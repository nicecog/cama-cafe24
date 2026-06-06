import { useMemo } from "react";
import AnimatedProgressItem from "./AnimatedProgressItem";
// 항목별 평균
import Chart1 from "./Chart1";
import Lottie from "lottie-react";
import walking from "@/assets/lotties/walking.json";
import { useTranslation } from "react-i18next";

type ReportDataType = {
  id: string;
  title: string;
  categoryAa?: string;
  categoryBb?: string;
  categoryCc?: string;
  categoryDd?: string;
  categoryEe?: string;
  [key: string]: string | undefined; // 동적으로 다른 category 키를 받아도 OK
};

export const Report = ({ data }: { data: ReportDataType[] }) => {
  const { t } = useTranslation();
  
  const averages = useMemo(() => {
    const keys = [
      "categoryAa",
      "categoryBb",
      "categoryCc",
      "categoryDd",
      "categoryEe",
      "cancerProgressRate",
      "avgStep",
    ] as const;

    const labels: Record<(typeof keys)[number], string> = {
      categoryAa: t("coachingProgress.columns.sleep"),
      categoryBb: t("coachingProgress.columns.diet"),
      categoryCc: t("coachingProgress.columns.physicalActivity"),
      categoryDd: t("coachingProgress.columns.mental"),
      categoryEe: t("coachingProgress.columns.exercise"),
      cancerProgressRate: t("coachingProgress.columns.cancerProgressRate"),
      avgStep: t("coachingProgress.report.avgSteps"),
    };

    const { sum, count } = data.reduce(
      (acc, item) => {
        keys.forEach((key) => {
          const raw = item[key];
          const num = parseFloat(raw ?? "0");
          acc.sum[key] += isNaN(num) ? 0 : num;
          acc.count[key] += 1;
        });
        return acc;
      },
      {
        sum: Object.fromEntries(keys.map((k) => [k, 0])) as Record<
          (typeof keys)[number],
          number
        >,
        count: Object.fromEntries(keys.map((k) => [k, 0])) as Record<
          (typeof keys)[number],
          number
        >,
      }
    );

    const _values = keys.reduce((avg, key) => {
      const average = sum[key] / count[key];
      avg[key] = parseFloat(average.toFixed(1));
      return avg;
    }, {} as Record<(typeof keys)[number], number>);

    return keys.map((key) => ({
      value: _values[key],
      label: labels[key],
      ...(["avgStep"].includes(key) ? { max: 10000 } : {}),
    }));
  }, [data, t]);

  const walkingAvg = averages.find((item) => item.label === t("coachingProgress.report.avgSteps"));

  return (
    <>
      <h1 className="border-b border-[#39906a]  my-4 text-xl font-semibold pb-2">
        {t("coachingProgress.report.title")}
      </h1>

      <div className=" px-4 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-[#399a6a] text-white bg-opacity-90">
        <div className=" text-sm  font-medium">{t("coachingProgress.report.totalPeople")} : {data.length}{t("coachingProgress.report.people")}</div>
      </div>
      <div className="grid grid-cols-4 gap-4 py-1 mt-2 relative">
        {averages
          .filter((r) => r.label !== t("coachingProgress.report.avgSteps"))
          .map((item, index) => (
            <AnimatedProgressItem key={index} index={index} item={item} />
          ))}

        <div className="col-start-4 w-full h-[70px] flex items-center gap-4 justify-between px-2 overflow-visible">
          <div className="w-[100px] h-[100px] -mt-4 scale-[1.4]">
            <Lottie animationData={walking} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{t("coachingProgress.report.avgSteps")}</span>
            <span className="text-xl font-semibold text-[#39906a]">
              {Math.round(walkingAvg?.value || 0).toLocaleString()} {t("coachingProgress.report.steps")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md bg-[#399a6a] text-white bg-opacity-90 text-sm mt-4">
        <h1 className="">{t("coachingProgress.report.categoryAverage")}</h1>
        <span className="">{t("coachingProgress.report.unit")} : %</span>
      </div>

      <Chart1 data={averages} />
    </>
  );
};
