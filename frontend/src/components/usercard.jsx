import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
    // 1. Destructuring dữ liệu người dùng (Part 3)
    // Tách object personal_info từ prop user để lấy các trường cần thiết
    let { personal_info: { fullname, username, profile_image } } = user;

    return (
        // 2. Thành phần Link điều hướng (Part 3)
        // Bọc toàn bộ card bằng thẻ Link để khi click vào sẽ chuyển hướng đến trang cá nhân của user
        <Link to={`/user/${username}`} className="flex gap-5 items-center mb-5">
            
            {/* 3. Hình ảnh đại diện (Part 3) */}
            <img src={profile_image} className="w-14 h-14 rounded-full" />
            
            {/* 4. Thông tin tên (Part 3) */}
            <div>
                {/* Hiển thị tên đầy đủ, line-clamp-2 giúp ngắt dòng và thêm dấu '...' nếu tên quá dài */}
                <h1 className="font-medium text-xl line-clamp-2">{fullname}</h1>
                
                {/* Hiển thị @username với màu xám */}
                <p className="text-dark-grey">@{username}</p>
            </div>
            
        </Link>
    );
};

export default UserCard;