import { useEffect, useState } from "react";
import adminAPI from "../../services/adminApi.service";

const AdminTags = () => {
  const [tags, setTags] = useState([]);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    sort: "name",
    order: "asc",
  });

  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  const [renamingTag, setRenamingTag] = useState(null);
  const [newTagName, setNewTagName] = useState("");

  const loadTags = async () => {
    try {
      setLoading(true);

      const res = await adminAPI.get("/tags", {
        params: query,
      });

      setTags(res.data.tags || []);

      setPagination({
        totalDocs: res.data.totalDocs || 0,
        totalPages: res.data.totalPages || 1,
      });
    } catch (err) {
      alert(err?.response?.data?.error || "Không thể tải danh sách tag");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleLimitChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      limit: Number(e.target.value),
      page: 1,
    }));
  };

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

  const getSortIcon = (field) => {
    if (query.sort !== field) return "↕";
    return query.order === "asc" ? "↑" : "↓";
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  const openRenameModal = (tag) => {
    setRenamingTag(tag);
    setNewTagName(tag.name || "");
  };

  const closeRenameModal = () => {
    setRenamingTag(null);
    setNewTagName("");
  };

  const handleRenameTag = async (e) => {
    e.preventDefault();

    if (!renamingTag) return;

    const oldName = renamingTag.name;
    const trimmedNewName = newTagName.trim();

    if (!trimmedNewName) {
      alert("Tên tag mới không được để trống");
      return;
    }

    if (trimmedNewName === oldName) {
      alert("Tên tag mới không được trùng tên cũ");
      return;
    }

    try {
      await adminAPI.patch("/tags/rename", {
        oldName,
        newName: trimmedNewName,
      });

      alert("Đổi tên danh mục/tag thành công");

      closeRenameModal();
      loadTags();
    } catch (err) {
      alert(err?.response?.data?.error || "Đổi tên tag thất bại");
    }
  };

  const handleDeleteTag = async (tag) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa tag "${tag.name}" khỏi toàn bộ bài viết không?`
    );

    if (!confirmDelete) return;

    try {
      await adminAPI.delete(`/tags/${encodeURIComponent(tag.name)}`);

      alert("Xóa tag thành công");

      loadTags();
    } catch (err) {
      alert(err?.response?.data?.error || "Xóa tag thất bại");
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2>Quản lý danh mục / Tags</h2>
          <p>
            Danh mục được lấy từ trường tags của các bài viết trong hệ thống.
          </p>
        </div>

        <div className="admin-total-box">
          <span>Tổng tags</span>
          <strong>{pagination.totalDocs}</strong>
        </div>
      </div>

      <div className="admin-toolbar admin-toolbar-tags">
        <input
          type="text"
          placeholder="Tìm kiếm tag..."
          value={query.search}
          onChange={handleSearchChange}
        />

        <select value={query.limit} onChange={handleLimitChange}>
          <option value={5}>5 dòng</option>
          <option value={10}>10 dòng</option>
          <option value={20}>20 dòng</option>
          <option value={50}>50 dòng</option>
        </select>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <p className="admin-loading">Đang tải danh sách tag...</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table admin-tags-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>
                    Tên tag {getSortIcon("name")}
                  </th>

                  <th onClick={() => handleSort("count")}>
                    Tổng bài viết {getSortIcon("count")}
                  </th>

                  <th>Bài đang hiện</th>

                  <th>Bài đang ẩn</th>

                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <tr key={tag._id || tag.name}>
                      <td>
                        <span className="admin-tag-name">
                          {tag.name}
                        </span>
                      </td>

                      <td>
                        <strong>{tag.totalBlogs || 0}</strong>
                      </td>

                      <td>
                        <span className="admin-badge admin-badge-green">
                          {tag.visibleBlogs || 0}
                        </span>
                      </td>

                      <td>
                        <span className="admin-badge admin-badge-red">
                          {tag.hiddenBlogs || 0}
                        </span>
                      </td>

                      <td>
                        <div className="admin-action-group">
                          <button
                            className="admin-btn-small admin-btn-edit"
                            onClick={() => openRenameModal(tag)}
                          >
                            Đổi tên
                          </button>

                          <button
                            className="admin-btn-small admin-btn-delete"
                            onClick={() => handleDeleteTag(tag)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="admin-empty-cell">
                      Không có tag nào
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

      {renamingTag && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Đổi tên tag</h3>

              <button onClick={closeRenameModal}>×</button>
            </div>

            <form onSubmit={handleRenameTag} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Tên tag cũ</label>
                <input
                  type="text"
                  value={renamingTag.name}
                  disabled
                />
              </div>

              <div className="admin-form-group">
                <label>Tên tag mới</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nhập tên tag mới"
                />
              </div>

              <div className="admin-warning-box">
                Việc đổi tên tag sẽ cập nhật tag này trong toàn bộ bài viết
                đang sử dụng nó.
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-light"
                  onClick={closeRenameModal}
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

export default AdminTags;