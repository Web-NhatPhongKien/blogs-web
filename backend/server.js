import dotenv from "dotenv";

import { register, login } from "./controllers/auth.controller.js";
import { registerSchema, signinSchema } from "./validates/auth.validate.js";
import BlogController from "./controllers/blog.controller.js";
import UserController from "./controllers/user.controller.js";
import CommentController from "./controllers/comment.controller.js";
import { verifyToken, verifyTokenOptional } from "./middlewares/auth.middleware.js";

import { verifyToken } from "./middlewares/auth.middleware.js";

dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import userRoutes from "./routes/user.route.js"; // THÊM

const server = express();

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch((e) => console.error(e.message));

server.post("/latest-blogs", BlogController.getLatestBlogs);
server.get("/trending-blogs", BlogController.getTrendingBlogs);
server.post("/search-blogs", BlogController.searchBlogs);
server.post("/get-blog", verifyTokenOptional, UserController.getBlog);

server.post("/get-profile", UserController.getProfile);
server.post("/search-users", UserController.searchUsers);

server.post("/all-latest-blogs-count", BlogController.getAllLatestBlogsCount);
server.post("/search-blogs-count", BlogController.getSearchBlogsCount);
server.post("/create-blog", verifyToken, BlogController.createBlog);

server.post("/like-blog", verifyToken, BlogController.likeBlog);

server.post("/add-comment", verifyToken, CommentController.addComment);
server.post("/get-blog-comments", CommentController.getBlogComments);
server.post("/get-replies-comments", CommentController.getRepliesComments);
server.post("/delete-comment", verifyToken, CommentController.deleteComment);

server.post("/create-blog", verifyToken, BlogController.createBlog);
  //routes
server.use('/api/auth', authRoutes);
server.use("/api/user", userRoutes); // THÊM: dùng cho sửa profile và đổi mật khẩu

server.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
});

