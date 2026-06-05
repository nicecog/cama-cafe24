import { Bookmark, Heart } from "lucide-react";
import advice from "@/assets/images/character/advice2.png";
import ImageViewer from "./ImageViewer";

//암정보 검색방법
export default function Detail4() {
  return (
    <>
      <div className="text-center bg-[#d0e7d3] py-4 flex flex-col items-center bg-opacity-55  px-5 ">
        <p className="flex items-center  font-semibold gap-2 mb-2 text-lg">
          <Heart className="text-2xl text-[#39906a]" size={28} />
          암정보 콘텐츠 즐겨찾기 방법
        </p>
        <img src={advice} className="w-20 mb-2" alt="advice" />
      </div>
      <div className=" px-5  py-2">
        <p className="text-center py-5 font-semibold">
          자주 보고 싶은 암정보 콘텐츠, 즐겨찾기에 저장해 두면 나중에 빠르게
          다시 볼 수 있어요!
        </p>
        <div className="mt-2 ">
          <ImageViewer type="type4" />
        </div>
        <div className="mt-5">
          <div className="flex flex-col gap-4 mt-6">
            {/* Step 1 */}
            <div className="flex items-start gap-2 border-t pt-4">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold  mt-0.5 p-1.5 text-sm">
                1
              </span>

              <div className="text-gray-700 text-justify">
                <p>
                  <span className="font-semibold text-[#39906a] ">
                    즐겨찾기 등록하는 방법
                  </span>{" "}
                </p>
                <p>
                  콘텐츠 상단의 하트{" "}
                  <Heart
                    className="inline-block -mt-1 text-rose-500"
                    size={20}
                  />{" "}
                  아이콘 누르기
                </p>
                <p>
                  암정보 콘텐츠 화면 오른쪽 상단에 있는 하트 아이콘을 탭하면
                  노란색으로 바뀌면서 즐겨찾기 등록이 완료됩니다!
                </p>
                <p className=" text-gray-600  font-semibold text-sm">
                  <Bookmark
                    className="inline-block -mt-1 text-amber-500"
                    size={18}
                  />{" "}
                  하트가 채워졌다면, 즐겨찾기 성공!
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-2 border-t pt-4">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold  mt-0.5 p-1.5 text-sm">
                2
              </span>

              <div className="text-gray-700 text-justify">
                <p>
                  <span className="font-semibold text-[#39906a] ">
                    저장한 콘텐츠 확인하는 방법
                  </span>{" "}
                </p>
                <p className="">
                  하단메뉴의{" "}
                  <span className="font-semibold text-[#39906a] ">
                    즐겨찾기
                  </span>{" "}
                  탭 클릭
                </p>
                <p className="">
                  앱 하단 메뉴중{" "}
                  <Heart
                    className="inline-block -mt-1 text-rose-500"
                    size={20}
                  />{" "}
                  모양 아이콘 (즐겨찾기) 를 누르면 내가 저장한 콘텐츠들이 한눈에
                  보여요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#d0e7d3] py-6 px-5 flex flex-col items-start mt-3  bg-opacity-55"></div>
    </>
  );
}
