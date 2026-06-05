import day16Pic from "@/assets/images/coaching/physical/day16.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day16Step2(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day16");
  const { step2, setStep2, questions, infoKeys } = props;
  return (
    <CoachingInfoStep title={pt("MSG_021")} image={day16Pic}>
      <div className="space-y-10 pt-4 pb-12">
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("MSG_022")}
          </h3>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((question: string, index: number) => {
            const value = step2[index];
            return (
              <div
                key={question}
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100/80"
              >
                <div className="flex items-center gap-3 px-1">
                  <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
                  <h4 className="text-lg font-black tracking-tight text-slate-900 break-keep">
                    {question}
                  </h4>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm font-bold leading-relaxed text-slate-600 break-keep">
                    {pt(infoKeys[index][0])}
                    <br />
                    {pt(infoKeys[index][1])}
                  </p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  {[pt("MSG_001"), pt("MSG_002")].map((label) => {
                    const checked =
                      label === pt("MSG_001")
                        ? value === true
                        : value === false;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          setStep2((prev: any[]) =>
                            prev.map((item, idx) =>
                              idx === index ? label === pt("MSG_001") : item,
                            ),
                          )
                        }
                        className={[
                          "rounded-full px-4 py-2 text-sm font-bold transition-all",
                          checked
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "border border-slate-200 bg-white text-slate-600",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100/80">
            <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
              {pt("MSG_035")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100/80">
            <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
              {pt("MSG_036")}
            </p>
          </div>
        </div>
      </div>
    </CoachingInfoStep>
  );
}
