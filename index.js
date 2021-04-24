const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("playerJoined", (gameId, playerId, playerUsername) => {
    socket.broadcast.emit("newPlayer", gameId, playerId, playerUsername);
  });
  socket.on("playerLeave", (gameId, playerId) => {
    socket.broadcast.emit("playerDisconnect", gameId, playerId);
  });
  socket.on("newPathDrawn", (path) => {
    socket.broadcast.emit("newPath", path);
  });
  socket.on("clearReq", () => {
    socket.broadcast.emit("clear");
  });
  socket.on("undoReq", () => {
    socket.broadcast.emit("undo");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log("listening on", process.env.PORT);
});
