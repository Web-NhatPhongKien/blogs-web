import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import BlogPostCard from "../components/blog-post";
import NoDataMessage from "../components/nodata";
import LoadMoreDataBtn from "../components/load-more";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import UserCard from "../components/usercard";

const SearchPage = () => {
    // 1. Lấy từ khóa tìm kiếm (query) từ thanh địa chỉ URL
    let { query } = useParams();

    // 2. Các State quản lý dữ liệu kết quả tìm kiếm
    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);

    // 3. Hàm tìm kiếm Blogs
    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {
                // Xử lý và tái cấu trúc dữ liệu để phục vụ phân trang (pagination)
                let formattedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { query },
                    create_new_arr
                });
                setBlogs(formattedData);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 4. Hàm tìm kiếm Users
    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(({ data }) => {
                setUsers(data.users);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 5. Hàm reset lại state khi người dùng tìm kiếm từ khóa mới
    const resetState = () => {
        setBlogs(null);
        setUsers(null);
    };

    // 6. useEffect: Gọi hàm tìm kiếm lại mỗi khi từ khóa `query` trên URL thay đổi
    useEffect(() => {
        resetState();
        searchBlogs({ page: 1, create_new_arr: true });
        fetchUsers();
    }, [query]);

    // 7. Component nội bộ (Helper) giúp đóng gói UI của danh sách người dùng
    const UserCardWrapper = () => {
        return (
            <>
                {users == null ? (
                    <Loader />
                ) : (
                    users.length ? 
                        users.map((user, i) => {
                            return (
                                <UserCard user={user} />
                            );
                        })
                    : <NoDataMessage message="No user found" />
                )}
            </>
        );
    };

    return (
        <section className="h-cover flex justify-center gap-10">
            {/* --- Cột bên trái: Trả về kết quả Bài viết và Cột Users (nếu xem trên Mobile) --- */}
            <div className="w-full">
                <InPageNavigation 
                    routes={[`Search Results from "${query}"`, "Accounts Matched"]} 
                    defaultHidden={["Accounts Matched"]}
                >
                    {/* Tab 1: Kết quả tìm kiếm Blog */}
                    <>
                        {blogs == null ? (
                            <Loader />
                        ) : (
                            blogs.results.length ? 
                                blogs.results.map((blog, i) => {
                                    return (
                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                    );
                                })
                            : <NoDataMessage message="No blogs published" />
                        )}
                        <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
                    </>

                    {/* Tab 2: Kết quả tìm kiếm Accounts (Bị ẩn trên màn hình lớn, chỉ xuất hiện trên thiết bị nhỏ) */}
                    <UserCardWrapper />

                </InPageNavigation>
            </div>

            {/* --- Cột bên phải: Hiển thị danh sách Users tìm được (Chỉ hiện trên Desktop) --- */}
            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">
                    User related to search <i className="fi fi-rr-user mt-1"></i>
                </h1>
                
                <UserCardWrapper />
            </div>
        </section>
    );
};

export default SearchPage;