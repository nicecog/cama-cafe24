import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import { FcInfo } from "react-icons/fc";
import TextArea from "../../component/Layout/TextArea";

import Day16 from "./day16.png";
import ImageBox from "../../component/ImageBox";
import CheckAnswer from "./CheckAnswer";
import useAlert from "@/hooks/useAlert";

export default function Day16Step2(props: any) {
  // Props;
  const { data, onChange, onNext, onPrev } = props;
  const { alert } = useAlert();

  //  답 선택
  const onClick = (index: number, checked: boolean) => {
    onChange((prevArr: any) =>
      prevArr.map((item: any, idx: number) => (idx === index ? checked : item))
    );
  };

  const onNextHandler = () => {
    if (data.some((r: any) => r === null)) {
      alert("답변을 모두 선택해 주세요.");
      return;
    }

    onNext();
  };

  return (
    <>
      <MainCard type="infomation">
        <TextBox className="mt-5 text-justify">
          <ImageBox imgSrc={Day16} />
          조금 더 구체적으로 어떤 변화가 있었는지 살펴보기로 해요
        </TextBox>
        <TextArea className="mt-10 text-justify ">
          {/* 1번 */}
          <div className="border shadow-md px-4 py-3 rounded-md">
            <div className="text-gray-800  mb-2">
              프로그램을 시작하기 전과 비교해, 피로감이 줄었나요?
            </div>
            <CheckAnswer value={data[0]} onChange={onClick} index={0} />
            <div className="mt-2 p-3 text-sm leading-[18px] text-gray-600 rounded-md border border-gray-300 bg-gray-100">
              <FcInfo className="inline mr-1.5 -mt-1" />
              피로감이 줄었다면, 운동이 신체적, 정신적 건강에 긍정적인 작용을
              했다는 것을 의미해요.
            </div>
          </div>
          {/* 2번 */}
          <div className="border shadow-md px-4 py-3 rounded-md mt-4">
            <div className="text-gray-800  mb-2">
              일주일에 3일 이상 운동을 하게 되었나요?
            </div>
            <CheckAnswer value={data[1]} onChange={onClick} index={1} />
            <div className="mt-2 p-3 text-sm leading-[18px] text-gray-600 rounded-md border border-gray-300 bg-gray-100">
              <FcInfo className="inline mr-1.5 -mt-1" />
              일주일에 3일 이상 운동을 했다면, 꾸준한 운동의 중요성을 인식하고
              실천하고 있는 거예요.
            </div>
          </div>
          {/* 3번 */}
          <div className="border shadow-md px-4 py-3 rounded-md mt-4">
            <div className="text-gray-800  mb-2">
              운동을 하면서 기분이 좋아지거나 스트레스가 줄었나요?
            </div>
            <CheckAnswer value={data[2]} onChange={onClick} index={2} />
            <div className="mt-2 p-3 text-sm leading-[18px] text-gray-600 rounded-md border border-gray-300 bg-gray-100">
              <FcInfo className="inline mr-1.5 -mt-1" />
              기분 개선이나 스트레스 감소는 운동이 정신적 건강에 좋은 영향을
              미쳤다는 중요한 지표예요.
            </div>
          </div>
          {/* 4번 */}
          <div className="border shadow-md px-4 py-3 rounded-md mt-4">
            <div className="text-gray-800  mb-2">
              운동을 통해 체중 관리가 쉬워졌다고 느꼈나요?
            </div>
            <CheckAnswer value={data[3]} onChange={onClick} index={3} />
            <div className="mt-2 p-3 text-sm leading-[18px] text-gray-600 rounded-md border border-gray-300 bg-gray-100">
              <FcInfo className="inline mr-1.5 -mt-1" />
              체중 관리에 도움이 되었다면, 이는 장기적으로 건강한 생활을
              유지하는 데 중요한 역할을 할 거예요.
            </div>
          </div>
          {/* 5번 */}
          <div className="border shadow-md px-4 py-3 rounded-md mt-4">
            <div className="text-gray-800  mb-2">
              운동을 할 때 통증이나 불편함이 감소했나요?
            </div>
            <CheckAnswer value={data[4]} onChange={onClick} index={4} />
            <div className="mt-2 p-3 text-sm leading-[18px] text-gray-600 rounded-md border border-gray-300 bg-gray-100">
              <FcInfo className="inline mr-1.5 -mt-1" />
              통증이나 불편함이 감소했다면, 운동이 물리적 건강에도 긍정적으로
              작용하고 있다는 것을 의미해요.
            </div>
          </div>
          {/* 6번 */}
          <div className="border shadow-md px-4 py-3 rounded-md mt-4">
            <div className="text-gray-800  mb-2">
              일상 활동을 수행하는 데 있어 더 쉽게 느껴졌나요?
            </div>
            <CheckAnswer value={data[5]} onChange={onClick} index={5} />
            <div className="mt-2 p-3 text-sm leading-[18px] text-gray-600 rounded-md border border-gray-300 bg-gray-100">
              <FcInfo className="inline mr-1.5 -mt-1" />
              일상생활이 수월해졌다면, 이는 전반적인 삶의 질을 향상 시킬 수
              있어요.
            </div>
          </div>
        </TextArea>

        <TextArea className="mt-5 text-camaBlue text-justify">
          16일 동안의 운동 프로그램을 완료한 것을 축하드려요!
        </TextArea>

        <TextArea className="mt-5 text-camaBlue text-justify">
          건강은 단기간에 이루어지는 것이 아니기에 지금까지의 노력을 지속적으로
          이어가시길 바래요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNextHandler} onPrev={onPrev} />
    </>
  );
}
