require("dotenv").config({ path: ".env.development" });

const WebSocket = require("ws");
const { db } = require("../lib/fsdb");

const server = new WebSocket.Server({ port: process.env.PORT || 4000 });
const sockets = {};

// Initialize the database
db.init().catch(console.error);

server.on("connection", (socket) => {
  console.log("Connection established");
  let first = true;
  let editable = false;
  let savedKey = null;
  let savedToken = null;

  socket.on("message", async (message) => {
    if (first) {
      first = false;

      console.log("First message received:", { message });

      const { key, tokens } = JSON.parse(message);

      console.log("Parsed first message:", { key, tokens });

      const page = await db.get(key);
      console.log("Retrieved page from DB:", { page });
      if (!page) {
        console.log("No page found, closing connection");
        return socket.close();
      }

      editable = tokens.includes(page.token);
      savedKey = key;
      savedToken = page.token;

      if (!sockets[key]) sockets[key] = [];
      sockets[key].push(socket);

      socket.send(editable.toString());
    } else if (editable) {
      console.log("Received update message:", message.toString("utf-8"));

      for (let i = 0; i < sockets[savedKey].length; i++) {
        const updateSocket = sockets[savedKey][i];
        if (socket === updateSocket) continue;

        try {
          updateSocket.send(message.toString("utf-8"));
        } catch {
          sockets[savedKey].splice(i, 1);
        }
      }

      try {
        await db.set(savedKey, {
          token: savedToken,
          content: message.toString("utf-8"),
        });
        console.log("Successfully saved to DB:", { key: savedKey });
      } catch (error) {
        console.error("Error saving to DB:", error);
      }
    }
  });
});
