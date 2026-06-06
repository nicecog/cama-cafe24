import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

import TextArea from "../../component/Layout/TextArea";
import NextButton from "../../component/Layout/NextButton";
// import AnswerList from "@/app/webview/coaching/component/Layout/AnswerList";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";

const answerValues = [
  "마트까기 걸어서 간단한 장 보기",
  "음식물 쓰레기 버리고 오기",
  "편의점에 가서 간식 사오기",
  "지하철역까지 걸어갔다 오기",
  "내가 정한 운동하기 ",
];
export default function Day1Step3(props: any) {
  const { data, onSave, onPrev } = props;

  const isExtra = data.value === answerValues[answerValues.length - 1];
  // //  답 선택
  // const onChangeHandler = (value: string) => {
  //   if (data.value === value) return;

  //   onChange({
  //     ...data,
  //     value,
  //     extra: "",
  //   });
  // };
  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"10분 걷기"</MissionTitle>
        <TextBox className=" mt-10 text-justify">
          오늘은 몸을 움직여 밖으로 나가는 것을 목표로 해봐요. 모든 일은 시작이
          중요한 만큼, 하루에 조금씩이라도 신체 활동을 하는 것이 좋습니다.
        </TextBox>

        <TextArea className="text-justify mt-5 ">
          다음과 같은 활동들이 가능해요. <br />
          어떤 것을 해 볼 수 있을지 선택해 보세요! <br />
          내가 할 수 있는 운동을 스스로 정해도 <br />
          좋습니다.
        </TextArea>
        <TextArea className="my-10">
          {answerValues.map((r, idx) => (
            <p key={idx} className="font-oneMobile text-camaColor my-1  ">
              <span className="mr-2">✔</span> {r}
            </p>
          ))}

          {/* <AnswerList
            list={answerValues}
            onChange={onChangeHandler}
            value={data.value}
          >
            {isExtra && (
              <input
                type="text"
                value={data.extra}
                onChange={({ target: { value } }) => {
                  onChange({
                    ...data,
                    extra: value,
                  });
                }}
                placeholder="내가 정한 운동을 입력해주세요"
                className="border w-full text-base  p-[8px] rounded-lg border-camaBlue  my-1 px-2 focus:outline-none"
              />
            )}
          </AnswerList> */}
        </TextArea>
        <ExcerciseCompleteButton
          type={isExtra ? "type1" : "type2"}
          // condition={isExtra ? data.value && data.extra : data.value}
          onSave={onSave}
        />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
