import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Check, Sparkles, CheckCircle2, MessageCircle } from "lucide-react";
import resultImage from "@/assets/images/character/result.png";
import char4Image from "@/assets/images/character/char4.png";
import useAlert from "@/hooks/useAlert";
import { MentalCardSummary4 } from "../CardSummary";
import {
  MentalCardFooter,
  MentalCardPanel,
  MentalCardText,
  MentalCardBubble,
  CoachingTitle,
} from "../Cards/-components";
import { CareCardSelectButton, useCareCardStepScrollReset } from "./-components";
import { prevStepAtom as prevSectionStepAtom } from "../../Section6/-session6Atoms";
import {
  careCardMaxStepAtom,
  careCardStepAtom,
  initCareCardAtom,
  nextCareCardStepAtom,
  prevCareCardStepAtom,
} from "./-atoms";

function ThoughtCard({ thought, body }: { thought: string; body: string }) {
  return (
    <div className="relative">
      <div className="bg-slate-200/50 border border-slate-200 rounded-t-[2rem] rounded-b-2xl p-5 pb-8">
        <div className="inline-flex items-center gap-1.5 bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2 shadow-sm">
          <MessageCircle className="w-3.5 h-3.5" /> 떠오른 생각
        </div>
        <div className="text-slate-700 text-lg font-bold leading-snug break-keep text-left">
          {thought}
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-5 -mt-5 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> 대안적인 생각
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <span className="text-slate-700 font-bold leading-relaxed break-keep text-left text-base">
            {body}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MentalCareCard3({ onSave }: { onSave: () => void }) {
  const step = useAtomValue(careCardStepAtom);
  const setMax = useSetAtom(careCardMaxStepAtom);
  const init = useSetAtom(initCareCardAtom);
  const next = useSetAtom(nextCareCardStepAtom);
  const prev = useSetAtom(prevCareCardStepAtom);
  const prevSection = useSetAtom(prevSectionStepAtom);
  const setStep = useSetAtom(careCardStepAtom);
  const { alert } = useAlert();
  useCareCardStepScrollReset(step);
  const [reviewPopupOpen, setReviewPopupOpen] = useState(false);
  const [returnToStepAfterReview, setReturnToStepAfterReview] =
    useState(false);

  useEffect(() => {
    setMax(8);
    return () => {
      init();
      setReviewPopupOpen(false);
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
            {step} <span className="text-emerald-800/40">/ 8</span>
          </div>
        </div>

        {step === 1 ? (
          <MentalCardPanel>
            <div className="relative flex flex-col items-center mb-6">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[22rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl py-5 px-5 mb-4 text-center z-20">
                <h2 className="relative z-10 text-lg font-black text-slate-800 leading-snug break-keep text-pretty tracking-tight whitespace-pre-line">
                  유방암을 겪는 환자분들이{"\n"}흔하게 호소하는 어려움은 다음과
                  같아요.
                </h2>
                <div className="mx-auto mt-3 h-[3px] w-6 rounded-full bg-primary/20" />

                {/* 말풍선 꼬리 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/95 drop-shadow-sm" />
              </div>

              {/* 캐릭터 */}
              <img
                src={char4Image}
                alt="카마 코치"
                className="w-[100px] drop-shadow-md animate-soft-float z-10"
              />
            </div>

            <MentalCardText className="mt-6 text-slate-800 font-bold">
              유방암을 치료하는 과정에서 몸의 모습이 이전과 달라져 위축되거나
              자신감이 낮아질 수 있어요.
            </MentalCardText>
            <MentalCardText className="mt-5 text-slate-800 font-bold">
              또한, 미처 발견하지 못한 질병이 있을까봐 걱정하거나 재발에 대한
              불안으로 사소한 신체 증상에도 긴장하게 될 수 있고, 사회적 관계가
              좁아질 수도 있어요.
            </MentalCardText>
            <MentalCardFooter onPrev={prevSection} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 2 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              이럴 때 도움이 되는{"\n"}
              <span className="text-primary font-black">마음근육훈련</span>이
              있어요.
            </MentalCardBubble>
            <MentalCardText className="-mt-2 text-center">
              바로 생각바꾸기를 통해 유연하게 사고하는 것이에요.
            </MentalCardText>
            <h3 className="text-center font-black text-2xl text-slate-800 mt-6 mb-6">
              "생각바꾸기를 기억하시나요?"
            </h3>
            <div className="flex gap-3 mt-2">
              <CareCardSelectButton
                className="flex-1"
                onClick={() =>
                  void alert("좋아요. 함께 해보아요", () => setStep(3))
                }
              >
                네
              </CareCardSelectButton>
              <CareCardSelectButton
                className="flex-1"
                onClick={() =>
                  void alert("괜찮아요. 카마코치와 복습해볼게요.", () =>
                    setReviewPopupOpen(true),
                  )
                }
              >
                아니요
              </CareCardSelectButton>
            </div>
            <MentalCardFooter onPrev={prev} showNext={false} />
          </MentalCardPanel>
        ) : null}

        {step === 3 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              유방암 환자들이 자주하는{"\n"}생각을 살펴볼게요.
            </MentalCardBubble>
            <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-6 text-left font-black leading-relaxed text-primary text-lg space-y-3">
              <p className="break-keep text-center font-black">
                '사람들이 수군거릴 것만 같아...'
              </p>
              <div className="flex items-center gap-2">
                <span className="h-[1px] flex-1 bg-slate-200" />
                <span className="text-slate-500 text-xs font-bold shrink-0">
                  (수술 후에)
                </span>
                <span className="h-[1px] flex-1 bg-slate-200" />
              </div>
              <p className="break-keep text-center font-black text-slate-855">
                '나는 더 이상 여자로서 매력이 없어.'
              </p>
              <div className="flex items-center gap-2">
                <span className="h-[1px] flex-1 bg-slate-200" />
                <span className="text-slate-500 text-xs font-bold shrink-0">
                  (작은 신체 증상에도)
                </span>
                <span className="h-[1px] flex-1 bg-slate-200" />
              </div>
              <p className="break-keep text-center font-black text-slate-855">
                '암이 재발한 건 아닐까?'
              </p>
            </div>
            <MentalCardText className="mt-5 text-center break-keep font-medium text-slate-600">
              이런 생각은 스트레스가 되고 자신감을 더욱 더 잃게 만들 수 있어요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 4 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              마음근육훈련에서 배운 방법으로{"\n"}생각을 바꿔볼까요?
            </MentalCardBubble>
            <div className="space-y-6">
              <ThoughtCard
                thought="'사람들이 수군거릴 것만 같아...'"
                body="사람들이 내 흉터만 쳐다보는 건 아니야. 나를 본다고 해도 어떻게 생각할지는 모르는 일이지."
              />
              <ThoughtCard
                thought="'나는 더 이상 여자로서 매력이 없어.'"
                body="나의 매력은 가슴에만 있지 않아. 이 흉터는 나를 살린 흔적이야."
              />
              <ThoughtCard
                thought="'암이 재발한 건 아닐까?'"
                body="암이 재발했다는 근거는 없어. 오늘은 좀 피곤한 것 같아. 쉬어봐야겠어."
              />
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 5 ? (
          <MentalCardPanel>
            <CoachingTitle icon={Sparkles} color="primary">
              차근차근 한발 한발
            </CoachingTitle>
            <MentalCardText className="text-slate-800 font-bold text-lg leading-relaxed text-center break-keep">
              달라진 내 모습 때문에 하지 못하는 것이 늘어나고, 가지 못하는 곳이
              많아졌나요?
            </MentalCardText>
            <MentalCardText className="mt-5 text-slate-800 font-bold text-lg leading-relaxed text-center break-keep">
              괜찮아요, 다시 하나씩 천천히 연습하면 돼요.
            </MentalCardText>
            <MentalCardText className="mt-5 text-slate-800 font-bold text-lg leading-relaxed text-center break-keep">
              할 수 있는만큼 한발 한발 내딛다보면, 예전처럼 편안하게 활동할 수
              있을거에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 6 ? (
          <MentalCardPanel>
            <div className="space-y-5 mt-5 px-2">
              {[
                "불편했던 상황을 모두 적어보세요.",
                "불편한 정도에 따라 각각의 순위를 매겨보세요.",
                "순위가 가장 낮은 것부터 직접 해 보세요.",
                "하나가 편안해지면 그 다음 순위의 것으로 넘어가요.",
                "반복해서 훈련합니다.",
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/60 shadow-sm text-base font-black text-primary">
                    {idx + 1}
                  </div>
                  <p className="text-left text-base font-extrabold leading-relaxed text-slate-800 break-keep">
                    {text}
                  </p>
                </div>
              ))}
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 7 ? (
          <MentalCardPanel>
            <div className="space-y-5 mt-5 px-2">
              <ul className="space-y-5">
                <li className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep">
                    무작정 상황 속에 나를 내던지는 것이 아니라, 편안할 수 있는
                    무언가와 함께 해야해요.
                  </span>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep">
                    처음에는 낯설고 힘들 수 있어요. <br />
                    그럴 땐 믿을만한 사람과 함께 해도 좋아요.
                  </span>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep">
                    <span className="text-primary font-black">
                      복식호흡이나 명상, 생각바꾸기
                    </span>{" "}
                    등을 활용해서 상황을 편안하게 느끼도록 할 수 있답니다.
                  </span>
                </li>
              </ul>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 8 ? (
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

            <MentalCardText className="mt-6">
              달라진 몸의 모습 때문에 스트레스를 받을 수 있어요, 이상한 것이
              아니에요. 그럴 땐 다음의 방법이 도움돼요.
            </MentalCardText>

            <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-6 text-left font-semibold leading-relaxed text-slate-700 mt-4">
              <h3 className="text-lg font-black text-primary mb-3">
                1. 생각바꾸기
              </h3>
              <p className="break-keep text-base font-bold text-slate-800">
                나의 생각을 검토하고 적응적이고 합리적인 생각으로 바꾸어보아요.
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-6 text-left font-semibold leading-relaxed text-slate-700 mt-4">
              <h3 className="text-lg font-black text-primary mb-3 leading-snug">
                2. 차근차근 한발 한발 <br />
                점진적으로 경험하기
              </h3>
              <p className="break-keep text-base font-bold text-slate-800">
                피하고 싶은 불편한 상황에 순위를 매기고, 가장 낮은 단계부터
                천천히 해 보아요.
              </p>
            </div>

            <MentalCardText className="mt-5">
              하나하나 따라가다보면 어느새 이전과 같이 활기찬 나의 모습을 되찾을
              수 있을 거에요.
            </MentalCardText>

            <MentalCardFooter onPrev={prev} onNext={onSave} nextLabel="완료" />
          </MentalCardPanel>
        ) : null}
      </div>

      <MentalCardSummary4
        open={reviewPopupOpen}
        setOpen={setReviewPopupOpen}
        afterClose={() => {
          if (!returnToStepAfterReview) return;
          setReturnToStepAfterReview(false);
          setStep(3);
        }}
        onComplete={() => {
          setReturnToStepAfterReview(true);
          setReviewPopupOpen(false);
        }}
      />
    </div>
  );
}
