import express from "express";
import AdminController from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// Login riêng cho admin
router.post("/login", AdminController.adminLogin);

// Tất cả route bên dưới bắt buộc phải đăng nhập và là admin
router.use(verifyToken);
router.use(isAdmin);

// User management
router.get("/users", AdminController.getUsers);
router.patch("/users/:userId", AdminController.updateUser);
router.delete("/users/:userId", AdminController.deleteUser);

// Blog management
router.get("/blogs", AdminController.getBlogs);
router.patch("/blogs/:blogId/visibility", AdminController.updateBlogVisibility);
router.delete("/blogs/:blogId", AdminController.deleteBlog);

// Tag/category management
router.get("/tags", AdminController.getTags);
router.patch("/tags/rename", AdminController.renameTag);
router.delete("/tags/:tagName", AdminController.deleteTag);

export default router;