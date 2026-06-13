import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import NoDataMessage from "./nodata.component";
import CommentCard from "./comment-card.component";

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
    let res;

    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", { blog_id, skip })
        .then(({ data }) => {

            data.map(comment => {
                comment.childrenLevel = 0;
            });

            setParentCommentCountFun(preVal => preVal + data.length);


            if (comment_array == null) {
                res = { results: data };
            } else {
                res = { results: [...comment_array, ...data] };
            }
        })
        .catch(err => {
            console.log(err);
            res = comment_array == null ? { results: [] } : { results: comment_array };
        });

    return res;
};

const CommentsContainer = () => {
    let {
        blog,
        blog: { _id, title, comments: { results: commentsArray }, activity: { total_parent_comments } },
        commentsWrapper,
        setCommentsWrapper,
        totalParentCommentsLoaded,
        setTotalParentCommentsLoaded,
        setBlog
    } = useContext(BlogContext);

    const loadMoreComments = async () => {
        let newCommentsArray = await fetchComments({
            skip: totalParentCommentsLoaded,
            blog_id: _id,
            setParentCommentCountFun: setTotalParentCommentsLoaded,
            comment_array: commentsArray
        });

        setBlog({ ...blog, comments: newCommentsArray });
    };

    return (
        <div className={`comments-panel ${commentsWrapper ? "open" : ""}`}>
            <div className="comments-panel-header">
                <h1 className="comments-panel-title">Bình luận</h1>

                <p className="comments-panel-blog-title">{title}</p>

                <button
                    onClick={() => setCommentsWrapper(false)}
                    className="comments-panel-close"
                >
                    <i className="fi fi-br-cross"></i>
                </button>
            </div>

            <hr className="comments-panel-divider" />

            <CommentField action="Bình luận" />

            {
                commentsArray && commentsArray.length ?
                    commentsArray.map((comment, i) => {
                        return (
                            <CommentCard key={comment._id || i} index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
                        );
                    })
                    : <NoDataMessage message="Chưa có bình luận" />
            }

            {
                total_parent_comments > totalParentCommentsLoaded ?
                    <button
                        onClick={loadMoreComments}
                        className="comments-load-more"
                    >
                        Xem thêm
                    </button>
                    : ""
            }

        </div>
    );
};

export default CommentsContainer;
