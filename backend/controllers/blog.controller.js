import  BlogService  from "../services/blog.service.js";

class BlogController {
    getLatestBlogs = async (req, res) => {
        try {
            const maxLimit = 10;

            const blogs = await BlogService.getLatestBlogsService(maxLimit);
            
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
            // Lấy toàn bộ tham số từ body
            const { tag, query, author, page, limit, eliminate_blog } = req.body;

            // Gọi service và truyền dữ liệu xuống dưới dạng 1 object
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
            // Có lỗi (như sai định dạng RegExp, rớt mạng DB...) thì đẩy đi
            next(err);
        }
    }
}

export default new BlogController();