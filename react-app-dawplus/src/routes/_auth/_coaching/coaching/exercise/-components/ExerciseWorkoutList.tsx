import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";
import type {
  WebviewExerciseContentItem,
  WebviewUserAnswerInfo,
} from "@/apis/types";
import type5 from "@/assets/images/coaching/main/type5.png";
import { cn } from "@/lib/utils";
import { getDifficultyLabel } from "../-constants/exerciseCodeMap";

interface ExerciseWorkoutListProps {
  workouts: WebviewExerciseContentItem[];
  answerList: WebviewUserAnswerInfo[];
  onSelect: (workout: WebviewExerciseContentItem) => void;
}

function toExerciseRef(item: WebviewExerciseContentItem) {
  return `${item.indexNum}${item.exerciseTypeCd}${item.difficultyCd}`;
}

export function ExerciseWorkoutList({
  workouts,
  answerList,
  onSelect,
}: ExerciseWorkoutListProps) {
  const completedRefs = new Set(
    answerList
      .filter((item) => item.answerChoice === "Y" && item.refVal1)
      .map((item) => item.refVal1 as string),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-md border border-primary/15 bg-white p-5 shadow-sm">
        <div className="max-w-[70%]">
          <p className="text-sm font-bold text-primary">
            TODAY&apos;S WORKOUTS
          </p>
          <h3 className="mt-2 text-lg font-extrabold text-slate-900">
            추천 운동을 선택하고 바로 따라해 보세요
          </h3>
        </div>
        <motion.img
          src={type5}
          alt=""
          aria-hidden="true"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-3 h-28 w-auto"
        />
      </div>

      {workouts.map((workout) => {
        const ref = toExerciseRef(workout);
        const completed = completedRefs.has(ref);

        return (
          <motion.button
            key={ref}
            type="button"
            onClick={() => onSelect(workout)}
            whileHover={{ y: -2, scale: 1.005 }}
            whileTap={{ scale: 0.992 }}
            className={cn(
              "flex items-center justify-between rounded-md border bg-white px-5 py-4 text-left shadow-sm transition",
              completed
                ? "border-primary/30 bg-primary-thin/10"
                : "border-slate-200 hover:border-primary/30 hover:bg-primary-thin/5",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-thin/15">
                <img
                  src={type5}
                  alt=""
                  aria-hidden="true"
                  className="h-10 w-auto"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-primary">
                  [
                  {getDifficultyLabel(
                    workout.difficultyCd as "A1" | "A2" | "A3",
                  )}
                  ]
                </p>
                <p className="text-base font-extrabold text-slate-900">
                  {workout.korName}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {workout.engName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {completed ? (
                <CheckCircle2 className="size-5 text-primary" />
              ) : null}
              <ChevronRight className="size-5 text-slate-400" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
