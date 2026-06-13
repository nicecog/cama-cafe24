import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  MentalCardFooter,
  MentalCardImage,
  MentalCardPanel,
  MentalCardText,
  MentalCardBubble,
} from "../Cards/-components";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import { MentalCardSummary1 } from "../CardSummary";
import { useCareCardStepScrollReset } from "./-components";
import { prevStepAtom as prevSectionStepAtom } from "../../Section6/-session6Atoms";
import {
  careCardMaxStepAtom,
  careCardStepAtom,
  initCareCardAtom,
  nextCareCardStepAtom,
  prevCareCardStepAtom,
} from "./-atoms";

export default function MentalCareCard5({ onSave }: { onSave: () => void }) {
  const step = useAtomValue(careCardStepAtom);
  const setMax = useSetAtom(careCardMaxStepAtom);
  const init = useSetAtom(initCareCardAtom);
  const setStep = useSetAtom(careCardStepAtom);
  const next = useSetAtom(nextCareCardStepAtom);
  const prev = useSetAtom(prevCareCardStepAtom);
  const prevSection = useSetAtom(prevSectionStepAtom);

  useCareCardStepScrollReset(step);

  useEffect(() => {
    setMax(2);
    return () => {
      init();
    };
  }, [init, setMax]);

  return (
    <div className="min-h-[100dvh] flex flex-col relative px-5 pb-10 pt-6">
      {/* Fixed Full Background to prevent scroll cutoffs */}
      <div className="fixed inset-0 -z-20 bg-[#f2f7f5]" />

      {/* Decorative background blurs */}
      <div className="fixed -right-20 -top-20 -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="fixed -left-20 bottom-40 -z-10 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />

      <div className="mx-auto max-w-[32rem] w-full space-y-5 relative z-10">
        {/* Step Indicator */}
        <div className="flex justify-end mb-2 relative z-20">
          <div className="rounded-full bg-white/60 backdrop-blur-md px-3.5 py-1 text-sm font-extrabold text-emerald-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white">
            {step} <span className="text-emerald-800/40">/ 2</span>
          </div>
        </div>

        {step === 1 && (
          <MentalCardPanel>
            <MentalCardBubble>
              폐 수술 후 가슴의 통증을 느껴{"\n"}힘드시죠.
            </MentalCardBubble>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px] mt-6 mb-2 animate-soft-float filter drop-shadow-md"
            />
            <div className="mt-6 px-2 space-y-4 text-center w-full">
              <MentalCardText className="leading-relaxed !text-slate-800 break-keep">
                전보다 쉽게 숨이 차는 등 폐 기능이 저하되었다고 느낄 수 있어요.
              </MentalCardText>
              <MentalCardText className="leading-relaxed !text-slate-800 break-keep">
                이러한 기능 저하는 폐 절제로 생기는 변화입니다. 하지만, 시간이 경과하여
                잘 적응하면 일상생활은 문제 없이 하실 수 있어요.
              </MentalCardText>
            </div>
            <MentalCardText className="mt-8 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              카마앱에 있는 <span className="font-extrabold text-primary">복식호흡</span>을
              연습해 보세요.
              <br />
              폐 기능을 살려주는 데 도움이 됩니다.
            </MentalCardText>
            <MentalCardFooter onPrev={prevSection} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 2 && (
          <>
            <MentalCardSummary1 open setOpen={() => setStep(1)} onComplete={onSave} />
            <MentalCardFooter onPrev={prev} showNext={false} />
          </>
        )}
      </div>
    </div>
  );
}
