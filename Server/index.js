import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import Routes
import AdminRoute from "./Routes/AdminRoute.js";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import AdvRoute from "./Routes/AdvRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import { app, server } from "./lib/socket.js";

// const allowedOrigins = ["http://localhost:3000", /ngrok-free\.app$/]; // Chấp nhận localhost và tất cả các subdomain của ngrok
// const socket = new WebSocket("https://dcb0-14-233-191-63.ngrok-free.app");
// socket.onopen = () => {
//   console.log("WebSocket connection established");
// };
// socket.onerror = (error) => {
//   console.error("WebSocket Error: ", error);
// };
// socket.onclose = () => {
//   console.log("WebSocket connection closed");
// };
const allowedOrigins = ["http://localhost:3000", /\.loca\.lt$/]; // Regex for Localtunnel subdomains

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((allowedOrigin) =>
          allowedOrigin instanceof RegExp
            ? allowedOrigin.test(origin)
            : allowedOrigin === origin
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies to be sent
  })
);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (
//         !origin ||
//         allowedOrigins.some((allowedOrigin) =>
//           allowedOrigin instanceof RegExp
//             ? allowedOrigin.test(origin)
//             : allowedOrigin === origin
//         )
//       ) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Cho phép gửi cookie, token
//   })
// );

app.use(cookieParser());
app.use(bodyparser.json({ limit: "20mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "20mb", extended: true }));

dotenv.config();

mongoose
  .connect(
    "mongodb+srv://lostnfound:k2HOMRjQjlQ4zr5t@cluster0.sxv75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    server.listen(5001, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  });

app.use("/api/admin", AdminRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/message", MessageRoute);
app.use("/api/adv", AdvRoute);
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong" });
});
export default app;
