import { useRouter } from "@tanstack/react-router";

export default function NotFound() {
  // Router
  const router = useRouter();

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100 text-gray-800">
      <div className="flex flex-col items-center text-center space-y-6 border w-[90%] max-w-4xl px-12 sm:px-24 py-28 rounded-lg bg-white shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-44 h-44 text-gray-600 animate-bounce"
        >
          <title>not Found </title>
          <path
            fill="currentColor"
            d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"
          ></path>
          <rect
            width="176"
            height="32"
            x="168"
            y="320"
            fill="currentColor"
          ></rect>
          <polygon
            fill="currentColor"
            points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"
          ></polygon>
          <polygon
            fill="currentColor"
            points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"
          ></polygon>
        </svg>
        <p className="text-4xl font-semibold">개발진행중</p>
        <div className="flex-grow">
          죄송합니다. 요청하신 페이지는 현재 개발 진행중입니다.
        </div>{" "}
        {/* 내용과 버튼 사이의 공간 확보 */}
        <button
          type="button"
          className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded bg-green-700 text-white hover:bg-green-800 transition-all mt-auto"
          onClick={(e) => {
            e.preventDefault();
            router.history.back();
          }}
        >
          뒤로가기
        </button>
      </div>
    </section>
  );
}
