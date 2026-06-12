import { useEffect, useState } from "react";
import axios from "axios";
import BlogPostCard from "../components/blog-post.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import Pagination from "../components/pagination.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import UserCard from "../components/usercard.component";



const BlogsManage = ({ userId }) => {
    const [blogs, setBlogs] = useState(null);
    const [query, setQuery] = useState("");
    const [drafts, setDrafts] = useState(null);
    const token = sessionStorage.getItem("token");

    const fetchUserBlogs = ({ page = 1 } = {}) => {
        if (!userId) {
            setBlogs({ results: [], page: 1, totalDocs: 0, totalPages: 0 });
            return;
        }

        axios
            .post(`${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`, {
                author: userId,
                page,
                limit: 5,
                query,
            })
            .then(({ data }) => {
                const formattedData = filterPaginationData({
                    data: data.blogs,
                    page: data.page,
                    totalDocs: data.totalDocs,
                    totalPages: data.totalPages,
                    limit: data.limit,
                });

                setBlogs(formattedData);
            })
            .catch((err) => {
                console.log(err);
                setBlogs({
                    results: [],
                    page: 1,
                    totalDocs: 0,
                    totalPages: 0,
                });
            });
    };


    const getBlogs = ({ page, draft, deletedDocCount = 0}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/user-written-blogs",{
            page, draft, query, deletedDocCount
        },{
            headers: {
                Authorization: `Bearer ${token}` 
            }
        })
        .then( async ({data}) => {
            let formattedData = await filterPaginationData({
                state: draft ? drafts: blogs,
                data: data.blogs,
                page,
                user : token,
                countRoute: "/user-written-blogs-count",
                data_to_send: {draft, query}
            })

            if(draft){
                setDrafts(formattedData)
            }
            else{
                setBlogs(formattedData)
            }
        
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(token){
            if(blogs == null){
                getBlogs({page: 1, draft: false})
            }
            if(drafts == null){
                getBlogs({ page: 1, draft: true})
            }
        }
    }, [token, blogs, drafts, query]);

    const handleSearchChange = (e) => {
        const value = e.target.value;

        setQuery(value);

        if (!value.length) {
            setQuery("");
            setBlogs(null);
            setDrafts(null);
            fetchUserBlogs({ page: 1 });
        }
    };

    const handleBlogSearch = (e) => {
        const searchQuery = e.target.value;

        setQuery(searchQuery);

        if (e.keyCode === 13 && searchQuery.length) {
            setBlogs(null);
            setDrafts(null);
        }
    };

    return (
        <>
        
        <div className="profile-post-placeholder">
            <h1>Manage Blogs</h1>
            <Toaster/>
            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    placeholder="Search Blogs"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full"
                    value={query}
                    onChange={handleSearchChange}
                    onKeyDown={handleBlogSearch}
                />

                <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
            </div>

            <InPageNavigation routes= {["Published Blogs", "Drafts"]}>

                {
                    blogs == null ? <Loader />:
                    blogs.results.length ? 
                        <>
                        {
                            blogs.results.map((blog , i) => {
                                return <div key={i}>
                                   <UserCard blog={blog} />
                                </div>
                            })
                        }
                        </>
                    : <NoDataMessage message="No Published blogs"/>
                }

            </InPageNavigation>

            {/* <div className="profile-post-list">
                {blogs == null ? (
                    <Loader />
                ) : blogs.results.length ? (
                    <>
                        {blogs.results.map((blog) => (
                            <BlogPostCard
                                key={blog.blog_id}
                                content={blog}
                                author={blog.author.personal_info}
                            />
                        ))}

                        <Pagination
                            state={blogs}
                            fetchDataFun={fetchUserBlogs}
                        />
                    </>
                ) : (
                    <NoDataMessage message="No blogs published" />
                )}
            </div> */}
        </div>
        
        </>
    );
};

export default BlogsManage;