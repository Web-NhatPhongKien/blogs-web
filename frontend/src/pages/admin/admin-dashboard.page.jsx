import { useEffect, useState } from "react";
import adminAPI from "../../services/adminApi.service";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    tags: 0,
    visibleBlogs: 0,
    hiddenBlogs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        const [usersRes, blogsRes, tagsRes, visibleRes, hiddenRes] =
          await Promise.all([
            adminAPI.get("/users?page=1&limit=1"),
            adminAPI.get("/blogs?page=1&limit=1&status=all"),
            adminAPI.get("/tags?page=1&limit=1"),
            adminAPI.get("/blogs?page=1&limit=1&status=visible"),
            adminAPI.get("/blogs?page=1&limit=1&status=hidden"),
          ]);

        setStats({
          users: usersRes.data.totalDocs || 0,
          blogs: blogsRes.data.totalDocs || 0,
          tags: tagsRes.data.totalDocs || 0,
          visibleBlogs: visibleRes.data.totalDocs || 0,
          hiddenBlogs: hiddenRes.data.totalDocs || 0,
        });
      } catch (err) {
        alert(
          err?.response?.data?.error ||
            "Không thể tải dữ liệu dashboard admin"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <p className="admin-loading">Đang tải dashboard...</p>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Tài khoản</span>
          <h2>{stats.users}</h2>
          <p>Tổng số tài khoản</p>
        </div>

        <div className="admin-stat-card">
          <span>Bài viết</span>
          <h2>{stats.blogs}</h2>
          <p>Tổng số bài viết</p>
        </div>

        <div className="admin-stat-card">
          <span>Đang hiển thị</span>
          <h2>{stats.visibleBlogs}</h2>
          <p>Bài viết đang hiện</p>
        </div>

        <div className="admin-stat-card">
          <span>Đang ẩn</span>
          <h2>{stats.hiddenBlogs}</h2>
          <p>Bài viết nháp</p>
        </div>

        <div className="admin-stat-card">
          <span>Danh mục</span>
          <h2>{stats.tags}</h2>
          <p>Tổng danh mục</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;