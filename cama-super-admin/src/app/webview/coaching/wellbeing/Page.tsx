import { useRef } from "react";
import WellbeingList from "./wellbeingList";
import Filter from "./filter";
export default function WellbeingPage() {
  const divRef = useRef<HTMLDivElement>(null);
  // const navigate = useNavigate();

  // const { loginId } = useParams();

  // const { confirm } = useAlert();

  // const getSound = () => {
  //   const deleteAllList: string[] = [
  //     // "전혀그렇지않다",
  //     // "그렇지않다",
  //     // "매우그렇다",
  //     // "그렇다",
  //   ]; // 모든 항목에서 제거할 문자열 목록
  //   const deleteLastList = ["이전", "다음", "유형 알아보기", "유형 확인하기"]; // 뒤로부터 첫 번째로 등장하는 문자열 목록

  //   confirm("음성재생 하시겠습니까? ", () => {
  //     if (window?.ReactNativeWebView) {
  //       if (divRef.current) {
  //         let divText = divRef.current.textContent;

  //         if (divText) {
  //           // 마침표나 물음표를 기준으로 앞뒤에 공백을 추가하는 정규 표현식
  //           const processedText = divText.replace(/(\.|!|\?)/g, "$1 ");

  //           // 모든 항목에서 문자열 제거
  //           let modifiedText = processedText;
  //           deleteAllList.forEach((item) => {
  //             const regex = new RegExp(item, "g");
  //             modifiedText = modifiedText.replace(regex, "");
  //           });

  //           // 뒤로부터 등장하는 첫 번째 문자열 제거
  //           deleteLastList.forEach((item) => {
  //             const regex = new RegExp(`${item}(?!.*${item})`);
  //             modifiedText = modifiedText.replace(regex, "");
  //           });

  //           window.ReactNativeWebView.postMessage(
  //             JSON.stringify({ data: modifiedText, type: "TS" })
  //           );
  //         }
  //       }
  //     }
  //   });
  // };

  // //  BS : 보임 BP : 안보임
  // const stopSound = () => {
  //   confirm("음성재생을 중지 하시겠습니까?  ", () => {
  //     if (window?.ReactNativeWebView) {
  //       window?.ReactNativeWebView.postMessage(
  //         JSON.stringify({ data: "", type: "TP" })
  //       );
  //     }
  //   });
  // };

  // const dispatch = useDispatch();

  // const onPlus = () => {
  //   dispatch(actions.onPlusFont());
  // };

  // const onMinus = () => {
  //   dispatch(actions.onMinusFont());
  // };

  return (
    <>
      <div className=" h-full ">
        <div
          className={` h-full  overflow-y-auto  bg-[#F9F9F9]  flex flex-col  `}
          ref={divRef}
        >
          <div className=" pt-5  px-6">
            <h1 className="  text-[25px] text-camaColor1">웰빙자원</h1>
            <p className="font-bold text-md">건강한 삶을 위한 자원 연결</p>
          </div>
          <div className="my-4  px-3  ">
            <Filter />
          </div>
          <div className="flex-grow h-full overflow-hidden">
            <WellbeingList />
          </div>
        </div>
      </div>
    </>
  );
}
