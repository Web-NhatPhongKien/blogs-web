import Blog from "../schemas/blog.schema.js";
import Notification from "../schemas/notification.schema.js";
class BlogService {
    getLatestBlogsService = async (page, limit = 10) => {
        return await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username -_id")
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip((page - 1) * limit)
            .limit(limit);
    }

    getTrendingBlogsService = async (limit = 5) => {
        return await Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username -_id")
        .sort({ "activity.total_reads": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id")
        .limit(limit);
    }

    searchBlogsService = async ({ tag, query, author, page = 1, limit = 10, eliminate_blog }) => {
        let findQuery = { draft: false };

        // Xây dựng query động giống logic của bạn
        if (tag) {
            findQuery.tags = tag;
            if (eliminate_blog) findQuery.blog_id = { $ne: eliminate_blog };
        } else if (query) {
            findQuery.title = new RegExp(query, 'i');
        } else if (author) {
            findQuery.author = author;
        }

        const skipDocs = (page - 1) * limit;

        // Trực tiếp trả về Promise
        return await Blog.find(findQuery)
            .populate("author", "personal_info.profile_img personal_info.username -_id")
            .sort({ publishedAt: -1 }) // Hoặc sort theo mức độ liên quan tùy bạn
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip(skipDocs)
            .limit(limit);
    }

    getBlogService = async (blog_id, draft, mode, user_id) => {
        const incrementVal = mode !== 'edit' ? 1 : 0; 
    
        // 1. Xây dựng bộ lọc tìm kiếm
        const findQuery = { blog_id };
        
        // Nếu không phải tác giả đang edit, chỉ cho phép lấy bài đã public
        if (draft !== 'true') {
            findQuery.draft = false;
        }
        
        // 2. Gọi DB bằng chính bộ lọc đã xây dựng
        const blog = await Blog.findOneAndUpdate(
            findQuery, // SỬA LẠI Ở ĐÂY
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
            const like = await Notification.exists({
                user: user_id,
                blog: blog._id,
                type: "like"
            });

            liked_by_user = Boolean(like);
        }

        return { blog, liked_by_user };
    }

    getAllLatestBlogsCountService = async () => {
        return await Blog.countDocuments({ draft: false });
    }

    getSearchBlogsCountService = async ({ tag, query, author }) => {
        // Khởi tạo điều kiện mặc định là chỉ lấy các bài đã public
        let findQuery = { draft: false };

        if (tag) {
            findQuery.tags = tag;
        } else if (query) {
            findQuery.title = new RegExp(query, 'i');
        } else if (author) {
            findQuery.author = author;
        }

        return await Blog.countDocuments(findQuery);
    };

    toggleLikeBlogService = async (user_id, blog_id, isLikedByUser) => {
        const incrementVal = !isLikedByUser ? 1 : -1;

        const blog = await Blog.findOneAndUpdate(
            { _id: blog_id }, 
            { $inc: { "activity.total_likes": incrementVal } },
            { new: true } 
        );

        if (!blog) {
            const err = new Error("Blog không tồn tại");
            err.statusCode = 404;
            throw err;
        }

        if (!isLikedByUser) {
            const likeNotification = new Notification({
                type: "like",
                blog: blog_id,
                notification_for: blog.author,
                user: user_id
            });
            
            await likeNotification.save();
            return { liked_by_user: true };

        } else {
            await Notification.findOneAndDelete({ 
                user: user_id, 
                blog: blog_id, 
                type: "like" 
            });
            
            return { liked_by_user: false };
        }
    };
}

export default new BlogService();
