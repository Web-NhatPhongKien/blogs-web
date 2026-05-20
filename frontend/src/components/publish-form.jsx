import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { editorContext } from "./editor.pages";
import Tag from "./tags.components";

const PublishForm = () => {
    let characterLimit = 200;
    let tagLimit = 10;
    let {blog, blog:{banner, title, tags, des},setEditorState, setBlog} = useContext(editorContext);

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
            </div>

        </section>
    );
}
export default PublishForm;