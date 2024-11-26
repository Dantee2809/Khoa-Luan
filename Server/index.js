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
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import { app, server } from "./lib/socket.js";

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyparser.json({limit: "20mb", extended: true})); 
app.use(bodyparser.urlencoded({limit: "20mb", extended: true})); 

dotenv.config();

mongoose.connect('mongodb+srv://lostnfound:k2HOMRjQjlQ4zr5t@cluster0.sxv75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    server.listen(5001,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})

app.use('/api/admin', AdminRoute)
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/post', PostRoute)
app.use('/api/chat', ChatRoute)
app.use('/api/message', MessageRoute)
