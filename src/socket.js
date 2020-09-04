const io = require("socket.io-client");
const SocketEndpoint = io("http://192.168.1.169:5000");

// Initialize Socket IO:
export const socket = io(SocketEndpoint, {
  transports: ["websocket"],
  jsonp: false,
});
// export the function to connect and use socket IO:
export const startSocketIO = () => {
  if (socket) {
    socket.on("connection");
  }
};
export const sendlocation = (lat, long) => {
  if (socket) {
    socket.emit("longitude", lat);
    socket.emit("latitude", long);
  }
};
