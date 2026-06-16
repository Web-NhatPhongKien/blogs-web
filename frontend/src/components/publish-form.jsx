import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { editorContext } from "../pages/editor.pages";
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
                toast.error(`Bạn chỉ được thêm tối đa ${tagLimit} thẻ`)
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
            return toast.error("Vui lòng nhập tiêu đề trước khi đăng bài")
        }

        if(!des.length || des.length > characterLimit){
            return toast.error("Vui lòng nhập mô tả trước khi đăng bài")
        }
        
        if(!tags.length || tags.length > tagLimit) {
            return toast.error("Vui lòng thêm thẻ chủ đề trước khi đăng bài")
        }

        e.target.classList.add('disable');

        const loadingToast = toast.loading("Đang đăng bài...");

        let blogObj = { title, banner, des, content, tags, draft: false, id: blog_id || blog.blog_id };
        console.log("Dữ liệu đăng bài:", blogObj);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/create-blog", blogObj, getAuthConfig())
        .then(({ data }) => {
        console.log("Đăng bài thành công", data);

        toast.success("Đăng bài thành công", {
            id: loadingToast
        });

        setTimeout(() => {
            navigate("/", { replace: true });
        }, 800);
        })
        .catch((err) => {
            console.log("Lỗi khi đăng bài:", err.response?.data || err.message);

            e.target.classList.remove("disable");

            toast.error(err.response?.data?.error || "Đã xảy ra lỗi khi đăng bài", {
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
                <p className="text-dark-grey mb-1">Xem trước</p>
                <div className="w-full rounded-lg overflow-hidden aspect-video mt-4">
                    <img src={banner} alt="Ảnh bìa bài viết" />
                </div>
                <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-1">{title}</h1>
                <p className="font-medium w-full break-words">{des}</p>
            </div>

            <div className="border-grey">
                <p className="mt-8 mb-2 text-dark-grey">Tiêu đề bài viết</p>
                <input type="text" onChange={handleTitleChange} placeholder="Nhập tiêu đề bài viết" defaultValue={title}
                onKeyDown={handleTitleKeyDown} className="input-box !text-left !pl-4 !pr-4"
                />
                <p className="mt-8 mb-2 text-dark-grey">Mô tả bài viết</p>
                <textarea
                    maxLength={characterLimit}
                    defaultValue={des}
                    className="h-40 resize-none leading-7 input-box !text-left !pl-4 !pr-4 "
                    onChange={handleBlogDesChange}
                    placeholder="Nhập mô tả ngắn về bài viết..."
                >

                </textarea>
                <p className="text-right text-sm mt-1 text-dark-grey">Còn lại {characterLimit - des.length} ký tự</p>

                <p className="mt-8 mb-2 text-dark-grey">Chủ đề</p>
                
                <div className="relative input-box pl-2 py-2 pb-4 !text-left !pl-4 !pr-4">
                    <input type="text" placeholder="Nhập chủ đề"
                    className="sticky input-box !bg-white top-0 left-0 pl-4
                    mb-3 focus:bg-white !text-left !pl-4 !pr-4 " onKeyDown={handleKeyDown}/>
                    
                    {tags.map((tag, i)=>{
                       return <Tag tag={tag} key={i} tagIndex={i} />
                    } )}


                    
                </div>
                <p className=" text-right text-sm mt-1 text-dark-grey">Còn lại {tagLimit - tags.length} thẻ</p>

                <button className="btn-dark"
                onClick={publishBlog}
                >Đăng bài</button>

            </div>

        </section>
    );
}
export default PublishForm;
