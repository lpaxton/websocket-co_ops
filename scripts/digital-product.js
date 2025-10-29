(function () {
  const query = new URLSearchParams(window.location.search);
  const itemId = query.get("item");
  const items = Array.isArray(window.DIGITAL_ITEMS) ? window.DIGITAL_ITEMS : [];
  const product = items.find((entry) => entry.id === itemId);

  const nameEl = document.getElementById("product-name");
  const priceEl = document.getElementById("product-price");
  const descriptionEl = document.getElementById("product-description");
  const captionEl = document.getElementById("animation-caption");

  if (product) {
    nameEl.textContent = product.name;
    priceEl.textContent = product.price;
    descriptionEl.textContent = product.description;
    captionEl.textContent = `Particles are assembling ${product.name} just for you. Keep this page open until the transfer finishes.`;
    document.body.style.background = `radial-gradient(circle at 10% 20%, ${product.color}33, transparent 55%), radial-gradient(circle at 90% 25%, ${product.accent}33, transparent 50%), #030308`;
  } else {
    captionEl.textContent = "We couldn't identify the item from your scan. Try scanning a QR code from the vending machine again.";
  }

  const accentColor = (product === null || product === void 0 ? void 0 : product.accent) || "#5a31f4";
  const baseColor = (product === null || product === void 0 ? void 0 : product.color) || "#00acc1";

  const container = document.getElementById("animation-container");

  const sketch = (p) => {
    const particles = [];
    const particleCount = 90;
    const phone = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      radius: 28
    };

    p.setup = function () {
      const size = getCanvasSize();
      const canvas = p.createCanvas(size, size);
      canvas.parent(container);
      p.frameRate(60);
      p.noStroke();
      updatePhone();
      createParticles();
    };

    p.windowResized = function () {
      const size = getCanvasSize();
      p.resizeCanvas(size, size);
      updatePhone();
    };

    p.draw = function () {
      drawBackground();
      drawPortal();
      drawParticles();
      drawPhone();
      drawSignal();
    };

    function drawBackground() {
      p.push();
      p.background(6, 8, 18, 255);
      const gradientSteps = 6;
      for (let i = 0; i < gradientSteps; i++) {
        const alpha = p.map(i, 0, gradientSteps - 1, 40, 5);
        p.fill(p.redHex(baseColor), p.greenHex(baseColor), p.blueHex(baseColor), alpha);
        p.circle(p.width * 0.2, p.height * 0.15, p.width * (0.9 - i * 0.12));
        p.fill(p.redHex(accentColor), p.greenHex(accentColor), p.blueHex(accentColor), alpha * 0.8);
        p.circle(p.width * 0.8, p.height * 0.1, p.width * (0.75 - i * 0.1));
      }
      p.pop();
    }

    function drawPortal() {
      const portalY = p.height * 0.18;
      const portalRadius = p.width * 0.18;
      p.push();
      p.translate(p.width / 2, portalY);
      const gradientRings = 4;
      for (let i = gradientRings; i > 0; i--) {
        const opacity = p.map(i, 1, gradientRings, 200, 20);
        p.fill(p.redHex(accentColor), p.greenHex(accentColor), p.blueHex(accentColor), opacity);
        p.circle(0, 0, portalRadius * (i / gradientRings));
      }
      p.fill(4, 6, 14);
      p.circle(0, 0, portalRadius * 0.55);
      p.pop();
    }

    function drawPhone() {
      p.push();
      p.fill(15, 16, 26);
      p.rect(phone.x, phone.y, phone.w, phone.h, phone.radius);

      // Screen glow
      p.fill(p.redHex(accentColor), p.greenHex(accentColor), p.blueHex(accentColor), 60);
      p.rect(phone.x + 12, phone.y + 16, phone.w - 24, phone.h - 32, phone.radius * 0.65);

      // Speaker notch
      p.fill(30, 32, 45);
      const notchWidth = phone.w * 0.28;
      const notchHeight = 8;
      p.rect(phone.x + phone.w / 2 - notchWidth / 2, phone.y + 12, notchWidth, notchHeight, 4);
      p.pop();
    }

    function drawSignal() {
      p.push();
      p.stroke(p.redHex(accentColor), p.greenHex(accentColor), p.blueHex(accentColor), 80);
      p.noFill();
      p.strokeWeight(2);
      const baseY = phone.y + phone.h * 0.35;
      for (let i = 0; i < 3; i++) {
        const offset = i * 12;
        const alpha = 100 - i * 30 + 40 * Math.sin(p.frameCount * 0.02 + i);
        p.stroke(p.redHex(accentColor), p.greenHex(accentColor), p.blueHex(accentColor), alpha);
        p.arc(p.width / 2, baseY, 80 + offset, 40 + offset, p.PI, p.TWO_PI);
      }
      p.pop();
    }

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }

    function createParticle() {
      return {
        startX: p.width / 2 + p.random(-p.width * 0.18, p.width * 0.18),
        startY: p.height * 0.18 + p.random(-p.width * 0.05, p.width * 0.05),
        controlX: p.width / 2 + p.random(-p.width * 0.22, p.width * 0.22),
        controlY: p.height * 0.4 + p.random(-p.width * 0.1, p.width * 0.1),
        endX: p.width / 2 + p.random(-phone.w * 0.2, phone.w * 0.2),
        endY: phone.y + phone.h * 0.55 + p.random(-phone.h * 0.1, phone.h * 0.1),
        size: p.random(5, 10),
        progress: p.random(),
        speed: p.random(0.005, 0.012),
        hueShift: p.random(-20, 20)
      };
    }

    function drawParticles() {
      particles.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress >= 1) {
          Object.assign(particle, createParticle());
          particle.progress = 0;
        }

        const eased = easeInOutCubic(Math.min(particle.progress, 1));
        const position = quadraticBezier(
          { x: particle.startX, y: particle.startY },
          { x: particle.controlX, y: particle.controlY },
          { x: particle.endX, y: particle.endY },
          eased
        );

        const tail = quadraticBezier(
          { x: particle.startX, y: particle.startY },
          { x: particle.controlX, y: particle.controlY },
          { x: particle.endX, y: particle.endY },
          Math.max(eased - 0.1, 0)
        );

        const gradient = p.drawingContext.createLinearGradient(position.x, position.y, tail.x, tail.y);
        const colorA = hexToRgba(accentColor, 0.9);
        const colorB = hexToRgba(baseColor, 0.2);
        gradient.addColorStop(0, colorA);
        gradient.addColorStop(1, colorB);
        p.drawingContext.fillStyle = gradient;

        p.push();
        p.translate(position.x, position.y);
        p.rotate(Math.atan2(position.y - tail.y, position.x - tail.x));
        p.ellipse(0, 0, particle.size * 1.3, particle.size * 0.7);
        p.pop();

        p.push();
        p.fill(hexToRgba(accentColor, 0.5));
        p.noStroke();
        p.ellipse(tail.x, tail.y, particle.size * 0.6, particle.size * 0.4);
        p.pop();
      });
    }

    function updatePhone() {
      phone.w = p.width * 0.36;
      phone.h = p.height * 0.55;
      phone.x = p.width / 2 - phone.w / 2;
      phone.y = p.height * 0.38;
      phone.radius = Math.max(22, p.width * 0.04);
    }

    function getCanvasSize() {
      const bounds = container.getBoundingClientRect();
      const max = Math.min(bounds.width, window.innerHeight * 0.75);
      return Math.max(280, Math.floor(max));
    }

    function quadraticBezier(start, control, end, t) {
      const u = 1 - t;
      return {
        x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
        y: u * u * start.y + 2 * u * t * control.y + t * t * end.y
      };
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function hexToRgba(hex, alpha) {
      const value = hex.replace("#", "");
      const bigint = parseInt(value, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  };

  // Extend p5 with helpers for using hex values inside draw loop
  if (typeof window.p5 !== "undefined") {
    window.p5.prototype.redHex = function (hex) {
      return parseInt(hex.substring(1, 3), 16);
    };
    window.p5.prototype.greenHex = function (hex) {
      return parseInt(hex.substring(3, 5), 16);
    };
    window.p5.prototype.blueHex = function (hex) {
      return parseInt(hex.substring(5, 7), 16);
    };
    new window.p5(sketch);
  }
})();
