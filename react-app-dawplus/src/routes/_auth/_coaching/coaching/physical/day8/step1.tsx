import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";

export function Day8Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day8");
  const { step1, setStep1, exerciseTypes } = props;
  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart type="physical">{pt("MSG_003")}</ChallengeStart>
      <div className="grid gap-3">
        {exerciseTypes.map((type: string) => {
          const selected = step1.type === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setStep1((prev: any) => ({ ...prev, type }))}
              className={[
                "rounded-2xl border px-4 py-4 text-left text-base font-semibold transition-all",
                selected
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                  : "border-slate-200 bg-white text-slate-700",
              ].join(" ")}
            >
              {type}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="number"
          min="5"
          max="120"
          value={step1.time}
          onChange={(event) =>
            setStep1((prev: any) => ({ ...prev, time: event.target.value }))
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>
    </div>
  );
}
