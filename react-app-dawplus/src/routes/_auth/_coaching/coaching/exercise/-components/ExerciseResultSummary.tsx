import {
  type DifficultyCode,
  getDifficultyLabel,
  getTherapyLabel,
  type TherapyCode,
} from "../-constants/exerciseCodeMap";

interface ExerciseResultSummaryProps {
  program: DifficultyCode;
  aerobic: "Y" | "N";
  therapy: TherapyCode | "";
}

export function ExerciseResultSummary({
  program,
  aerobic,
  therapy,
}: ExerciseResultSummaryProps) {
  const extras = [
    ...(aerobic === "Y" ? ["유산소 운동"] : []),
    ...(therapy ? [getTherapyLabel(therapy)] : []),
  ];

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="rounded-3xl bg-primary/5 p-5 text-center">
        <p className="text-sm font-bold text-slate-500">추천 운동 수준</p>
        <h2 className="mt-2 text-3xl font-black text-primary">
          {getDifficultyLabel(program)}
        </h2>
      </div>

      {extras.length ? (
        <div className="mt-5 rounded-3xl border border-primary/20 bg-white p-5">
          <p className="text-sm font-bold text-slate-500">추가 권장 프로그램</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {extras.map((item) => (
              <span
                key={item}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
