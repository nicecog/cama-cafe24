import { usePageTranslation } from "@/hooks/usePageTranslation";

export function ExerciseQuestionComplete() {
  const { pt } = usePageTranslation("coaching/exercise/eval");

  return (
    <section className="rounded-md border border-primary/15 bg-white p-6 text-center shadow-sm">
      <p className="whitespace-pre-line text-sm font-medium leading-6 text-slate-600">
        {pt("complete")}
      </p>
    </section>
  );
}
