import express from "express";
import CommentController from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-comment", verifyToken, CommentController.addComment);

router.post("/get-blog-comments", CommentController.getBlogComments);

router.post("/get-replies-comments", CommentController.getRepliesComments);

router.post("/delete-comment", verifyToken, CommentController.deleteComment);

export default router;