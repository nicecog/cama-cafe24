import { differenceInDays } from "date-fns";
import { useAtom } from "jotai";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Each } from "@/components/common/Each";
import { Button } from "@/components/ui/Button";
import { CardContent } from "@/components/ui/Card";
import type { CarouselApi } from "@/components/ui/Carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/Carousel";
import {
  useCareTrackAppliedInfo,
  useCheckDoneCareTrack,
} from "@/hooks/queries";
import { selectedDayAtom } from "../../-atoms/homeAtom";

export default function DailyCarousel() {
  // Data
  const { data } = useCareTrackAppliedInfo();

  const { data: careTrackInfo } = useCareTrackAppliedInfo();

  // 선택된 일차
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom);

  // 현재 일차 계산 (trackCreatedAt 기준)
  const currentDay = useMemo(() => {
    if (!data?.trackCreatedAt) return null;

    const startDate = new Date(data.trackCreatedAt);
    const today = new Date();

    // 날짜 차이 계산 (당일을 1일차로 치기 때문에 +1)
    const daysDiff = differenceInDays(today, startDate);
    return daysDiff + 1;
  }, [data?.trackCreatedAt]);

  //  케어트랙 완료정보 (현재 일차까지의 모든 progress 데이터 조회)
  const { data: doneData } = useCheckDoneCareTrack(
    {
      diseaseSeq: String(careTrackInfo?.diseaseSeq),
      day: String(data?.days),
    },
    !!data?.days, // currentDay가 있을 때만 활성화
  );

  // 일차별 progress 맵 생성 (빠른 조회를 위해)
  const progressMap = useMemo(() => {
    if (!doneData?.response) return new Map<number, number>();
    return new Map(doneData.response.map((item) => [item.day, item.progress]));
  }, [doneData]);

  // Carousel API
  const [api, setApi] = useState<CarouselApi>();

  // 초기 로드 시 오늘 일차 자동 선택 및 스크롤
  useEffect(() => {
    if (currentDay && !selectedDay) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, selectedDay, setSelectedDay]);

  // 오늘 일차가 화면 중앙에 오도록 스크롤
  useEffect(() => {
    if (!api || !currentDay) return;

    // 약간의 지연을 주어 레이아웃이 정착된 후 중앙으로 스크롤
    const timer = setTimeout(() => {
      api.scrollTo(currentDay - 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [api, currentDay]);

  // 일차 클릭 핸들러
  const handleDayClick = (dayNumber: number) => {
    setSelectedDay(dayNumber);
  };

  // 오늘 날짜로 이동 및 선택 핸들러
  const handleGoToToday = () => {
    if (currentDay && api) {
      api.scrollTo(currentDay - 1);
      setSelectedDay(currentDay);
    }
  };

  return (
    <div className="bg-transparent w-full -mt-12 py-4 overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          dragFree: true,
          containScroll: "trimSnaps",
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="-ml-1 px-4 py-2">
          <Each
            of={Array.from({ length: data ? +data.days : 0 }, (_, i) => i)}
            render={(_, index) => {
              const dayNumber = index + 1;
              const isToday = currentDay === dayNumber;
              const isSelected = selectedDay === dayNumber;
              const progress = progressMap.get(dayNumber) ?? 0;
              const isCompleted = progress === 100;

              return (
                <CarouselItem className="pl-2 basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8 select-none">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="relative py-1"
                  >
                    <CardContent
                      className={`aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-300 relative border-2 ${
                        isSelected
                          ? "border-secondary bg-white scale-110 z-20 shadow-md"
                          : isCompleted
                            ? "border-green-200 bg-white"
                            : "border-gray-200 bg-white hover:border-primary/20"
                      }`}
                      onClick={() => handleDayClick(dayNumber)}
                    >
                      {/* 진행률 링 (진행 중일 때만) */}
                      {progress > 0 && !isCompleted && (
                        <div className="absolute inset-0 p-1">
                          <svg
                            className="w-full h-full -rotate-90 select-none"
                            viewBox="0 0 100 100"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="46"
                              fill="none"
                              stroke={
                                isSelected
                                  ? "rgba(var(--secondary), 0.1)"
                                  : "rgba(0,0,0,0.03)"
                              }
                              strokeWidth="4"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="46"
                              fill="none"
                              stroke={isSelected ? "#00B4D8" : "#0066CC"}
                              strokeWidth="6"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: progress / 100 }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </svg>
                        </div>
                      )}

                      {/* 완료 체크 오버레이 */}
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex-center bg-green-500/10 rounded-2xl"
                        >
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full flex-center shadow-sm">
                            <Check
                              className="w-2.5 h-2.5 text-white"
                              strokeWidth={4}
                            />
                          </div>
                        </motion.div>
                      )}

                      <div className="flex flex-col items-center justify-center">
                        {/* 중앙 일차 숫자 (가장 크게 강조) */}
                        <div className="flex-center z-10">
                          <span
                            className={`text-base-fixed font-jalnan tracking-tight transition-all duration-300 ${
                              isSelected
                                ? "text-secondary scale-110"
                                : isCompleted
                                  ? "text-green-600"
                                  : "text-gray-900"
                            }`}
                          >
                            {dayNumber}
                          </span>
                        </div>

                        {/* 하단 일차 텍스트 (작게 고정) */}

                        <span
                          className={`text-[12px] font-black transition-all duration-300 px-1 rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                            isToday
                              ? isSelected
                                ? "bg-secondary/10 text-secondary shadow-sm px-1.5 py-0.5"
                                : "bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5"
                              : isSelected
                                ? "text-secondary opacity-80"
                                : "text-gray-950 opacity-80 font-bold"
                          }`}
                        >
                          {isToday ? "오늘" : "일차"}
                        </span>
                      </div>
                    </CardContent>
                  </motion.div>
                </CarouselItem>
              );
            }}
          />
        </CarouselContent>
      </Carousel>

      {/* 오늘보기 버튼 */}
      {currentDay && (
        <div className="flex justify-end px-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoToToday}
            className="text-[11px] h-7 px-3 rounded-full bg-primary/5 hover:bg-primary/10 text-primary font-bold gap-1 transition-all active:scale-95"
          >
            오늘보기
            <motion.span
              animate={{ x: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </Button>
        </div>
      )}
    </div>
  );
}
