import Comment from "../schemas/comment.schema.js";
import Blog from "../schemas/blog.schema.js";
import Notification from "../schemas/notification.schema.js";

class CommentService {
    addCommentService = async ({ user_id, blog_id, comment, blog_author, replying_to, notification_id }) => {
        const commentObj = {
            blog_id,
            blog_author,
            comment, 
            commented_by: user_id,
        };

        let parentComment = null;

        if (replying_to) {
            parentComment = await Comment.findOne({ _id: replying_to, isDeleted: { $ne: true } });

            if (!parentComment) {
                const err = new Error("Bình luận không tồn tại");
                err.statusCode = 404;
                throw err;
            }

            commentObj.parent = replying_to;
            commentObj.isReply = true;
        }

        const savedComment = await new Comment(commentObj).save();

        const dbTasks = [];


        const blogUpdateTask = Blog.findOneAndUpdate(
            { _id: blog_id }, 
            { 
                $push: { comments: savedComment._id }, 
                $inc: { 
                    "activity.total_comments": 1, 
                    "activity.total_parent_comments": replying_to ? 0 : 1 
                } 
            }
        );
        dbTasks.push(blogUpdateTask);

        let notificationFor = blog_author; 

        if (replying_to) {
            await Comment.findOneAndUpdate(
                { _id: replying_to, isDeleted: { $ne: true } }, 
                { $push: { children: savedComment._id } }
            );

            notificationFor = parentComment.commented_by; 

            if (notification_id) {
                const updateNotifTask = Notification.findOneAndUpdate(
                    { _id: notification_id }, 
                    { reply: savedComment._id }
                );
                dbTasks.push(updateNotifTask);
            }
        }

        const notificationObj = {
            type: replying_to ? "reply" : "comment",
            blog: blog_id,
            notification_for: notificationFor,
            user: user_id,
            comment: savedComment._id
        };

        if (replying_to) {
            notificationObj.replied_on_comment = replying_to;
        }

        if (user_id.toString() !== notificationFor.toString()) {
            const saveNotifTask = new Notification(notificationObj).save();
            dbTasks.push(saveNotifTask);
        }

        await Promise.all(dbTasks);


        return {
            comment: savedComment.comment,
            commentedAt: savedComment.commentedAt,
            _id: savedComment._id,
            user_id,
            children: savedComment.children
        };
    };

    getBlogCommentsService = async (blog_id, skip = 0, limit = 5) => {
        return await Comment.find({
                        blog_id,
                        $or: [{ isReply: false }, { isReply: { $exists: false } }]
                    })
            .populate("commented_by", "personal_info.username personal_info.profile_img")
            .skip(skip)
            .limit(limit)
            .sort({ commentedAt: -1 });
    };

    getRepliesCommentsService = async (children) => {
        return await Comment.find({ _id: { $in: children } })
            .populate("commented_by", "personal_info.username personal_info.profile_img")
            .sort({ commentedAt: 1 });
    }

    softDeleteComment = async (comment_id) => {
        const comment = await Comment.findOneAndUpdate(
            { _id: comment_id, isDeleted: { $ne: true } },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
        if (!comment) return;

        const cleanupTasks = [];

        cleanupTasks.push(Notification.findOneAndDelete({ comment: comment_id }));
        cleanupTasks.push(Notification.findOneAndUpdate(
            { reply: comment_id },
            { $unset: { reply: 1 } }
        ));

        cleanupTasks.push(
            Blog.findOneAndUpdate(
                { _id: comment.blog_id },
                {
                    $inc: {
                        "activity.total_comments": -1,
                    }
                }
            )
        );

        await Promise.all(cleanupTasks);
    };


    deleteCommentService = async (user_id, comment_id) => {
        const comment = await Comment.findOne({ _id: comment_id, isDeleted: { $ne: true } });
        
        if (!comment) {
            const err = new Error("Bình luận không tồn tại");
            err.statusCode = 404;
            throw err;
        }

        const isCommentAuthor = user_id.toString() === comment.commented_by.toString();
        const isBlogAuthor = user_id.toString() === comment.blog_author.toString();

        if (!isCommentAuthor && !isBlogAuthor) {
            const err = new Error("Bạn không có quyền xóa bình luận này");
            err.statusCode = 403;
            throw err;
        }

        await this.softDeleteComment(comment_id);
    };
}

export default new CommentService();
