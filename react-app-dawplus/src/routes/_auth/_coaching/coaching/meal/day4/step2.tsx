import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import day4Pic from "@/assets/images/coaching/meal/day4/day4.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day4Step2() {
  const { pt } = usePageTranslation("coaching/meal/day4");
  const { pt: day3Pt } = usePageTranslation("coaching/meal/day3");
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { data: answerList = [] } = useUserAnswerInfoList({
    loginId,
    categoryCd: "B",
  });

  const previousDayAnswers = answerList
    .filter((item) => item.stepDayCd === "03" && item.progressTypeCd === "A1")
    .map((item) => item.answerChoice)
    .filter((item): item is string => Boolean(item));

  const previousDayOptionTexts = [
    day3Pt("MSG_005"),
    day3Pt("MSG_006"),
    day3Pt("MSG_007"),
    day3Pt("MSG_008"),
    day3Pt("MSG_009"),
    day3Pt("MSG_010"),
    day3Pt("MSG_011"),
    day3Pt("MSG_012"),
  ];
  const adviceSections = [
    {
      title: pt("MSG_027"),
      lines: [pt("MSG_028"), pt("MSG_029")],
    },
    {
      title: pt("MSG_030"),
      lines: [pt("MSG_031"), pt("MSG_032"), pt("MSG_033"), pt("MSG_034")],
    },
    {
      title: pt("MSG_035"),
      lines: [pt("MSG_036"), pt("MSG_037")],
    },
    {
      title: pt("MSG_038"),
      lines: [pt("MSG_039"), pt("MSG_040"), pt("MSG_041"), pt("MSG_042")],
    },
    {
      title: pt("MSG_043"),
      lines: [pt("MSG_044"), pt("MSG_045")],
    },
    {
      title: pt("MSG_046"),
      lines: [
        pt("MSG_047"),
        pt("MSG_048"),
        pt("MSG_049"),
        pt("MSG_050"),
        pt("MSG_051"),
      ],
    },
    {
      title: pt("MSG_052"),
      lines: [pt("MSG_053"), pt("MSG_054"), pt("MSG_055")],
    },
    {
      title: pt("MSG_056"),
      lines: [
        pt("MSG_057"),
        pt("MSG_058"),
        pt("MSG_059"),
        pt("MSG_060"),
        pt("MSG_061"),
      ],
    },
  ] as const;

  const selectedAdvice = previousDayAnswers
    .map((answer) => {
      const index = previousDayOptionTexts.indexOf(answer);
      return adviceSections[index];
    })
    .filter((item): item is (typeof adviceSections)[number] => Boolean(item));

  return (
    <CoachingInfoStep image={day4Pic}>
      <div className="flex flex-col gap-6 pt-4 pb-8">
        {selectedAdvice.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-black text-sm text-white shadow-lg shadow-primary/20">
                {idx + 1}
              </div>
              <h4 className="text-lg font-black tracking-tight text-slate-900">
                {section.title}
              </h4>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2">
                {section.lines.map((line) => (
                  <p
                    key={line}
                    className="text-base font-bold leading-relaxed text-slate-600 break-keep"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </CoachingInfoStep>
  );
}
