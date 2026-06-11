import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import "./admin.css";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const username = user?.personal_info?.username || "Admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Blog Admin</h2>
          <p>Management Panel</p>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users">
            Tài khoản
          </NavLink>

          <NavLink to="/admin/blogs">
            Bài viết
          </NavLink>

          <NavLink to="/admin/tags">
            Danh mục / Tags
          </NavLink>

          {/* <NavLink to="/admin/admins">
            Quản trị viên
          </NavLink> */}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Quản lý hệ thống blog</p>
          </div>

          <button onClick={() => navigate("/profile")}>
            Về profile
          </button>
        </header>

        <Outlet />
      </main>
    </section>
  );
};

export default AdminLayout;