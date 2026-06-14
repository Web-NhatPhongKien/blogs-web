import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import BlogsManage from "./manage-blogs.page";
import "../index.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-empty">
          <h1>Bạn chưa đăng nhập</h1>
          <Link to="/login" className="profile-btn profile-btn-dark">
            Đăng nhập
          </Link>
        </div>
      </section>
    );
  }

  const personalInfo = user.personal_info || {};
  const socialLinks = user.social_links || {};
  const accountInfo = user.account_info || {};

  const username = personalInfo.username || "Unknown user";
  const email = personalInfo.email || "";
  const bio = personalInfo.bio || "Chưa có mô tả cá nhân.";
  const profileImg = personalInfo.profile_img;
  const role = user.role || "user";
  const userId = user._id;

  const totalPosts = accountInfo.total_posts || 0;
  const totalReads = accountInfo.total_reads || 0;

  const joinedAt = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("vi-VN")
    : "Chưa rõ";

    
  
  return (
    <section className="profile-page">
      <div className="profile-layout">
        {/* CỘT PHẢI */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-sticky">
            <img 
              src={profileImg} 
              alt={username} 
              className="profile-avatar" 
            />

            <h2>{username}</h2>

            <p className="profile-bio">{bio}</p>

            <div className="profile-stats">
              <div>
                <h3>{totalPosts}</h3>
                <p>Bài đăng</p>
              </div>

              <div>
                <h3>{totalReads}</h3>
                <p>Lượt xem</p>
              </div>
            </div>

            <div className="profile-socials">
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noreferrer">
                  Youtube
                </a>
              )}

              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}

              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}

              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer">
                  Twitter
                </a>
              )}

              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer">
                  Github
                </a>
              )}

              {socialLinks.website && (
                <a href={socialLinks.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              )}
            </div>

            <div className="profile-actions">
              <Link 
                to="/settings/edit-profile" 
                className="profile-btn profile-btn-dark"
              >
                Chỉnh sửa trang cá nhân
              </Link>

              {role === "admin" && (
                <Link 
                  to="/admin" 
                  className="profile-btn profile-btn-light"
                >
                  Quản trị viên
                </Link>
              )}

              <button 
                onClick={handleLogout} 
                className="profile-btn profile-btn-light"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </aside>

        {/* CỘT TRÁI */}
        <main className="profile-main">
          <BlogsManage userId={userId} />
        </main>
      </div>
    </section>
  );
};

export default Profile;
