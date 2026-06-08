import  BlogService  from "../services/blog.service.js";

class BlogController {
    getLatestBlogs = async (req, res) => {
        try {
            const { page } = req.body;
            const maxLimit = 10;

            const blogs = await BlogService.getLatestBlogsService(page, maxLimit);
            
            return res.status(200).json({ blogs });
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
            const { tag, query, author, page, limit, eliminate_blog } = req.body;

            const blogs = await BlogService.searchBlogsService({
                tag, 
                query, 
                author, 
                page, 
                limit, 
                eliminate_blog
            });

            return res.status(200).json({ blogs });
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
}

export default new BlogController();