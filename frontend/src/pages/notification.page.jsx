import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import axios from "axios";
import { getAuthConfig } from "../common/auth-config";
import Pagination from "../components/pagination.component";

const notifyUnreadChanged = (detail) => {
    window.dispatchEvent(new CustomEvent("notifications:unread-change", { detail }));
};

const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 30) return `${diffDay} ngày trước`;
    return date.toLocaleDateString("vi-VN");
};

const getNotificationMessage = (notification) => {
    const actorName = notification.user?.personal_info?.username || "Ai đó";
    const blogTitle = notification.blog?.title || "một bài viết";

    switch (notification.type) {
        case "like":
            return (
                <>
                    <span className="notif-actor">{actorName}</span>
                    {" đã thích bài viết "}
                    <span className="notif-blog-title">"{blogTitle}"</span>
                </>
            );
        case "comment":
            return (
                <>
                    <span className="notif-actor">{actorName}</span>
                    {" đã bình luận vào bài viết "}
                    <span className="notif-blog-title">"{blogTitle}"</span>
                </>
            );
        case "reply":
            return (
                <>
                    <span className="notif-actor">{actorName}</span>
                    {" đã trả lời bình luận của bạn trong bài viết "}
                    <span className="notif-blog-title">"{blogTitle}"</span>
                </>
            );
        default:
            return <span>Bạn có thông báo mới</span>;
    }
};

const NotificationPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async (currentFilter = "all", currentPage = 1) => {
        setLoading(true);
        const config = {
            ...getAuthConfig(),
            params: {
                filter: currentFilter,
                page: currentPage,
                limit: 10
            }
        };

        try {
            const res = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/notifications", config);

            setNotifications(res.data.notifications);
            setPage(res.data.page || currentPage);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Loi lay thong bao:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await axios.get(
                import.meta.env.VITE_SERVER_DOMAIN + "/api/notifications/unread-count",
                getAuthConfig()
            );
            setUnreadCount(res.data.count || 0);
            notifyUnreadChanged({ count: res.data.count || 0 });
        } catch (err) {
            console.error("Loi lay unread count:", err);
        }
    }, []);

    useEffect(() => {
        fetchNotifications(filter, 1);
        fetchUnreadCount();
    }, [filter, fetchNotifications, fetchUnreadCount]);

    const handleRead = async (id) => {
        try {
            await axios.patch(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/notifications/${id}/read`,
                {},
                getAuthConfig()
            );
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
            notifyUnreadChanged({ delta: -1 });
        } catch (err) {
            console.error("Loi danh dau da doc:", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.patch(
                import.meta.env.VITE_SERVER_DOMAIN + "/api/notifications/read-all",
                {},
                getAuthConfig()
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
            setUnreadCount(0);
            notifyUnreadChanged({ count: 0 });
        } catch (err) {
            console.error("Loi danh dau tat ca da doc:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/notifications/${id}`,
                getAuthConfig()
            );
            const deleted = notifications.find((n) => n._id === id);

            setNotifications((prev) => prev.filter((n) => n._id !== id));

            if (deleted && !deleted.seen) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
                notifyUnreadChanged({ delta: -1 });
            }
        } catch (err) {
            console.error("Loi xoa thong bao:", err);
        }
    };

    const handleFilterChange = (newFilter) => {
        if (newFilter === filter) return;
        setFilter(newFilter);
    };

    const goToPage = ({ page: nextPage }) => {
        fetchNotifications(filter, nextPage);
    };

    if (!user) {
        return (
            <div className="notification-page">
                <p className="notif-empty-msg">Vui lòng đăng nhập để xem thông báo.</p>
            </div>
        );
    }

    return (
        <div className="notification-page">
            <div className="notification-container">
                <div className="notification-header">
                    <div className="notification-header-left">
                        <h1 className="notification-title">Thông báo</h1>
                        {unreadCount > 0 && (
                            <span className="notification-header-badge">{unreadCount}</span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <button className="notif-mark-all-btn" onClick={handleMarkAllRead}>
                            <i className="fi fi-rr-check-double"></i>
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>

                <div className="notification-filters">
                    <button
                        className={`notification-filter-btn${filter === "all" ? " active" : ""}`}
                        onClick={() => handleFilterChange("all")}
                    >
                        Tất cả
                    </button>

                    <button
                        className={`notification-filter-btn${filter === "unread" ? " active" : ""}`}
                        onClick={() => handleFilterChange("unread")}
                    >
                        Chưa đọc
                        {unreadCount > 0 && (
                            <span className="notification-filter-count">{unreadCount}</span>
                        )}
                    </button>
                </div>

                <div className="notification-list">
                    {loading ? (
                        <div className="loader-wrap">
                            <svg className="loader-spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2Z" />
                            </svg>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="notif-empty">
                            <i className="fi fi-rr-bell-slash notif-empty-icon"></i>
                            <p className="notif-empty-msg">
                                {filter === "unread"
                                    ? "Bạn đã đọc hết thông báo!"
                                    : "Chưa có thông báo nào."}
                            </p>
                        </div>
                    ) : (
                        <>
                            {notifications.map((notif) => (
                                <NotificationItem
                                    key={notif._id}
                                    notification={notif}
                                    onRead={handleRead}
                                    onDelete={handleDelete}
                                />
                            ))}

                            <div className="notification-pagination">
                                <Pagination
                                    state={{ page, totalPages }}
                                    fetchDataFun={goToPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const NotificationItem = ({ notification, onRead, onDelete }) => {
    const navigate = useNavigate();
    const avatarSrc = notification.user?.personal_info?.profile_img;
    const blogId = notification.blog?.blog_id;

    const handleClick = async () => {
        if (!notification.seen) {
            await onRead(notification._id);
        }

        if (blogId) {
            navigate(`/blog/${blogId}`);
        }
    };

    return (
        <div
            className={`notification-item${notification.seen ? "" : " unread"}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
            <div className="notification-item-left">
                <div className="notification-avatar-wrap">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" className="notification-avatar" />
                    ) : (
                        <div className="notification-avatar notification-avatar-placeholder">
                            <i className="fi fi-rr-user"></i>
                        </div>
                    )}

                    <span className={`notification-type-icon notif-type-${notification.type}`}>
                        {notification.type === "like" && <i className="fi fi-sr-heart"></i>}
                        {notification.type === "comment" && <i className="fi fi-sr-comment-dots"></i>}
                        {notification.type === "reply" && <i className="fi fi-sr-reply-all"></i>}
                    </span>
                </div>

                <div className="notification-body">
                    <p className="notification-message">
                        {getNotificationMessage(notification)}
                    </p>

                    {notification.comment?.comment && (
                        <p className="notification-comment-preview">
                            "{notification.comment.comment}"
                        </p>
                    )}

                    <p className="notification-time">
                        {formatTimeAgo(notification.createdAt)}
                    </p>
                </div>
            </div>

            <div className="notification-actions">
                {!notification.seen && (
                    <span className="notification-unread-dot" title="Chưa đọc"></span>
                )}

                <button
                    className="notification-delete-btn"
                    title="Xóa thông báo"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification._id);
                    }}
                >
                    <i className="fi fi-rr-trash"></i>
                </button>
            </div>
        </div>
    );
};

export default NotificationPage;
