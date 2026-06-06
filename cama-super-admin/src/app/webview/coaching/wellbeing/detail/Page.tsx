import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "@/hooks/useAlert";
import { useRef, useState } from "react";
import QuillEditer from "@/components/edit/QuillEditer";
import { FcPhone, FcAbout, FcHome } from "react-icons/fc";
import { motion } from "framer-motion";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { GrDocumentSound } from "react-icons/gr";
import { FaRegStopCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
export default function WellbeingDetail() {
  // Params
  const { id, loginId } = useParams();
  const navigate = useNavigate();

  // 폰트 사이즈
  const [fontSize, setFontSize] = useState(18);

  const divRef = useRef<HTMLDivElement>(null);

  const { confirm } = useAlert();

  const { data } = useQuery({
    queryKey: ["wellbeing", "detail", id],
    queryFn: async () => {
      const response = await axios
        .post(`/api/contents/wellbeing/${id}/view/getWellbeingResourceDetail`)
        .then((res) => res.data.response);
      return response;
    },
    initialData: {},
  });

  const changeSize = (size: string) => () => {
    setFontSize((currentSize) => {
      if (size === "plus") {
        return Math.min(currentSize + 2, 26); // 최대값 20으로 제한
      } else {
        return Math.max(currentSize - 2, 14); // 최소값 16으로 제한
      }
    });
  };

  const getSound = () => {
    const deleteAllList: string[] = [
      // "전혀그렇지않다",
      // "그렇지않다",
      // "매우그렇다",
      // "그렇다",
    ]; // 모든 항목에서 제거할 문자열 목록
    const deleteLastList = [
      "이전",
      "다음",
      "유형 알아보기",
      "유형 확인하기",
      "사이트",
      "연락처",
      "SNS",
    ]; // 뒤로부터 첫 번째로 등장하는 문자열 목록

    confirm("음성재생 하시겠습니까? ", () => {
      if (window?.ReactNativeWebView) {
        if (divRef.current) {
          let divText = divRef.current.textContent;

          if (divText) {
            // 마침표나 물음표를 기준으로 앞뒤에 공백을 추가하는 정규 표현식
            const processedText = divText.replace(/(\.|!|\?)/g, "$1 ");

            // 모든 항목에서 문자열 제거
            let modifiedText = processedText;
            deleteAllList.forEach((item) => {
              const regex = new RegExp(item, "g");
              modifiedText = modifiedText.replace(regex, "");
            });

            // 뒤로부터 등장하는 첫 번째 문자열 제거
            deleteLastList.forEach((item) => {
              const regex = new RegExp(`${item}(?!.*${item})`);
              modifiedText = modifiedText.replace(regex, "");
            });

            window.ReactNativeWebView.postMessage(
              JSON.stringify({ data: modifiedText, type: "TS" })
            );
          }
        }
      }
    });
  };

  //  BS : 보임 BP : 안보임
  const stopSound = () => {
    confirm("음성재생을 중지 하시겠습니까?  ", () => {
      if (window?.ReactNativeWebView) {
        window?.ReactNativeWebView.postMessage(
          JSON.stringify({ data: "", type: "TP" })
        );
      }
    });
  };

  const onClose = () => {
    confirm({ html: "웰빙 자원 목록으로 이동하시겠습니까?" }, () => {
      navigate(`/webview/coaching/wellbeing/${loginId}`);
    });
  };

  return (
    <>
      <div className="h-dvh flex flex-col">
        <div className="w-full bg-white z-10 h-[50px]">
          <div className="bg-white h-[50px] flex justify-between items-center border-b  px-4 relative">
            <div>
              <button onClick={onClose} className=" ">
                <IoClose className="text-text font-extrabold text-[23px]" />
              </button>
            </div>
            <div className=" gap-2 flex items-center ml-5 ">
              <button onClick={getSound} className=" ">
                <GrDocumentSound className="text-text font-extrabold text-[20px]" />
              </button>
              <button onClick={stopSound} className=" ">
                <FaRegStopCircle className="text-text font-extrabold text-[20px]" />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-[56px] flex items-center justify-between text-[#444444] text-[16px] border-[#00000029] border-b shadow-md px-[20px]">
          <div className="text-[#777777] text-[14px]">
            글자크기를 조절하세요
          </div>
          <div className="flex gap-4 text-[14px] font-bold text-[#774F2D]">
            <button
              className=" flex  items-center justify-center gap-1"
              onClick={changeSize("minus")}
            >
              작게
              <FiMinusCircle className="text-[19px] " />
            </button>
            <button
              className=" flex  items-center justify-center gap-1"
              onClick={changeSize("plus")}
            >
              크게
              <FiPlusCircle className="text-[19px] " />
            </button>
          </div>
        </div>

        <div
          className={`flex-grow h-full  overflow-y-auto  bg-[#FFFFFF]  `}
          ref={divRef}
        >
          <div className=" mt-[40px]  px-[20px] relative">
            <h1
              className={`text-[#774F2D] font-notoB text-[${fontSize}px] font-bold`}
            >
              {data.title}
            </h1>
            <p
              className={` mt-[10px] text-camaColor1 text-[${fontSize - 4}px]`}
            >
              #{data.wellbeingCategoryNm}
            </p>
          </div>
          <div className="  px-[5px] ">
            <QuillEditer
              value={data.contents}
              readOnly
              className={` ${
                {
                  14: "xs",
                  16: "sm",
                  18: "md",
                  20: "lg",
                  22: "xl",
                  24: "xxl",
                  26: "xxxl",
                  28: "xxxxl",
                }[fontSize]
              } `}
            />
          </div>
          <div className={`bg-[#F9F9F9] px-[20px] py-[40px]`}>
            <h1
              className={`text-[#774F2D] text-[${
                fontSize - 4
              }px] font-notoB font-bold`}
            >
              {data.companyName}
            </h1>
            <div
              className={`text-[${
                fontSize - 4
              }px] text-[#777777] font-notoR font-semibold  mt-2`}
            >
              <p>{data.companyDescription}</p>
              <div className={`text-[${fontSize - 7}px]  mt-2`}>
                <p> {data.address}</p>
                <p> {data.homepage}</p>
                <p>
                  {data.phoneNumber
                    ? data.phoneNumber.replace(
                        /(\d{3})(\d{4})(\d{4})/,
                        "$1-$2-$3"
                      )
                    : "?"}
                </p>

                <p> {data.sns}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              {/* 사이트 링크 버튼 */}
              <motion.a
                href={data.homepage} //
                target="_blank" // 새 창에서 열기
                rel="noopener noreferrer" // 보안 강화
                whileTap={{ scale: 1.05 }}
                className={`flex gap-1 items-center px-2 py-1 rounded-lg bg-white text-[#774F2D] border shadow-md hover:bg-camaColor1 hover:text-white text-[${
                  fontSize - 4
                }px] font-bold font-notoB`}
              >
                <FcHome />
                사이트
              </motion.a>

              {/* 전화번호 버튼 */}
              <motion.a
                href={`tel:+82${data.phoneNumber}`} //
                whileTap={{ scale: 1.05 }}
                className={`flex gap-1 items-center px-2 py-1 rounded-lg bg-white text-[#774F2D] border shadow-md hover:bg-camaColor1 hover:text-white text-[${
                  fontSize - 4
                }px] font-bold font-notoB`}
              >
                <FcPhone />
                연락처
              </motion.a>

              {/* 이메일 버튼 */}
              <motion.a
                href={data.sns} //
                target="_blank" // 새 창에서 열기
                rel="noopener noreferrer" // 보안 강화
                whileTap={{ scale: 1.05 }}
                className={`flex gap-1 items-center px-2 py-1 rounded-lg bg-white text-[#774F2D] border shadow-md hover:bg-camaColor1 hover:text-white text-[${
                  fontSize - 4
                }px] font-bold font-notoB`}
              >
                <FcAbout />
                SNS
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
