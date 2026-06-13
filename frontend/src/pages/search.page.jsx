import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import Pagination from "../components/pagination.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import { UserCard } from "../components/usercard.component";
import UserCardsearch from "../components/userCardsearch.component";

const SearchPage = () => {

    let { query } = useParams();

    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);


    const searchBlogs = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {
                // Xử lý và tái cấu trúc dữ liệu để phục vụ phân trang (pagination)
                let formattedData = await filterPaginationData({
                    data: data.blogs,
                    page: data.page,
                    totalDocs: data.totalDocs,
                    totalPages: data.totalPages,
                    limit: data.limit
                });
                setBlogs(formattedData);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(({ data }) => {
                setUsers(data.users);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const resetState = () => {
        setBlogs(null);
        setUsers(null);
    };

    useEffect(() => {
        resetState();
        searchBlogs({ page: 1 });
        fetchUsers();
    }, [query]);

    const UserCardWrapper = () => {
        return (
            <>
                {users == null ? (
                    <Loader />
                ) : (
                    users.length ? 
                        users.map((user, i) => {
                            return (
                                <UserCardsearch user={user} />
                            );
                        })
                    : <NoDataMessage message="No user found" />
                )}
            </>
        );
    };

    return (
        <section className="h-cover desktop-layout">
            <div className="desktop-main">
                <InPageNavigation 
                    routes={[`Search Results from "${query}"`]} 
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
                        <Pagination state={blogs} fetchDataFun={searchBlogs} />
                    </>

                </InPageNavigation>
            </div>

            <div className="search-sidebar">
                <h1 className="search-sidebar-title">
                    User related to search <i className="fi fi-rr-user mt-1"></i>
                </h1>
                
                <UserCardWrapper />
            </div>
        </section>
    );
};

export default SearchPage;
