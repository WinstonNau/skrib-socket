const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("playerJoined", (gameId, playerUsername) => {
    socket.broadcast.emit("newPlayer", gameId, playerUsername);
  });
  socket.on("playerLeave", (gameId, playerUsername) => {
    socket.broadcast.emit("playerDisconnect", gameId, playerUsername);
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
  socket.on("wrongGuess", (gameId, user, guess) => {
    socket.broadcast.emit("playerGuessedWrong", gameId, user, guess);
  });
  socket.on("correctGuess", (gameId, playerUsername) => {
    socket.broadcast.emit("playerGuessedCorrect", gameId, playerUsername);
  });
  socket.on("gameIsOver", (gameId) => {
    socket.emit("gameOver", gameId);
  });
  socket.on("roundOver", (gameId, nextPlayer) => {
    socket.emit("roundFinished", gameId, nextPlayer);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log("listening on", process.env.PORT);
});
