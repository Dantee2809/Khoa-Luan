import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
// const socket = io("https://52a0-14-233-191-63.ngrok-free.app", {
//   transports: ["websocket", "polling"],
//   withCredentials: true,
// });

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://pink-comics-mate.loca.lt"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// export { io, app, server, socket };
export { io, app, server };
