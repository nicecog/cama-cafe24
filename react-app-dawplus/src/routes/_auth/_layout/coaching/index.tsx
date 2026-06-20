import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import CoachingCharacter from "@/assets/images/character/char2.png";
import type1 from "@/assets/images/coaching/main/type1.png";
import type2 from "@/assets/images/coaching/main/type2.png";
import type3 from "@/assets/images/coaching/main/type3.png";
import type4 from "@/assets/images/coaching/main/type4.png";
import type5 from "@/assets/images/coaching/main/type5.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { Each } from "@/components/common/Each";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCoachingProgressList } from "@/hooks/queries";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingCard } from "./-components/CoachingCard";
import { CoachingHeaderProgress } from "./-components/CoachingHeaderProgress";

export const Route = createFileRoute("/_auth/_layout/coaching/")({
  component: RouteComponent,
});

const coachingData = [
  {
    id: 1,
    categoryCd: "A", // 수면
    titleKey: "MSG_19",
    descriptionKey: "MSG_20",
    screenId: "/coaching/sleep",
    image: type1,
    primaryColor: "rgb(139, 92, 246)", // violet-500
    bgGradient: "from-violet-100 to-violet-50",
  },
  {
    id: 2,
    categoryCd: "B", // 식습관
    titleKey: "MSG_21",
    descriptionKey: "MSG_22",
    screenId: "/coaching/meal",
    image: type2,
    primaryColor: "rgb(251, 146, 60)", // orange-400
    bgGradient: "from-orange-100 to-orange-50",
  },
  {
    id: 3,
    categoryCd: "C", // 신체활동
    titleKey: "MSG_23",
    descriptionKey: "MSG_24",
    screenId: "/coaching/physical", // Placeholder
    image: type4,
    primaryColor: "rgb(52, 211, 153)", // emerald-400
    bgGradient: "from-emerald-100 to-emerald-50",
  },
  {
    id: 4,
    categoryCd: "D", // 심리
    titleKey: "MSG_25",
    descriptionKey: "MSG_26",
    screenId: "/coaching/mental",
    image: type3,
    primaryColor: "rgb(236, 72, 153)", // pink-500
    bgGradient: "from-pink-100 to-pink-50",
  },
  {
    id: 5,
    categoryCd: "E", // 운동하기
    titleKey: "MSG_27",
    descriptionKey: "MSG_28",
    screenId: "/coaching/exercise",
    image: type5,
    primaryColor: "rgb(251, 191, 36)", // amber-400
    bgGradient: "from-amber-100 to-amber-50",
  },
];

function RouteComponent() {
  const { pt } = usePageTranslation("home");
  const accountMe = useAtomValue(accountMeAtom);
  const navigate = useNavigate();

  const { data: progressList } = useCoachingProgressList(
    accountMe.data?.loginId,
  );

  const mergedData = useMemo(() => {
    return coachingData.map((coaching) => {
      const apiData = progressList?.find(
        (p) => p.categoryCd === coaching.categoryCd,
      );
      return {
        ...coaching,
        progress: apiData?.progress ?? 0,
      };
    });
  }, [progressList]);

  const onCardClick = (categoryCd: string) => {
    const coaching = coachingData.find((d) => d.categoryCd === categoryCd);
    if (coaching?.screenId) {
      navigate({ to: coaching.screenId });
    }
  };

  const mainCategories = useMemo(
    () => mergedData.filter((d) => d.categoryCd !== "E"),
    [mergedData],
  );
  const allMainCategoriesCompleted = useMemo(
    () =>
      mainCategories.length === 4 &&
      mainCategories.every((category) => category.progress >= 100),
    [mainCategories],
  );

  const exerciseCategory = useMemo(
    () => mergedData.find((d) => d.categoryCd === "E"),
    [mergedData],
  );

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-gray-50/50">
      <PageHeader
        title={pt("MSG_17")}
        description={pt("MSG_18")}
        characterImage={CoachingCharacter}
        characterAlt="Coaching Character"
      >
        <div className="mt-4">
          <div className="grid grid-cols-5 gap-2">
            <Each
              of={mergedData}
              keyItem="id"
              render={(coaching, idx) => (
                <CoachingHeaderProgress
                  {...coaching}
                  idx={idx}
                  pt={pt}
                  msgProgress04={pt("MSG_04")}
                />
              )}
            />
          </div>
        </div>
      </PageHeader>

      <div className="flex-1 pb-20">
        <div className="flex flex-col gap-2 p-5">
          {allMainCategoriesCompleted ? (
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-center shadow-sm">
              <p className="text-sm font-bold text-emerald-700">
                건강코칭 4가지 카테고리를 모두 완료했어요.
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-600">
                각 카테고리에서 이전 답변을 다시 확인할 수 있습니다.
              </p>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <Each
              of={mainCategories}
              keyItem="id"
              render={(coaching, index) => (
                <CoachingCard
                  {...coaching}
                  index={index}
                  pt={pt}
                  onClick={onCardClick}
                />
              )}
            />
          </div>

          {exerciseCategory && (
            <CoachingCard
              {...exerciseCategory}
              index={mainCategories.length}
              pt={pt}
              onClick={onCardClick}
              isLargeVariant
            />
          )}
        </div>
      </div>
    </div>
  );
}
