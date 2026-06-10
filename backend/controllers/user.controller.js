import UserService from "../services/user.service.js";
import BlogService from "../services/blog.service.js";

class UserController {
    getProfile = async (req, res, next) => {
        try {
            const { username } = req.body;
            const user = await UserService.getUserProfileService(username);

            if (!user) {
                const err = new Error("User not found");
                err.statusCode = 404;
                throw err;
            }

            return res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    searchUsers = async (req, res, next) => {
        try {
            const { query } = req.body;
            const users = await UserService.searchUsersService(query);
            return res.status(200).json({ users });
        } catch (err) {
            next(err);
        }
    }

    // THÊM: controller xử lý cập nhật profile
    updateProfile = async (req, res, next) => {
        try {
            // verifyToken đã giải mã token và gắn dữ liệu vào req.user
            
            const userId = req.user.userId;
            console.log("REQ USER:", req.user);
            const updatedUser = await UserService.updateProfileService(
                userId,
                req.body
            );

            return res.status(200).json({
                message: "Cập nhật profile thành công",
                user: updatedUser
            });
        } catch (err) {
            next(err);
        }
    }


    // THÊM: controller xử lý đổi mật khẩu
    changePassword = async (req, res, next) => {
        try {
            // Lấy id user từ token
            const userId = req.user.userId;

            await UserService.changePasswordService(
                userId,
                req.body
            );

            return res.status(200).json({
                message: "Đổi mật khẩu thành công"
            });
        } catch (err) {
            next(err);
        }
    }

    getBlog = async (req, res, next) => {
        try {
            const { blog_id, draft, mode } = req.body;
            const user_id = req.user?.userId;
            
            const { blog, liked_by_user } = await BlogService.getBlogService(blog_id, draft, mode, user_id);


            if (!blog) {
                const err = new Error("Blog not found");
                err.statusCode = 404;
                throw err;
            }

            return res.status(200).json({ blog, liked_by_user });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();
