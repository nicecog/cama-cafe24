import { useState, ChangeEvent, useEffect } from "react";
import { convertImageToBase64 } from "@/utils/imageReader";
import axios from "@/utils/axios";
const ImageUploader = (props: any) => {
  const { images, onChange } = props;

  const [image, setImage] = useState<string | null>(images);

  useEffect(() => {
    setImage(images);
  }, [images]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 파일이 없으면 패스
    if (!file) return;

    const base64Image = await convertImageToBase64(file);

    const response = await axios.post("/api/common/images/base64/upload", {
      base64: base64Image,
    });

    onChange(response.data.response[0]);

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-md ">
      <div className="flex items-center relative">
        {image && (
          <div className="mr-2 w-20 h-20 relative">
            <img
              src={image}
              alt="Uploaded image"
              className="w-full h-full object-cover rounded-md border border-gray-300"
            />
            <button
              className="absolute top-0 right-0 px-2 py-1 bg-red-500 text-white rounded-bl-md text-xs font-semibold"
              onClick={() => setImage(null)}
            >
              삭제
            </button>
          </div>
        )}
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
        >
          파일 선택
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
