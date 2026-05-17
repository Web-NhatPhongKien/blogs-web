import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {

    let {
        commented_by: { personal_info: { profile_image, fullname, username: commented_by_username } },
        commentedAt, comment, _id, children
    } = commentData;

    let { userAuth: { access_token, username } } = useContext(UserContext);
    let {
        blog: { author: { personal_info: { username: blog_author } } },
    } = useContext(BlogContext);

    const [isReplying, setReplying] = useState(false);

    const handleReplyClick = () => {
        if (!access_token) {
            return toast.error("Login first to leave a reply");
        }
        setReplying(preVal => !preVal);
    };

    const hideReplies = () => {
        commentData.isReplyLoaded = false;
    };

    const loadReplies = () => {
        if(children.length) {
            hideReplies();
        }
    };

    const deleteComment = (e) => {
        e.target.setAttribute("disabled", true);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", { _id }, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        }).then(() => {
            e.target.removeAttribute("disabled");
        }).catch(err => console.log(err));
    };

    return (
        <div className="comment-card-wrap" style={{ paddingLeft: `${leftVal * 14}px` }}>
            <div className="comment-card">
                <div className="comment-card-header">
                    <img src={profile_image} className="comment-card-avatar" />

                    <p className="comment-card-author">
                        {fullname} <span className="comment-card-username">@{commented_by_username}</span>
                    </p>

                    <p className="comment-card-date">{getDay(commentedAt)}</p>
                </div>

                <p className="comment-card-text">{comment}</p>

                <div className="comment-card-actions">
                    {
                        commentData.isReplyLoaded ? (
                            <button onClick={hideReplies} className="comment-card-action comment-card-muted-action">
                                <i className="fi fi-rs-comment-dots"></i> Hide Reply
                            </button>
                        ) : (
                            children.length ? (
                                <button onClick={loadReplies} className="comment-card-action comment-card-muted-action">
                                    <i className="fi fi-rs-comment-dots"></i> {children.length} Reply
                                </button>
                            ) : ""
                        )
                    }

                    <button className="comment-card-reply" onClick={handleReplyClick}>Reply</button>

                    {
                        username === commented_by_username || username === blog_author ? (
                            <button
                                onClick={deleteComment}
                                className="comment-card-delete"
                            >
                                <i className="fi fi-rr-trash"></i>
                            </button>
                        ) : ""
                    }
                </div>

                {
                    isReplying ? (
                        <div className="comment-card-reply-field">
                            <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
                        </div>
                    ) : ""
                }
            </div>
        </div>
    );
};

export default CommentCard;
