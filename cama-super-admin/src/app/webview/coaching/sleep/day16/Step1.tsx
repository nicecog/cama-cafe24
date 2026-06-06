import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getNumberInnerText } from "../../lib/coachingUtils";
import AnswerList from "../../component/Layout/AnswerList";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "../../component/Layout/MissionTitle";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";
import useAlert from "@/hooks/useAlert";

// Day16
export default function Day16Step1(props: any) {
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();
  // 다음 선택
  const onNextHandler = () => {
    if (!data.answer) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext("A2");
  };
  const answerList = useSelector(
    (s: RootState) => s.COACHING.coaching.sleep.answerList
  );

  const time = answerList
    .filter((t) => t.answerChoice.includes("수면 시간"))
    .map((i) => getNumberInnerText(i.answerChoice))
    .reduce((acc, curr, _, { length }) => acc + curr / length, 0)
    .toFixed(1);

  const rating = answerList
    .filter((t) => t.answerChoice.includes("수면점수"))
    .map((i) => getNumberInnerText(i.answerChoice))
    .reduce((acc, curr, _, { length }) => acc + curr / length, 0)
    .toFixed(1);

  // TODO 8일차는 시간ㅇ과 점수를 선택하지 않아요

  const onClick = (answer: string) => {
    onChange({
      time: time,
      rating: rating,
      answer,
    });
  };

  const aList = [
    "습관 개선을 위해 최선을 다 했고,  수면 시간도 많이 늘었다.",
    "습관 개선을 위해 노력했지만,  생각만큼 수면 시간이 늘지 않았다.",
    "충분히 노력하지 못 한 것 같다.",
    "잘 모르겠다.",
  ];

  return (
    <>
      <MainCard type="question" coachingType="A">
        <MissionTitle>
          지금까지 매일 성실하게 도전에 <br />
          참여하느라 수고가 많았습니다!
        </MissionTitle>
        <TextArea className="mt-4">그동안의 수면을 점검해 보겠습니다.</TextArea>

        <TextBox className="mt-4   text-camaColor font-bold">
          <p className="my-2">
            미션에 참여한 기간 동안의 평균 수면 시간은
            <span className="font-bold text-lg text-green-600 ml-2 underline mr-1">
              {time}
            </span>
            시간이었으며, 평균 수면의 질은
            <span className="font-bold text-lg text-yellow-600 ml-2 underline mr-1">
              {rating}
            </span>
            점 이었어요.
          </p>
        </TextBox>
        <TextArea className="mt-5 ">
          지난 2주간 좋은 수면 습관을 만들기위해 노력해 본 결과는 어땠나요?
        </TextArea>
        <TextArea className="mt-10 mb-2 font-bold">
          스스로의 실천에 대해서 평가해 보세요.
        </TextArea>

        <AnswerList list={aList} value={data.answer} onChange={onClick} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
