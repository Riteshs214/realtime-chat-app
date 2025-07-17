import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
dotenv.config();

import cors from "cors";

const port = process.env.PORT || 3000;
app.use(cookieParser());
app.use(cors({ origin: "https://realtime-chat-app-frontend-iil1.onrender.com", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  connectDB();
  console.log(`server is running on ${port}`);
});
