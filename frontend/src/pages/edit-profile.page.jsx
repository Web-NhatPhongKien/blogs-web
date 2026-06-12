import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import toast from "react-hot-toast";
import "../index.css";


const SERVER_DOMAIN =
    import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

const EditProfile = () => {
    const navigate = useNavigate();

    // setUser có thể chưa có trong auth.context, nên mình xử lý dạng optional
    const { user, setUser } = useAuth();

    const [form, setForm] = useState({
        username: "",
        bio: "",
        profile_img: "",
        youtube: "",
        instagram: "",
        facebook: "",
        twitter: "",
        github: "",
        website: "",
    });

    // THÊM: state cho form đổi mật khẩu
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // THÊM: loading riêng cho đổi mật khẩu
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        const personalInfo = user.personal_info || {};
        const socialLinks = user.social_links || {};

        setForm({
            username: personalInfo.username || "",
            bio: personalInfo.bio || "",
            profile_img: personalInfo.profile_img || "",
            youtube: socialLinks.youtube || "",
            instagram: socialLinks.instagram || "",
            facebook: socialLinks.facebook || "",
            twitter: socialLinks.twitter || "",
            github: socialLinks.github || "",
            website: socialLinks.website || "",
        });
    }, [user]);

    const getToken = () => {
        return sessionStorage.getItem("token");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // THÊM: xử lý nhập dữ liệu form đổi mật khẩu
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const username = form.username.trim();

        if (!username) {
            toast.error("Username không được để trống");
            return false;
        }

        if (username.length < 3) {
            toast.error("Username phải có ít nhất 3 ký tự");
            return false;
        }

        if (form.bio.length > 200) {
            toast.error("Bio không được quá 200 ký tự");
            return false;
        }

        return true;
    };

    // THÊM: validate form đổi mật khẩu
    const validatePasswordForm = () => {
        if (
            !passwordForm.currentPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu");
            return false;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return false;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return false;
        }

        if (passwordForm.currentPassword === passwordForm.newPassword) {
            toast.error("Mật khẩu mới không được trùng mật khẩu hiện tại");
            return false;
        }

        return true;
    };

    const updateLocalUser = (updatedUser) => {
        if (!updatedUser) return;

        //cập nhật trực tiếp context
        if (typeof setUser === "function") {
            setUser(updatedUser);
        }
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const token = getToken();

            if (!token) {
                toast.error("Bạn chưa đăng nhập hoặc token không tồn tại");
                return;
            }

            const res = await fetch(`${SERVER_DOMAIN}/api/user/update-profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",

                    // Backend verifyToken lấy token từ req.headers.authorization
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: form.username.trim(),
                    bio: form.bio.trim(),
                    profile_img: form.profile_img.trim(),
                    youtube: form.youtube.trim(),
                    instagram: form.instagram.trim(),
                    facebook: form.facebook.trim(),
                    twitter: form.twitter.trim(),
                    github: form.github.trim(),
                    website: form.website.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || data?.message || "Cập nhật thất bại");
            }

            updateLocalUser(data.user);

            toast.success("Cập nhật profile thành công");
            navigate("/profile");
        } catch (err) {
            toast.error(err.message || "Có lỗi xảy ra khi cập nhật profile");
        } finally {
            setLoading(false);
        }
    };

    // THÊM: gọi API đổi mật khẩu ngay trong trang edit profile
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) return;

        try {
            setPasswordLoading(true);

            const token = getToken();

            if (!token) {
                toast.error("Bạn chưa đăng nhập hoặc token không tồn tại");
                navigate("/login");
                return;
            }

            const res = await fetch(`${SERVER_DOMAIN}/api/user/change-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",

                    // Backend lấy token từ req.headers.authorization
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.error || data?.message || "Đổi mật khẩu thất bại"
                );
            }

            toast.success("Đổi mật khẩu thành công");

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            toast.error(err.message || "Có lỗi xảy ra khi đổi mật khẩu");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!user) {
        return (
            <section className="edit-profile-page">
                <div className="edit-profile-empty">
                    <h1>Bạn chưa đăng nhập</h1>
                    <button
                        className="edit-btn edit-btn-dark"
                        onClick={() => navigate("/login")}
                    >
                        Đăng nhập
                    </button>
                </div>
            </section>
        );
    }

    const avatarInputRef = useRef(null);

    const handleAvatarImg = async (e) => {
        let file = e.target.files[0];

        if (file) {
            const previewUrl = URL.createObjectURL(file);

            setForm((prev) => ({
                ...prev,
                profile_img: previewUrl
            }));

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "mn9huksh");
            formData.append("cloud_name", "dj5mxvmtm");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dj5mxvmtm/image/upload", {
                    method: "POST",
                    body: formData
                });

                const data = await res.json();

                if (data.secure_url) {
                    setForm((prev) => ({
                        ...prev,
                        profile_img: data.secure_url
                    }));

                    console.log("Upload avatar thành công!", data.secure_url);
                }
            } catch (err) {
                console.error("Lỗi khi upload avatar:", err);
            }
        }
    };

    return (
        <section className="edit-profile-page">
            <div className="edit-profile-container">
                <div className="edit-profile-header">
                    <h1>Edit profile</h1>
                    <p>
                        Cập nhật thông tin cá nhân, ảnh đại diện và các liên kết mạng xã hội
                        của bạn.
                    </p>
                </div>

                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    <div className="edit-profile-preview">
                        <label htmlFor="uploadAvatar" className="cursor-pointer">
                            <img
                                src={
                                    form.profile_img ||
                                    "https://api.dicebear.com/6.x/fun-emoji/svg?seed=user"
                                }
                                alt={form.username || "avatar"}
                                className="edit-profile-avatar"
                            />
                            <input
                                id="uploadAvatar"
                                type="file"
                                accept=".png, .jpg, .jpeg, .webp"
                                hidden
                                onChange={handleAvatarImg}
                            />
                        </label>

                        <div className="edit-profile-preview-info">
                            <h2>{form.username || "Username"}</h2>
                            <p>{form.bio || "Chưa có mô tả cá nhân."}</p>
                        </div>
                    </div>

                    <div className="edit-section">
                        <h3>Thông tin cá nhân</h3>

                        <div className="edit-field">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Nhập username"
                            />
                        </div>

                        <div className="edit-field">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Viết mô tả ngắn về bạn"
                                maxLength={200}
                            />

                            <span className="edit-char-count">{form.bio.length}/200</span>
                        </div>

                        <div className="edit-field">
                            <label>Ảnh đại diện URL</label>
                            <input
                                type="text"
                                name="profile_img"
                                value={form.profile_img}
                                onChange={handleChange}
                                placeholder="Dán link ảnh đại diện"
                            />
                        </div>
                    </div>

                    <div className="edit-section">
                        <h3>Mạng xã hội</h3>

                        <div className="edit-field">
                            <label>Youtube</label>
                            <input
                                type="text"
                                name="youtube"
                                value={form.youtube}
                                onChange={handleChange}
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div className="edit-field">
                            <label>Instagram</label>
                            <input
                                type="text"
                                name="instagram"
                                value={form.instagram}
                                onChange={handleChange}
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="edit-field">
                            <label>Facebook</label>
                            <input
                                type="text"
                                name="facebook"
                                value={form.facebook}
                                onChange={handleChange}
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        <div className="edit-field">
                            <label>Twitter</label>
                            <input
                                type="text"
                                name="twitter"
                                value={form.twitter}
                                onChange={handleChange}
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div className="edit-field">
                            <label>Github</label>
                            <input
                                type="text"
                                name="github"
                                value={form.github}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div className="edit-field">
                            <label>Website</label>
                            <input
                                type="text"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder="https://your-website.com"
                            />
                        </div>
                    </div>

                    <div className="edit-actions">
                        <button
                            type="button"
                            className="edit-btn edit-btn-light"
                            onClick={() => navigate("/profile")}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="edit-btn edit-btn-dark"
                            disabled={loading}
                        >
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
                {/* THÊM: form đổi mật khẩu nằm chung trang Edit Profile */}
                <form className="edit-password-form" onSubmit={handleChangePassword}>
                    <div className="edit-section">
                        <h3>Đổi mật khẩu</h3>

                        <p className="edit-password-desc">
                            Cập nhật mật khẩu tài khoản của bạn. Mật khẩu mới phải có ít nhất 6 ký tự.
                        </p>

                        <div className="edit-field">
                            <label>Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </div>

                        <div className="edit-field">
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>

                        <div className="edit-field">
                            <label>Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>

                        <div className="edit-actions">
                            <button
                                type="submit"
                                className="edit-btn edit-btn-dark"
                                disabled={passwordLoading}
                            >
                                {passwordLoading ? "Đang đổi..." : "Đổi mật khẩu"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default EditProfile;