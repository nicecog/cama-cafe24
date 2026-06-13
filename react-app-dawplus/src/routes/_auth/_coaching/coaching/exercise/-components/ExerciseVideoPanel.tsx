import { motion } from "framer-motion";
import type5 from "@/assets/images/coaching/main/type5.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import {
  type DifficultyCode,
  getDifficultyLabel,
} from "../-constants/exerciseCodeMap";

function toEmbedUrl(url: string) {
  if (url.includes("/embed/")) return url;

  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&/]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  const watchMatch = url.match(/[?&]v=([^?&/]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  return url;
}

interface ExerciseVideoPanelProps {
  difficultyCd: DifficultyCode;
  korName: string;
  url: string;
}

export function ExerciseVideoPanel({
  difficultyCd,
  korName,
  url,
}: ExerciseVideoPanelProps) {
  const { pt } = usePageTranslation("coaching/exercise/video");

  return (
    <>
      <section className="rounded-md border border-primary/15 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex rounded-md bg-primary/10 px-3 py-1 text-sm font-bold text-primary"
            >
              [{getDifficultyLabel(difficultyCd)}]
            </motion.p>
            <p className="mt-3 whitespace-pre-line text-base font-bold leading-7 text-slate-900">
              {pt("today_prefix")}{" "}
              <span className="text-primary">&quot;{korName}&quot;</span>{" "}
              {pt("today_suffix")}
            </p>
          </div>

          <motion.img
            src={type5}
            alt=""
            aria-hidden="true"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-20 w-auto shrink-0"
          />
        </div>
      </section>

      <section className="rounded-md border border-primary/15 bg-white p-5 text-center shadow-sm">
        <p className="text-sm font-bold text-primary">{pt("notice_title")}</p>
        <p className="mt-3 whitespace-pre-line text-sm font-medium leading-6 text-slate-600">
          {pt("notice_body")}
        </p>
        {difficultyCd === "A3" ? (
          <p className="mt-3 text-sm font-medium leading-6 text-primary">
            {pt("notice_advanced")}
          </p>
        ) : null}
      </section>

      <p className="text-center text-sm font-bold text-slate-700">
        {pt("guide")}
      </p>

      <section className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
        <div className="aspect-video overflow-hidden rounded-md bg-slate-900">
          <iframe
            src={toEmbedUrl(url)}
            title={korName}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </section>
    </>
  );
}
