import { useEffect, useState } from "react";
import adminAPI from "../../services/adminApi.service";
import toast from "react-hot-toast";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);

  const [query, setQuery] = useState({
    page: 1,
    limit: 5,
    search: "",
    status: "all",
    tag: "",
    sort: "publishedAt",
    order: "desc",
  });

  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  const loadBlogs = async () => {
    try {
      setLoading(true);

      const res = await adminAPI.get("/blogs", {
        params: query,
      });

      setBlogs(res.data.blogs || []);

      setPagination({
        totalDocs: res.data.totalDocs || 0,
        totalPages: res.data.totalPages || 1,
      });
    } catch (err) {
      toast.success(err?.response?.data?.error || "Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const res = await adminAPI.get("/tags", {
        params: {
          page: 1,
          limit: 100,
          sort: "name",
          order: "asc",
        },
      });

      setTags(res.data.tags || []);
    } catch (err) {
      console.error("Không thể tải tags:", err);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleStatusFilter = (e) => {
    setQuery((prev) => ({
      ...prev,
      status: e.target.value,
      page: 1,
    }));
  };

  const handleTagFilter = (e) => {
    setQuery((prev) => ({
      ...prev,
      tag: e.target.value,
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

  const handleToggleVisibility = async (blog) => {
    const isHidden = blog.draft === true;

    const confirmMessage = isHidden
      ? `Bạn có muốn hiện bài "${blog.title}" không?`
      : `Bạn có muốn ẩn bài "${blog.title}" không?`;

    const confirmAction = window.confirm(confirmMessage);

    if (!confirmAction) return;

    try {
      await adminAPI.patch(`/blogs/${blog.blog_id}/visibility`, {
        hidden: !isHidden,
      });

      toast.success(isHidden ? "Đã hiện bài viết" : "Đã ẩn bài viết");

      loadBlogs();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Cập nhật trạng thái thất bại");
    }
  };

  const handleDeleteBlog = async (blog) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa bài viết "${blog.title}" không?`
    );

    if (!confirmDelete) return;

    try {
      await adminAPI.delete(`/blogs/${blog.blog_id}`);

      toast.success("Xóa bài viết thành công");

      loadBlogs();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Xóa bài viết thất bại");
    }
  };

  return (
    <div className="admin-section">

      <div className="admin-toolbar admin-toolbar-blogs">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={query.search}
          onChange={handleSearchChange}
        />

        <select value={query.status} onChange={handleStatusFilter}>
          <option value="all">Tất cả trạng thái</option>
          <option value="visible">Đang hiện</option>
          <option value="hidden">Đang ẩn</option>
        </select>

        <select value={query.tag} onChange={handleTagFilter}>
          <option value="">Tất cả tag</option>

          {tags.map((tag) => (
            <option key={tag.name} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <p className="admin-loading">Đang tải danh sách bài viết...</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table admin-blog-table">
              <thead>
                <tr>
                  <th>Banner</th>

                  <th>
                    Tiêu đề
                  </th>

                  <th>Tác giả</th>

                  <th>Danh mục</th>

                  <th>Trạng thái</th>

                  {/* <th onClick={() => handleSort("reads")}>
                    Reads {getSortIcon("reads")}
                  </th> */}

                  <th onClick={() => handleSort("likes")}>
                    Lượt thích {getSortIcon("likes")}
                  </th>

                  <th onClick={() => handleSort("comments")}>
                    Bình luận {getSortIcon("comments")}
                  </th>

                  <th onClick={() => handleSort("publishedAt")}>
                    Ngày đăng {getSortIcon("publishedAt")}
                  </th>

                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {blogs.length > 0 ? (
                  blogs.map((blog) => {
                    const author = blog.author?.personal_info || {};
                    const activity = blog.activity || {};

                    return (
                      <tr key={blog._id || blog.blog_id}>
                        <td>
                          {blog.banner ? (
                            <img
                              src={blog.banner}
                              alt={blog.title}
                              className="admin-blog-banner"
                            />
                          ) : (
                            <div className="admin-blog-no-banner">
                              No image
                            </div>
                          )}
                        </td>

                        <td>
                          <div className="admin-blog-title-cell">
                            <strong>{blog.title}</strong>
                          </div>
                        </td>

                        <td>
                          <div className="admin-author-cell">
                            {blog.author?.personal_info?.profile_img && (
                              <img
                                src={blog.author.personal_info.profile_img}
                                alt={author.username}
                              />
                            )}

                            <span>{author.username || "Unknown"}</span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-tag-list">
                            {blog.tags?.length > 0 ? (
                              blog.tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                              ))
                            ) : (
                              <em>Không có tag</em>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              blog.draft ? "admin-badge admin-badge-red" : "admin-badge admin-badge-green"
                            }
                          >
                            {blog.draft ? "Ẩn" : "Hiện"}
                          </span>
                        </td>

                        {/* <td>{activity.total_reads || 0}</td> */}

                        <td>{activity.total_likes || 0}</td>

                        <td>{activity.total_comments || 0}</td>

                        <td>
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa rõ"}
                        </td>

                        <td>
                          <div className="admin-action-group">
                            <button
                              className={
                                blog.draft
                                  ? "admin-btn-small admin-btn-show"
                                  : "admin-btn-small admin-btn-hide"
                              }
                              onClick={() => handleToggleVisibility(blog)}
                            >
                              {blog.draft ? "Hiện" : "Ẩn"}
                            </button>

                            <button
                              className="admin-btn-small admin-btn-delete"
                              onClick={() => handleDeleteBlog(blog)}
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
                    <td colSpan="10" className="admin-empty-cell">
                      Không có bài viết nào
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
    </div>
  );
};

export default AdminBlogs;