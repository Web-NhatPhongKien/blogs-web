import express from "express";
import BlogController from "../controllers/blog.controller.js";
import { verifyToken, verifyTokenOptional } from "../middlewares/auth.middleware.js";
import UserController from "../controllers/user.controller.js";


const router = express.Router();

router.post("/latest-blogs", BlogController.getLatestBlogs);

router.get("/trending-blogs", BlogController.getTrendingBlogs);

router.get("/popular-tags", BlogController.getPopularTags);

router.post("/search-blogs", BlogController.searchBlogs);

router.post("/like-blog", verifyToken, BlogController.likeBlog);

router.post("/create-blog", verifyToken, BlogController.createBlog);

router.post("/user-written-blogs", verifyToken, BlogController.userWrittenBlogs);

router.post("/user-written-blogs-count",verifyToken, BlogController.userWrittenBlogsCount)

router.post("/delete-blog", verifyToken, BlogController.deleteBlog);

router.post("/get-blog", verifyTokenOptional, UserController.getBlog);

export default router;
