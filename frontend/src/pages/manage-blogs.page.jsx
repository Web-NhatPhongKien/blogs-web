import { useEffect, useState } from "react";
import axios from "axios";
import BlogPostCard from "../components/blog-post.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import { UserCard, ManageDraftBlog } from "../components/usercard.component";


// isOwnProfile = true  => profile của chính mình, có Edit/Delete/Drafts
// isOwnProfile = false => profile user khác, chỉ xem bài công khai

const BlogsManage = ({ userId, isOwnProfile = true }) => {
    const [blogs, setBlogs] = useState(null);
    const [query, setQuery] = useState("");
    const [drafts, setDrafts] = useState(null);
    const token = sessionStorage.getItem("token");

    // THÊM: lấy bài public của user đang được xem
    const fetchUserBlogs = ({ page = 1 } = {}) => {
        if (!userId) {
            setBlogs({
                results: [],
                page: 1,
                totalDocs: 0,
                totalPages: 0,
            });

            return;
        }

        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/api/blogs/search-blogs`, {
            // userId ở đây là _id của user đang được xem
            author: userId,
            page,
            limit: 10,
        })
            .then(({ data }) => {
                const publicBlogs = data.blogs || [];

                // SỬA: API search-blogs hiện chỉ trả về mảng blogs,
                // nên chưa dùng filterPaginationData ở chế độ xem công khai
                setBlogs({
                    results: publicBlogs,
                    page,
                    totalDocs: publicBlogs.length,
                    totalPages: 1,
                });
            })
            .catch((err) => {
                console.log("Lỗi lấy bài viết công khai:", err.response?.data || err.message);

                setBlogs({
                    results: [],
                    page: 1,
                    totalDocs: 0,
                    totalPages: 0,
                });
            });
    };


    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/blogs/user-written-blogs", {
            page, draft, query, deletedDocCount
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: draft ? drafts : blogs,
                    data: data.blogs,
                    page,
                    user: token,
                    countRoute: "/api/blogs/user-written-blogs-count",
                    data_to_send: { draft, query }
                })

                if (draft) {
                    setDrafts(formattedData)
                }
                else {
                    setBlogs(formattedData)
                }

            })
            .catch(err => {
                console.log(err)
            })
    }

    // THÊM: khi mở /user/:username thì lấy bài public của user đó
    useEffect(() => {
        if (!isOwnProfile) {
            setBlogs(null);
            setDrafts(null);
            fetchUserBlogs({ page: 1 });
        }
    }, [userId, isOwnProfile]);

    useEffect(() => {
        // SỬA: chỉ gọi API quản lý bài khi đang xem profile của chính mình
        if (isOwnProfile && token) {
            if (blogs == null) {
                getBlogs({
                    page: 1,
                    draft: false,
                });
            }

            if (drafts == null) {
                getBlogs({
                    page: 1,
                    draft: true,
                });
            }
        }
    }, [isOwnProfile, token, blogs, drafts, query]);

    const handleSearchChange = (e) => {
        const value = e.target.value;

        setQuery(value);

        if (!value.length) {
            setQuery("");
            setBlogs(null);
            setDrafts(null);

        }
    };

    const handleBlogSearch = (e) => {
        const searchQuery = e.target.value;

        setQuery(searchQuery);

        if (e.keyCode === 13 && searchQuery.length) {
            setBlogs(null);
            setDrafts(null);
        }
    };

    // THÊM: giao diện công khai khi xem profile của user khác
    if (!isOwnProfile) {
        return (
            <div>

                {blogs == null ? (
                    <Loader />
                ) : blogs.results.length ? (
                    blogs.results.map((blog) => (
                        <BlogPostCard
                            key={blog.blog_id}
                            content={blog}
                            author={
                                blog.author?.personal_info || {
                                    username: "",
                                    profile_img: "",
                                }
                            }
                        />
                    ))
                ) : (
                    <NoDataMessage message="Người dùng này chưa có bài viết" />
                )}
            </div>
        );
    }

    return (
        <>

            <div className="profile-post-placeholder">
                <h1>Quản lý bài viết</h1>
                <Toaster />
                <div className="relative max-md:mt-5 md:mt-8 mb-10">
                    <input
                        type="search"
                        placeholder="Search Blogs"
                        className="w-full bg-grey p-4 pl-12 pr-6 rounded-full"
                        value={query}
                        onChange={handleSearchChange}
                        onKeyDown={handleBlogSearch}
                    />

                    <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                </div>

                <InPageNavigation routes={["Bài đã xuất bản", "Bản nháp"]}>

                    {
                        blogs == null ? <Loader /> :
                            blogs.results.length ?
                                <>
                                    {
                                        blogs.results.map((blog, i) => {
                                            return <div key={i}>
                                                <UserCard blog={{ ...blog, index: i, setStateFunc: setBlogs }} />
                                            </div>
                                        })
                                    }
                                </>
                                : <NoDataMessage message="Không có bài đăng" />
                    }


                    {
                        drafts == null ? <Loader /> :
                            drafts.results.length ?
                                <>
                                    {
                                        drafts.results.map((blog, i) => {
                                            return <div key={i}>
                                                <ManageDraftBlog blog={{ ...blog, index: i + 1, setStateFunc: setDrafts }} />
                                            </div>
                                        })
                                    }
                                </>
                                : <NoDataMessage message="Không có bản nháp" />
                    }

                </InPageNavigation>


            </div>

        </>
    );
};

export default BlogsManage;