import { useState } from "react";

export default function Picture() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      event.target.value = ""; // 같은 파일 다시 선택 가능하도록 초기화
    }
  };

  const onDeletePicture = () => {
    setPreview(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* 파일 선택 및 삭제 버튼 */}
      <div className="flex items-center gap-2">
        <label className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
          📷 사진 선택하기
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            capture="environment"
            className="hidden"
          />
        </label>
        {preview && (
          <button
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
            onClick={onDeletePicture}
          >
            삭제
          </button>
        )}
      </div>

      {/* 미리보기 영역 */}
      <div className="w-72 h-72 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
        {preview ? (
          <>
            <img
              src={preview}
              alt="미리보기"
              className={`w-full h-full object-cover transition-opacity `}
            />
          </>
        ) : (
          <div className="text-gray-400">이미지 미리보기</div>
        )}
      </div>
    </div>
  );
}
