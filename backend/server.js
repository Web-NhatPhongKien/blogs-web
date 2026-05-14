import dotenv from "dotenv";

import { register, signin } from "./controllers/auth.controller.js";
import { registerSchema, signinSchema } from "./schemas/auth.validate.js";
import BlogController from "./controllers/blog.controller.js";
import UserController from "./controllers/user.controller.js";

dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';

const server = express();

server.use(cors());
server.use(express.json());
server.use(morgan('dev'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch((e) => console.error(e.message));

server.get("/latest-blogs", BlogController.getLatestBlogs);
server.get("/trending-blogs", BlogController.getTrendingBlogs);
server.post("/search-blogs", BlogController.searchBlogs);
server.post("/get-blog", UserController.getBlog);

server.post("/get-profile", UserController.getProfile);
server.post("/search-users", UserController.searchUsers);

  //routes
server.use('/api/auth', authRoutes);

server.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
});

