const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

let userMap = new Map();
let gamePlayersMap = new Map();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("playerJoined", (gameId, playerId, playerUsername) => {
    userMap.set(socket.id, playerId);
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
  socket.on("startGame", (gameId, users) => {
    gamePlayersMap.set(gameId, users);
    console.log(gamePlayersMap.get(gameId));
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
  //Test this:
  socket.on("gameIsOver", (gameId) => {
    userMap.delete(socket.id);
    //TODO: Add other game over stuff
  });
  //Test this:
  socket.on("disconnect", () => {
    if (userMap.has(socket.id)) {
      //TODO: Remove the player from the game
      //TODO: Send an event to the other players to notify them, that a player left the game and choose the next player or something like that
      userMap.delete(socket.id);
    }
    console.log("user disconnected", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log("listening on", process.env.PORT);
});
