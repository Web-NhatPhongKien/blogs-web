import { json } from "express";
import  BlogService  from "../services/blog.service.js";
import { nanoid } from "nanoid";
import joi from "joi";
import User from "../schemas/user.schema.js";
import Blog from "../schemas/blog.schema.js";



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

    createBlog = async (req, res, next) => {
        try {
            let authorId = req.user.userId

            if (!authorId) {
                return res.status(401).json({ error: "Invalid token, author not found" });
            }

            let {
                title = "",
                des = "",
                banner = "",
                tags = [],
                content = { blocks: [] },
                draft = false
            } = req.body;

            if (!title.length) {
                return res.status(403).json({ error: "You must provide a title" });
            }
            
            if (!draft){
                if (!des.length || des.length > 200) {
                return res.status(403).json({ error: "You must provide blog descriptiom under 200 character" });
                }

                if (!banner.length) {
                    return res.status(403).json({ error: "You must provide blog banner" });
                }

                if (!content?.blocks?.length) {
                    return res.status(403).json({ error: "You must provide blog content" });
                }

                if (!tags.length || tags.length > 10) {
                    return res.status(403).json({ error: "You must provide tags in order, Maximum 10" });
                }
            }

            

            tags = tags.map(tag => tag.toLowerCase());

            let blog_id = title
                .replace(/[^a-zA-Z0-9]/g, " ")
                .replace(/\s+/g, "-")
                .trim() + nanoid();


            let blog = new Blog({
                title,
                des,
                banner,
                content,
                tags,
                author: authorId,
                blog_id,
                draft: Boolean(draft)
            });

            await blog.save();

            let incrementVal = draft ? 0 : 1;

            await User.findOneAndUpdate(
                { _id: authorId },
                {
                    $inc: { "account_info.total_posts": incrementVal },
                    $push: { blogs: blog._id }
                }
            );

            return res.status(200).json({ blog_id: blog.blog_id });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: "Internal server error"
            });
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