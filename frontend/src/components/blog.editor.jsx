import logo from "../imgs/logo.png";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import dfBanner from "../imgs/dfBanner.png";
import React, { useContext, useState } from "react";
import { editorContext } from "./editor.pages";

const BlogEditor = () => {
    const { blog, setBlog } = useContext(editorContext);
    const { title, banner, content, tags, des } = blog;


    const handleImg = async (e) => {
        let file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setBlog({ ...blog, banner: previewUrl });
=======
import dfBanner from "../imgs/dfBanner.png"
import React, { useState } from "react";
const BlogEditor = ()=>{
    const [banner, setBanner] = useState(dfBanner);
    const [title, setTitle] = useState("");

    const handleImg = async (e) => {
        let file = e.target.files[0];

        if (file) {
            setBanner(URL.createObjectURL(file));

            
>>>>>>> b751743 (Update editor, publish form and banner)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "mn9huksh");
            formData.append("cloud_name", "dj5mxvmtm");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dj5mxvmtm/image/upload", {
                    method: "POST",
                    body: formData
                });
<<<<<<< HEAD
                const data = await res.json();
                if (data.secure_url) {
                    setBlog({ ...blog, banner: data.secure_url });
                    console.log("Upload thành công lên Cloudinary!", data.secure_url);
                }
=======

                const data = await res.json();
                
                if(data.url) {
                    console.log("Upload thành công!", data.url);
                }

>>>>>>> b751743 (Update editor, publish form and banner)
            } catch (err) {
                console.error("Lỗi khi kết nối Cloudinary:", err);
            }
        }
<<<<<<< HEAD
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };
=======
    }
    const handleKeyDown = (e)=>
        if(e.keyCode === 13) {
            e.preventDefault();
        }
    }
>>>>>>> b751743 (Update editor, publish form and banner)

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
<<<<<<< HEAD
        setBlog({...blog, title: input.value})
    };

    return (
        <>
            <nav className="navbar gap-4">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" alt="logo" />
                </Link>
                <p className="line-clamp-1 w-full font-medium ml-4">{blog.title && blog.title.length ? blog.title : "New Blog"}</p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark px-4 py-2 text-sm">Publish</button>
                    <button className="btn-light px-4 py-2 text-sm">Save Draft</button>
                </div>
            </nav>
            <section>
                <div className="mx-auto max-w-[900px] w-full">
                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-gray-100 rounded overflow-hidden cursor-pointer">
                        <label htmlFor="uploadBanner" className="cursor-pointer">
                            <img src={blog.banner || dfBanner} className="w-full h-full object-cover" alt="banner" />
                            <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleImg} />
                        </label>
                    </div>
                    <textarea 
                        placeholder="Blog Title" 
                        value={blog.title}
                        className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight"
                        onKeyDown={handleKeyDown}
                        onChange={handleTitleChange}
                    ></textarea>

                <hr className="w-full opacity-20 my-2"/>

                <div id="textEditor" className="font-gelasio">

                </div>

                </div>
            </section>
        </>
    );
};

export default BlogEditor;
=======
    }

    return(
        <>
            <nav className="navbar gap-4">
                <Link to="/" className="flex-none w-10 ">
                    <img src={logo} className="w-full" />
                </Link>
                <p>New Blog</p>
                <div className="flex gap-4 ml-auto ">
                    <button className="btn-dark px-4 py-2 text-sm">
                        Publish
                    </button>
                    <button className="btn-light px-4 py-2 text-smm">
                        Save Draft
                    </button>
                </div>
            </nav>
            <section>
                <div className=" mx-auto w-full">
                    
                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-gray-100 rounded overflow-hidden cursor-pointer">
                        <label htmlFor="uploadBanner" className="cursor-pointer">
                        
                            <img 
                                src={banner} 
                                alt="banner" 
                                className="w-full h-full object-cover" 
                            />

                            <input 
                                id="uploadBanner"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                hidden 
                                onChange={handleImg} 
                            />
                        </label>
                    </div>

                    <textarea 
                    placeholder="Blog Title"
                    className="text-4xl font-medium w-full h-20
                    outline-none resize-none mt-10 leading-tight"
                    onKeyDown={handleKeyDown}
                    onChange={handleTitleChange}
                    >
                    </textarea>

                </div>
                
            </section>
        </>    
    )
}
 export default BlogEditor;
>>>>>>> b751743 (Update editor, publish form and banner)
