import axios from "@/utils/axios";
import { convertImageToBase64 } from "@/utils/imageReader";
import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function QuillEditer(props: any) {
  const { value, onChange, className, readOnly = false } = props;
  const ref = useRef<ReactQuill>();
  // 이미지 업로드 관련
  const imageHandler = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files;
      if (!file) return;

      try {
        const base64Image = await convertImageToBase64(file[0]);

        const response = await axios.post("/api/common/images/base64/upload", {
          base64: base64Image,
        });
        if (!response) throw new Error("에디터 이미지 업로드 중 에러 발생");

        // 현재 커서 위치에 이미지 태그 삽입
        const range = ref.current?.getEditor().getSelection()?.index;
        if (range !== null && range !== undefined) {
          const quill = ref.current?.getEditor();

          quill?.setSelection(range, 1);

          quill?.clipboard.dangerouslyPasteHTML(
            range,
            `<img src=${response.data.response[0]} alt="이미지 태그가 삽입됩니다." />`
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6] }],
          [{ color: [] }, { background: [] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [{ align: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <>
      {/* <div className="min-h-72 max-h-full overflow-y-auto h-72"> */}

      <ReactQuill
        theme="snow"
        value={value}
        readOnly={readOnly}
        modules={modules}
        onChange={onChange}
        className={`${readOnly && "hideToolbar"}   ${className}`}
        ref={(el) => {
          if (el !== null) {
            ref.current = el;
          }
        }}
      />
    </>
  );
}
