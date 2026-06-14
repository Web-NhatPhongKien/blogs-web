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
          <h3>Quản trị viên</h3>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            Tổng quan
          </NavLink>

          <NavLink to="/admin/users">
            Tài khoản
          </NavLink>

          <NavLink to="/admin/blogs">
            Bài viết
          </NavLink>

          <NavLink to="/admin/tags">
            Danh mục
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Quản lý hệ thống</h1>
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