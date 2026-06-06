import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useFontSize from "@/hooks/useFontSize";
import React from "react";
import useAccountName from "@/hooks/useAccountName";
import TextArea from "../../component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

const answerList = [
  "일주일에 3일 이상 운동을 한다.",
  "하루에 30분 이상 운동을 한다.",
  "심박수를 높이는 유산소 운동(예: 걷기, 달리기, 자전거 타기)을 한다.",
  "운동을 할 때 중량운동을 포함한다.",
  "운동 전후에 스트레칭을 한다.",
  "운동 목표를 설정하고 목표를 지킨다.",
  "특별한 부상이나 통증이 없는 한 매일 운동을 조금씩이라도 한다.",
];

// Day1
export default function Day3Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  //  답 선택
  const onClick = (value: string) => () => {
    onChange(
      data.includes(value)
        ? data.filter((item: string) => item !== value)
        : data.concat(value)
    );
  };

  // 다음 선택
  const onNextHandler = () => {
    if (data.length === 0) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext("A2");
  };

  // const answers = useSelector(
  //   (s: RootState) => getState(s).exercise.answerList
  // );

  // const exAnswer = answers.filter(
  //   (r) =>
  //     r.stepDayCd === "02" && r.progressTypeCd === "A1" && r.refVal1 === "N"
  // );

  const [sm] = useFontSize([-2]);

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="C">
        <TextBox className="text-justify">
          오늘은 {accountName}님의 운동 습관 중 변화를 줄 수 있는 것을 찾아서
          도전해 보기로 해요.
        </TextBox>
        {/* {exAnswer.length > 0 && (
          <TextArea className="my-5 bg-white shadow-lg rounded-lg px-3 py-1">
            <SubTitle>예시</SubTitle>
            {exAnswer.map((r: any, idx: number) => (
              <p
                className="text-base text-camaColor tracking-tighter"
                key={idx}
              >
                {r.answerChoice.replace(/:[^:]*$/, "")}
              </p>
            ))}
          </TextArea>
        )} */}
        <TextArea className="mt-5 ">
          어제는 {accountName}님의 운동 습관을 체크해 보았어요.
        </TextArea>
        <TextArea className="mt-5 text-justify">
          아래에는 {accountName}님이 새로 도전하면 좋을 활동 리스트예요. 어떤
          것을 새롭게 해볼까요?
        </TextArea>
        <TextArea className="">
          <div className="py-4 bg-[#F7F8FA] rounded-2xl ">
            {answerList.map((i: any, idx: number) => (
              <React.Fragment key={idx}>
                <div
                  className={`text-md flex my-3 border-2 px-2.5 py-1 rounded-xl bg-white accent-camaColor1 ${
                    data.includes(i) && "border-camaColor1"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={`check_${idx}`}
                    checked={data.includes(i)}
                    id={`id_${idx}`}
                    className={`w-3.5 min-w-3.5 mr-1`}
                    onChange={onClick(i)}
                  />
                  <label
                    style={{ fontSize: sm }}
                    htmlFor={`id_${idx}`}
                    className={`ml-2 tracking-tighter ${
                      data.includes(i) ? "font-semibold text-camaColor1" : ""
                    }`}
                  >
                    {i}
                  </label>
                </div>
              </React.Fragment>
            ))}
          </div>
        </TextArea>
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
