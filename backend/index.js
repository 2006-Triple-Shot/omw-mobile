const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("client connected backend");
  socket.on("chat message", (msg) => {
    console.log("msg : ", longitude);
    io.emit("chat message", msg);
  });
});

// io.on("connection", (socket) => {
//   console.log("client connected on websocket from server file");
//   socket.on("longitude", (longitude) => {
//     console.log("Longitude : ", longitude);
//   });
//   socket.on("latitude", (latitude) => {
//     console.log("Longitude : ", latitude);
//   });
//   socket.on("i-am-connected", () => {
//     console.log("I am Connected");
//   });
// });
// setInterval(() => {
//   io.emit("ping", { data: new Date() / 1 });
// }, 1000);
server.listen(PORT, () => {
  console.log("server started and listening on port " + PORT);
});
