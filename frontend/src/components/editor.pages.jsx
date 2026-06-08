import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditor from "./blog.editor";
import userSchema from "../../../backend/schemas/user.schema";
import PublishForm from "../components/publish-form"
import { useAuth } from "../context/auth.context";

const blogStructure = {
    title:'',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author: {userSchema:{}}
}

export const editorContext = createContext({});

const Editor = () => {
    const [blog, setBlog] = useState(blogStructure)
    const [editorState, setEditorState] = useState("editor"); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [textEditor, setTextEditor] = useState({ _isReady: false });

    useEffect(() => {

        if (!user) {
            return navigate("/login");
        }

        setLoading(false);
    }, [user,navigate]);

    return (
        <>
            <editorContext.Provider value={{blog,setBlog,editorState,setEditorState,textEditor,setTextEditor}}>
                {
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