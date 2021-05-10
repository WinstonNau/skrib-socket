const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("a user connected", socket);
  socket.on("playerJoined", (gameId, playerId, playerUsername) => {
    socket.broadcast.emit("newPlayer", gameId, playerId, playerUsername);
  });
  socket.on("playerLeave", (gameId, playerId) => {
    socket.broadcast.emit("playerDisconnect", gameId, playerId);
  });
  socket.on("newPathDrawn", (gameId, path) => {
    socket.broadcast.emit("newPath", gameId, path);
  });
  socket.on("clearReq", (gameId) => {
    socket.broadcast.emit("clear", gameId);
  });
  socket.on("undoReq", (gameId) => {
    socket.broadcast.emit("undo", gameId);
  });
  socket.on("startGame", (gameId) => {
    socket.broadcast.emit("gameStarted", gameId);
  });
  socket.on("selectWord", (gameId, word) => {
    socket.broadcast.emit("wordSelected", gameId, word);
  });
  socket.on("wrongGuess", (gameId, guess) => {
    socket.broadcast.emit("playerGuessedWrong", gameId, guess);
  });
  socket.on("correctGuess", (gameId, playerUsername) => {
    //TODO: Maybe define the next player? Or maybe define an order of players when the round starts?
    socket.broadcast.emit("playerGuessedCorrect", gameId, playerUsername);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket);
  });
});

server.listen(process.env.PORT, () => {
  console.log("listening on", process.env.PORT);
});
