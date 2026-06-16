import NotificationService from "../services/notification.service.js";

class NotificationController {
    getNotifications = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const filter = req.query.filter || "all"; // "all" | "unread"
            const page = Number(req.query.page) || 1;
            const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

            const result = await NotificationService.getNotificationsService(userId, filter, page, limit);

            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    getUnreadCount = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const count = await NotificationService.getUnreadCountService(userId);

            return res.status(200).json({ count });
        } catch (err) {
            next(err);
        }
    };

    markAsRead = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const notification = await NotificationService.markAsReadService(id, userId);

            return res.status(200).json({ status: "done", notification });
        } catch (err) {
            next(err);
        }
    };

    markAllAsRead = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            await NotificationService.markAllAsReadService(userId);

            return res.status(200).json({ status: "done" });
        } catch (err) {
            next(err);
        }
    };

    deleteNotification = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            await NotificationService.deleteNotificationService(id, userId);

            return res.status(200).json({ status: "done" });
        } catch (err) {
            next(err);
        }
    };
}

export default new NotificationController();
