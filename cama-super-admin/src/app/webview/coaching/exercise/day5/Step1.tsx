import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAccountName from "@/hooks/useAccountName";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAlert from "@/hooks/useAlert";

// Day5
export default function Day5Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  const onClickHandler = (type: string) => () => {
    onChange(type);
  };
  const onNextHandler = () => {
    if (data === "") {
      alert("답변을 선택해 주세요");
      return;
    }
    onNext();
  };

  const accountName = useAccountName();
  return (
    <>
      <MainCard type="question" coachingType="C">
        <TextBox className="text-justify">
          많은 분들이 신체적, 정신적 장벽 때문에 활동적인 생활을 유지하기 어려울
          수 있어요.
          <br />
          이런 방해요소들을 이해하는 것이 그것들을 효과적으로 관리하는
          첫걸음입니다.
        </TextBox>

        <TextArea className=" my-10 text-justify">
          오늘은 암 환자분들이 운동을 할 때 마주치는 흔한 방해요소들을 소개하고,
          이를 극복할 수 있는 실질적인 방법을 알려드릴게요.
        </TextArea>
        <TextArea className=" my-10  text-justify">
          {accountName}님이 운동이나 신체 활동을 하기 어려운 이유는 다음 중
          무엇인가요?
        </TextArea>
        <div className="flex justify-center items-center gap-8 sh">
          <button
            className={` rounded-full font-oneMobile text-[24px]  shadow-md w-[100px] h-[100px] 
          ${
            data === "피로감"
              ? "!bg-camaColor1 !text-white"
              : "bg-white text-camaColor1"
          }

          
          
          `}
            onClick={onClickHandler("피로감")}
          >
            피로감
          </button>
          <button
            className={`bg-white rounded-full font-oneMobile text-[24px] text-camaColor1 shadow-md w-[100px] h-[100px]
          ${
            data === "신체적 제한"
              ? "!bg-camaColor1 !text-white"
              : "bg-white text-camaColor1"
          }
          `}
            onClick={onClickHandler("신체적 제한")}
          >
            <span>
              신체적
              <br />
              제한
            </span>
          </button>
        </div>
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
