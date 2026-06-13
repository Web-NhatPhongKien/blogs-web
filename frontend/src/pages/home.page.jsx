import { useEffect, useState } from "react";
import axios from "axios";
import BlogPostCard from "../components/blog-post.component";
import InPageNavigation from "../components/inpage-navigation.component";
import MinimalBlogPost from "../components/nobanner-post.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import Pagination from "../components/pagination.component";


const HomePage = () => {
    let [ blogs, setBlogs ] = useState(null);
    let [ trendingBlogs, setTrendingBlogs ] = useState(null);    
    let [ categories, setCategories ] = useState([]);
    let [ pageState, setPageState ] = useState("Trang chủ");

    const fetchLatestBlogs = ({ page = 1 } = {}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    data: data.blogs,
                    page: data.page,
                    totalDocs: data.totalDocs,
                    totalPages: data.totalPages,
                    limit: data.limit
                });
                setBlogs(formattedData);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const fetchBlogsByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    data: data.blogs,
                    page: data.page,
                    totalDocs: data.totalDocs,
                    totalPages: data.totalPages,
                    limit: data.limit
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

    const fetchPopularTags = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/popular-tags")
        .then(({ data }) => {
            setCategories(data.tags || []);
        })
        .catch(err => {
            console.log(err);
            setCategories([]);
        })
    }

    const loadBlogByCategory = (e) => {
        let category = e.currentTarget.dataset.category;
        
        setBlogs(null);

        if (pageState === category) {
            setPageState("Trang chủ");
        } else {
            setPageState(category);
        }
        
    }

    useEffect(() => {
        if (pageState === "Trang chủ") {
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogsByCategory({ page: 1 });
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }

        if (!categories.length) {
            fetchPopularTags();
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
                                : <NoDataMessage message="Chưa có bài viết" />
                            )}
                            <Pagination 
                                state={blogs} 
                                fetchDataFun={(pageState === "Trang chủ" ? fetchLatestBlogs : fetchBlogsByCategory)} 
                            />
                        </>
                    </InPageNavigation>
                </div>
          
                <div className="desktop-only">
                    <div className="stack-lg">
                        <div>
                            <h1 className="category-title">Chủ đề phổ biến</h1>
    
                            <div className="tags-wrap">
                                {categories.map((category) => {
                                    return (
                                        <button 
                                            onClick={loadBlogByCategory} 
                                            data-category={category.name}
                                            className={`tag ${pageState === category.name ? "active" : ""}`} 
                                            key={category.name}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                        
                        <div>
                            <h1 className="category-title">
                                Xu hướng <i className="fi fi-br-arrow-trend-up"></i>
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
                                : <NoDataMessage message="Chưa có bài viết xu hướng" />
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage;
