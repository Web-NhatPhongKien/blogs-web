import { getDay } from "../common/date";
import { Link } from "react-router-dom";

const BlogPostCard = ({ content, author }) => {
    let { publishedAt, tags, title, des, banner, activity: { total_likes }, blog_id: id } = content;
    let { fullname, profile_img, username } = author;

    return (

        <Link to={`/blog/${id}`} className="blog-post-card">
            <div className="blog-post-content">
                <div className="blog-post-meta">
                    <img src={profile_img} className="blog-post-avatar"/>
                    <p className="blog-post-author">{fullname} @{username}</p>
                    <p className="blog-post-date">{ getDay(publishedAt) }</p>
                </div>

                <h1 className="blog-title">{title}</h1>

                <p className="blog-post-description">{des}</p>

                <div className="blog-post-footer">
                    <span className="blog-post-tag">{tags[0]}</span>
                    <span className="blog-post-likes">
                        <i className="fi fi-rr-heart"></i>
                        { total_likes }
                    </span>
                </div>
            </div>

            <div className="blog-post-banner-wrap">
                <img src={banner} className="blog-post-banner"/>
            </div>
        </Link>
    )
}

export default BlogPostCard;