import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../schemas/user.schema.js";
import Blog from "../schemas/blog.schema.js";
import { generateToken } from "../utils/jwt.js";

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getSortValue = (sort, order, allowedSorts, defaultSort) => {
  const sortField = allowedSorts[sort] || defaultSort;
  const sortOrder = order === "asc" ? 1 : -1;

  return {
    [sortField]: sortOrder,
  };
};

const getBlogFindQuery = (blogId) => {
  if (mongoose.Types.ObjectId.isValid(blogId)) {
    return {
      $or: [{ _id: blogId }, { blog_id: blogId }],
    };
  }

  return {
    blog_id: blogId,
  };
};

class AdminService {

  // Lấy danh sách user: có phân trang, search, sort, filter
  getUsersService = async (queryData) => {
    const { page, limit, skip } = getPagination(queryData);

    const {
      search = "",
      role = "all",
      sort = "joinedAt",
      order = "desc",
    } = queryData;

    const findQuery = {};

    if (search) {
      findQuery.$or = [
        { "personal_info.username": new RegExp(search, "i") },
        { "personal_info.email": new RegExp(search, "i") },
      ];
    }

    if (role !== "all") {
      findQuery.role = role;
    }

    const sortValue = getSortValue(
      sort,
      order,
      {
        joinedAt: "joinedAt",
        username: "personal_info.username",
        email: "personal_info.email",
        role: "role",
        total_posts: "account_info.total_posts",
        total_reads: "account_info.total_reads",
      },
      "joinedAt"
    );

    const [users, totalDocs] = await Promise.all([
      User.find(findQuery)
        .select("-personal_info.password -blogs -google_auth -updatedAt")
        .sort(sortValue)
        .skip(skip)
        .limit(limit),

      User.countDocuments(findQuery),
    ]);

    return {
      users,
      page,
      limit,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
    };
  };

  // Sửa thông tin user
  updateUserService = async (userId, data) => {
    const {
      username,
      email,
      bio,
      profile_img,
      role,
      youtube,
      instagram,
      facebook,
      twitter,
      github,
      website,
    } = data;

    if (username) {
      const existedUsername = await User.findOne({
        "personal_info.username": username,
        _id: { $ne: userId },
      });

      if (existedUsername) {
        throw new Error("Username đã tồn tại");
      }
    }

    if (email) {
      const existedEmail = await User.findOne({
        "personal_info.email": email,
        _id: { $ne: userId },
      });

      if (existedEmail) {
        throw new Error("Email đã tồn tại");
      }
    }

    const updateData = {
      "personal_info.username": username,
      "personal_info.email": email,
      "personal_info.bio": bio,
      "personal_info.profile_img": profile_img,

      "social_links.youtube": youtube,
      "social_links.instagram": instagram,
      "social_links.facebook": facebook,
      "social_links.twitter": twitter,
      "social_links.github": github,
      "social_links.website": website,
    };

    if (role && ["user", "admin"].includes(role)) {
      updateData.role = role;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-personal_info.password -blogs -google_auth -updatedAt");

    if (!updatedUser) {
      throw new Error("Không tìm thấy user");
    }

    return {
      message: "Cập nhật tài khoản thành công",
      user: updatedUser,
    };
  };

  // Xóa user
  deleteUserService = async (userId, currentAdminId) => {
    if (String(userId) === String(currentAdminId)) {
      throw new Error("Không thể tự xóa tài khoản đang đăng nhập");
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error("Không tìm thấy user");
    }

    return {
      message: "Xóa tài khoản thành công",
    };
  };

  // Lấy danh sách bài viết: có phân trang, search, sort, filter
  getBlogsService = async (queryData) => {
    const { page, limit, skip } = getPagination(queryData);

    const {
      search = "",
      status = "all",
      tag = "",
      sort = "publishedAt",
      order = "desc",
    } = queryData;

    const findQuery = {};

    if (search) {
      findQuery.$or = [
        { title: new RegExp(search, "i") },
        { des: new RegExp(search, "i") },
        { tags: new RegExp(search, "i") },
      ];
    }

    if (status === "hidden") {
      findQuery.draft = true;
    }

    if (status === "visible") {
      findQuery.draft = false;
    }

    if (tag) {
      findQuery.tags = tag;
    }

    const sortValue = getSortValue(
      sort,
      order,
      {
        publishedAt: "publishedAt",
        title: "title",
        reads: "activity.total_reads",
        likes: "activity.total_likes",
        comments: "activity.total_comments",
      },
      "publishedAt"
    );

    const [blogs, totalDocs] = await Promise.all([
      Blog.find(findQuery)
        .populate(
          "author",
          "personal_info.username personal_info.email personal_info.profile_img role"
        )
        .sort(sortValue)
        .skip(skip)
        .limit(limit),

      Blog.countDocuments(findQuery),
    ]);

    return {
      blogs,
      page,
      limit,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
    };
  };

  // Ẩn / hiện bài viết
  updateBlogVisibilityService = async (blogId, data) => {
    const { hidden } = data;

    const updatedBlog = await Blog.findOneAndUpdate(
      getBlogFindQuery(blogId),
      {
        $set: {
          draft: Boolean(hidden),
        },
      },
      {
        new: true,
      }
    );

    if (!updatedBlog) {
      throw new Error("Không tìm thấy bài viết");
    }

    return {
      message: Boolean(hidden) ? "Đã ẩn bài viết" : "Đã hiện bài viết",
      blog: updatedBlog,
    };
  };

  // Xóa bài viết
  deleteBlogService = async (blogId) => {
    // SỬA: lấy bài trước để giữ lại author và _id
    const blogToDelete = await Blog.findOne(
      getBlogFindQuery(blogId)
    );

    if (!blogToDelete) {
      throw new Error("Không tìm thấy bài viết");
    }

    // SỬA: xóa bài khỏi collection blogs
    await Blog.deleteOne({
      _id: blogToDelete._id,
    });

    // THÊM: đếm lại chính xác số bài đã xuất bản còn lại của tác giả
    const remainingPublishedPosts =
      await Blog.countDocuments({
        author: blogToDelete.author,
        draft: false,
      });

    // THÊM:
    // 1. Xóa ObjectId bài khỏi user.blogs
    // 2. Gán lại total_posts theo dữ liệu thực tế trong collection blogs
    const updatedAuthor =
      await User.findByIdAndUpdate(
        blogToDelete.author,
        {
          $pull: {
            blogs: blogToDelete._id,
          },

          $set: {
            "account_info.total_posts":
              remainingPublishedPosts,
          },
        },
        {
          new: true,
        }
      );

    if (!updatedAuthor) {
      throw new Error(
        "Đã xóa bài viết nhưng không tìm thấy tác giả để cập nhật"
      );
    }

    return {
      message: "Xóa bài viết thành công",
      totalPosts:
        updatedAuthor.account_info.total_posts,
    };
  };

  // Lấy danh sách tag/category từ blog.tags
  getTagsService = async (queryData) => {
    const { page, limit, skip } = getPagination(queryData);

    const {
      search = "",
      sort = "name",
      order = "asc",
    } = queryData;

    const matchStage = search
      ? {
        tags: new RegExp(search, "i"),
      }
      : {};

    const sortStage = {};

    if (sort === "count") {
      sortStage.totalBlogs = order === "asc" ? 1 : -1;
    } else {
      sortStage.name = order === "desc" ? -1 : 1;
    }

    const result = await Blog.aggregate([
      { $match: matchStage },
      { $unwind: "$tags" },
      ...(search
        ? [
          {
            $match: {
              tags: new RegExp(search, "i"),
            },
          },
        ]
        : []),
      {
        $group: {
          _id: "$tags",
          name: { $first: "$tags" },
          totalBlogs: { $sum: 1 },
          hiddenBlogs: {
            $sum: {
              $cond: ["$draft", 1, 0],
            },
          },
          visibleBlogs: {
            $sum: {
              $cond: ["$draft", 0, 1],
            },
          },
        },
      },
      { $sort: sortStage },
      {
        $facet: {
          tags: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const tags = result[0]?.tags || [];
    const totalDocs = result[0]?.total?.[0]?.count || 0;

    return {
      tags,
      page,
      limit,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
    };
  };

  // Đổi tên tag/category trên toàn bộ bài viết
  renameTagService = async ({ oldName, newName }) => {
    if (!oldName || !newName) {
      throw new Error("Vui lòng nhập oldName và newName");
    }

    const blogs = await Blog.find({
      tags: oldName,
    });

    for (const blog of blogs) {
      blog.tags = [
        ...new Set(
          blog.tags.map((tag) => {
            return tag === oldName ? newName : tag;
          })
        ),
      ];

      await blog.save();
    }

    return {
      message: "Đổi tên danh mục/tag thành công",
      updatedBlogs: blogs.length,
    };
  };

  // Xóa tag/category khỏi toàn bộ bài viết
  deleteTagService = async (tagName) => {
    const result = await Blog.updateMany(
      {
        tags: tagName,
      },
      {
        $pull: {
          tags: tagName,
        },
      }
    );

    return {
      message: "Xóa danh mục/tag khỏi các bài viết thành công",
      modifiedCount: result.modifiedCount,
    };
  };
}

export default new AdminService();