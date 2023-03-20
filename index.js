import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
import "./db/connection.js";
import userRouter from "./Routes/userRoutes.js";
import chatRouter from "./Routes/chatRoutes.js";
import messageRoute from "./Routes/messateRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";


const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: ["*", "http://chatappclone01.onrender.com"],
  },
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRoute);


io.on("connection", (socket) => {
  console.log("A user has connected");



  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("uiser joined room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new Message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat users not defiend");

    chat.users.map((user) => {
      if (user._id === newMessageRecieved.sender._id) {
        return;
      }

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup",()=>{
    console.log("user desconnected");
    socket.leave(userData._id)
  })
});

httpServer.listen(PORT, () => {
  console.log("start server");
});
