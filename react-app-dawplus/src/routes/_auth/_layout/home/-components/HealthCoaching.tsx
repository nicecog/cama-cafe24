import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type1 from "@/assets/images/coaching/main/type1.png";
import type2 from "@/assets/images/coaching/main/type2.png";
import type3 from "@/assets/images/coaching/main/type3.png";
import type4 from "@/assets/images/coaching/main/type4.png";
import type5 from "@/assets/images/coaching/main/type5.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Card } from "@/components/ui/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/Carousel";
import { useCoachingProgressList } from "@/hooks/queries";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { cn } from "@/lib/utils";

const coachingData = [
  {
    id: 1,
    categoryCd: "A", // 수면
    titleKey: "MSG_19",
    descriptionKey: "MSG_20",
    image: type1,
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    id: 2,
    categoryCd: "B", // 식습관
    titleKey: "MSG_21",
    descriptionKey: "MSG_22",
    image: type2,
    color: "from-green-500/20 to-green-600/10",
  },
  {
    id: 3,
    categoryCd: "C", // 신체활동
    titleKey: "MSG_23",
    descriptionKey: "MSG_24",
    image: type3,
    color: "from-orange-500/20 to-orange-600/10",
  },
  {
    id: 4,
    categoryCd: "D", // 심리
    titleKey: "MSG_25",
    descriptionKey: "MSG_26",
    image: type4,
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    id: 5,
    categoryCd: "E", // 운동하기
    titleKey: "MSG_27",
    descriptionKey: "MSG_28",
    image: type5,
    color: "from-red-500/20 to-red-600/10",
  },
];

//  헬스코칭 데이터 출력 Component
export default function HealthCoaching() {
  // Translation
  const { pt } = usePageTranslation();

  const accountMe = useAtomValue(accountMeAtom);

  const navigate = useNavigate();

  // API에서 진도율 데이터 가져오기
  const { data: progressList } = useCoachingProgressList(
    accountMe.data?.loginId,
  );

  // API 데이터와 UI 데이터 병합
  const mergedData = coachingData.map((coaching) => {
    const apiData = progressList?.find(
      (p) => p.categoryCd === coaching.categoryCd,
    );
    return {
      ...coaching,
      progress: apiData?.progress ?? 0,
    };
  });

  return (
    <div className=" px-5 mb-6">
      <h2 className="text-lg font-bold mb-3">{pt("MSG_17")}</h2>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {mergedData.map((coaching) => (
            <CarouselItem
              key={coaching.id}
              className="pl-2 md:pl-4 basis-[70%]"
            >
              <Card
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-300",
                  "bg-white",
                  "border border-primary ",
                )}
                onClick={() => navigate({ to: "/home" })}
              >
                {/* 배경 그라데이션 */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-5",
                    coaching.color,
                  )}
                />

                <div className="relative p-4">
                  {/* 상단: 이미지 + 타이틀/설명 */}
                  <div className="flex gap-3 mb-3">
                    {/* 좌측 이미지 */}
                    <div className="flex-shrink-0 w-14 h-14">
                      <img
                        src={coaching.image}
                        alt={pt(coaching.titleKey)}
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </div>

                    {/* 우측 텍스트 - 고정 높이로 통일 */}
                    <div className="flex-1 min-w-0 h-14 flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">
                        {pt(coaching.titleKey)}
                      </h3>
                      <p className="text-[11px] text-gray-600 leading-[1.3] line-clamp-3 flex-1">
                        {pt(coaching.descriptionKey)}
                      </p>
                    </div>
                  </div>

                  {/* 하단: 프로그레스 바 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {pt("MSG_30")}
                      </span>
                      <span className="text-lg font-black text-primary">
                        {coaching.progress}%
                      </span>
                    </div>
                    <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                        style={{
                          width: `${coaching.progress}%`,
                        }}
                      >
                        {/* 반짝이는 효과 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
