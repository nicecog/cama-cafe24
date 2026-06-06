import { MouseEvent, useRef } from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";
import { GrDocumentSound } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { MdFormatSize } from "react-icons/md";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";

import { actions } from "@/app/webview/coaching/lib/coachingSlice";
import useAlert from "@/hooks/useAlert";
export default function StepLayout(props: any) {
  const { currentStep, title, maxDay, onCalendarClick } = props;

  const navigate = useNavigate();

  const { loginId } = useParams();

  const { confirm } = useAlert();

  const onBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    confirm("건강코칭 화면으로 돌아가시겠습니까? ", () => {
      navigate(`../${loginId}`, { state: { reload: true } });
    });
  };

  const divRef = useRef<HTMLDivElement>(null);

  const getSound = () => {
    const deleteAllList: string[] = [
      // "전혀그렇지않다",
      // "그렇지않다",
      // "매우그렇다",
      // "그렇다",
    ]; // 모든 항목에서 제거할 문자열 목록
    const deleteLastList = ["이전", "다음", "유형 알아보기", "유형 확인하기"]; // 뒤로부터 첫 번째로 등장하는 문자열 목록

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

  // const getSound = () => {
  //   if (confirm("음성재생 하시겠습니까? ")) {
  //     console.log(divRef?.current?.textContent);
  //     if (window?.ReactNativeWebView) {
  //       if (divRef.current) {
  //         const divText = divRef.current.textContent;

  //         // 마침표나 물음표를 기준으로 앞뒤에 공백을 추가하는 정규 표현식
  //         const processedText = divText?.replace(/(\.|!|\?)/g, "$1 ");

  //         if (processedText) {
  //           window?.ReactNativeWebView.postMessage(
  //             JSON.stringify({ data: processedText, type: "TS" })
  //           );
  //         }
  //       }
  //     }
  //   }
  // };

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

  const dispatch = useDispatch();

  const onPlus = () => {
    dispatch(actions.onPlusFont());
  };

  const onMinus = () => {
    dispatch(actions.onMinusFont());
  };

  return (
    <>
      <div className="scrollbar h-dvh">
        <div className="fixed top-0 w-full bg-white z-10">
          <div className="bg-white h-[50px] flex justify-center items-center px-3 border-b">
            <button onClick={onBack} className="absolute top-3.5 left-2 ">
              <MdClose className="text-[#BBBBBB] font-extrabold text-[23px]" />
            </button>
            <span className="text-base font-medium text-text">{title}</span>

            <div className="absolute top-3.5 right-4 flex items-center justify-center gap-3">
              {onCalendarClick && (
                <button onClick={onCalendarClick} className="">
                  <MdOutlineCalendarMonth className="text-text font-extrabold text-[21px]" />
                </button>
              )}
              <button onClick={getSound} className=" ">
                <GrDocumentSound className="text-text font-extrabold text-[20px]" />
              </button>
              <button onClick={stopSound} className=" ">
                <FaRegStopCircle className="text-text font-extrabold text-[20px]" />
              </button>
            </div>
          </div>
          {/* Day Check */}{" "}
          {title !== "운동" && (
            <div className="h-[40px] shadow-md flex justify-between items-center px-[20px]">
              <div className="text-sm">
                {currentStep && (
                  <>
                    전체 {maxDay}일 중
                    <span className="text-camaColorLight font-bold ml-1">
                      {currentStep === "00" ? "시작" : `${+currentStep} 일차`}
                    </span>
                  </>
                )}
              </div>

              <div className="flex justify-center items-center gap-2 text-camaColor font-bold">
                <MdFormatSize className="text-[18px] font-notoR" />
                <button
                  className="flex justify-center items-center "
                  onClick={onMinus}
                >
                  <span className="text-[14px]">작게</span>
                  <AiOutlineMinusCircle className="text-[18px] ml-1" />
                </button>
                <button
                  className="flex justify-center items-center ml-1 "
                  onClick={onPlus}
                >
                  <span className="text-[14px]">크게</span>
                  <AiOutlinePlusCircle className="text-[18px] ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="block bg-[#F9F9F9] h-full" ref={divRef}>
          {props.children}
        </div>
      </div>
    </>
  );
}
