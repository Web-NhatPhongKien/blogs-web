import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import dfBanner from "../imgs/dfBanner.png";
import axios from "axios";


export const UserCard = ({ blog }) => {
    if (!blog) return null;

    let { banner, blog_id, title, publishedAt, activity} = blog;
    const token = sessionStorage.getItem("token");

    return (
        <div className="border-b border-grey pb-6 w-full mb-6 ">

            <div className="flex gap-5 mb-6  w-full">
                <img
                    src={banner}
                    alt={title}
                    className="w-32 h-32 rounded-[20px] flex-none bg-grey object-cover"
                />

                <div className="flex flex-col justify-between h-32 flex-1">
                    <Link
                        to={`/blog/${blog_id}`}
                        className="hover:underline text-2xl font-semibold"
                    >
                        {title}
                    </Link>
                </div>

            </div>

            <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between ">
                    <div className="flex gap-10">
                        <Link to={`/editor/${blog_id}`} className="hover:underline">Edit</Link>
                        <button className=" hover:underline text-red" onClick={(e) =>{deleteBlog(blog, token, e.target)}}>Delete</button>
                    </div>
                    <div className="flex gap-5 justify-between">
                        <div className="flex items-center gap-2 text-dark-grey">
                            <i className="fi fi-rr-heart"></i>
                            <span>{activity?.total_likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-dark-grey">
                            <i className="fi fi-rr-comment-alt"></i>
                            <span>{activity?.total_comments || 0}</span>
                        </div>
                    </div>
                    
                </div>
                    <p className="!text-[10px] text-gray self-end whitespace-nowrap">
                        Publish on {getDay(publishedAt)}
                    </p>
            </div>

        </div>
        
    );
};



export const ManageDraftBlog = ({blog}) =>{

    let { banner, blog_id, title, des,  index } = blog;
    const token = sessionStorage.getItem("token");

    return(
        <div>
            <div className="flex items-center gap-5 mb-4">
                <h1 className="text-xl text-dark-grey">{String(index + 1).padStart(2, "0")}</h1>
                <img src={banner || dfBanner} alt={title} className="w-32 h-32 rounded-[20px] flex-none bg-grey object-cover" />
                <div>
                    <Link
                        to={`/editor/${blog_id}`}
                        className="hover:underline text-2xl font-semibold">
                        {title}
                    </Link>
                    <p className="!text-[15px]">{des || "No Description"}</p>
                </div>
                
            </div>
            <div>
                <div className="flex gap-10 ">
                    <h1></h1>
                    <Link to={`/editor/${blog_id}`} className="hover:underline">Edit</Link>
                    <button className=" hover:underline text-red" onClick={(e) =>{deleteBlog(blog, token, e.target)}}>Delete</button>
                </div>
            </div>
        </div>
    )
}


const deleteBlog = (blog, token, target) => {
    const { index, blog_id, setStateFunc } = blog;

    target.disabled = true;

    axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog",
        { blog_id },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then(() => {
        target.disabled = false;

        setStateFunc((preVal) => {
            if (!preVal || !Array.isArray(preVal.results)) {
                return preVal;
            }

            const updatedResults = preVal.results.filter(
                (_, currentIndex) => currentIndex !== index
            );

            if (!updatedResults.length && preVal.totalDocs - 1 > 0) {
                return null;
            }

            return {
                ...preVal,
                results: updatedResults,
                totalDocs: Math.max(preVal.totalDocs - 1, 0),
                deletedDocCount: (preVal.deletedDocCount || 0) + 1
            };
        });
    })
    .catch((err) => {
        target.disabled = false;
        console.log(err.response?.data || err.message);
    });
};