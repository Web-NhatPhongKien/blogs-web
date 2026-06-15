import { json } from "express";
import  BlogService  from "../services/blog.service.js";
import { nanoid } from "nanoid";
import joi from "joi";
import User from "../schemas/user.schema.js";
import Blog from "../schemas/blog.schema.js";
import Notification from "../schemas/notification.schema.js";
import BlogLike from "../schemas/blog-like.schema.js";
import Comment from "../schemas/comment.schema.js";




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
                draft = false,
                id
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

            let blog_id = id || title
                .replace(/[^a-zA-Z0-9]/g, " ")
                .replace(/\s+/g, "-")
                .trim() + nanoid();

            if(id){
                const draftValue = draft === true || draft === "true";

    return Blog.findOneAndUpdate(
        {
            blog_id: id,
            author: authorId
        },
        {
            $set: {
                title,
                des,
                banner,
                content,
                tags,
                draft: draftValue
            }
        },
        {
            new: true
        }
    )
    .then((blog) => {
        if (!blog) {
            return res.status(404).json({
                error: "Không tìm thấy bài viết để cập nhật"
            });
        }

            console.log("Blog sau khi cập nhật:", {
                blog_id: blog.blog_id,
                draft: blog.draft
            });

            return res.status(200).json({
                blog_id: blog.blog_id,
                draft: blog.draft
            });
    })
        .catch((err) => {
            // THÊM: in lỗi thật ra terminal
            console.error("UPDATE BLOG ERROR:", err);
            console.error("UPDATE BLOG MESSAGE:", err.message);

            return res.status(500).json({
                error: err.message
            });
        });

            }else{
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
            }

            

        } catch (err) {
            console.error("CREATE/UPDATE BLOG ERROR:");
            console.error(err);
            console.error(err.stack);

            return res.status(500).json({
                error: err.message || "Internal server error"
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
    userWrittenBlogs = async (req, res, next) =>{
        let user_id  = req.user.userId;
        let { page, draft, query, deletedDocCount } = req.body;

        let maxLimit = 5;
        let skipDocs = (page - 1) * maxLimit;
        if (deletedDocCount) {
            skipDocs -= deletedDocCount;
        }
        Blog.find({ author: user_id, draft, title: new RegExp(query, "i") })
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({publishedAt: -1 })
        .select("title banner publishedAt blog_id activity des draft -_id")
        .then(blogs => {
            return res.status(200).json({blogs})
        })
        .catch(err => {
            return res.status(500).json({error: err.message })
        })
    }
    userWrittenBlogsCount = async (req, res, next) => {
        let user_id  = req.user.userId;
        let {draft, query } = req.body;
        Blog.countDocuments({author: user_id, draft, title: new RegExp(query, "i") })
        .then(count => {
            return res.status(200).json({ totalDocs: count})
        })
        .catch( err => {
            console.log(err.message);
            return res.status(500).json({ error: err.message});
        })
    }
    deleteBlog = async (req, res, next) => {
        let user_id  = req.user.userId;
        let {blog_id} = req.body;

        Blog.findOneAndDelete({blog_id})
        .then(async blog => {

            await Notification.deleteMany({ blogs: blog._id }).then(data => console.log('Notification deleted'));
            await Comment.deleteMany({ blog_id: blog._id }).then(data => console.log('Comment deleted'));
            await User.findOneAndUpdate({_id: user_id}, {$pull: {blog: blog._id}, $inc: {"account_info.total_posts":-1}} )
            .then(user => console.log("Blog deleted"))
            return res.status(200).json({status: 'done'});
        })
        .catch(err => {
            return res.status(500).json({error: err.message})
        })
    }
}

export default new BlogController();