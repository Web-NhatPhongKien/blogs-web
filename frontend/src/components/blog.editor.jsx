import logo from "../imgs/logo.png";
import { Link } from "react-router-dom";
import dfBanner from "../imgs/dfBanner.png";
import React, { useContext, useEffect,useRef } from "react";
import { editorContext } from "./editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.components";
import { toast } from "react-hot-toast";



const BlogEditor = () => {
    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(editorContext);
    const textEditorRef = useRef(null);
    const editorInstanceRef = useRef(null);

    useEffect(() =>{
        if (editorInstanceRef.current) return;
        let editor = new EditorJS({
            holder:"textEditor",
            data: content,
            placeholder:"Let's write an awesome story",
            tools: tools
        });
        setTextEditor(editor);
        editorInstanceRef.current = editor;

        return () => {
            if (editor && typeof editor.destroy === 'function') {
                editor.destroy();
                editorInstanceRef.current = null;
            }
        };

    },[])
    const handleImg = async (e) => {
        let file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setBlog({ ...blog, banner: previewUrl });
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "mn9huksh");
            formData.append("cloud_name", "dj5mxvmtm");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dj5mxvmtm/image/upload", {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();
                if (data.secure_url) {
                    setBlog({ ...blog, banner: data.secure_url });
                    console.log("Upload thành công lên Cloudinary!", data.secure_url);
                }
            } catch (err) {
                console.error("Lỗi khi kết nối Cloudinary:", err);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        setBlog({...blog, title: input.value})
    };

    const handlePublishEvent = () => {
        if (!blog.banner.length) {
            return toast.error("Upload a blog banner to publish!");
        }
        if(!blog.title.length){
            return toast.error("Write blog tilte to publish!");
        }
        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks && data.blocks.length) {
                
                setBlog({ ...blog, content: data });
                setEditorState("publish");
                }
                else {
                return toast.error("Write something in your blog to publish it!");
                }
            })
        .catch(err => {
            console.log("error",err);
        });
        };
    }
    return (
        <>
            <nav className="navbar gap-4">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" alt="logo" />
                </Link>
                <p className="line-clamp-1 w-full font-medium ml-4">{blog.title && blog.title.length ? blog.title : "New Blog"}</p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark px-4 py-2 text-sm" onClick={handlePublishEvent}>Publish</button>
                    <button className="btn-light px-4 py-2 text-sm">Save Draft</button>
                </div>
            </nav>
            <section>
                <div className="mx-auto max-w-[800px] w-full">
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