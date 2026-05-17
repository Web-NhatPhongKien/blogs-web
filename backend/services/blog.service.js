import Blog from "../schemas/blog.js";

class BlogService {
    getLatestBlogsService = async (limit = 10) => {
        return await Blog.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .limit(limit);
    }

    getTrendingBlogsService = async (limit = 5) => {
        return await Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
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
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ publishedAt: -1 }) // Hoặc sort theo mức độ liên quan tùy bạn
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip(skipDocs)
            .limit(limit);
    }

    getBlogService = async (blog_id, mode) => {

        const incrementVal = mode !== 'edit' ? 1 : 0; 
        
        const findQuery = { blog_id };

        if (draft !== 'true') {
            findQuery.draft = false;
        }
        
        return await Blog.findOneAndUpdate(
            { blog_id }, 
            { $inc: { "activity.total_reads": incrementVal } },
            { new: true } // Trả về document MỚI sau khi đã cập nhật lượt đọc
        )
        .populate("author", "personal_info.profile_image personal_info.username personal_info.fullname")
        .select("title des content banner activity publishedAt blog_id tags");
    }
}

export default new BlogService();