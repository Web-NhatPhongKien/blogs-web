import Blog from "../schemas/blog.schema.js";
import Notification from "../schemas/notification.schema.js";
import BlogLike from "../schemas/blog-like.schema.js";

class BlogService {
    getLatestBlogsService = async (page, maxLimit) => {
        return await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username -_id")
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip((page - 1) * maxLimit)
            .limit(maxLimit);
    };

    getTrendingBlogsService = async (maxLimit) => {
        return await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username -_id")
            .sort({ "activity.total_reads": -1, "activity.total_likes": -1, publishedAt: -1 })
            .select("blog_id title publishedAt -_id")
            .limit(maxLimit);
    };

    searchBlogsService = async ({ tag, query, author, page, limit, eliminate_blog }) => {
        let findQuery = { draft: false };

        if (tag) {
            findQuery.tags = tag;
            if (eliminate_blog) findQuery.blog_id = { $ne: eliminate_blog };
        } else if (query) {
            findQuery.$text = { $search: query };
        } else if (author) {
            findQuery.author = author;
        }

        const skipDocs = (page - 1) * limit;

        if (query && !tag) {
            return await Blog.find(findQuery, { score: { $meta: "textScore" } })
                .populate("author", "personal_info.profile_img personal_info.username -_id")
                .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
                .select("blog_id title des banner activity tags publishedAt -_id")
                .skip(skipDocs)
                .limit(limit);
        }

        return await Blog.find(findQuery)
            .populate("author", "personal_info.profile_img personal_info.username -_id")
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip(skipDocs)
            .limit(limit);
    };

    getBlogService = async (blog_id, draft, mode, user_id) => {
        const incrementVal = mode !== "edit" ? 1 : 0;
        const findQuery = { blog_id };

        if (draft !== "true") {
            findQuery.draft = false;
        }

        const blog = await Blog.findOneAndUpdate(
            findQuery,
            { $inc: { "activity.total_reads": incrementVal } },
            { new: true }
        )
            .populate("author", "_id personal_info.profile_img personal_info.username")
            .select("title des content banner activity publishedAt blog_id tags");

        if (!blog) {
            return { blog: null, liked_by_user: false };
        }

        let liked_by_user = false;

        if (user_id) {
            const like = await BlogLike.exists({
                user: user_id,
                blog: blog._id
            });

            if (like) {
                liked_by_user = true;
            } else {
                const legacyLike = await Notification.exists({
                    user: user_id,
                    blog: blog._id,
                    type: "like"
                });

                liked_by_user = Boolean(legacyLike);
            }
        }

        return { blog, liked_by_user };
    };

    getAllLatestBlogsCountService = async () => {
        return await Blog.countDocuments({ draft: false });
    };

    getSearchBlogsCountService = async ({ tag, query, author }) => {
        let findQuery = { draft: false };

        if (tag) {
            findQuery.tags = tag;
        } else if (query) {
            findQuery.$text = { $search: query };
        } else if (author) {
            findQuery.author = author;
        }

        return await Blog.countDocuments(findQuery);
    };

    toggleLikeBlogService = async (user_id, blog_id, isLikedByUser) => {
        const blog = await Blog.findById(blog_id).select("author");

        if (!blog) {
            const err = new Error("Blog khong ton tai");
            err.statusCode = 404;
            throw err;
        }

        if (!isLikedByUser) {
            const likeResult = await BlogLike.updateOne(
                {
                    user: user_id,
                    blog: blog_id
                },
                {
                    $setOnInsert: {
                        user: user_id,
                        blog: blog_id
                    }
                },
                { upsert: true }
            );
            const newLikeCreated = likeResult.upsertedCount > 0;

            if (newLikeCreated) {
                await Blog.findByIdAndUpdate(blog_id, {
                    $inc: { "activity.total_likes": 1 }
                });
            }

            if (user_id.toString() !== blog.author.toString() && newLikeCreated) {
                const likeNotification = new Notification({
                    type: "like",
                    blog: blog_id,
                    notification_for: blog.author,
                    user: user_id
                });
                await likeNotification.save();
            }

            return { liked_by_user: true };
        }

        const deletedLike = await BlogLike.findOneAndDelete({
            user: user_id,
            blog: blog_id
        });

        const deletedNotification = await Notification.findOneAndDelete({
            user: user_id,
            blog: blog_id,
            type: "like"
        });

        if (deletedLike || deletedNotification) {
            await Blog.findByIdAndUpdate(blog_id, {
                $inc: { "activity.total_likes": -1 }
            });
        }

        return { liked_by_user: false };
    };
}

export default new BlogService();
