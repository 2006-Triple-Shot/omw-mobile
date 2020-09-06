const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const PORT = process.env.PORT || 5000;

let taxiSocket = null;
let passengerSocket = null;
let count = 0;
io.on("connection", (socket) => {
  count++;
  console.log("-----Backend connected----", count);

  socket.on("taxiRequest", (passengerlocation) => {
    passengerSocket = socket;
    console.log("Someone wants a taxi at ", passengerlocation);
    if (taxiSocket !== null) {
      taxiSocket.emit("taxiRequest", passengerlocation);
    }
  });

  socket.on("driverLocation", (driverLocation) => {
    console.log("DRiver location Backend>>>", driverLocation);
    socket.emit("driverLocation", driverLocation);
  });

  socket.on("passengerRequest", (driverlocation) => {
    taxiSocket = socket;
    console.log("Someone wants a passenger at", driverlocation);
    console.log("taxiSocket");
    console.log("passengerSocket");
  });
});

server.listen(PORT, () => {
  console.log("server started and listening on port " + PORT);
});
