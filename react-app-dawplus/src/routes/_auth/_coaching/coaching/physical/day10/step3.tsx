import { usePageTranslation } from "@/hooks/usePageTranslation";
import TodayMission from "../../-components/elements/TodayMission";

export function Day10Step3() {
  const { pt } = usePageTranslation("coaching/physical/day10");

  const option1 = pt("MSG_014").replace(/[\[\]]/g, "");
  const option2 = pt("MSG_015").replace(/[\[\]]/g, "");
  const targetOption = pt("MSG_016").replace(/[\[\]]/g, "");

  const renderFormattedText = () => {
    const rawText = pt("MSG_013");
    const regex = /(\[.*?\])/g;
    const parts = rawText.split(regex);

    return parts.map((part, index) => {
      if (part === pt("MSG_014")) {
        return (
          <span
            key={part}
            className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-extrabold text-base mx-1 my-0.5 align-middle"
          >
            {option1}
          </span>
        );
      }
      if (part === pt("MSG_015")) {
        return (
          <span
            key={part}
            className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-extrabold text-base mx-1 my-0.5 align-middle"
          >
            {option2}
          </span>
        );
      }
      if (part === pt("MSG_016")) {
        return (
          <span
            key={part}
            className="inline-block bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-black text-lg mx-1 my-0.5 border border-primary/20 shadow-sm align-middle"
          >
            {targetOption}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <TodayMission text={pt("MSG_011")} />

      <div className="flex flex-col gap-5 px-1 mt-2">
        <h3 className="text-xl font-black text-slate-900 text-center leading-relaxed break-keep">
          {pt("MSG_012")}
        </h3>

        <p className="text-lg font-bold leading-loose text-slate-600 break-keep text-center">
          {renderFormattedText()}
        </p>
      </div>
    </div>
  );
}
