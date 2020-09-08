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
  socket.join(["room 237"], () => {
    const rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237']
  });

  socket.on("passengerRequest", (driverlocation) => {
    taxiSocket = socket;
    console.log("Driver wants a passenger at", driverlocation);
    console.log("taxiSocket");
    console.log("*****************");
  });

  socket.on("taxiRequest", (routeToHost) => {
    passengerSocket = socket;
    console.log("Host wants a taxi at ");
    if (taxiSocket !== null) {
      io.to("room 237").emit("taxiRequest", routeToHost);
      // taxiSocket.emit("taxiRequest", routeToHost);
      console.log("=======================");
    }
  });

  socket.on("accepted", (driverLocation) => {
    console.log("<<<<<<<<<<DRiver Accepted Backend>>>>>>>", driverLocation);
    if (passengerSocket !== null) {
      passengerSocket.emit("accepted", driverLocation);
    }
  });

  socket.on("driverTracking", (driverLocation) => {
    console.log("<<<<<<<<<<BACKGROUND DRIVER TRACKING >>>>>>>", driverLocation);
    if (passengerSocket !== null) {
      passengerSocket.emit("driverTracking", driverLocation);
    }
  });
});

server.listen(PORT, () => {
  console.log("server started and listening on port " + PORT);
});
