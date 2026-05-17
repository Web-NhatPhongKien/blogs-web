import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditor from "./blog.editor";

const Editor = () => {
    const [editorState, setEditorState] = useState("editor"); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const access_token = localStorage.getItem("token");

        if (!access_token) {
            return navigate("/signin");
        }

        setLoading(false);
    }, [navigate]);

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