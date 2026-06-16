import User from "../schemas/user.schema.js";
import bcrypt from "bcrypt"; // THÊM: dùng để so sánh và mã hóa mật khẩu khi đổi password

class UserService {
    getUserProfileService = async (username) => {
        return await User.findOne({ "personal_info.username": username })
            .select("-personal_info.password -google_auth -updatedAt -blogs");
    }

    searchUsersService = async (query, limit = 50) => {
        return await User.find({ "personal_info.username": new RegExp(query, 'i') })
            .limit(limit)
            .select("personal_info.username personal_info.profile_img -_id");
    }

    //THÊM: chức năng sửa profile cho User
    updateProfileService = async (userId, data) => {
        // data là thông tin frontend gửi lên từ form sửa profile
        const { username, bio, profile_img, youtube, instagram, facebook, twitter, github, website } = data;

        // Nếu user đổi username thì phải kiểm tra username đó đã tồn tại chưa
        if (username) {
            const existingUser =
                await User.findOne({
                    "personal_info.username": username, _id: { $ne: userId } // SỬA: loại trừ chính user hiện tại
                });

            if (existingUser) {
                throw new Error("Username đã tồn tại");
            }
        }

        // Chỉ cho user sửa các field an toàn
        // KHÔNG cho sửa role ở đây vì role phải do admin quản lý
        const updateData = {
            "personal_info.username": username,
            "personal_info.bio": bio,
            "personal_info.profile_img": profile_img,

            "social_links.youtube": youtube,
            "social_links.instagram": instagram,
            "social_links.facebook": facebook,
            "social_links.twitter": twitter,
            "social_links.github": github,
            "social_links.website": website,
        };

        // Xóa các field undefined để không ghi đè dữ liệu cũ
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        ).select("-personal_info.password -google_auth -updatedAt -blogs");

        return updatedUser;
    }

    //THÊM: sửa mật khẩu cho User
    changePasswordService = async (userId, data) => {
        const { currentPassword, newPassword } = data;
        // Kiểm tra dữ liệu đầu vào
        if (!currentPassword || !newPassword) {
            throw new Error("Vui lòng nhập đầy đủ mật khẩu");
        }
        if (newPassword.length < 6) {
            throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
        }
        // Lấy user từ database để lấy password cũ
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Không tìm thấy user");
        }
        // Nếu là tài khoản Google thì không cho đổi mật khẩu thường
        if (user.google_auth) {
            throw new Error("Tài khoản Google không thể đổi mật khẩu tại đây");
        }
        // So sánh mật khẩu hiện tại với mật khẩu đã mã hóa trong database
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.personal_info.password
        );
        if (!isMatch) {
            throw new Error("Mật khẩu hiện tại không đúng");
        }
        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Lưu mật khẩu mới
        user.personal_info.password = hashedPassword;
        await user.save();

        return true;
    }
}

export default new UserService();

