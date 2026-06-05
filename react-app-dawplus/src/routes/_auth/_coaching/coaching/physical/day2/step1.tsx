import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import Textbox from "../../-components/elements/Textbox";

export function Day2Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day2");
  const { step1, setStep1 } = props;

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">{pt("MSG_013")}</ChallengeStart>
      <Textbox className="font-semibold text-center">{pt("MSG_014")}</Textbox>
      <div className="flex flex-col gap-4">
        {step1.map((item: any, index: number) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-100/80 bg-white p-4 shadow-sm"
          >
            {/* Question Header with Index Indicator */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="text-base font-bold leading-relaxed text-slate-800 break-keep">
                {item.label}
              </div>
            </div>

            {/* Segmented Control Toggle Group */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[pt("MSG_016"), pt("MSG_017")].map((label) => {
                const checked =
                  label === pt("MSG_016")
                    ? item.value === true
                    : item.value === false;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      setStep1((prev: any[]) =>
                        prev.map((it, idx) =>
                          idx === index
                            ? { ...it, value: label === pt("MSG_016") }
                            : it,
                        ),
                      )
                    }
                    className={[
                      "h-11 rounded-xl text-base font-bold transition-all duration-200",
                      checked
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]"
                        : "border border-slate-200/60 bg-slate-50/50 text-slate-500 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
