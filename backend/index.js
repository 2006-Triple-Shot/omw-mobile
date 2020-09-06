const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let taxiSocket = null;
let routeResponse = null;
let count = 0;

io.on("connection", (socket) => {
  count++;
  console.log("connection recieved on server", count);

  socket.on("taxiRequest", (routeResponse) => {
    console.log("BACKEND-TAXIREQUEST-cooords: ", routeResponse);
    if (taxiSocket !== null) {
      socket.emit("taxiRequest", routeResponse);
    }
  });

  socket.on("lookingForPassengers", () => {
    console.log("Someone is looking for a passenger");
    taxiSocket = socket;
    // socket.emit("driver coming");
    // console.log("***********");
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
