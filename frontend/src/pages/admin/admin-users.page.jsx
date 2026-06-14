import { useEffect, useState } from "react";
import adminAPI from "../../services/adminApi.service";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    search: "",
    role: "all",
    sort: "joinedAt",
    order: "desc",
  });

  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    bio: "",
    profile_img: "",
    role: "user",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await adminAPI.get("/users", {
        params: query,
      });

      setUsers(res.data.users || []);

      setPagination({
        totalDocs: res.data.totalDocs || 0,
        totalPages: res.data.totalPages || 1,
      });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleRoleFilter = (e) => {
    setQuery((prev) => ({
      ...prev,
      role: e.target.value,
      page: 1,
    }));
  };

  // const handleLimitChange = (e) => {
  //   setQuery((prev) => ({
  //     ...prev,
  //     limit: Number(e.target.value),
  //     page: 1,
  //   }));
  // };

  const handleSort = (field) => {
    setQuery((prev) => ({
      ...prev,
      sort: field,
      order:
        prev.sort === field && prev.order === "asc"
          ? "desc"
          : "asc",
      page: 1,
    }));
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  const openEditModal = (user) => {
    const personalInfo = user.personal_info || {};

    setEditingUser(user);

    setEditForm({
      username: personalInfo.username || "",
      email: personalInfo.email || "",
      bio: personalInfo.bio || "",
      profile_img: personalInfo.profile_img || "",
      role: user.role || "user",
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);

    setEditForm({
      username: "",
      email: "",
      bio: "",
      profile_img: "",
      role: "user",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editingUser) return;

    if (!editForm.username.trim() || !editForm.email.trim()) {
      toast.error("Username và email không được để trống");
      return;
    }

    try {
      await adminAPI.patch(`/users/${editingUser._id}`, {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        bio: editForm.bio.trim(),
        profile_img: editForm.profile_img.trim(),
        role: editForm.role,
      });

      toast.success("Cập nhật tài khoản thành công");

      closeEditModal();
      loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Cập nhật tài khoản thất bại");
    }
  };

  const handleDeleteUser = async (user) => {
    const username = user.personal_info?.username || "user này";

    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa tài khoản "${username}" không?`
    );

    if (!confirmDelete) return;

    try {
      await adminAPI.delete(`/users/${user._id}`);

      toast.success("Xóa tài khoản thành công");

      loadUsers();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Xóa tài khoản thất bại");
    }
  };

  const getSortIcon = (field) => {
    if (query.sort !== field) return "↕";
    return query.order === "asc" ? "↑" : "↓";
  };

  return (
    <div className="admin-section">
      {/* <div className="admin-section-header">
        <div>
          <h3>Quản lý tài khoản</h3>
        </div>

        <div className="admin-total-box">
          <span>Tổng tài khoản</span>
          <strong>{pagination.totalDocs}</strong>
        </div>
      </div> */}

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={query.search}
          onChange={handleSearchChange}
        />

        <select value={query.role} onChange={handleRoleFilter}>
          <option value="all">Tất cả</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* <select value={query.limit} onChange={handleLimitChange}>
          <option value={5}>5 dòng</option>
          <option value={10}>10 dòng</option>
          <option value={20}>20 dòng</option>
          <option value={50}>50 dòng</option>
        </select> */}
      </div>

      <div className="admin-table-card">
        {loading ? (
          <p className="admin-loading">Đang tải danh sách tài khoản...</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh đại diện</th>

                  <th onClick={() => handleSort("username")}>
                    Tên tài khoản {getSortIcon("username")}
                  </th>

                  <th onClick={() => handleSort("email")}>
                    Email {getSortIcon("email")}
                  </th>

                  <th onClick={() => handleSort("role")}>
                    Vai trò {getSortIcon("role")}
                  </th>

                  {/* <th onClick={() => handleSort("total_posts")}>
                    Posts {getSortIcon("total_posts")}
                  </th>

                  <th onClick={() => handleSort("total_reads")}>
                    Reads {getSortIcon("total_reads")}
                  </th> */}

                  <th onClick={() => handleSort("joinedAt")}>
                    Tham gia vào {getSortIcon("joinedAt")}
                  </th>

                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user) => {
                    const personalInfo = user.personal_info || {};
                    const accountInfo = user.account_info || {};

                    return (
                      <tr key={user._id}>
                        <td>
                          <img
                            src={personalInfo.profile_img}
                            alt={personalInfo.username}
                            className="admin-user-avatar"
                          />
                        </td>

                        <td>{personalInfo.username}</td>

                        <td>{personalInfo.email}</td>

                        <td>
                          <span
                            className={
                              user.role === "admin"
                                ? "admin-badge admin-badge-green"
                                : "admin-badge admin-badge-gray"
                            }
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* <td>{accountInfo.total_posts || 0}</td>

                        <td>{accountInfo.total_reads || 0}</td> */}

                        <td>
                          {user.joinedAt
                            ? new Date(user.joinedAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa rõ"}
                        </td>

                        <td>
                          <div className="admin-action-group">
                            <button
                              className="admin-btn-small admin-btn-edit"
                              onClick={() => openEditModal(user)}
                            >
                              Sửa
                            </button>

                            <button
                              className="admin-btn-small admin-btn-delete"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="admin-empty-cell">
                      Không có tài khoản nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-pagination">
        <button
          onClick={() => goToPage(query.page - 1)}
          disabled={query.page <= 1}
        >
          Trước
        </button>

        <span>
          Trang {query.page} / {pagination.totalPages}
        </span>

        <button
          onClick={() => goToPage(query.page + 1)}
          disabled={query.page >= pagination.totalPages}
        >
          Sau
        </button>
      </div>

      {editingUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Sửa tài khoản</h3>

              <button onClick={closeEditModal}>×</button>
            </div>

            <form onSubmit={handleUpdateUser} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                />
              </div>

              <div className="admin-form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  maxLength={200}
                />
              </div>

              <div className="admin-form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-light"
                  onClick={closeEditModal}
                >
                  Hủy
                </button>

                <button type="submit" className="admin-btn-dark">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;