import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Blogseditor from "./blog.editor";

const Editor = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const access_token = localStorage.getItem("token");

        if (!access_token) {
            navigate("/signin");
        }

    }, []);

    return (
        <Blogseditor/>
    )
}

export default Editor;