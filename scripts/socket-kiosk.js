(function () {
  const grid = document.getElementById("vending-grid");
  const toast = document.getElementById("transfer-toast");
  const toastTitle = document.getElementById("toast-title");
  const toastMessage = document.getElementById("toast-message");
  if (!grid) {
    return;
  }

  const cards = Array.from(grid.querySelectorAll(".item-card"));
  const cardsById = new Map();
  cards.forEach((card) => {
    if (card.dataset.itemId) {
      cardsById.set(card.dataset.itemId, card);
    }
  });

  let activeHighlight = null;
  function clearHighlight() {
    if (activeHighlight) {
      activeHighlight.classList.remove("item-card--active", "item-card--delivered");
      activeHighlight.style.removeProperty("--active-accent");
    }
  }

  function showToast(title, message, accent) {
    if (!toast || !toastTitle || !toastMessage) {
      return;
    }
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    if (accent) {
      toast.style.setProperty("--toast-accent", accent);
    } else {
      toast.style.removeProperty("--toast-accent");
    }
    toast.hidden = false;
    toast.classList.remove("transfer-toast--hidden");
    toast.classList.add("transfer-toast--visible");
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      toast.classList.add("transfer-toast--hidden");
      toast.classList.remove("transfer-toast--visible");
      window.setTimeout(() => {
        toast.hidden = true;
      }, 350);
    }, 4000);
  }

  function highlightItem(itemId, options) {
    const card = cardsById.get(itemId);
    if (!card) {
      return;
    }
    clearHighlight();
    activeHighlight = card;
    if (options && options.status === "delivered") {
      card.classList.add("item-card--delivered");
    } else {
      card.classList.add("item-card--active");
      card.classList.remove("item-card--delivered");
    }
    const accent = (options && options.accent) || card.dataset.itemAccent;
    if (accent) {
      card.style.setProperty("--active-accent", accent);
    }
    const name = card.dataset.itemName || "mystery item";
    if (options && options.status === "delivered") {
      showToast(`${name} sent`, "The transfer finished on the guest's device.", accent);
    } else {
      showToast(`${name} claimed`, "Watch the animation as it beams to their phone.", accent);
    }
  }

  function connect() {
    if (!window.location || !("WebSocket" in window)) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    if (!host) {
      showToast("Host offline", "Launch the kiosk through the Node server to enable live updates.");
      return;
    }
    const socket = new WebSocket(`${protocol}://${host}/ws`);

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data || !data.type) {
          return;
        }
        if (data.type === "transfer-start" && data.itemId) {
          const card = cardsById.get(data.itemId);
          const accent = data.accent || (card && card.dataset ? card.dataset.itemAccent : undefined);
          highlightItem(data.itemId, { accent });
        }
        if (data.type === "transfer-complete" && data.itemId) {
          const card = cardsById.get(data.itemId);
          const accent = data.accent || (card && card.dataset ? card.dataset.itemAccent : undefined);
          highlightItem(data.itemId, {
            status: "delivered",
            accent,
          });
        }
      } catch (error) {
        console.warn("Unable to parse socket message", error);
      }
    });

    socket.addEventListener("close", () => {
      window.setTimeout(connect, 2000);
    });

    socket.addEventListener("error", () => {
      socket.close();
    });
  }

  connect();
})();
