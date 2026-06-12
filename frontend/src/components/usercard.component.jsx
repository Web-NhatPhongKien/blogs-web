import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const UserCard = ({ blog }) => {
    if (!blog) return null;

    let { banner, blog_id, title, publishedAt } = blog;

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
                <Link to={`/editor/${blog_id}`}>Edit</Link>
                <p className="!text-[10px] text-gray self-end whitespace-nowrap">
                        Publish on {getDay(publishedAt)}
                    </p>
            </div>

        </div>
        
    );
};

export default UserCard;