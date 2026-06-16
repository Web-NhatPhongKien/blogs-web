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

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));

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


server.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
});

