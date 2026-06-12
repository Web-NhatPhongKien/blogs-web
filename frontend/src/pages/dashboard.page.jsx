import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
    return (
        <section className="dashboard-page flex gap-10 py-8">
            {/* SIDEBAR BÊN TRÁI */}
            <aside className="w-[250px] min-w-[250px] border-r border-grey pr-6">
                <h1 className="text-xl text-dark-grey mb-4">DashBoard</h1>
                <hr className="border-t border-dark-grey/20 mb-6" />

                <NavLink
                    to="/dashboard/blogs"
                    className="sidebar-link"
                >
                    <i className="fi fi-sr-document"></i>
                    Blogs
                </NavLink>

                <NavLink
                    to="/dashboard/notification"
                    className="sidebar-link"
                >
                    <i className="fi fi-ss-bell"></i>
                    Notification
                </NavLink>

                <NavLink
                    to="/editor"
                    className="sidebar-link"
                >
                    <i className="fi fi-sr-pencil"></i>
                    Write
                </NavLink>
            </aside>

            {/* NỘI DUNG BÊN PHẢI */}
            <main className="flex-1">
                <Outlet />
            </main>
        </section>
    );
}