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

  socket.on("passengerRequest", (driverlocation) => {
    taxiSocket = socket;
    console.log("Driver wants a passenger at", driverlocation);
    console.log("taxiSocket");
    console.log("*****************");
  });

  socket.on("taxiRequest", (routeToPassenger) => {
    passengerSocket = socket;
    console.log("Passenger wants a taxi at ", routeToPassenger);
    if (taxiSocket !== null) {
      taxiSocket.emit("taxiRequest", routeToPassenger);
      console.log("=======================");
    }
  });

  socket.on("accepted", (driverLocation) => {
    console.log("<<<<<<<<<<DRiver location Backend>>>>>>>", driverLocation);
    socket.emit("driverLocation", driverLocation);
  });
});

server.listen(PORT, () => {
  console.log("server started and listening on port " + PORT);
});
