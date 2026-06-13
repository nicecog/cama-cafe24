import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import useAlert from "@/hooks/useAlert";
import useAccountName from "@/hooks/useAccountName";
import image50 from "@/assets/images/coaching/mental/50.png";
import image63 from "@/assets/images/coaching/mental/63.png";
import resultImage from "@/assets/images/character/result.png";
import {
  MentalCardFooter,
  MentalCardPanel,
  MentalCardText,
  MentalCardBubble,
} from "../Cards/-components";
import {
  CareCardSelectButton,
  useCareCardStepScrollReset,
} from "./-components";
import { MentalCardSummary2 } from "../CardSummary";
import { prevStepAtom as prevSectionStepAtom } from "../../Section6/-session6Atoms";
import {
  careCardMaxStepAtom,
  careCardStepAtom,
  initCareCardAtom,
  nextCareCardStepAtom,
  prevCareCardStepAtom,
} from "./-atoms";

export default function MentalCareCard4({ onSave }: { onSave: () => void }) {
  const step = useAtomValue(careCardStepAtom);
  const setMax = useSetAtom(careCardMaxStepAtom);
  const init = useSetAtom(initCareCardAtom);
  const next = useSetAtom(nextCareCardStepAtom);
  const prev = useSetAtom(prevCareCardStepAtom);
  const prevSection = useSetAtom(prevSectionStepAtom);
  const { alert } = useAlert();
  const accountName = useAccountName();
  useCareCardStepScrollReset(step);
  const [showReview, setShowReview] = useState(false);
  const [advanceAfterReview, setAdvanceAfterReview] = useState(false);

  useEffect(() => {
    setMax(5);
    return () => {
      init();
      setShowReview(false);
      setAdvanceAfterReview(false);
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
            {step} <span className="text-emerald-800/40">/ 5</span>
          </div>
        </div>

        {step === 1 ? (
          <MentalCardPanel>
            <div className="relative flex flex-col items-center mb-6">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[22rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl py-5 px-5 mb-4 text-center z-20">
                <h2 className="relative z-10 text-lg font-black text-slate-800 leading-snug break-keep text-pretty tracking-tight whitespace-pre-line">
                  유방암의 수술 치료는 몸의 모양을 변형시키고{"\n"}조기 폐경의
                  위험을 높이는 등{"\n"}
                  <span className="text-primary font-black">'여성'</span>
                  으로서의 고민을 더하게 돼요.
                </h2>
                <div className="mx-auto mt-3 h-[3px] w-6 rounded-full bg-primary/20" />

                {/* 말풍선 꼬리 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/95 drop-shadow-sm" />
              </div>

              {/* 캐릭터 */}
              <img
                src={image50}
                alt="카마 코치"
                className="w-[200px] drop-shadow-md animate-soft-float z-10"
              />
            </div>

            <MentalCardText className="mt-5 text-slate-800 font-bold break-keep">
              배우자 또는 연인 관계에서도 성적 매력이 줄어든다고 느끼거나
              위축되고 우울한 마음이 들 수 있어요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-slate-800 font-bold break-keep">
              그로 인해 관계가 더욱 어려워질 수 있지요. 쑥스럽거나 상처받을까 봐
              걱정돼 솔직하게 터 놓지 못할 수도 있지요.
            </MentalCardText>

            <MentalCardFooter onPrev={prevSection} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 2 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              그럴 땐, 마음근육훈련에서 함께 살펴본{"\n"}
              <span className="text-primary font-black">"나 말하기 기법"</span>
              으로{"\n"}배우자 또는 연인과 대화해보는 것도 도움이 돼요.
            </MentalCardBubble>
            <MentalCardText className="mt-6 text-slate-800 font-bold break-keep">
              친밀한 관계는 더욱 돈독해지고 자신감도 회복하고, 암에 대해서도 더
              잘 대처할 수 있을 거에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 3 ? (
          <MentalCardPanel>
            <h3 className="text-center font-black text-2xl text-slate-800 mt-6 mb-6">
              "나 말하기 기법을 기억하시나요?"
            </h3>
            <div className="flex gap-3 mt-2">
              <CareCardSelectButton
                className="flex-1"
                onClick={() => void alert("좋아요.", () => next())}
              >
                네
              </CareCardSelectButton>
              <CareCardSelectButton
                className="flex-1"
                onClick={() =>
                  void alert("괜찮아요. 카마코치와 복습해볼게요.", () =>
                    setShowReview(true),
                  )
                }
              >
                아니요
              </CareCardSelectButton>
            </div>
            <MentalCardSummary2
              open={showReview}
              setOpen={setShowReview}
              afterClose={() => {
                if (!advanceAfterReview) return;
                setAdvanceAfterReview(false);
                next();
              }}
              onComplete={() => {
                setAdvanceAfterReview(true);
                setShowReview(false);
              }}
            />
            <MentalCardFooter onPrev={prev} showNext={false} />
          </MentalCardPanel>
        ) : null}

        {step === 4 ? (
          <MentalCardPanel>
            <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-6 flex flex-col items-center">
              <img
                src={image63}
                alt="격려"
                className="mx-auto w-full max-w-[220px] mb-4 animate-soft-float"
              />
              <MentalCardText className="!text-slate-800 font-bold text-lg leading-relaxed text-center break-keep">
                한 번에 다 기억하기 어려울 수 있어요. 그래도 복습하며 여기까지
                온 스스로를 격려해주세요.
              </MentalCardText>
            </div>
            <MentalCardText className="mt-5 text-center font-black text-xl text-primary">
              포기하지 않고 시도하는 모습이 멋져요!
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 5 ? (
          <MentalCardPanel>
            <MentalCardBubble tone="summary">
              <div className="flex items-center gap-2 justify-center flex-col">
                <p className="mb-1.5">카마 코치의 요약</p>
                <img
                  src={resultImage}
                  className="h-[180px] object-contain rounded-lg drop-shadow-md animate-soft-float transition-transform duration-300 hover:scale-[1.03]"
                />
              </div>
            </MentalCardBubble>

            <MentalCardText className="mt-6 text-slate-800 font-bold break-keep">
              유방암으로 인해{" "}
              <span className="text-primary font-black">'여성'</span>으로서의
              성기능이나 파트너와의 친밀감이 약해져 우울하고 위축될 수 있어요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-slate-800 font-bold break-keep">
              하지만{" "}
              <span className="text-primary font-black">{accountName}</span>님은
              늘 존중받을만하고 여전히 소중한 사람이에요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-slate-800 font-bold break-keep">
              마음근육훈련의{" "}
              <span className="text-primary font-black">"나 말하기 기법"</span>
              으로 관계가 더욱 돈독해지길 언제나 카마코치가 응원합니다.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={onSave} nextLabel="완료" />
          </MentalCardPanel>
        ) : null}
      </div>
    </div>
  );
}
