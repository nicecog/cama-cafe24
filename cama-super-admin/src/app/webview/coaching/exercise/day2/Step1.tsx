import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

import Answer from "../../component/Layout/Answer";
import TextArea from "../../component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

// Day1
export default function StartDayStep1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  //  답 선택
  const onClick = (index: number, checked: boolean) => () => {
    onChange(
      data.map((it: any, idx: number) => ({
        ...it,
        value: idx === index ? checked : it.value,
      }))
    );
  };

  const onNextHandler = () => {
    if (data.some((item: any) => item.value === null)) {
      alert("답변을 모두 선택해 주세요");
      return;
    }
    onNext();
  };

  return (
    <>
      <MainCard type="question" coachingType="C">
        <TextBox>오늘은 현재의 운동 습관을 확인해볼게요.</TextBox>
        <TextArea className="mt-5 text-justify font-bold">
          다음 문항을 읽고 현재 당신의 모습에 <br /> 답해보세요.
        </TextArea>

        <TextArea className="mt-10">
          {data.map((item: any, idx: any) => (
            <div
              className="flex flex-col justify-between mb-5   bg-white rounded-lg shadow-md py-2"
              key={idx}
            >
              <div className="cursor-pointer w-full  pl-5">{item.label}</div>
              <div className="flex w-full gap-1 items-center justify-end pr-5">
                <Answer
                  onChange={onClick(idx, true)}
                  checked={item.value && item.value}
                  useUnique
                >
                  예
                </Answer>
                <Answer
                  className="ml-8"
                  onChange={onClick(idx, false)}
                  checked={item.value != null && !item.value}
                  useUnique
                >
                  아니요
                </Answer>
              </div>
            </div>
          ))}
        </TextArea>
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
