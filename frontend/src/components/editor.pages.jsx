import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditor from "./blog.editor";
import { useAuth } from "../context/auth.context";

const Editor = () => {
    const [editorState, setEditorState] = useState("editor"); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {

        if (!user) {
            return navigate("/login");
        }

        setLoading(false);
    }, [user, navigate]);

    return (
        <>
            {
                loading ? <p className="text-center mt-20">Loading...</p> :
                editorState === "editor" ? 
                    <BlogEditor setEditorState={setEditorState} /> 
                : 
                    <PublishForm setEditorState={setEditorState} />
            }
        </>
    )
}

export default Editor;