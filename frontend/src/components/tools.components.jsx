import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header"
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

const uploadImageByUrl = (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e);
        } catch(err) {
            reject(err);
        }
    })
    return link.then(url => {
        return {
            success: 1,
            file: { url } 
        }
    })
}

const uploadImageByFile = async (file) => {
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
            return {
                success: 1,
                file: {
                    url: data.secure_url
                }
            };
        }
    } catch (err) {
        console.error("Lỗi khi upload file ảnh từ EditorJS lên Cloudinary:", err);
    }
    return { success: 0 };
};

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    image:{
        class: Image,
        config:{
            uploader:{
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile
            }
        }
    },
    header: Header,
    quote: Quote,
    marker: Marker,
    inlineCode: InlineCode
}
