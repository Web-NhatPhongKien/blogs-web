import Notification from "../schemas/notification.schema.js";

class NotificationService {
    getNotificationsService = async (userId, filter = "all", page = 1, limit = 20) => {
        const query = { notification_for: userId };

        if (filter === "unread") {
            query.seen = false;
        }

        const skip = (page - 1) * limit;

        const notifications = await Notification.find(query)
            .populate("user", "personal_info.username personal_info.profile_img")
            .populate("blog", "blog_id title")
            .populate("comment", "comment")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalDocs = await Notification.countDocuments(query);

        return {
            notifications,
            page,
            limit,
            totalDocs,
            totalPages: Math.ceil(totalDocs / limit),
        };
    };

    getUnreadCountService = async (userId) => {
        const count = await Notification.countDocuments({
            notification_for: userId,
            seen: false,
        });
        return count;
    };

    markAsReadService = async (notificationId, userId) => {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, notification_for: userId },
            { seen: true },
            { new: true }
        );

        if (!notification) {
            const err = new Error("Không tìm thấy thông báo hoặc bạn không có quyền truy cập");
            err.statusCode = 404;
            throw err;
        }

        return notification;
    };

    markAllAsReadService = async (userId) => {
        const result = await Notification.updateMany(
            { notification_for: userId, seen: false },
            { seen: true }
        );
        return result;
    };

    deleteNotificationService = async (notificationId, userId) => {
        const notification = await Notification.findOne({
            _id: notificationId,
            notification_for: userId,
        });

        if (!notification) {
            const err = new Error("Không tìm thấy thông báo hoặc bạn không có quyền xóa");
            err.statusCode = 404;
            throw err;
        }

        await Notification.findByIdAndDelete(notificationId);
    };
}

export default new NotificationService();
