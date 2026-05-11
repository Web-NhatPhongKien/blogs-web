// import AnimationWrapper from "../common/page-animation";
import { useEffect, useState } from "react";
import BlogPostCard from "../components/blog-post";
import InPageNavigation from "../components/inpage-navigation";
import Loader from "../components/Loader";
import axios from "axios";

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
                                        <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                    )
                                })
                        }
                    </InPageNavigation>
                </div>

                <div>

                </div>
            </section>
        </div>
    )
}

export default HomePage;