import dotenv from "dotenv";

dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import userRoutes from "./routes/user.route.js"; 
import adminRoutes from "./routes/admin.route.js";
import notificationRoutes from "./routes/notification.route.js"; 
import blogRoutes from "./routes/blog.route.js";
import commentRoutes from "./routes/comment.route.js";
const server = express();
const PORT = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));

// THÊM: API kiểm tra backend có hoạt động sau khi deploy hay không
server.get("/api/health", (req, res) => {
  return res.status(200).json({
    message: "Blog API is running",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch((e) => console.error(e.message));

server.use('/api/auth', authRoutes);
server.use("/api/user", userRoutes); 
server.use("/api/admin", adminRoutes);
server.use("/api/blogs", blogRoutes);
server.use("/api/comments", commentRoutes);
server.use("/api/notifications", notificationRoutes); 


// SỬA: có port mặc định để chạy được cả local lẫn môi trường deploy
server.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

