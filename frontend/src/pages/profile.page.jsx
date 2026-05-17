import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
// import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import PageNotFound from "./404.page";

// 1. Cấu trúc dữ liệu mặc định (Tránh lỗi undefined trước khi API tải xong)
export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_image: "",
        bio: ""
    },
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    social_links: { },
    joinedAt: " "
};

const ProfilePage = () => {
    // Lấy ID (username) từ đường dẫn URL (Ví dụ: /user/kunal)
    let { id: profileId } = useParams();

    // Các states quản lý dữ liệu
    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let [blogs, setBlogs] = useState(null);
    let [profileLoaded, setProfileLoaded] = useState("");

    // Lấy thông tin user đăng nhập hiện tại từ Context
    // Sử dụng Context để lấy thông tin người dùng đang đăng nhập (Part 3)
    // Phong làm phần này sẽ update sau
    // let { userAuth: { username } } = useContext(UserContext);

    // Phân rã dữ liệu từ state profile
    let { personal_info: { fullname, username: profile_username, profile_image, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

    // 2. Hàm gọi API lấy thông tin Profile
    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId })
            .then(({ data: user }) => {
                if (user !== null) {
                    setProfile(user);
                }
                setProfileLoaded(profileId); // Ghi nhận profile nào đang được tải
                getBlogs({ user_id: user._id }); // Gọi hàm lấy bài viết của user này
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    // 3. Hàm gọi API lấy danh sách bài viết của User
    const getBlogs = ({ page = 1, user_id }) => {
        user_id = user_id === undefined ? blogs.user_id : user_id;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { author: user_id, page })
            .then(async ({ data }) => {
                let formatedDate = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { author: user_id }
                });

                formatedDate.user_id = user_id;
                setBlogs(formatedDate);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // Hàm Reset State khi chuyển qua một profile khác
    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(true);
        setProfileLoaded("");
    };

    // 4. Gọi API khi profileId thay đổi
    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
        }
        if (blogs === null) {
            resetStates();
            fetchUserProfile();
        }
    }, [profileId, blogs]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                profile_username.length ? (
                    <section className="h-cover profile-layout"> 
                        <div className="profile-sidebar">
                            
                            <img src={profile_image} className="profile-avatar" />
                            <h1 className="profile-username">@{profile_username}</h1>
                            <p className="profile-fullname">{fullname}</p>
                            
                            {/* Định dạng số (10,000 thay vì 10000) */}
                            <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>

                            {/* Nút Edit Profile: Chỉ hiện nếu người dùng đang đăng nhập trùng với profile đang xem */}
                            <div className="profile-action">
                                {profileId === username ? (
                                    <Link to="/settings/edit-profile" className="btn-light rounded-md">Edit Profile</Link>
                                ) : (
                                    " "
                                )}
                            </div>

                            <AboutUser className="profile-about-desktop" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                        </div>

            
                        <div className="profile-main">
                            <InPageNavigation 
                                routes={["Blogs Published", "About"]} 
                                defaultHidden={["About"]}>

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
                                    <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
                                </>

                            </InPageNavigation>
                        </div>

                    </section>
                ) 
                : (

                    <PageNotFound />
                )
            )}
        </>
    );
};

export default ProfilePage;