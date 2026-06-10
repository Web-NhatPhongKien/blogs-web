import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
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

  const validateForm = () => {
    const username = form.username.trim();

    if (!username) {
      alert("Username không được để trống");
      return false;
    }

    if (username.length < 3) {
      alert("Username phải có ít nhất 3 ký tự");
      return false;
    }

    if (form.bio.length > 200) {
      alert("Bio không được quá 200 ký tự");
      return false;
    }

    return true;
  };

  const updateLocalUser = (updatedUser) => {
    if (!updatedUser) return;

    // Nếu auth.context có setUser thì cập nhật trực tiếp context
    if (typeof setUser === "function") {
      setUser(updatedUser);
    }

    // Cập nhật localStorage nếu project đang lưu user ở đây
    const oldUser = localStorage.getItem("user");

    if (oldUser) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        alert("Bạn chưa đăng nhập hoặc token không tồn tại");
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

      alert("Cập nhật profile thành công");
      navigate("/profile");
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi cập nhật profile");
    } finally {
      setLoading(false);
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
            <img
              src={
                form.profile_img ||
                "https://api.dicebear.com/6.x/fun-emoji/svg?seed=user"
              }
              alt={form.username || "avatar"}
              className="edit-profile-avatar"
            />

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
      </div>
    </section>
  );
};

export default EditProfile;