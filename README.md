# Digital Vending Machine

This project provides a digital vending machine experience composed of two pages:

- **`index.html`** – a large-format kiosk display that renders a grid of futuristic snacks and beverages. Each card includes a dynamically generated QR code that links to the matching digital hand-off page.
- **`digital-product.html`** – the mobile-friendly experience that opens after a QR scan. A p5.js sketch animates energy particles spiraling from a portal into a glowing phone to represent the transfer of the selected product.

## Getting started

1. Install dependencies and start the realtime server:

   ```bash
   npm install
   npm start
   ```

   This hosts the static files and opens a WebSocket endpoint used to keep the kiosk and mobile devices in sync.

2. Open `http://localhost:3000/index.html` in a desktop browser to display the kiosk view. Each QR code points to the hosted `digital-product.html` page with an `item` query parameter.
3. Scan a QR code from a phone. The mobile browser loads `digital-product.html`, personalizes the copy and color palette, and automatically notifies the kiosk that a transfer is in progress. Tap **Confirm delivery on kiosk** when the animation finishes to send the completion event back to the display.

Both pages load their styling and scripts via relative paths, so you can customize the item catalog by editing `scripts/items-data.js` without touching layout code. When you add or remove items, the WebSocket hand-off will continue to work because it keys off each item's `id`.
