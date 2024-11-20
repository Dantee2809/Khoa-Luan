import express from 'express'
import bodyparser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import AdminRoute from './Routes/AdminRoute.js'
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import ChatRoute from './Routes/ChatRoute.js'
import MessageRoute from './Routes/MessageRoute.js'

const app = express();
app.use(cors()); // Kích hoạt CORS cho toàn bộ ứng dụng

app.use(bodyparser.json({limit: "20mb", extended: true})); 
app.use(bodyparser.urlencoded({limit: "20mb", extended: true})); 

dotenv.config();

mongoose.connect('mongodb+srv://lostnfound:k2HOMRjQjlQ4zr5t@cluster0.sxv75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    app.listen(5001,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})

app.use('/admin', AdminRoute)
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/post', PostRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
