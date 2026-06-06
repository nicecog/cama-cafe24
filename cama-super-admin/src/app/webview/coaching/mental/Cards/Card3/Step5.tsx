import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { prevStepAtom } from "../CardAtom";
import Bubble from "../../component/Bubble";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";
import { ChangeEvent, useState } from "react";
import MissionTitle from "../../../component/Layout/MissionTitle";
import Radio from "../../component/Radio";
import Inputs from "../../../component/Inputs";
import useAccountName from "@/hooks/useAccountName";
import MentalButton from "../../component/MentalButton";
import useAlert from "@/hooks/useAlert";
import { AnswersType } from "../CardTypes";
import useMentalType from "@/hooks/useMentalType";

export default function Step5(props: {
  onSave: (data: AnswersType[]) => void;
}) {
  const onPrev = useSetAtom(prevStepAtom);

  const [video, setVideo] = useState("");
  const [time, setTime] = useState("");
  const [timeExtra, setTimeExtra] = useState("");

  const accountName = useAccountName();

  // Alert
  const { alert } = useAlert();

  const type = useMentalType();

  // 등록
  const onSave = () => {
    if (video === "" || time === "") {
      alert("답변을 선택해 주세요.");
      return;
    }
    if (time === "기타" && timeExtra === "") {
      alert("답변을 입력해 주세요 ");
      return;
    }

    props.onSave([
      {
        progressTypeCd: "07",
        answerChoice: time === "기타" ? timeExtra : time,
      },
      {
        progressTypeCd: "07",
        answerChoice: video,
      },
    ]);
  };

  return (
    <>
      <Bubble className="mt-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>
      <TextBox className="mt-5">
        <ImporText className="!mx-0"> 어떠셨나요?</ImporText>
        <br />잘 하지 않아도 괜찮아요. <br />
        자꾸 집중력을 잃게 될 때, 나를 탓하거나 포기하지 말고 그저 다시 주의를
        가져오세요. 그러면 된답니다.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        꾸준히 연습하면 삶이 더욱 생생하고 안정될거에요. <br />
        <br />
        그때까지 카마코치가 곁에서 함께할게요!
      </TextArea>

      <TextArea className="mt-5 text-justify">
        함께 훈련 일정을 정해볼까요?
      </TextArea>

      <TextBox className="mt-5 tracking-tighter">
        <MissionTitle className="tracking-tighter !text-camaColor">
          1. 어떤 명상을 연습해보고 <br />
          싶으신가요?
        </MissionTitle>
        <div className="mt-2">
          {["호흡명상", "바디스캔명상", "자비명상"].map(
            (r: string, index: number) => (
              <Radio
                key={index}
                name="radio1"
                checked={video === r}
                onChange={(_) => {
                  setVideo(r);
                }}
              >
                {r}
              </Radio>
            )
          )}
        </div>
      </TextBox>
      <TextBox className="mt-8 tracking-tighter">
        <MissionTitle className="tracking-tighter !text-camaColor">
          2. 언제 연습하는 것이 좋을까요?
        </MissionTitle>
        <div className="mt-2">
          {["아침(일어난 직후)", "점심", "저녁", "밤(잠들기 전)", "기타"].map(
            (r: string, index: number) => (
              <Radio
                key={index}
                name="radio1"
                checked={time === r}
                onChange={(_) => {
                  setTime(r);
                }}
              >
                {r}
              </Radio>
            )
          )}
        </div>
        {time === "기타" && (
          <Inputs
            className="!py-1 border-camaColor1 !text-[#555555]"
            value={timeExtra}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTimeExtra(e.target.value);
            }}
          />
        )}
      </TextBox>

      {video !== "" &&
        time !== "" &&
        (time !== "기타" || (time === "기타" && timeExtra !== "")) && (
          <>
            <TextBox className="mt-5">
              나는 안정적이고 생생하게 살아가기 위해{" "}
              <ImporText className="!mx-0">{video}</ImporText>을{" "}
              <ImporText className="!mx-0">
                {time === "기타" ? timeExtra : time}
              </ImporText>
              에 연습해 볼 거에요.
            </TextBox>
            <TextArea className="mt-2 text-center">
              {type === "전투형" ? (
                <>
                  잘 싸워내고 있는{" "}
                  <ImporText className="!mx-0">{accountName}님</ImporText>,
                </>
              ) : (
                <>
                  용기내어 마주할{" "}
                  <ImporText className="!mx-0">{accountName}님</ImporText>의 삶,
                </>
              )}
              <br />
              언제나 응원할게요!
            </TextArea>
          </>
        )}

      <MentalButton onClick={onSave}>완료 </MentalButton>
      <Footer onPrev={onPrev} />
    </>
  );
}
