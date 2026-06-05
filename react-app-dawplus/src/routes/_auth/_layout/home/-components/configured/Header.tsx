import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { useMemo } from "react";
import EffectImage from "@/components/home/EffectImage";
import MotionProgress from "@/components/ui/Progress/MotionProgress";
import { useCareTrackAppliedInfo } from "@/hooks/queries";
import { usePageTranslation } from "@/hooks/usePageTranslation";

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  //  PT
  const { pt } = usePageTranslation();

  // Data
  const { data } = useCareTrackAppliedInfo();

  // 현재 일차 계산
  const currentDay = useMemo(() => {
    if (!data?.trackCreatedAt) return 1;

    // "2026-01-18 18:31:16" 형식을 ISO 형식으로 변환 후 파싱
    const createdDate = startOfDay(
      parseISO(data.trackCreatedAt.replace(" ", "T")),
    );
    const today = startOfDay(new Date());

    // 날짜 차이 계산 (1일차부터 시작)
    return differenceInDays(today, createdDate) + 1;
  }, [data?.trackCreatedAt]);

  // 남은 일수 계산
  const remainingDays = useMemo(() => {
    if (!data?.days) return 0;
    return Math.max(0, data.days - currentDay);
  }, [data?.days, currentDay]);

  return (
    <div className="bg-primary pt-16 rounded-b-2xl pb-10 px-5">
      <div className="text-white">
        <div className="flex flex-col gap-1 text-2xl font-jalnan ">
          <h1>
            {pt("MSG_01")}, {`${userName}${pt("MSG_02")}`}
          </h1>
          <p className="text-xl ">
            {pt("MSG_03")}{" "}
            <span className="text-secondary font-bold underline">
              {currentDay}
              {pt("MSG_04")}
            </span>{" "}
            {pt("MSG_05")}
          </p>
        </div>

        <div className="flex justify-end items-baseline -mb-1 ">
          <EffectImage />
        </div>
        <div className="border-2 p-4 bg-white rounded-2xl border-primary-text">
          <MotionProgress
            value={currentDay}
            max={data?.days}
            className="text-white"
            suffix={pt("MSG_04")}
          />
        </div>
        <p className="text-right mt-8 font-semibold">
          {pt("MSG_06")} D-{remainingDays}
        </p>
      </div>
    </div>
  );
}
