# Digital Vending Machine

This project provides a digital vending machine experience composed of two pages:

- **`index.html`** – a large-format kiosk display that renders a grid of futuristic snacks and beverages. Each card includes a dynamically generated QR code that links to the matching digital hand-off page.
- **`digital-product.html`** – the mobile-friendly experience that opens after a QR scan. A p5.js sketch animates energy particles spiraling from a portal into a glowing phone to represent the transfer of the selected product.

## Getting started

1. Serve the project with your favorite static web server (e.g., `npx serve`, the VS Code Live Server extension, or a simple Python HTTP server).
2. Open `index.html` in a browser to display the kiosk view. Each QR code points to the hosted `digital-product.html` page with an `item` query parameter.
3. Scan a QR code from a phone. The mobile browser loads `digital-product.html`, reads the `item` parameter, and personalizes the copy and color palette while running the animated transfer sequence.

Both pages load their styling and scripts via relative paths, so you can customize the item catalog by editing `scripts/items-data.js` without touching layout code.
