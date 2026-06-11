import AdminService from "../services/admin.service.js";

class AdminController {
  
  // Lấy danh sách user
  getUsers = async (req, res, next) => {
    try {
      const data = await AdminService.getUsersService(req.query);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Sửa user
  updateUser = async (req, res, next) => {
    try {
      const data = await AdminService.updateUserService(
        req.params.userId,
        req.body
      );

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Xóa user
  deleteUser = async (req, res, next) => {
    try {
      const data = await AdminService.deleteUserService(
        req.params.userId,
        req.user.userId
      );

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Lấy danh sách bài viết
  getBlogs = async (req, res, next) => {
    try {
      const data = await AdminService.getBlogsService(req.query);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Ẩn / hiện bài viết
  updateBlogVisibility = async (req, res, next) => {
    try {
      const data = await AdminService.updateBlogVisibilityService(
        req.params.blogId,
        req.body
      );

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Xóa bài viết
  deleteBlog = async (req, res, next) => {
    try {
      const data = await AdminService.deleteBlogService(req.params.blogId);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Lấy danh sách tag/category
  getTags = async (req, res, next) => {
    try {
      const data = await AdminService.getTagsService(req.query);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Đổi tên tag/category
  renameTag = async (req, res, next) => {
    try {
      const data = await AdminService.renameTagService(req.body);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Xóa tag/category
  deleteTag = async (req, res, next) => {
    try {
      const data = await AdminService.deleteTagService(req.params.tagName);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export default new AdminController();