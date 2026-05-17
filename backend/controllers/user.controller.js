import UserService from "../services/user.service.js";

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

    getBlog = async (req, res, next) => {
        try {
            const { blog_id, draft, mode } = req.body;
            
            const blog = await getBlogService(blog_id, mode);


            if (!blog) {
                const err = new Error("Blog not found");
                err.statusCode = 404;
                throw err;
            }

            return res.status(200).json({ blog });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();