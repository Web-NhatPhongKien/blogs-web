import express from "express";
import UserController from "../controllers/user.controller.js";
import { verifyToken, verifyTokenOptional } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/get-blog", verifyTokenOptional, UserController.getBlog);

router.post("/get-profile", UserController.getProfile);

router.post("/search-users", UserController.searchUsers);

router.patch("/update-profile", verifyToken, UserController.updateProfile);

router.patch("/change-password", verifyToken, UserController.changePassword);

export default router;