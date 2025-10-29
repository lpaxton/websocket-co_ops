const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
const port = process.env.PORT || 3000;

const publicDir = __dirname;
app.use(express.static(publicDir));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

function broadcast(data, sender) {
  const payload = JSON.stringify({ ...data, timestamp: Date.now() });
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      if (!data || typeof data.type !== "string") {
        return;
      }
      broadcast(data, socket);
    } catch (error) {
      console.warn("Ignoring invalid socket message", error);
    }
  });
});

server.listen(port, () => {
  console.log(`Digital vending machine server running on http://localhost:${port}`);
});
