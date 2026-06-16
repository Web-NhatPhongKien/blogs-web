import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog.editor";
// XÓA: frontend không được import Mongoose schema từ backend
//import userSchema from "../../../backend/schemas/user.schema";
// THÊM: lấy user đăng nhập từ AuthContext của frontend
import PublishForm from "../components/publish-form";
import { useAuth } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import axios from "axios";


const blogStructure = {
    title:'',
    banner: '',
    content: [],
    tags: [],
    des: '',
    // SỬA: cấu trúc author sau khi backend populate user
    author: {
        personal_info: {}
    }
}

export const editorContext = createContext({});

const Editor = () => {
    const [blog, setBlog] = useState(blogStructure)
    const [editorState, setEditorState] = useState("editor"); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [textEditor, setTextEditor] = useState({ _isReady: false });

    

    let token = sessionStorage.getItem("token");
    let {blog_id} = useParams();

    useEffect(() => {

        if(!blog_id){
            return setLoading(false)
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog",{
            blog_id, draft: true, mode: 'edit'
        })
        .then(({data: {blog}})  => {
            setBlog(blog);
            setLoading(false);
        })
        .catch(err => {
            setBlog(null);
            setLoading(false);
        })
  
    }, []);

    return (
        <>
            <editorContext.Provider value={{blog,setBlog,editorState,setEditorState,textEditor,setTextEditor}}>
                {
                
                token == null ? <Navigate to="login" replace/>:
                loading ? <p className="text-center mt-20" >Loading...</p> :
                editorState === "editor" ? 
                    <BlogEditor setEditorState={setEditorState}/> 
                : 
                    <PublishForm setEditorState={setEditorState} />
                }
            </editorContext.Provider>
        </>
    )
}

export default Editor;