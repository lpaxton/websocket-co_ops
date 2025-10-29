(function () {
  const items = Array.isArray(window.DIGITAL_ITEMS) ? window.DIGITAL_ITEMS : [];
  const grid = document.getElementById("vending-grid");

  if (!grid) {
    return;
  }

  if (items.length === 0) {
    grid.innerHTML = "<p>Items are unavailable right now. Please check back later.</p>";
    return;
  }

  const baseProductUrl = new URL("digital-product.html", window.location.href);

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "item-card";
    card.dataset.itemId = item.id;
    card.dataset.itemName = item.name;
    card.dataset.itemAccent = item.accent;
    card.dataset.itemColor = item.color;
    card.style.setProperty("--accent", item.accent);
    card.style.background = `linear-gradient(145deg, ${item.color}1f, rgba(12, 13, 22, 0.95))`;

    const header = document.createElement("div");
    header.className = "item-header";

    const icon = document.createElement("div");
    icon.className = "item-icon";
    icon.textContent = item.name
      .split(" ")
      .map((chunk) => chunk[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    icon.style.background = `linear-gradient(135deg, ${item.accent}, ${item.color})`;

    const titleGroup = document.createElement("div");
    const name = document.createElement("h2");
    name.className = "item-name";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "item-price";
    price.textContent = item.price;

    titleGroup.append(name, price);
    header.append(icon, titleGroup);

    const description = document.createElement("p");
    description.className = "item-description";
    description.textContent = item.description;

    const qrWrapper = document.createElement("div");
    qrWrapper.className = "qr-wrapper";

    const qrCanvas = document.createElement("canvas");
    qrCanvas.setAttribute("role", "img");
    qrCanvas.setAttribute("aria-label", `QR code to purchase ${item.name}`);

    const caption = document.createElement("p");
    caption.className = "qr-caption";
    caption.textContent = "Scan to transfer this treat";

    qrWrapper.append(qrCanvas, caption);

    card.append(header, description, qrWrapper);
    grid.append(card);

    const qrUrl = new URL(baseProductUrl.href);
    qrUrl.searchParams.set("item", item.id);

    new QRious({
      element: qrCanvas,
      value: qrUrl.href,
      size: 200,
      level: "H",
      background: "transparent",
      foreground: "#f5f7ff"
    });
  });
})();
