import day16Pic from "@/assets/images/coaching/physical/day16.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day16Step2(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day16");
  const { step2, setStep2, questions, infoKeys } = props;
  const yesLabel = pt("MSG_044");
  const noLabel = pt("MSG_002");

  return (
    <CoachingInfoStep image={day16Pic} subtitle={pt("MSG_021")}>
      <div className="flex flex-col gap-10 pt-4 pb-12 text-left">
        <div className="flex flex-col gap-6">
          {questions.map((question: string, index: number) => {
            const value = step2[index];

            return (
              <div
                key={question}
                className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black tracking-[0.08em] text-primary">
                      Q{index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {index + 1} / {questions.length}
                    </span>
                  </div>

                  <h4 className="text-left text-lg font-black leading-relaxed tracking-tight text-slate-900 break-keep text-pretty">
                    {question}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {[yesLabel, noLabel].map((label) => {
                      const checked =
                        label === yesLabel ? value === true : value === false;

                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            setStep2((prev: any[]) =>
                              prev.map((item, idx) =>
                                idx === index ? label === yesLabel : item,
                              ),
                            )
                          }
                          className={[
                            "rounded-2xl border px-4 py-3 text-sm font-black transition-all",
                            checked
                              ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                              : "border-slate-200 bg-slate-50 text-slate-600",
                          ].join(" ")}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary/70" />
                      <span className="h-px flex-1 bg-primary/15" />
                    </div>
                    <p className="text-left text-sm font-bold leading-relaxed text-slate-600 break-keep text-pretty">
                      {pt(infoKeys[index])}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Textbox>{pt("MSG_035")}</Textbox>
        <Textbox>{pt("MSG_036")}</Textbox>
      </div>
    </CoachingInfoStep>
  );
}
