import User from "../schemas/user.schema.js";

class UserService {
    getUserProfileService = async (username) => {
        return await User.findOne({ "personal_info.username": username })
            .select("-personal_info.password -google_auth -updatedAt -blogs");
    }

    searchUsersService = async (query, limit = 50) => {
        return await User.find({ "personal_info.username": new RegExp(query, 'i') })
            .limit(limit)
            .select("personal_info.fullname personal_info.username personal_info.profile_image -_id");
    }
}

export default new UserService();

