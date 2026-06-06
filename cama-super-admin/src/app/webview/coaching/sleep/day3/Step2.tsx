import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAccountName from "@/hooks/useAccountName";
import { useSelector } from "react-redux";
import { getState } from "../../lib/coachingSlice";
import { RootState } from "@/store/store";
import { useMemo } from "react";

import TextBox from "../../component/Layout/TextBox";
import MainCard from "../../component/Layout/MainCard";
import MissionTitle from "../../component/Layout/MissionTitle";

import Day3Pic from "./day3Pic.png";

import dayjs from "dayjs";
import ImageBox from "../../component/ImageBox";
import TextArea from "../../component/Layout/TextArea";
// 타입 정의
interface Time {
  hour: string;
  minutes: string;
}

interface StepData {
  sleep: Time;
  wakeup: Time;
}

type Step2Data = {
  totalTime: string; //총 수면
  diffTime: string; //이전 선택한 시간과 총수면 시간의 차이
};
// 수면 시간을 계산하는 함수
const calculateSleepDuration = ({ sleep, wakeup }: StepData) => {
  let sleepTime = dayjs()
    .set("hour", parseInt(sleep.hour))
    .set("minute", parseInt(sleep.minutes));
  let wakeupTime = dayjs()
    .set("hour", parseInt(wakeup.hour))
    .set("minute", parseInt(wakeup.minutes));

  // 기상 시간이 수면 시간보다 이른 경우, 다음 날 기상한 것으로 간주
  if (wakeupTime.isBefore(sleepTime)) {
    wakeupTime = wakeupTime.add(1, "day");
  }

  const duration = wakeupTime.diff(sleepTime, "minute");

  // 만약 수면 시간과 기상 시간이 00:00인 경우, 12시간으로 간주
  if (
    sleepTime.hour() === 0 &&
    sleepTime.minute() === 0 &&
    wakeupTime.hour() === 0 &&
    wakeupTime.minute() === 0
  ) {
    return { hours: 12, minutes: 0 }; // 12시간
  }

  return { hours: Math.floor(duration / 60), minutes: duration % 60 };
};

// 수면 시간을 계산하고 문장을 출력하는 함수
const calculateSleepDurationAndOutput = (
  { sleep, wakeup }: StepData,
  previousSleepHour: number
) => {
  const calculatedSleepTime = calculateSleepDuration({ sleep, wakeup });

  // 이전에 자겠다고 했던 값과 수면 시간의 차이를 계산
  const previousSleepMinutes = previousSleepHour * 60;
  const currentSleepMinutes =
    calculatedSleepTime.hours * 60 + calculatedSleepTime.minutes;
  const differenceInMinutes = currentSleepMinutes - previousSleepMinutes;

  const differenceInHours = Math.floor(Math.abs(differenceInMinutes) / 60);
  const remainingMinutes = Math.abs(differenceInMinutes) % 60;

  const statement = (
    <>
      이전보다 약
      <span className="font-bold underline mx-1 text-camaColor1">
        {differenceInHours > 0 && `${differenceInHours}시간`}
        {differenceInHours > 0 && remainingMinutes > 0 && " "}
        {remainingMinutes > 0 && `${remainingMinutes}분`}
      </span>
      <span className={`font-bold underline text-camaColor mx-1`}>
        {differenceInMinutes > 0 ? "더 많이" : "더 적게"}
      </span>
      수면을 취하는 것으로 계획을 세웠네요.
    </>
  );

  return {
    sleepDuration: calculatedSleepTime,
    statement,
    differenceInHours,
    remainingMinutes,
    differenceInMinutes,
  };
};

export default function Day3Step2(props: {
  data: StepData;
  step2Data: Step2Data;
  onNext: () => void;
  onPrev: () => void;
  onChange: (e: Step2Data) => void;
}) {
  // Props
  const { data, onNext, onChange, onPrev } = props;
  // 사용자 명
  const accountName = useAccountName();

  //  사용자 답변 목록
  const answerList = useSelector(
    (s: RootState) => getState(s).sleep.answerList
  );
  const result = answerList.find(
    (i) => i.stepDayCd === "02" && i.progressTypeCd === "A3"
  );

  // 지난번 선택한 답
  const selectedTime = useMemo(() => {
    const numbers = result.answerChoice.match(/\d+/g).map(Number);
    return result ? Math.max(...numbers) : 0;
  }, [answerList]);

  // 시간 계산
  const { sleepDuration, statement, differenceInHours, remainingMinutes } =
    calculateSleepDurationAndOutput(data, selectedTime);

  // OnNext Handler
  const onNextHandler = () => {
    onChange({
      totalTime:
        String(sleepDuration.hours).padStart(2, "0") +
        ":" +
        String(sleepDuration.minutes).padStart(2, "0"),
      diffTime:
        String(differenceInHours).padStart(2, "0") +
        ":" +
        String(remainingMinutes).padStart(2, "0"),
    });
    onNext();
  };

  return (
    <>
      <MainCard coachingType="A" type="infomation">
        <TextBox>
          <ImageBox imgSrc={Day3Pic} containerClassName="!mb-0" />
          <MissionTitle>
            {accountName}님이 정한 <br />
            취침시간은
            <span className="text-camaColor ml-2">
              {`${data.sleep.hour} : ${data.sleep.minutes}`}
            </span>
            <br />
            기상시간은
            <span className="text-camaColor ml-2">
              {`${data.wakeup.hour} : ${data.wakeup.minutes}`}
            </span>
            <br />
            <span className="text-camaColor ml-2">
              {sleepDuration.hours > 0 && `${sleepDuration.hours}시간 `}
              {sleepDuration.minutes > 0 && `${sleepDuration.minutes}분 `}
            </span>
            {sleepDuration.hours > 0 || sleepDuration.minutes > 0 ? (
              <>
                만큼의
                <br />
                수면을 취할 수 있어요
              </>
            ) : (
              "수면 시간이 없습니다."
            )}
          </MissionTitle>
        </TextBox>

        <TextArea className="mt-10">{statement}</TextArea>
      </MainCard>

      <NextButton onNext={onNextHandler} onPrev={onPrev} />
    </>
  );
}
