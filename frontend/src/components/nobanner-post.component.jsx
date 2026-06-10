import { Link } from "react-router-dom";
import { getDay } from "../common/date";    

const MinimalBlogPost = ({ blog, index}) => {
    let { title, blog_id: id, author: { personal_info: { username, profile_img } }, publishedAt } = blog;

    return (

        <Link to={`/blog/${id}`} className="minimal-post">
            <h1 className="blog-index">{ index < 10 ? "0" + (index + 1) : index }</h1>

            <div>
                 <div className="minimal-post-meta">
                    <img src={profile_img} className="minimal-post-avatar"/>
                    <p className="minimal-post-author">@{username}</p>
                    <p className="minimal-post-date">{ getDay(publishedAt) }</p>
                </div>

                <h1 className="blog-title">{title}</h1>
            </div>
        </Link>
    )
}

export default MinimalBlogPost;