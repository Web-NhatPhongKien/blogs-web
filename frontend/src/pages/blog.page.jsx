import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";

export const blogStructure = {
    title: '',
    description: '',
    content: [],
    author: { personal_info: { } },
    activity: {
        total_likes: 0,
        total_comments: 0,
        total_reads: 0,
        total_parent_comments: 0,
    },
    comments: { results: [] },
    banner: '',
    publishedAt: '',
};

export const BlogContext = createContext({ });

const getContentBlocks = (content) => {
    if (Array.isArray(content)) {
        if (content.length === 1 && Array.isArray(content[0]?.blocks)) {
            return content[0].blocks;
        }

        return content;
    }

    return Array.isArray(content?.blocks) ? content.blocks : [];
};

const BlogPage = () => {

    let { blog_id } = useParams();

    const [blog, setBlog] = useState(blogStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLikedByUser, setLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);


    let { 
        title, content, banner, publishedAt, 
        author: { personal_info: { fullname, username: author_username, profile_img } } 
    } = blog;
    const contentBlocks = getContentBlocks(content);

    const fetchBlog = () => {
        const access_token = sessionStorage.getItem("token");
        const config = access_token ? {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        } : {};

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id }, config)
            .then(async ({ data: { blog, liked_by_user } }) => {
                
                blog.comments = await fetchComments({ 
                    blog_id: blog._id, 
                    setParentCommentCountFun: setTotalParentCommentsLoaded 
                });
                
                setBlog(blog); 
                setLikedByUser(Boolean(liked_by_user));

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { 
                    tag: blog.tags, 
                    limit: 6, 
                    eliminate_blog: blog_id 
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

    const resetStates = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);
    };

    useEffect(() => {
        resetStates();
        fetchBlog();
    }, [blog_id]);

    return (
        <>
            {loading ? <Loader /> :
                
                <BlogContext.Provider value={{ 
                    blog, setBlog, 
                    isLikedByUser, setLikedByUser, 
                    commentsWrapper, setCommentsWrapper, 
                    totalParentCommentsLoaded, setTotalParentCommentsLoaded 
                }}>

                    <CommentsContainer />

                    <div className="blog-page-wrap">
                        
                        <img src={banner} className="blog-page-banner" />

                        <div className="blog-page-header">
                            <h2>{title}</h2>

                            <div className="blog-page-author-row">
                                
                                <div className="blog-page-author">
                                    <img src={profile_img} className="blog-page-author-avatar" />
                                    <p className="blog-page-author-name">
                                        {fullname} <br />
                                        <Link to={`/user/${author_username}`} className="blog-page-author-link">
                                            @{author_username}
                                        </Link>
                                    </p>
                                </div>
                                
            
                                <p className="blog-page-date">
                                    Published on {getDay(publishedAt)}
                                </p>
                            </div>
                        </div>

                        <BlogInteraction />

                        <div className="blog-page-content-wrap blog-page-content">
                            {contentBlocks.map((block, i) => (
                                <div key={i} className="blog-page-block">
                                    <BlogContent block={block} />
                                </div>
                            ))}
                        </div>

                        <BlogInteraction />

                        {similarBlogs !== null && similarBlogs.length ?
                            <>
                                <h1 className="blog-page-similar-title">Similar Blogs</h1>
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
