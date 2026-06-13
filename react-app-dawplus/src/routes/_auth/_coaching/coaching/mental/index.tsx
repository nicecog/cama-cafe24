import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import Textbox from "../-components/elements/Textbox";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { getMentalSession } from "./-component/-mentalSectionConfig";
import { MentalSection1Page } from "./Section1";
import { MentalSection2Page } from "./Section2";
import { MentalSection3Page } from "./Section3";
import { MentalSection4Page } from "./Section4";
import { MentalSection5Page } from "./Section5";
import { MentalSection6Page } from "./Section6";

export const Route = createFileRoute("/_auth/_coaching/coaching/mental/")({
  component: MentalRoutePage,
});

function MentalRoutePage() {
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { data: answerList = [], isLoading } = useUserAnswerInfoList({
    categoryCd: "D",
    loginId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const hasSection1Result = answerList.some(
    (item) => item.stepDayCd === "Q1" && item.progressTypeCd === "D2",
  );

  if (!hasSection1Result) {
    return <MentalSection1Page />;
  }

  const nextSection = getMentalSession(answerList);

  if (nextSection === 2) {
    return <MentalSection2Page />;
  }

  if (nextSection === 3) {
    return <MentalSection3Page />;
  }

  if (nextSection === 4) {
    return <MentalSection4Page />;
  }

  if (nextSection === 5) {
    return <MentalSection5Page />;
  }

  if (nextSection === 6) {
    return <MentalSection6Page />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-[32rem] rounded-[30px] border border-slate-100 bg-white px-5 py-8 shadow-sm">
        <Textbox className="text-center text-base font-bold text-slate-700">
          Section 6 연결 전입니다.
        </Textbox>
      </div>
    </div>
  );
}
