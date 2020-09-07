<<<<<<< HEAD
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
=======
// const http = require("http");
// const express = require("express");
// const socketIO = require("socket.io");
// const PORT = process.env.PORT || 5000;
// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// io.on("connection", (socket) => {
//   console.log("client connected backend");
//   socket.on("chat message", (msg) => {
//     console.log("msg : ", longitude);
//     io.emit("chat message", msg);
//   });
// });

// // io.on("connection", (socket) => {
// //   console.log("client connected on websocket from server file");
// //   socket.on("longitude", (longitude) => {
// //     console.log("Longitude : ", longitude);
// //   });
// //   socket.on("latitude", (latitude) => {
// //     console.log("Longitude : ", latitude);
// //   });
// //   socket.on("i-am-connected", () => {
// //     console.log("I am Connected");
// //   });
// // });
// // setInterval(() => {
// //   io.emit("ping", { data: new Date() / 1 });
// // }, 1000);
// server.listen(PORT, () => {
//   console.log("server started and listening on port " + PORT);
// });
>>>>>>> 85c4ffa5803259b7a5303c0a0e61237f73c69aac
