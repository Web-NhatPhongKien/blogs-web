import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
    // 1. Destructuring các state và dữ liệu từ BlogContext (Part 4)
    let { 
        blog, 
        blog: { 
            _id, 
            title, 
            blog_id, 
            activity, 
            activity: { total_likes, total_comments }, 
            author: { personal_info: { username: author_username } } 
        }, 
        setBlog, 
        isLikedByUser, 
        setLikedByUser, 
        setCommentsWrapper 
    } = useContext(BlogContext);

    // 2. Destructuring thông tin người dùng đang đăng nhập từ UserContext (Part 4)
    let { userAuth: { username, access_token } } = useContext(UserContext);

    // 3. Hàm xử lý khi người dùng bấm nút Like (Part 4)
    const handleLike = () => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (access_token) {
            // Thay đổi UI ngay lập tức (Optimistic Update)
            setLikedByUser(preVal => !preVal);

            // Tăng hoặc giảm số đếm lượt like
            !isLikedByUser ? total_likes++ : total_likes--;
            setBlog({ ...blog, activity: { ...activity, total_likes } });

            // Gửi API lên server để lưu trạng thái Like vào cơ sở dữ liệu
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });

        } else {
            // Hiển thị thông báo lỗi nếu chưa đăng nhập
            toast.error("Please log in to like this blog");
        }
    };

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
            
            {/* THIẾT KẾ RESPONSIVE: Sử dụng flex justify-between để tự động đẩy 2 nhóm nút sang 2 bên */}
            <div className="flex items-center justify-between">
                
                {/* Nhóm bên Trái: Nút Like và Nút Comment */}
                <div className="flex gap-6 items-center">
                    
                    {/* Nút Like */}
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={handleLike}
                            className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")}
                        >
                            <i className={"fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                        </button>
                        <p className="text-xl text-dark-grey">{total_likes}</p>
                    </div>

                    {/* Nút Comment */}
                    <div className="flex gap-3 items-center">
                        <button
                            // Chuyển đổi trạng thái đóng/mở thanh Sidebar bình luận (Part 4)
                            onClick={() => setCommentsWrapper(preVal => !preVal)}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
                        >
                            <i className="fi fi-rr-comment-dots"></i>
                        </button>
                        <p className="text-xl text-dark-grey">{total_comments}</p>
                    </div>
                </div>

                {/* Nhóm bên Phải: Nút Share Twitter và Nút Edit */}
                <div className="flex gap-6 items-center">
                    
                    {/* Logic phân quyền: Chỉ hiển thị nút Edit nếu user đang đăng nhập chính là Tác giả bài viết */}
                    {
                        username === author_username ? 
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }

                    {/* Nút Share Twitter với URL tự động sinh */}
                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target="_blank" className="hover:text-twitter">
                        <i className="fi fi-brands-twitter text-xl"></i>
                    </Link>
                </div>
            </div>
            
            <hr className="border-grey my-2" />
        </>
    );
};

export default BlogInteraction;
