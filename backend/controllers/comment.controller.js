import CommentService from "../services/comment.service.js";

class CommentController {
    addComment = async (req, res, next) => {
        try {
            const user_id = req.user.userId;
            const { _id: blog_id, comment, blog_author, replying_to, notification_id } = req.body;

            if (!comment || !comment.trim().length) {
                return res.status(400).json({ error: "Vui lòng nhập nội dung bình luận" });
            }

            const result = await CommentService.addCommentService({
                user_id, 
                blog_id, 
                comment, 
                blog_author, 
                replying_to, 
                notification_id
            });

            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    getBlogComments = async (req, res, next) => {
        try {
            const { blog_id, skip } = req.body;
            const max_limit = 5;

            const comments = await CommentService.getBlogCommentsService(blog_id, skip, max_limit);

            return res.status(200).json(comments);
        } catch (err) {
            next(err);
        }
    };

    getRepliesComments = async (req, res, next) => {
        try {
            const { children } = req.body;

            const replies = await CommentService.getRepliesCommentsService(children);

            return res.status(200).json({ replies });
        } catch (err) {
            next(err);
        }
    };

    deleteComment = async (req, res, next) => {
        try {
            const user_id = req.user.userId;
            const { _id: comment_id } = req.body;

            await CommentService.deleteCommentService(user_id, comment_id);

            return res.status(200).json({ status: 'done' });
        } catch (err) {
            next(err);
        }
    };
}

export default new CommentController();