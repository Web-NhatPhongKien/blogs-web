import EditorJS from "@editorjs/editorjs";

import { useEffect, useRef } from "react";

export default function Editor({ setContent }) {
  const editorRef = useRef();

  useEffect(() => {
    editorRef.current = new EditorJS({
      holder: "editorjs",
      async onChange() {
        const data = await editorRef.current.save();
        setContent(data);
      }
    });

    return () => editorRef.current.destroy();
  }, []);

  return <div id="editorjs"></div>;
}