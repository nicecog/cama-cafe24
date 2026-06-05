export interface Day3TimeData {
  hour: string;
  minutes: string;
}

export interface Day3Step1Data {
  sleep: Day3TimeData;
  wakeup: Day3TimeData;
}

export interface Day3Step2Data {
  totalTime: string;
  diffTime: string;
}

export const formatTimeString = (timeString: string) => {
  return timeString
    .split(":")
    .map((part) => part.padStart(2, "0"))
    .join("");
};

export const calculateSleepDuration = ({ sleep, wakeup }: Day3Step1Data) => {
  const sleepMinutes =
    Number.parseInt(sleep.hour, 10) * 60 + Number.parseInt(sleep.minutes, 10);
  const wakeupMinutes =
    Number.parseInt(wakeup.hour, 10) * 60 + Number.parseInt(wakeup.minutes, 10);

  if (sleepMinutes === 0 && wakeupMinutes === 0) {
    return { hours: 12, minutes: 0 };
  }

  let duration = wakeupMinutes - sleepMinutes;

  if (duration < 0) {
    duration += 24 * 60;
  }

  return {
    hours: Math.floor(duration / 60),
    minutes: duration % 60,
  };
};

export const calculateSleepDurationAndOutput = (
  data: Day3Step1Data,
  previousSleepHour: number,
) => {
  const calculatedSleepTime = calculateSleepDuration(data);
  const previousSleepMinutes = previousSleepHour * 60;
  const currentSleepMinutes =
    calculatedSleepTime.hours * 60 + calculatedSleepTime.minutes;
  const differenceInMinutes = currentSleepMinutes - previousSleepMinutes;

  const differenceInHours = Math.floor(Math.abs(differenceInMinutes) / 60);
  const remainingMinutes = Math.abs(differenceInMinutes) % 60;

  return {
    sleepDuration: calculatedSleepTime,
    statement: (
      <>
        이전보다 약
        <span className="mx-1 font-bold underline text-camaColor1">
          {differenceInHours > 0 && `${differenceInHours}시간`}
          {differenceInHours > 0 && remainingMinutes > 0 && " "}
          {remainingMinutes > 0 && `${remainingMinutes}분`}
        </span>
        <span className="mx-1 font-bold underline text-camaColor">
          {differenceInMinutes > 0 ? "더 많이" : "더 적게"}
        </span>
        수면을 취하는 것으로 계획을 세웠네요.
      </>
    ),
    differenceInHours,
    remainingMinutes,
    differenceInMinutes,
  };
};
