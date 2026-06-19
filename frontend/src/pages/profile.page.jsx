import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import BlogsManage from "./manage-blogs.page";
import "../index.css";

const Profile = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  // lấy username từ URL /user/:username
  const { username: usernameParam } = useParams();
  // user thực tế đang được hiển thị trên trang
  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  // THÊM: lưu tổng số bài lấy mới trực tiếp từ database
  const [totalPosts, setTotalPosts] = useState(0);

  // Không có usernameParam nghĩa là đang ở /profile
  const isOwnProfile = !usernameParam || usernameParam === currentUser?.personal_info?.username;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        // Trường hợp vào /profile của chính mình
        if (!usernameParam) {
          setProfileUser(currentUser);
          return;
        }

        // Trường hợp vào /user/:username nhưng username đó là chính mình
        if (currentUser && usernameParam === currentUser.personal_info?.username) {
          setProfileUser(currentUser);
          return;
        }

        // THÊM: lấy profile của user khác từ backend
        const serverDomain = import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

        const response = await fetch(`${serverDomain}/api/user/get-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: usernameParam,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
            data?.message ||
            "Không tìm thấy người dùng"
          );
        }

        // Backend hiện trả trực tiếp object user
        setProfileUser(data);
      } catch (error) {
        console.error("Lỗi tải profile:", error);
        setProfileUser(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [usernameParam, currentUser]);

  // THÊM: luôn lấy total_posts mới nhất từ database,
  // không dùng giá trị cũ trong sessionStorage
  useEffect(() => {
    const loadTotalPosts = async () => {
      const targetUsername =
        usernameParam ||
        currentUser?.personal_info?.username;

      if (!targetUsername) return;

      try {
        const serverDomain =
          import.meta.env.VITE_SERVER_DOMAIN ||
          "http://localhost:3000";

        const response = await fetch(
          `${serverDomain}/api/user/get-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: targetUsername,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
            data?.message ||
            "Không thể lấy tổng số bài viết"
          );
        }

        // Hỗ trợ cả hai dạng response:
        // user trực tiếp hoặc { user: {...} }
        const databaseUser = data.user || data;

        setTotalPosts(
          databaseUser?.account_info?.total_posts ?? 0
        );
      } catch (error) {
        console.error(
          "Lỗi lấy tổng số bài viết:",
          error
        );

        setTotalPosts(0);
      }
    };

    loadTotalPosts();
  }, [
    usernameParam,
    currentUser?.personal_info?.username,
  ]);

  // THÊM: trạng thái đang tải hồ sơ
  if (loadingProfile) {
    return (
      <section className="profile-page">
        <div className="profile-empty">
          <p>Đang tải hồ sơ...</p>
        </div>
      </section>
    );
  }

  // THÊM: không tìm thấy user
  if (!profileUser) {
    return (
      <section className="profile-page">
        <div className="profile-empty">
          <h1>Không tìm thấy người dùng</h1>

          <Link
            to="/"
            className="profile-btn profile-btn-dark"
          >
            Về trang chủ
          </Link>
        </div>
      </section>
    );
  }

  // SỬA: dùng user đang được xem, không phải luôn dùng user đăng nhập
  const personalInfo = profileUser.personal_info || {};
  const socialLinks = profileUser.social_links || {};
  const accountInfo = profileUser.account_info || {};

  const username = personalInfo.username || "Unknown user";
  const email = personalInfo.email || "";
  const bio = personalInfo.bio || "Chưa có mô tả cá nhân.";
  const profileImg = personalInfo.profile_img;
  const role = profileUser.role || "user";
  const userId = profileUser._id;

  // const totalPosts = accountInfo.total_posts || 0;
  // const totalReads = accountInfo.total_reads || 0;

  const joinedAt = profileUser.joinedAt ? new Date(profileUser.joinedAt).toLocaleDateString("vi-VN") : "Chưa rõ";



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

            {/* SỬA: chỉ chủ tài khoản mới được sửa profile và đăng xuất */}
            {isOwnProfile && (
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
            )}
          </div>
        </aside>

        {/* CỘT TRÁI */}
        <main className="profile-main">
          <BlogsManage userId={userId} isOwnProfile={isOwnProfile} />
        </main>
      </div>
    </section>
  );
};

export default Profile;
