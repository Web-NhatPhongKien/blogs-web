import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthConfig } from "../common/auth-config";

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const handleSearch = (e) => {
        const query = e.target.value;

        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
        }
    };

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        const fetchUnreadCount = async () => {
            try {
                const res = await axios.get(
                    import.meta.env.VITE_SERVER_DOMAIN + "/api/notifications/unread-count",
                    getAuthConfig()
                );
                setUnreadCount(res.data.count || 0);
            } catch {
                setUnreadCount(0);
            }
        };

        const handleUnreadChange = (event) => {
            if (typeof event.detail?.count === "number") {
                setUnreadCount(event.detail.count);
                return;
            }

            if (typeof event.detail?.delta === "number") {
                setUnreadCount((prev) => Math.max(0, prev + event.detail.delta));
                return;
            }

            fetchUnreadCount();
        };

        fetchUnreadCount();
        window.addEventListener("notifications:unread-change", handleUnreadChange);

        const interval = setInterval(fetchUnreadCount, 60000);

        return () => {
            clearInterval(interval);
            window.removeEventListener("notifications:unread-change", handleUnreadChange);
        };
    }, [user]);

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" />
                </Link>

                <div className="relative bg-white w-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-auto bg-grey p-4 pr-6 rounded-full placeholder:text-dark-grey pl-12"
                        onKeyDown={handleSearch}
                    />

                    <i className="fi fi-rr-search absolute pointer-events-none left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <Link to="/editor" className="flex md:flex gap-2 link">
                        <i className="fi fi-sr-pencil">Click to edit</i>
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to="/notifications"
                                className="notif-bell"
                                title="Thong bao"
                            >
                                <i className="fi fi-rr-bell"></i>
                                {unreadCount > 0 && (
                                    <span className="notif-badge">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/profile"
                                className="w-12 h-12 rounded-full border flex items-center justify-center"
                            >
                                <i className="fi fi-rr-user"></i>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className="btn-dark" to="/login">
                                Sign in
                            </Link>

                            <Link className="btn-light" to="/register">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar;
