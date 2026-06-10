import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import "../index.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const personalInfo = user.personal_info;
  const socialLinks = user.social_links;
  const accountInfo = user.account_info;

  const username = personalInfo.username || "Unknown user";
  const email = personalInfo.email || "";
  const bio = personalInfo.bio || "Chưa có mô tả cá nhân.";
  const profileImg = personalInfo.profile_img;
  const role = user.role || "user";

  const totalPosts = accountInfo.total_posts || 0;
  const totalReads = accountInfo.total_reads || 0;

  const joinedAt = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("vi-VN")
    : "Chưa rõ";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
                <p>Posts</p>
              </div>

              <div>
                <h3>{totalReads}</h3>
                <p>Reads</p>
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
                Edit profile
              </Link>

              {role === "admin" && (
                <Link
                  to="/admin"
                  className="profile-btn profile-btn-light"
                >
                  Admin dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="profile-btn profile-btn-light"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* CỘT TRÁI */}
        <main className="profile-main">
          <div className="profile-header">
            <h1>{username}</h1>

            <div className="profile-tabs">
              <button className="active">Home</button>
              <button>About</button>
            </div>
          </div>

          {/* Bỏ phần load bài vì teammate làm */}
          <div className="profile-post-placeholder">
            <h2>Chưa hiển thị bài viết</h2>
          </div>

          <div className="profile-about">
            <h2>About {username}</h2>

            <p className="profile-about-text">{bio}</p>

            <div className="profile-about-info">
              <p>
                <span>Email:</span> {email}
              </p>

              <p>
                <span>Role:</span> {role}
              </p>

              <p>
                <span>Joined:</span> {joinedAt}
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Profile;