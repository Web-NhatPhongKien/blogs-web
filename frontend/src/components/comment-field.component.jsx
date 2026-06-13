import { useContext, useState } from "react";
import { useAuth } from "../context/auth.context";
import { BlogContext } from "../pages/blog.page";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { getAuthConfig } from "../common/auth-config";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
    
    const [comment, setComment] = useState("");

    const { user } = useAuth();
    const access_token = sessionStorage.getItem("token");
    const username = user?.personal_info?.username;
    const fullname = user?.personal_info?.fullname || username;
    const profile_image = user?.personal_info?.profile_image || user?.personal_info?.profile_img;
    
    let { 
        blog, 
        blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } }, 
        setBlog, 
        setTotalParentCommentsLoaded 
    } = useContext(BlogContext);

    const getId = (value) => value?._id?.toString?.() || value?.toString?.() || value;

    const handleComment = () => {
        if (!access_token) {
            return toast.error("Đăng nhập để viết bình luận");
        }
        
        if (!comment.length) {
            return toast.error("Vui lòng nhập nội dung bình luận");
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
            _id,
            blog_author,
            comment,
            replying_to: replyingTo
        }, getAuthConfig())
        .then(({ data }) => {
            setComment("");

            data.commented_by = { personal_info: { username, profile_image, fullname } };

            let newCommentArr;

            if (replyingTo) {
                const parentComment = commentsArr[index];
                const parentChildren = parentComment.children || [];
  
                data.parent = replyingTo;
                data.isReply = true;
                data.children = data.children || [];
                data.childrenLevel = parentComment.childrenLevel + 1;
                data.parentIndex = index;

                newCommentArr = commentsArr.map((comment, i) => {
                    if (i !== index) {
                        return comment;
                    }

                    return {
                        ...comment,
                        children: parentChildren.some(childId => getId(childId) === getId(data._id))
                            ? parentChildren
                            : [...parentChildren, data._id],
                        isReplyLoaded: true
                    };
                });

                newCommentArr.splice(index + 1, 0, data);

                setReplying(false);
            } 
            else {
                data.childrenLevel = 0;
                newCommentArr = [data, ...commentsArr];
            }

            let parentCommentIncrementVal = replyingTo ? 0 : 1;

            setBlog({
                ...blog,
                comments: { ...comments, results: newCommentArr },
                activity: {
                    ...activity,
                    total_comments: total_comments + 1,
                    total_parent_comments: total_parent_comments + parentCommentIncrementVal
                }
            });

            setTotalParentCommentsLoaded(prev => prev + parentCommentIncrementVal);

        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <>
            <Toaster />
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={action === "comment" ? "Viết bình luận..." : "Viết trả lời..."}
                className="input-box comment-field-textarea"
            ></textarea>
            <button className="btn-dark comment-field-submit" onClick={handleComment}>
                {action}
            </button>
        </>
    );
};

export default CommentField;
