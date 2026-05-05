import { useEffect, useState } from "react";
import axios from "axios";
import BlogPostCard from "../components/blog-post";
import InPageNavigation from "../components/inpage-navigation";
import MinimalBlogPost from "../components/nobanner-blog-post";
import Loader from "../components/loader";

const HomePage = () => {
    let [ blogs, setBlog ] = useState(null);
    let [ trendingBlogs, setTrendingBlog ] = useState(null);

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then(({ data }) => {
            setBlog(data.blogs);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
        .then(({ data }) => {
            setTrendingBlog(data.blogs);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchLatestBlogs();
        fetchTrendingBlogs();
    }, [])

    return (
        <div>
            <section className="h-cover flex justify-center gap-10">
                <div className="w-full">
                    <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
                        <>
                            {
                                blogs == null ? <Loader /> :
                                blogs.map((blog, i) => {
                                    return (
                                        <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                    )
                                })
                            }
                        </>

                        {
                            trendingBlogs == null ? <Loader /> :
                                trendingBlogs.map((blog, i) => {
                                    return (
                                        <MinimalBlogPost blog={blog} index={i}/>
                                    )
                                })
                        }
                    </InPageNavigation>
                </div>

                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        
                        <h1></h1>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage;