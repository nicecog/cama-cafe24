import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { prevStepAtom } from "../CardAtom";
import ImporText from "../../component/ImportText";
import MissionTitle from "../../../component/Layout/MissionTitle";
import Radio from "../../component/Radio";
import { ChangeEvent, useState } from "react";
import MentalButton from "../../component/MentalButton";
import Inputs from "../../../component/Inputs";
import { CardType } from "../CardTypes";
import useAlert from "@/hooks/useAlert";
import useMentalType from "@/hooks/useMentalType";

export default function Step7(props: CardType) {
  const onPrev = useSetAtom(prevStepAtom);

  const { alert } = useAlert();

  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [areaExtra, setAreaExtra] = useState("");

  const type = useMentalType() as string;

  const onSave = () => {
    if (time === "" || area === "") {
      alert("답변을 선택해 주세요.");
      return;
    }
    if (area === "기타" && areaExtra === "") {
      alert("답변을 입력해 주세요 ");
      return;
    }

    // 현재 페이지 데이터
    const _currentStepData = [
      time,
      area === "기타" ? area + "-" + areaExtra : area,
    ].map((item) => ({
      progressTypeCd: "07",
      answerChoice: item,
    }));

    props.onSave(_currentStepData);
  };

  return (
    <>
      <TextBox className="mt-5 text-justify tracking-tighter">
        마음근육을 키우기 위해서는 규칙적으로 훈련하는게 좋아요. <br />
        <ImporText className="!mx-0">1주일에 2번, 10분 이상</ImporText>씩 연습해
        보아요. 카마코치와 함께 일정을 정해 볼게요.
      </TextBox>
      <TextArea className="mt-10 tracking-tighter">
        <MissionTitle className="tracking-tighter !text-camaColor1">
          1. 복식호흡을 하기에 가장 편안한 <br />
          시간을 찾아볼까요?
        </MissionTitle>
        <div className="mt-2 rounded-t-xl shadow-sm">
          {["아침(일어난 직후)", "점심", "저녁", "밤(잠들기 전)"].map(
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
      </TextArea>
      <TextArea className="mt-10 tracking-tighter">
        <MissionTitle className="tracking-tighter !text-camaColor1">
          2. 복식호흡을 하기에 가장 편안한 <br />
          장소를 찾아볼까요?
        </MissionTitle>
        <div className="mt-2 rounded-t-xl shadow-sm">
          {["방", "거실", "기타"].map((r: string, index: number) => (
            <Radio
              key={index}
              name="radio1"
              checked={area === r}
              onChange={(_) => {
                setArea(r);
              }}
            >
              {r}
            </Radio>
          ))}
        </div>
        {area === "기타" && (
          <Inputs
            className="!py-1 border-camaColor1 !text-[#555555]"
            value={areaExtra}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setAreaExtra(e.target.value);
            }}
          />
        )}
      </TextArea>

      {/* 전투형 */}
      {/* 나는 지금 잘 싸우고 있는 나를 위해 */}
      {/* 걱정형 */}
      {/* 나는 지금 나를 위해 휴식할 */}
      {/* 억압형 */}
      {/* 나는 지금 나를 위해 휴식할 */}
      {/* 순응형 */}
      {/* 나는 지금 나를 위해 휴식할 */}
      {/* 자포자기 */}
      {/* 나는 지금 무기력한 나를 위해 */}

      {time !== "" &&
        area !== "" &&
        (area !== "기타" || (area === "기타" && areaExtra !== "")) && (
          <>
            <TextArea className="mt-5 text-justify tracking-tighter">
              {
                {
                  ["전투형"]: <>나는 지금 잘 싸우고 있는 나를 위해 </>,
                  ["순응형"]: <>나는 지금 나를 위해 휴식할 </>,
                  ["억압형"]: <>나는 지금 나를 위해 휴식할 </>,
                  ["자포자기형"]: <> 나는 지금 무기력한 나를 위해 </>,
                  ["걱정형"]: <>나는 지금 나를 위해 휴식할 </>,
                }[type]
              }
              계획을 세웠어요. 몸과 마음을 충전해서 잘 대처해 나가볼게요.
            </TextArea>
            <TextBox className="mt-10 text-center font-oneMobile ">
              <span className="text-camaColor1">{time}</span>에
              <span className="text-camaColor1 ml-1.5">
                {area === "기타" ? areaExtra : area}
              </span>
              에서 <br />
              연습해 볼 거에요.
            </TextBox>
          </>
        )}
      <MentalButton onClick={onSave}>완료 </MentalButton>
      <Footer onPrev={onPrev} />
    </>
  );
}
