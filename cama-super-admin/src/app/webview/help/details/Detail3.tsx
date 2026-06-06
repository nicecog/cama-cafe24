import advice from "@/assets/images/character/advice2.png";
import { text2XlAtom, textLgAtom, textSmAtom } from "../HelpAtom";
import { FcApproval, FcIdea, FcSearch } from "react-icons/fc";
import { useAtomValue } from "jotai";
import ImageViewer from "./ImageViewer";

//건강 정보 검색방법
export default function Detail3() {
  const textSm = useAtomValue(textSmAtom);
  const textLg = useAtomValue(textLgAtom);
  const text2xl = useAtomValue(text2XlAtom);

  return (
    <>
      <div className="text-center bg-[#d0e7d3] py-4 flex flex-col items-center bg-opacity-55  px-5 ">
        <p
          className="flex items-center  font-semibold gap-2 mb-2"
          style={{ fontSize: `${textLg}` }}
        >
          <FcSearch style={{ fontSize: `${text2xl}` }} />
          건강 정보 검색방법
        </p>
        <img src={advice} className="w-20 mb-2" />
      </div>
      <div className=" px-5  py-2">
        <p className="text-center py-5 font-semibold">
          궁금한 내용을 직접 검색해서 보고 싶다면? <br />
          건강 정보 검색기능을 활용해 보세요!
        </p>
        <div className="mt-2 ">
          <ImageViewer type="type3" />
        </div>
        <div className="mt-5">
          <div className="flex flex-col gap-4 mt-6">
            {/* Step 1 */}
            <div className="flex items-start gap-2 border-t pt-4">
              <span
                className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5"
                style={{ fontSize: `${textSm}` }}
              >
                1
              </span>

              <div className="text-gray-700 text-justify">
                <p>
                  <span className="font-semibold text-[#39906a] ">
                    [건강 정보 직접 찾아보기]
                  </span>{" "}
                  클릭
                </p>
                <p>
                  홈 화면 상단의 "건강 정보를 직접 찾아보세요" 검색창을 누르면
                  건강 정보 검색화면으로 이동합니다.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-2 border-t pt-4">
              <span
                className="w-5 h-5 flex items-center justify-center rounded-full bg-[#39906a] text-white font-semibold mt-0.5 p-1.5"
                style={{ fontSize: `${textSm}` }}
              >
                2
              </span>

              <div className="text-gray-700 text-justify">
                <p>
                  <span className="font-semibold text-[#39906a] ">
                    상세 검색 화면에서 검색하기
                  </span>{" "}
                  클릭
                </p>
                <p className="">암종류 선택가능</p>
                <p
                  className=" text-gray-600 font-semibold"
                  style={{ fontSize: `${textSm}` }}
                >
                  유방암, 대장암, 폐암, 갑상선암 등 본인에게 해당하는 암종을
                  먼저 선택하면 더욱 정확한 정보만 보여드려요
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-[#39906a] ">
                    키워드검색
                  </span>{" "}
                  궁금한 주제를 입력해 보세요.
                </p>
                <p
                  className=" text-gray-600 font-semibold"
                  style={{ fontSize: `${textSm}` }}
                >
                  예 : 식이, 운동, 부작용, 면역력, 심리, 치료과정 등
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 border-t pt-4">
              <FcApproval
                className="  w-8 h-6 "
                style={{ fontSize: `${text2xl}` }}
              />

              <div className="text-gray-700 text-justify">
                <p>
                  <span className="font-semibold text-[#39906a] ">
                    검색한 결과 보기
                  </span>{" "}
                </p>
                <p className=" text-gray-600 ">
                  입력한 암종 + 키워드에 맞는 콘텐츠들이 리스트로 나타납니다.
                </p>
                <p className=" text-gray-600 ">
                  궁금한 내용을 클릭해 자세한 정보를 확인하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#d0e7d3] py-6 px-5 flex flex-col items-start mt-3  bg-opacity-55">
        <div
          className="flex items-center gap-2  font-bold text-[#39906a] border-l-4 border-[#39906a] pl-2 mb-3"
          style={{ fontSize: `${text2xl}` }}
        >
          <FcIdea className="text-3xl" />
          TIP
        </div>

        <p className="leading-relaxed  font-semibold">
          키워드만 입력해도 검색할 수 있어요.
        </p>
        <p className="leading-relaxed  font-semibold mt-1">
          하지만 암종을 선택하면 더{" "}
          <span className="text-[#39906a]">맞춤형 정보</span> 를 찾을 수 있어요!
        </p>
      </div>
    </>
  );
}
