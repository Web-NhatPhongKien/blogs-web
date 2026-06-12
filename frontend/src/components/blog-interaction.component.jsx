import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { getAuthConfig } from "../common/auth-config";

const BlogInteraction = () => {
    let { 
        blog, 
        blog: { 
            _id, 
            title, 
            blog_id, 
            activity, 
            activity: { total_likes, total_comments }, 
            author: { personal_info: { username: author_username } } 
        }, 
        setBlog, 
        isLikedByUser, 
        setLikedByUser, 
        setCommentsWrapper 
    } = useContext(BlogContext);

    const { user } = useAuth();
    const username = user?.personal_info?.username;
    const access_token = sessionStorage.getItem("token");

    const handleLike = () => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (access_token) {

            setLikedByUser(preVal => !preVal);


            !isLikedByUser ? total_likes++ : total_likes--;
            setBlog({ ...blog, activity: { ...activity, total_likes } });


            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, getAuthConfig())
            .then(({ data }) => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });

        } else {

            toast.error("Please log in to like this blog");
        }
    };

    return (
        <>
            <Toaster />
            <hr className="blog-interaction-divider" />
                <div className="blog-interaction-row">
                    
                    <div className="blog-interaction-group">

                        <div className="blog-interaction-item">
                            <button
                                onClick={handleLike}
                                className={"blog-interaction-btn " + (isLikedByUser ? "liked" : "") }>
                                <i className={"fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                            </button>

                            <p className="blog-interaction-count">{total_likes}</p>
                        </div>

                        <div className="blog-interaction-item">
                            <button
                                onClick={() => setCommentsWrapper(preVal => !preVal)}
                                className="blog-interaction-btn">
                                <i className="fi fi-rr-comment-dots"></i>
                            </button>
                            <p className="blog-interaction-count">{total_comments}</p>
                        </div>
                    </div>

                    <div className="blog-interaction-group">
                        {
                            username === author_username ? 
                            <Link to={`/editor/${blog_id}`} className="blog-interaction-edit">Edit</Link> : ""
                        }

                        <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target="_blank" className="blog-interaction-share">
                            <i className="fi fi-brands-twitter"></i>
                        </Link>
                    </div>
                </div>
            
            <hr className="blog-interaction-divider" />
        </>
    );
};

export default BlogInteraction;
