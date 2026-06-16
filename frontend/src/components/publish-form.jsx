import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { editorContext } from "./editor.pages";
import Tag from "./tags.components";
import axios from "axios";
import Loader from "./loader.component";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthConfig } from "../common/auth-config";


const PublishForm = () => {
    let characterLimit = 200;
    let tagLimit = 10;
    let {blog, blog:{banner, title, tags, des, content},setEditorState, setBlog} = useContext(editorContext);

    let token = sessionStorage.getItem("token");

    let navigate = useNavigate();
    let { blog_id } = useParams();

    const handleTitleChange = (e) =>{
        let input = e.target;

        setBlog({...blog, title: input.value})
    }

    const handleBlogDesChange =(e) =>{
        let input = e.target;

        setBlog({...blog, des: input.value})
    }

    const hanbleCloseEvent = () =>{
        setEditorState("editor")
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188 ) {
            e.preventDefault();

            let tag = e.target.value

            if(tags.length < tagLimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({...blog, tags:[...tags, tag]})
                }
            }
            else{
                toast.error(`You just add max ${tagLimit} tag`)
            }
        e.target.value ="";
        }
    };


    const publishBlog = (e) => {
        if (e.target.className.includes("disable")){
            return;
        }

        if (!token) {
            return toast.error("Bạn cần đăng nhập để đăng bài");
        }

        if(!title.length){
            return toast.error("Write blog title before publishing")
        }

        if(!des.length || des.length > characterLimit){
            return toast.error("Write blog description before publishing")
        }
        
        if(!tags.length || tags.length > tagLimit) {
            return toast.error("Write blog tags before publishing")
        }

        e.target.classList.add('disable');

        const loadingToast = toast.loading("Publishing...");

        let blogObj = { title, banner, des, content, tags, draft: false, id: blog_id || blog.blog_id };
        console.log("Publish data:", blogObj);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/api/blogs/create-blog", blogObj, getAuthConfig())
        .then(({ data }) => {
        console.log("Publish success:", data);

        toast.success("Published", {
            id: loadingToast
        });

        setTimeout(() => {
            navigate("/", { replace: true });
        }, 800);
        })
        .catch((err) => {
            console.log("Publish error:", err.response?.data || err.message);

            e.target.classList.remove("disable");

            toast.error(err.response?.data?.error || "Something went wrong", {
                id: loadingToast
            });

        });
    }


    return (
        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-24 relative max-w-[1200px] mx-auto px-10">

            <Toaster/>

            <button className="top-8 right-8 absolute right-4 z-50"
            onClick={hanbleCloseEvent}
            >
                <i class="fi fi-rr-square-x"></i>
            </button>
            <div className="center max-w-[550px]">
                <p className="text-dark-grey mb-1">Preview</p>
                <div className="w-full rounded-lg overflow-hidden aspect-video mt-4">
                    <img src={banner} alt="banner" />
                </div>
                <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-1">{title}</h1>
                <p className="font-medium w-full break-words">{des}</p>
            </div>

            <div className="border-grey">
                <p className="mt-8 mb-2 text-dark-grey">Blog title</p>
                <input type="text" onChange={handleTitleChange} placeholder="Blog title" defaultValue={title}
                onKeyDown={handleTitleKeyDown} className="input-box !text-left !pl-4 !pr-4"
                />
                <p className="mt-8 mb-2 text-dark-grey">Discription about your blog</p>
                <textarea
                    maxLength={characterLimit}
                    defaultValue={des}
                    className="h-40 resize-none leading-7 input-box !text-left !pl-4 !pr-4 "
                    onChange={handleBlogDesChange}
                    placeholder="Write a short description about your blog..."
                >

                </textarea>
                <p className="text-right text-sm mt-1 text-dark-grey">{ characterLimit - des.length} character left</p>

                <p className="mt-8 mb-2 text-dark-grey">Topics</p>
                
                <div className="relative input-box pl-2 py-2 pb-4 !text-left !pl-4 !pr-4">
                    <input type="text" placeholder="Topic"
                    className="sticky input-box !bg-white top-0 left-0 pl-4
                    mb-3 focus:bg-white !text-left !pl-4 !pr-4 " onKeyDown={handleKeyDown}/>
                    
                    {tags.map((tag, i)=>{
                       return <Tag tag={tag} key={i} tagIndex={i} />
                    } )}


                    
                </div>
                <p className=" text-right text-sm mt-1 text-dark-grey">{tagLimit - tags.length} Tags left</p>

                <button className="btn-dark"
                onClick={publishBlog}
                >Publish</button>

            </div>

        </section>
    );
}
export default PublishForm;
