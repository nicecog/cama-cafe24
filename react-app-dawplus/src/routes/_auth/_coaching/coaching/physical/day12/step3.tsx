import { usePageTranslation } from "@/hooks/usePageTranslation";
import TodayMission from "../../-components/elements/TodayMission";

export function Day12Step3() {
  const { pt } = usePageTranslation("coaching/physical/day12");

  const renderFormattedText = () => {
    const rawText = pt("MSG_016");
    const parts = rawText.split(/<hl>(.*?)<\/hl>/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="text-primary font-black text-xl mx-0.5">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <TodayMission text={pt("MSG_014")} />

      <div className="flex flex-col gap-5 px-1 mt-2">
        <h3 className="text-xl font-black text-slate-900 text-center leading-relaxed break-keep">
          {pt("MSG_015")}
        </h3>

        <p className="text-lg font-bold leading-loose text-slate-600 break-keep text-center">
          {renderFormattedText()}
        </p>
      </div>
    </div>
  );
}
