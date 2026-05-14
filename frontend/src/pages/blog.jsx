// ==== [ PART 4 ]: KHỞI TẠO FILE VÀ LOGIC ĐỌC BÀI VIẾT ====
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction";
import BlogPostCard from "../components/blog-post";
import BlogContent from "../components/blog-content";
import CommentsContainer, { fetchComments } from "../components/comments";

// Cấu trúc dữ liệu rỗng mặc định để tránh lỗi undefined khi render lần đầu (Part 4)
export const blogStructure = {
    title: '',
    description: '',
    content: [],
    author: { personal_info: { } },
    banner: '',
    publishedAt: '',
};

// [ PART 4 ]: Tạo Context để truyền dữ liệu xuống các component con (Tương tác, Bình luận)
export const BlogContext = createContext({ });

const BlogPage = () => {
    // Lấy blog_id động từ URL
    let { blog_id } = useParams();

    // ==== CÁC STATE QUẢN LÝ (PART 4 & 5) ====
    const [blog, setBlog] = useState(blogStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLikedByUser, setLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    // Phân rã (Destructuring) dữ liệu từ state blog
    let { 
        title, content, banner, publishedAt, 
        author: { personal_info: { fullname, username: author_username, profile_image } } 
    } = blog;

    // [ PART 4 ]: Hàm gọi API lấy dữ liệu chi tiết của bài blog
    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
            .then(async ({ data: { blog } }) => {
                
                // [ PART 5 ]: Gọi hàm lấy dữ liệu comments ngay khi tải blog
                blog.comments = await fetchComments({ 
                    blog_id: blog._id, 
                    setParentCommentCountFun: setTotalParentCommentsLoaded 
                });
                
                setBlog(blog); // Cập nhật state bài viết

                // [ PART 4 ]: Lấy danh sách các bài blog tương tự (dựa trên tag đầu tiên)
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { 
                    tag: blog.tags, 
                    limit: 6, 
                    eliminate_blog: blog_id // Loại trừ bài hiện tại khỏi danh sách gợi ý
                })
                .then(({ data }) => {
                    setSimilarBlogs(data.blogs);
                });

                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    // [ PART 4 ]: Hàm reset lại toàn bộ state khi người dùng chuyển sang đọc blog khác
    const resetStates = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);
    };

    // Theo dõi sự thay đổi của blog_id trên URL để load lại dữ liệu
    useEffect(() => {
        resetStates();
        fetchBlog();
    }, [blog_id]);

    return (
        <>
            {loading ? <Loader /> :
                
                // [ PART 4 ]: Bọc Context Provider để share state cho Comments và Interactions
                <BlogContext.Provider value={{ 
                    blog, setBlog, 
                    isLikedByUser, setLikedByUser, 
                    commentsWrapper, setCommentsWrapper, 
                    totalParentCommentsLoaded, setTotalParentCommentsLoaded 
                }}>

                    {/* [ PART 5 ]: Component trượt chứa hệ thống bình luận */}
                    <CommentsContainer />

                    {/* ==== KHUNG GIAO DIỆN ĐỌC BLOG CHÍNH ==== */}
                    {/* THIẾT KẾ RESPONSIVE: Căn giữa, giới hạn chiều rộng trên Web, thêm đệm hai bên trên Mobile */}
                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                        
                        <img src={banner} className="aspect-video object-cover" />

                        <div className="mt-12">
                            <h2>{title}</h2>

                            {/* THIẾT KẾ MOBILE: Flex cột khi màn hình nhỏ (max-sm:flex-col), Flex ngang khi màn hình lớn */}
                            <div className="flex max-sm:flex-col justify-between my-8">
                                
                                <div className="flex gap-5 items-start">
                                    <img src={profile_image} className="w-12 h-12 rounded-full" />
                                    <p className="capitalize">
                                        {fullname} <br />
                                        <Link to={`/user/${author_username}`} className="underline">
                                            @{author_username}
                                        </Link>
                                    </p>
                                </div>
                                
                                {/* THIẾT KẾ MOBILE: Thêm khoảng cách lề trên và trái khi avatar bị đẩy lên trên ở màn hình nhỏ */}
                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                    Published on {getDay(publishedAt)}
                                </p>
                            </div>
                        </div>

                        {/* Thanh tương tác (Like, Comment, Share) nằm trên nội dung */}
                        <BlogInteraction />

                        {/* [ PART 4 ]: KHU VỰC HIỂN THỊ NỘI DUNG (Content Blocks từ EditorJS) */}
                        <div className="my-12 font-gelasio blog-page-content">
                            {content?.blocks.map((block, i) => (
                                // THIẾT KẾ WEB/MOBILE: Khoảng cách dòng lớn hơn trên màn hình Desktop (md:my-8)
                                <div key={i} className="my-4 md:my-8">
                                    <BlogContent block={block} />
                                </div>
                            ))}
                        </div>

                        {/* Thanh tương tác nằm dưới nội dung (Để người dùng không phải cuộn lên) */}
                        <BlogInteraction />

                        {/* [ PART 4 ]: KHU VỰC BÀI VIẾT TƯƠNG TỰ (Similar Blogs) */}
                        {similarBlogs !== null && similarBlogs.length ?
                            <>
                                <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                                {similarBlogs.map((blog, i) => {
                                    let { author: { personal_info } } = blog;
                                    return (
                                        <BlogPostCard content={blog} author={personal_info} />
                                    );
                                })}
                            </>
                        : " "}
                    </div>
                </BlogContext.Provider>
            }
        </>
    );
};

export default BlogPage;
