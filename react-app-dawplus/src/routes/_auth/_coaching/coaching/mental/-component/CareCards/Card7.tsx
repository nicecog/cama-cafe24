import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  CircleAlert,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import image64 from "@/assets/images/coaching/mental/64.png";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import resultImage from "@/assets/images/character/result.png";
import useAlert from "@/hooks/useAlert";
import { MentalCardSummary4, MentalCardSummary5 } from "../CardSummary";
import {
  MentalCardFooter,
  MentalCardPanel,
  MentalCardText,
  MentalCardBubble,
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

function ThoughtMeaning({
  thought,
  body,
}: {
  thought: string;
  body: React.ReactNode;
}) {
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
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-3 shadow-sm border border-primary/10">
          생각의 속뜻
        </div>
        <div className="text-slate-700 font-bold leading-relaxed break-keep text-left text-base">
          {body}
        </div>
      </div>
    </div>
  );
}

function ThoughtSwitch({
  thought,
  body,
}: {
  thought: string;
  body: React.ReactNode;
}) {
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
          <div className="text-slate-700 font-bold leading-relaxed break-keep text-left text-base">
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentalCareCard7({ onSave }: { onSave: () => void }) {
  const step = useAtomValue(careCardStepAtom);
  const setMax = useSetAtom(careCardMaxStepAtom);
  const init = useSetAtom(initCareCardAtom);
  const next = useSetAtom(nextCareCardStepAtom);
  const prev = useSetAtom(prevCareCardStepAtom);
  const prevSection = useSetAtom(prevSectionStepAtom);
  const setStep = useSetAtom(careCardStepAtom);
  const { alert } = useAlert();
  useCareCardStepScrollReset(step);
  const [showReview, setShowReview] = useState(false);
  const [goStep7AfterReview, setGoStep7AfterReview] = useState(false);

  useEffect(() => {
    setMax(10);
    return () => {
      init();
      setShowReview(false);
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
            {step} <span className="text-emerald-800/40">/ 10</span>
          </div>
        </div>

        {step === 1 ? (
          <MentalCardPanel>
            <div className="relative flex flex-col items-center mb-6">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[22rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl py-5 px-5 mb-4 text-center z-20">
                <h2 className="relative z-10 text-lg font-black text-slate-800 leading-snug break-keep text-pretty tracking-tight whitespace-pre-line">
                  '암이 재발하면 어떡하지?'
                </h2>
                <div className="mx-auto mt-3 h-[3px] w-6 rounded-full bg-primary/20" />

                {/* 말풍선 꼬리 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/95 drop-shadow-sm" />
              </div>

              {/* 캐릭터 */}
              <img
                src={image64}
                alt="암 재발 불안"
                className="w-[180px] drop-shadow-md animate-soft-float z-10"
              />
            </div>

            <MentalCardText className="mt-5 text-slate-800 font-bold break-keep text-center">
              암 환자라면 누구나 갖고 있을 이러한 불안과 두려움을{" "}
              <span className="text-primary font-black">'암 재발 불안'</span>
              이라고 합니다. 따로 이름을 붙일만큼 흔하고 중요한 것 중
              하나이지요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-slate-800 font-bold break-keep text-center">
              암이라는 병의 특성 상 실제로 재발할 확률도 있기 때문에 그저 뜬구름
              잡는 걱정이 아니기도 해요.
            </MentalCardText>
            <MentalCardFooter onPrev={prevSection} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 2 ? (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-slate-800 font-bold break-keep text-center">
              이런 불안 덕분에 검진이나 건강 관리도 열심히 하고, 미리 대비할 수
              있는 긍정적인 효과도 있어요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-slate-800 font-bold break-keep text-center">
              다만, 재발 불안 때문에 일상생활에 지장이 생긴다면 정작 내게
              중요하고 의미있는 것을 놓칠 수 있지요.
            </MentalCardText>

            <h3 className="text-center font-black text-2xl text-slate-800 mt-8 mb-4">
              불안이 엄습할 때 대처하는{"\n"}나만의 방법을 알고 있나요?
            </h3>

            <MentalCardText className="text-slate-800 font-bold break-keep text-center">
              불안을 잘 다스리면, 몸도 마음도 편안하고 일상에서 의미있고 중요한
              일에 집중하며 더 가치 있는 삶을 살아갈 수 있어요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 3 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              나는 재발과 관련해{"\n"}무엇이 불안한가요?
            </MentalCardBubble>
            <div className="space-y-4 mt-6">
              {[
                "힘든 치료 과정을 또 겪어야 한다니…",
                "재발하면 죽는거 아닌가?",
                "열심히 노력했는데 실패네, 가족들에게 미안해.",
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 rounded-2xl border border-rose-100 bg-rose-50/30 px-5 py-4 shadow-[0_4px_12px_rgba(244,63,94,0.02)] backdrop-blur-sm"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mt-0.5">
                    <CircleAlert className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <p className="text-left font-bold leading-relaxed text-slate-800 text-base break-keep">
                    {text}
                  </p>
                </div>
              ))}
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 4 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              암 재발이 내게는{"\n"}이런 의미이군요.
            </MentalCardBubble>
            <div className="space-y-6 mt-4">
              <ThoughtMeaning
                thought="'힘든 치료과정을 또 겪어야 한다니...'"
                body="치료 과정이 정말 힘들었어. 다시는 하고 싶지 않아."
              />
              <ThoughtMeaning
                thought="'재발하면 죽는거 아닌가?'"
                body="죽을지도 모른다는 사실이 두려워."
              />
              <ThoughtMeaning
                thought="'가족들에게 미안해.'"
                body={
                  <>
                    <p>가족들의 고생이 안타깝고 희망을 전하고 싶어.</p>
                    <p className="pt-2">
                      그건 내가 가족들을 많이 사랑한다는 뜻이야.
                    </p>
                  </>
                }
              />
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 5 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              그리고 이런 생각이{"\n"}숨어 있을 수 있어요.
            </MentalCardBubble>
            <div className="space-y-6 mt-4">
              <ThoughtMeaning
                thought="'힘든 치료과정을 또 겪어야 한다니...'"
                body="치료 과정이 또 힘들거야. 견뎌낼 수 없을 거야."
              />
              <ThoughtMeaning
                thought="'재발하면 죽는거 아닌가?'"
                body="재발하면 끝이지 뭐."
              />
              <ThoughtMeaning
                thought="'가족들에게 미안해.'"
                body="열심히 노력했는데 실패야. 짐이 되는 것 같아."
              />
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 6 ? (
          <MentalCardPanel>
            <div className="flex justify-center">
              <img src={advice1Image} alt="조언" className="w-[110px]" />
            </div>
            <MentalCardText className="mt-5 text-slate-800 font-bold break-keep text-center">
              마음근육훈련의{" "}
              <span className="text-primary font-black">'생각바꾸기'</span>를
              활용해 보아요.{"\n"}
              생각바꾸기는 재발 불안을 다스리는데 정말 효과적이에요.
            </MentalCardText>

            <h3 className="text-center font-black text-2xl text-slate-800 mt-8 mb-6">
              "생각바꾸기를 기억하시나요?"
            </h3>

            <div className="flex gap-3 mt-2">
              <CareCardSelectButton
                className="flex-1"
                onClick={() => void alert("훌륭하시네요.", () => setStep(8))}
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
                아니오
              </CareCardSelectButton>
            </div>
            <MentalCardSummary4
              open={showReview}
              setOpen={setShowReview}
              afterClose={() => {
                if (!goStep7AfterReview) return;
                setGoStep7AfterReview(false);
                setStep(7);
              }}
              onComplete={() => {
                setGoStep7AfterReview(true);
                setShowReview(false);
              }}
            />
            <MentalCardFooter onPrev={prev} showNext={false} />
          </MentalCardPanel>
        ) : null}

        {step === 7 ? (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-slate-800 font-bold break-keep text-center text-lg">
              그럼 이번엔 대안적인 사고를 떠올려봐요. 함께해요!
            </MentalCardText>
            <div className="space-y-6 mt-4">
              <ThoughtSwitch
                thought="'힘든 치료과정을 또 겪어야 한다니...'"
                body="힘들지만 견뎌낼 수 있을거야."
              />
              <ThoughtSwitch
                thought="'재발하면 죽는거 아닌가?'"
                body={
                  <>
                    <p>재발이라는 증거는 확실하지 않아.</p>
                    <p>재발하더라도 치료할 수 있는 방법이 있어.</p>
                  </>
                }
              />
              <ThoughtSwitch
                thought="'가족들에게 미안해.'"
                body={
                  <>
                    <p>안타깝지만 우리 모두 열심히 노력했어.</p>
                    <p>가족들이 날 위해 애쓰는 건 나를 사랑한다는 거야.</p>
                  </>
                }
              />
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 8 ? (
          <MentalCardPanel>
            <div className="flex justify-center">
              <img src={advice1Image} alt="조언" className="w-[110px]" />
            </div>
            <MentalCardText className="mt-5 text-slate-800 font-bold break-keep text-center text-lg">
              암 진단부터 치료 과정 동안, 당신은 이미 많은 두려움과 고통에 맞서
              여기까지 왔을 거에요.
            </MentalCardText>
            <h3 className="text-center font-black text-3xl text-primary mt-6 mb-4  ">
              고생 많으셨어요!
            </h3>
            <MentalCardText className="mt-4 text-slate-800 font-bold break-keep text-center">
              그래도 한편엔 안심할 수 없는 마음이 늘 살아 있으시지요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-slate-800 font-bold break-keep text-center">
              앞으로는 내게 그러한 위협이 없길 바라며, 사소한 재발의 증거에도
              촉각을 곤두세우며 민감하게 나를 지키려는 마음이에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 9 ? (
          <>
            <MentalCardSummary5
              open
              setOpen={() => setStep(8)}
              onComplete={() => next()}
            >
              <MentalCardText className="mt-5 text-slate-800 font-bold break-keep text-center">
                도움이 되는 다른 방법도 알려드릴게요.
              </MentalCardText>
              <MentalCardText className="text-slate-800 font-bold break-keep text-center mt-2">
                마음근육훈련{" "}
                <span className="text-primary font-black">[명상]</span>과{" "}
                <span className="text-primary font-black">[호흡]</span>이에요.
              </MentalCardText>
              <MentalCardText className="mb-10 text-slate-800 font-bold break-keep text-center mt-2">
                카마 코치와 함께 재발 불안을 잘 다뤄봐요.{"\n"}함께 해 볼까요?
              </MentalCardText>
            </MentalCardSummary5>
            <MentalCardFooter showNext={false} />
          </>
        ) : null}

        {step === 10 ? (
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

            <MentalCardText className="mt-6 text-slate-800 font-bold break-keep text-center">
              암 재발에 대한 두려움과 걱정을{" "}
              <span className="text-primary font-black">'암 재발 불안'</span>
              이라고 해요.{"\n"}암 재발 불안을 다스리는 데 도움이 되는 방법이
              있어요.
            </MentalCardText>

            <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-6 text-left font-semibold leading-relaxed text-slate-700 mt-4 space-y-2">
              <p className="text-slate-800 font-bold text-base">
                <span className="text-primary font-black">1.</span> 재발 불안
                이해하기
              </p>
              <p className="text-slate-800 font-bold text-base">
                <span className="text-primary font-black">2.</span> 생각 바꾸기
              </p>
              <p className="text-slate-800 font-bold text-base">
                <span className="text-primary font-black">3.</span> 명상 또는
                이완훈련으로 안정감 느끼기
              </p>
            </div>

            <MentalCardText className="mt-5 text-slate-800 font-bold break-keep text-center">
              마음 근육훈련을 활용해 불안을 줄이고 하루하루를{" "}
              <span className="text-primary font-black">의미있게 살아가길</span>{" "}
              바랄게요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={onSave} nextLabel="완료" />
          </MentalCardPanel>
        ) : null}
      </div>
    </div>
  );
}
