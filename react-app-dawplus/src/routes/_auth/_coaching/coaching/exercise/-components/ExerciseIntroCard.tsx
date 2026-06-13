import { motion } from "framer-motion";
import type5 from "@/assets/images/coaching/main/type5.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";

export function ExerciseIntroCard({ onStart }: { onStart: () => void }) {
  const { pt } = usePageTranslation("coaching/exercise/index");

  return (
    <section className="rounded-md border border-primary/15 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md bg-primary-thin/20 p-5">
          <div className="inline-flex rounded-md bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            EXERCISE COACHING
          </div>
          <h2 className="mt-3 text-xl font-extrabold text-slate-900">
            {pt("title")}
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm font-medium leading-6 text-slate-600">
            {pt("description")}
          </p>
        </div>

        <div className="flex items-center justify-center rounded-md border border-primary/10 bg-primary-thin/10 px-4 py-4">
          <motion.img
            src={type5}
            alt=""
            aria-hidden="true"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-44 w-auto"
          />
        </div>
      </div>

      <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-5">
        <p className="whitespace-pre-line text-sm font-medium leading-6 text-slate-600">
          {pt("summary")}
        </p>
      </div>

      <div className="pt-2">
        <motion.button
          type="button"
          onClick={onStart}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-md bg-primary text-md font-bold text-white transition hover:bg-primary/90"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-md">
            ▶
          </span>
          {pt("start")}
        </motion.button>
      </div>
    </section>
  );
}
