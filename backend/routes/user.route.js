import express from "express";
import UserController from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// THÊM: route sửa profile
// verifyToken dùng để biết user nào đang đăng nhập
router.patch(
    "/update-profile",
    verifyToken,
    UserController.updateProfile
);

// THÊM: route đổi mật khẩu
// verifyToken bắt buộc vì chỉ user đã login mới đổi được mật khẩu của chính mình
router.patch(
    "/change-password",
    verifyToken,
    UserController.changePassword
);

export default router;