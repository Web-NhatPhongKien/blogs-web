import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useEffect, useState } from "react";
import axios from "axios";
import BlogPostCard from "../components/blog-post.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import Pagination from "../components/pagination.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import "../index.css";
import { Toaster } from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(null);
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState(null);

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

  const fetchUserBlogs = ({ page = 1 } = {}) => {
    if (!userId) {
      setBlogs({ results: [], page: 1, totalDocs: 0, totalPages: 0 });
      return;
    }

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: userId,
        page,
      })
      .then(({ data }) => {
        const formattedData = filterPaginationData({
          data: data.blogs,
          page: data.page,
          totalDocs: data.totalDocs,
          totalPages: data.totalPages,
          limit: data.limit,
        });

        setBlogs(formattedData);
      })
      .catch((err) => {
        console.log(err);
        setBlogs({ results: [], page: 1, totalDocs: 0, totalPages: 0 });
      });
  };

  useEffect(() => {
    fetchUserBlogs({ page: 1 });
  }, [userId]);

  


    const handleChange = (e) => {
        if(!e.target.value.length){
            setQuery("");
            setBlogs(null);
            setDrafts(null)

        }
    }
    
    const handleSearch = (e) => {
        let searchQuery = e.target.value;

        setQuery(searchQuery);
        if(e.keyCode == 13 && searchQuery.length){
            console.log("Search:", searchQuery);
        }
    }
    
  
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

          <div className="profile-post-list">
            {blogs == null ? (
              <Loader />
            ) : blogs.results.length ? (
              <>
                {blogs.results.map((blog) => (
                  <BlogPostCard
                    key={blog.blog_id}
                    content={blog}
                    author={blog.author.personal_info}
                  />
                ))}

                <Pagination state={blogs} fetchDataFun={fetchUserBlogs} />
              </>
            ) : (
              <NoDataMessage message="No blogs published" />
            )}
          </div>
          {/* Bỏ phần load bài vì teammate làm */}
          <div className="profile-post-placeholder">
            <h1 className="">Blogs</h1>
            <Toaster />

            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input type="search" placeholder="Search Blogs" className="w-full bg-grey p-4 pl-12 pr-6 rounded-full"
                onChange={handleChange}
                onKeyDown={handleSearch}
                />
                <i className="fi fi-rr-search absolute  md:left-5 top-1/2 -translate-y-1/2"></i>
            </div>

            {/* <div className="profile-about-info">
              <p>
                <span>Email:</span> {email}
              </p>

              <p>
                <span>Role:</span> {role}
              </p>

              <p>
                <span>Joined:</span> {joinedAt}
              </p>
            </div> */}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Profile;
