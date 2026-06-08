import { useEffect, useState } from "react";
import axios from "axios";
import BlogPostCard from "../components/blog-post.component";
import InPageNavigation from "../components/inpage-navigation.component";
import MinimalBlogPost from "../components/nobanner-post.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";


const HomePage = () => {
    let [ blogs, setBlogs ] = useState(null);
    let [ trendingBlogs, setTrendingBlogs ] = useState(null);    
    let [ pageState, setPageState ] = useState("home");

    let categories = ["programming", "hollywood", "sports", "technology", "travel", "fashion", "business", "health", "education"];

    const fetchLatestBlogs = ({ page = 1 } = {}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/all-latest-blogs-count"
                });
                setBlogs(formattedData);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Lấy bài viết theo danh mục (có phân trang)
    const fetchBlogsByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { tag: pageState }
                });
                setBlogs(formattedData);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
        .then(({ data }) => {
            setTrendingBlogs(data.blogs);
        })
        .catch(err => {
            console.log(err);
            setTrendingBlogs([]);
        })
    }

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        
        // Reset state blog về null để hiện loader
        setBlogs(null);

        // Chuyển đổi trạng thái nếu tag đang được chọn thì hủy, ngược lại thì chọn tag
        if (pageState === category) {
            setPageState("home");
        } else {
            setPageState(category);
        }
        
    }

    useEffect(() => {
        // Kiểm tra pageState đang ở trang chủ hay danh mục để gọi API tương ứng
        if (pageState === "home") {
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogsByCategory({ page: 1 });
        }

        // Chỉ fetch trending blogs nếu chưa có dữ liệu
        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }

    }, [pageState])

    return (
        <div>
            <section className="h-cover desktop-layout">
                <div className="desktop-main">
                    <InPageNavigation 
                        routes={[pageState]} 
                    >
                        <>
                            {blogs == null ? (
                                <Loader />
                            ) : (
                                blogs.results.length ? 
                                    blogs.results.map((blog, i) => {
                                        return (
                                            <BlogPostCard content={blog} author={blog.author.personal_info} />
                                        );
                                    })
                                : <NoDataMessage message="No blogs published" />
                            )}
                            <LoadMoreDataBtn 
                                state={blogs} 
                                fetchDataFun={(pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory)} 
                            />
                        </>
                    </InPageNavigation>
                </div>
          
                <div className="desktop-only">
                    <div className="stack-lg">
                        {/* Bộ lọc theo danh mục (Categories) */}
                        <div>
                            <h1 className="category-title">Stories form all interests</h1>
    
                            <div className="tags-wrap">
                                {categories.map((category, i) => {
                                    return (
                                        <button 
                                            onClick={loadBlogByCategory} 
                                            className={`tag ${pageState === category ? "active" : ""}`} 
                                            key={i}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                        
                        {/* Danh sách Trending Blogs */}
                        <div>
                            <h1 className="category-title">
                                Trending <i className="fi fi-br-arrow-trend-up"></i>
                            </h1>

                            {trendingBlogs == null ? (
                                <Loader />
                            ) : (
                                trendingBlogs.length ? 
                                    trendingBlogs.map((blog, i) => {
                                        return (
                                            <MinimalBlogPost blog={blog} index={i} />
                                        );
                                    })
                                : <NoDataMessage message="No trending blogs" />
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage;