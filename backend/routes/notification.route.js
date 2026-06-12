import express from "express";
import NotificationController from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", NotificationController.getNotifications);

router.get("/unread-count", NotificationController.getUnreadCount);

router.patch("/read-all", NotificationController.markAllAsRead);

router.patch("/:id/read", NotificationController.markAsRead);

router.delete("/:id", NotificationController.deleteNotification);

export default router;
