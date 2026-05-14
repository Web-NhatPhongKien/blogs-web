import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import morgan from 'morgan'

import { register, signin } from "./controllers/auth.controller.js";
import { registerSchema, signinSchema } from "./schemas/auth.validate.js";
import BlogController from "./controllers/blog.controller.js";
import UserController from "./controllers/user.controller.js";

const server = express();
let PORT = 3000;

server.use(express.json())
server.use(morgan('dev'))

mongoose.connect("mongodb://localhost:27017/")
.then(
    () => console.log("DB connected")
).catch(e => 
    console.error(e.messsage)
)

// middleware validate
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

// routes
server.post("/signup", validate(registerSchema), register);
server.post("/signin", validate(signinSchema), signin);

server.get("/latest-blogs", BlogController.getLatestBlogs);
server.get("/trending-blogs", BlogController.getTrendingBlogs);
server.post("/search-blogs", BlogController.searchBlogs);
server.post("/get-blog", UserController.getBlog);

server.post("/get-profile", UserController.getProfile);
server.post("/search-users", UserController.searchUsers);

server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})

