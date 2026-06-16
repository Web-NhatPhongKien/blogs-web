import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { useAuth } from "../context/auth.context";
import toast from "react-hot-toast";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
import { getAuthConfig } from "../common/auth-config";

const CommentCard = ({ index, leftVal, commentData }) => {

    let {
        commented_by: { personal_info: { profile_image, fullname, username: commented_by_username } },
        commentedAt, comment, _id, children, isDeleted
    } = commentData;

    const { user } = useAuth();
    const access_token = sessionStorage.getItem("token");
    const username = user?.personal_info?.username;
    let {
        blog,
        setBlog,
        blog: {
            author: { personal_info: { username: blog_author } },
            comments,
            activity
        },
    } = useContext(BlogContext);

    const [isReplying, setReplying] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    const getId = (value) => value?._id?.toString?.() || value?.toString?.() || value;

    const collectDescendantIds = (commentId, list) => {
        const ids = new Set();
        const targetId = getId(commentId);

        const collect = (parentId) => {
            list.forEach(comment => {
                if (getId(comment.parent) === parentId) {
                    ids.add(getId(comment._id));
                    collect(getId(comment._id));
                }
            });
        };

        collect(targetId);
        return ids;
    };

    const handleReplyClick = () => {
        if (!access_token) {
            return toast.error("Login first to leave a reply");
        }
        setReplying(preVal => !preVal);
    };

    const hideReplies = () => {
        const idsToHide = collectDescendantIds(_id, comments.results);

        const newCommentsArr = comments.results
            .filter(comment => !idsToHide.has(getId(comment._id)))
            .map(comment => {
                if (getId(comment._id) === getId(_id)) {
                    return { ...comment, isReplyLoaded: false };
                }

                return comment;
            });

        setBlog({
            ...blog,
            comments: {
                ...comments,
                results: newCommentsArr
            }
        });
    };

    const loadReplies = () => {
        if (!children.length || commentData.isReplyLoaded) return;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/comments/get-replies-comments", { children })
            .then(({ data: { replies } }) => {
                const existingIds = new Set(comments.results.map(comment => getId(comment._id)));

                const newReplies = replies
                    .filter(reply => !existingIds.has(getId(reply._id)))
                    .map(reply => ({
                        ...reply,
                        childrenLevel: commentData.childrenLevel + 1,
                        parentIndex: index
                    }));

                const newCommentsArr = [...comments.results];

                const updatedParent = {
                    ...commentData,
                    isReplyLoaded: true
                };

                newCommentsArr[index] = updatedParent;
                newCommentsArr.splice(index + 1, 0, ...newReplies);

                setBlog({
                    ...blog,
                    comments: {
                        ...comments,
                        results: newCommentsArr
                    }
                });
            })
            .catch(err => {
                console.log(err.response?.data || err);
            });
    };

    const deleteComment = () => {
        setDeleting(true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/comments/delete-comment", { _id }, getAuthConfig())
        .then(() => {
            const newResults = comments.results.map(comment => {
                if (getId(comment._id) === getId(_id)) {
                    return {
                        ...comment,
                        isDeleted: true,
                        deletedAt: new Date().toISOString()
                    };
                }

                return comment;
            });

            setBlog({
                ...blog,
                comments: {
                    ...comments,
                    results: newResults
                },
                activity: {
                    ...activity,
                    total_comments: Math.max(0, activity.total_comments - 1)
                }
            });
        })
        .catch(err => {
            console.log(err.response?.status);
            console.log(err.response?.data);
            setDeleting(false);
        });
    };

    const confirmDeleteComment = () => {
        if (isDeleting) return;

        if (!window.confirm("Bạn có muốn xóa comment không?")) return;

        deleteComment();
    };

    return (
        <div className="comment-card-wrap" style={{ paddingLeft: `${leftVal * 14}px` }}>
            <div className="comment-card">
                {
                    !isDeleted ? (
                        <div className="comment-card-header">
                            <img src={profile_image} className="comment-card-avatar" />

                            <p className="comment-card-author">
                                {fullname} <span className="comment-card-username">@{commented_by_username}</span>
                            </p>

                            <p className="comment-card-date">{getDay(commentedAt)}</p>
                        </div>
                    ) : ""
                }

                <p className={"comment-card-text " + (isDeleted ? "comment-card-deleted" : "")}>
                    {isDeleted ? "Comment n\u00e0y \u0111\u00e3 b\u1ecb x\u00f3a." : comment}
                </p>

                <div className="comment-card-actions">
                    {
                        commentData.isReplyLoaded ? (
                            <button onClick={hideReplies} className="comment-card-action comment-card-muted-action">
                                <i className="fi fi-rs-comment-dots"></i> Ẩn trả lời
                            </button>
                        ) : (
                            children.length ? (
                                <button onClick={loadReplies} className="comment-card-action comment-card-muted-action">
                                    <i className="fi fi-rs-comment-dots"></i> {children.length} Trả lời
                                </button>
                            ) : ""
                        )
                    }

                    {
                        !isDeleted ? (
                            <button className="comment-card-reply" onClick={handleReplyClick}>Trả lời</button>
                        ) : ""
                    }

                    {
                        !isDeleted && (username === commented_by_username || username === blog_author) ? (
                            <button
                                onClick={confirmDeleteComment}
                                className="comment-card-delete"
                                disabled={isDeleting}
                            >
                                <i className="fi fi-rr-trash"></i>
                            </button>
                        ) : ""
                    }
                </div>

                {
                    !isDeleted && isReplying ? (
                        <div className="comment-card-reply-field">
                            <CommentField action="Trả lời" index={index} replyingTo={_id} setReplying={setReplying} />
                        </div>
                    ) : ""
                }
            </div>
        </div>
    );
};

export default CommentCard;
