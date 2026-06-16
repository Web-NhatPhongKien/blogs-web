import Blog from "../schemas/blog.schema.js";
import Notification from "../schemas/notification.schema.js";
import BlogLike from "../schemas/blog-like.schema.js";

class BlogService {
    buildSearchQuery = ({ tag, query, author, eliminate_blog }) => {
        const findQuery = { draft: false };

        if (tag) {
            findQuery.tags = tag;
            if (eliminate_blog) findQuery.blog_id = { $ne: eliminate_blog };
        } else if (query) {
            findQuery.$text = { $search: query };
        } else if (author) {
            findQuery.author = author;
        }

        return findQuery;
    };

    getLatestBlogsService = async (page, limit) => {
        const findQuery = { draft: false };
        const skipDocs = (page - 1) * limit;

        const [blogs, totalDocs] = await Promise.all([
            Blog.find(findQuery)
                .populate("author", "personal_info.profile_img personal_info.username -_id")
                .sort({ publishedAt: -1 })
                .select("blog_id title des banner activity tags publishedAt -_id")
                .skip(skipDocs)
                .limit(limit),
            Blog.countDocuments(findQuery)
        ]);

        return {
            blogs,
            totalDocs,
            totalPages: Math.ceil(totalDocs / limit)
        };
    };

    getTrendingBlogsService = async (limit) => {
        return await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username -_id")
            .sort({ "activity.total_reads": -1, "activity.total_likes": -1, publishedAt: -1 })
            .select("blog_id title publishedAt -_id")
            .limit(limit);
    };

    getPopularTagsService = async (limit) => {
        return await Blog.aggregate([
            { $match: { draft: false } },
            { $unwind: "$tags" },
            {
                $group: {
                    _id: "$tags",
                    name: { $first: "$tags" },
                    totalBlogs: { $sum: 1 }
                }
            },
            { $sort: { totalBlogs: -1, name: 1 } },
            { $limit: limit }
        ]);
    };

    searchBlogsService = async ({ tag, query, author, page, limit, eliminate_blog }) => {
        const findQuery = this.buildSearchQuery({ tag, query, author, eliminate_blog });
        const skipDocs = (page - 1) * limit;
        let blogsQuery;

        if (query && !tag) {
            blogsQuery = Blog.find(findQuery, { score: { $meta: "textScore" } })
                .populate("author", "personal_info.profile_img personal_info.username -_id")
                .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
                .select("blog_id title des banner activity tags publishedAt -_id");
        } else {
            blogsQuery = Blog.find(findQuery)
                .populate("author", "personal_info.profile_img personal_info.username -_id")
                .sort({ publishedAt: -1 })
                .select("blog_id title des banner activity tags publishedAt -_id");
        }

        const [blogs, totalDocs] = await Promise.all([
            blogsQuery.skip(skipDocs).limit(limit),
            Blog.countDocuments(findQuery)
        ]);

        return {
            blogs,
            totalDocs,
            totalPages: Math.ceil(totalDocs / limit)
        };
    };

    getBlogService = async (blog_id, draft, mode, user_id) => {
        const incrementVal = mode !== "edit" ? 1 : 0;
        const findQuery = { blog_id };
        const isDraft = draft === true || draft === "true";

        if (!isDraft) {
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
