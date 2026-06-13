import { useState } from "react";
import useAlert from "@/hooks/useAlert";
import mentalHeaderImage from "@/assets/images/coaching/mental/mentalheader.png";
import missionImage from "@/assets/images/coaching/mental/mission.png";
import { CareCardImageChoiceButton } from "../CareCards/-components";
import { MentalCardSummary1Content } from "./Card1";
import { MentalCardSummary3Content } from "./Card3";
import { CardSummaryPopup } from "./-utils";
import type { CardSummaryPopupProps } from "./-types";

export default function MentalCardSummary5({
  children,
  onComplete,
  open,
  setOpen,
  afterClose,
}: CardSummaryPopupProps) {
  const { alert, confirm } = useAlert();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (step === 2) {
    return (
      <CardSummaryPopup open={open} setOpen={setOpen} afterClose={afterClose}>
        <MentalCardSummary1Content onComplete={onComplete} />
      </CardSummaryPopup>
    );
  }

  if (step === 3) {
    return (
      <CardSummaryPopup open={open} setOpen={setOpen} afterClose={afterClose}>
        <MentalCardSummary3Content onComplete={onComplete} />
      </CardSummaryPopup>
    );
  }

  return (
    <CardSummaryPopup open={open} setOpen={setOpen} afterClose={afterClose}>
      <div className="mt-8 flex flex-col gap-6 w-full items-center text-center">
        {children ? <div className="w-full">{children}</div> : null}

        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-3 w-full">
            <CareCardImageChoiceButton
              onClick={() =>
                void alert("카마코치와 복습해볼게요.", () => setStep(2))
              }
              imageSrc={mentalHeaderImage}
              imageAlt="복식호흡"
              label="복식호흡"
              className="flex-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 active:scale-95 py-5"
            />
            <CareCardImageChoiceButton
              onClick={() => setStep(3)}
              imageSrc={missionImage}
              imageAlt="명상"
              label="명상"
              className="flex-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 active:scale-95 py-5"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              void confirm(
                {
                  html: "복식 호흡 과 명상을 이해하는 데 <br/>도움이 되셨나요?",
                },
                onComplete,
              )
            }
            className="w-full h-14 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-sm text-base font-extrabold text-slate-500 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-300 hover:border-slate-300 hover:bg-white hover:text-slate-700 active:scale-98"
          >
            오늘은 그만 할게요.
          </button>
        </div>
      </div>
    </CardSummaryPopup>
  );
}
