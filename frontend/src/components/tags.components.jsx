import { useContext, useState } from "react";
import { editorContext } from "./editor.pages";




const Tag = ({tag, tagIndex}) =>{

    let {blog, blog :{tags}, setBlog} = useContext(editorContext)

    const handleEditable  = (e) =>{
        e.target.setAttribute("contentEditable", true);
        e.target.focus();
    }

    const handleTagEdit = (e) =>{
        if (e.keyCode === 13 || e.keyCode === 188 ) {
            e.preventDefault();
            let currentTag = e.target.innerText;
            tags[tagIndex] = currentTag;
            setBlog({...blog, tags});

            e.target.setAttribute("contentEditable",false);
        }
    }
    const handleTagDel = () => {

        let newTags = tags.filter(t => t !== tag);
        setBlog({ ...blog, tags: newTags });
    }

    return(
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block
        hover:bg-opacity-50 pr-8">
            <p className="outline-none" onDoubleClick={handleEditable} onKeyDown={handleTagEdit} >{ tag }</p>
            <button className="mt-[2px] rounded-full absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center hover:scale-105"
            onClick={handleTagDel}>
                <i class="fi fi-ss-cross-small poiter-events-none"></i>
            </button>
        </div>
    )
}
export default Tag;