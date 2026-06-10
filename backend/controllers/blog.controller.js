import  BlogService  from "../services/blog.service.js";

class BlogController {
    getLatestBlogs = async (req, res) => {
        try {
            const page = Number(req.body.page) || 1;
            const maxLimit = 2;

            const blogs = await BlogService.getLatestBlogsService(page, maxLimit);
            const totalDocs = await BlogService.getAllLatestBlogsCountService();
            
            return res.status(200).json({
                blogs,
                page,
                limit: maxLimit,
                totalDocs,
                totalPages: Math.ceil(totalDocs / maxLimit)
            });
        } catch (err) {
            console.error("Lỗi khi lấy latest blogs:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    getTrendingBlogs = async (req, res) => {
        try {
            const maxLimit = 5;
            
            const blogs = await BlogService.getTrendingBlogsService(maxLimit);
            
            return res.status(200).json({ blogs });
        } catch (err) {
            console.error("Lỗi khi lấy trending blogs:", err);
            return res.status(500).json({ error: err.message });
        }
    }

    searchBlogs = async (req, res, next) => {
        try {
            const { tag, query, author, eliminate_blog } = req.body;
            const page = Number(req.body.page) || 1;
            const limit = Number(req.body.limit) || 5;

            const blogs = await BlogService.searchBlogsService({
                tag, 
                query, 
                author, 
                page, 
                limit, 
                eliminate_blog
            });
            const totalDocs = await BlogService.getSearchBlogsCountService({ tag, query, author });

            return res.status(200).json({
                blogs,
                page,
                limit,
                totalDocs,
                totalPages: Math.ceil(totalDocs / limit)
            });
        } catch (err) {
            next(err);
        }
    }

    getAllLatestBlogsCount = async (req, res, next) => {
        try {
            const count = await BlogService.getAllLatestBlogsCountService();
            return res.status(200).json({ totalDocs: count });
        } catch (err) {
            next(err);
        }
    };

    getSearchBlogsCount = async (req, res, next) => {
        try {
            const { tag, query, author } = req.body;
            
            const count = await BlogService.getSearchBlogsCountService({ tag, query, author });
            
            return res.status(200).json({ totalDocs: count });
        } catch (err) {
            next(err);
        }
    };

    likeBlog = async (req, res, next) => {
        try {
            const user_id = req.user.userId; 
            const { _id: blog_id, isLikedByUser } = req.body;

            const result = await BlogService.toggleLikeBlogService(user_id, blog_id, isLikedByUser);

            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };
}

export default new BlogController();
