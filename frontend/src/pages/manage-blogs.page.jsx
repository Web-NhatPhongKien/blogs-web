import { useEffect, useState } from "react";
import axios from "axios";
import BlogPostCard from "../components/blog-post.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import Pagination from "../components/pagination.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import {
    UserCard,
    ManageDraftBlog
} from "../components/usercard.component";




const BlogsManage = ({ userId }) => {
    const [blogs, setBlogs] = useState(null);
    const [query, setQuery] = useState("");
    const [drafts, setDrafts] = useState(null);
    const token = sessionStorage.getItem("token");
    const maxLimit = 5;


    const getBlogs = ({ page = 1, draft, deletedDocCount = 0}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/user-written-blogs",{
            page, draft, query, deletedDocCount
        },{
            headers: {
                Authorization: `Bearer ${token}` 
            }
        })
        .then( async ({data}) => {
            let formattedData = await filterPaginationData({
                state: null,
                data: data.blogs,
                page,
                user: token,
                countRoute: "/user-written-blogs-count",
                data_to_send: { draft, query }
            });

            const countResponse = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs-count",
                { draft, query },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const totalDocs = Number(countResponse.data.totalDocs) || 0;

            formattedData = {
                ...formattedData,
                page: Number(page),
                totalDocs,
                totalPages: Math.ceil(totalDocs / maxLimit),
                deletedDocCount
            };
            

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

    const getPublishedBlogs = ({ page = 1 }) => {
        getBlogs({
            page,
            draft: false,
            deletedDocCount: blogs?.deletedDocCount || 0
        });
    };

    const getDraftBlogs = ({ page = 1 }) => {
        getBlogs({
            page,
            draft: true,
            deletedDocCount: drafts?.deletedDocCount || 0
        });
    };

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
                                    return  <div key={blog.blog_id}>
                                    <UserCard blog={{...blog, index: i, setStateFunc: setBlogs}} />
                                    </div>
                                })
                            }

                            <Pagination
                                state={blogs}
                                fetchDataFun={getPublishedBlogs}
                            />
                        </>
                    : <NoDataMessage message="No Published blogs"/>
                }


                {
                    drafts == null ? <Loader />:
                    drafts.results.length ? 
                        <>
                            {
                                drafts.results.map((blog , i) => {
                                    return <div key={blog.blog_id}>
                                    <ManageDraftBlog blog={{...blog, index: i, setStateFunc: setDrafts}} />
                                    </div>
                                })
                            }

                            <Pagination
                                state={drafts}
                                fetchDataFun={getDraftBlogs}
                            />

                        </>
                    : <NoDataMessage message="No drafts blogs"/>
                }

            </InPageNavigation>

            
        </div>
        
        </>
    );
};

export default BlogsManage;