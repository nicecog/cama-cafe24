import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Check, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";
import image62 from "@/assets/images/coaching/mental/62.png";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import resultImage from "@/assets/images/character/result.png";
import mentalHeaderImage from "@/assets/images/coaching/mental/mentalheader.png";
import missionImage from "@/assets/images/coaching/mental/mission.png";
import useAlert from "@/hooks/useAlert";
import ImporText from "../../component/ImportText";
import {
  MentalCardSummary1,
  MentalCardSummary2,
  MentalCardSummary3,
  MentalCardSummary4,
} from "../CardSummary";
import {
  MentalCardFooter,
  MentalCardImage,
  MentalCardPanel,
  MentalCardText,
  MentalCardBubble,
} from "../Cards/-components";
import {
  useCareCardStepScrollReset,
} from "./-components";
import { prevStepAtom as prevSectionStepAtom } from "../../Section6/-session6Atoms";
import {
  careCardMaxStepAtom,
  careCardStepAtom,
  initCareCardAtom,
  nextCareCardStepAtom,
  prevCareCardStepAtom,
} from "./-atoms";

function ThoughtCard({
  thought,
  alternative,
}: {
  thought: React.ReactNode;
  alternative: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="bg-slate-200/50 border border-slate-200 rounded-t-[2rem] rounded-b-2xl p-5 pb-8 text-left">
        <div className="inline-flex items-center gap-1.5 bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2 shadow-sm">
          <MessageCircle className="w-3.5 h-3.5" /> 떠오른 생각
        </div>
        <div className="text-slate-700 text-lg font-bold leading-snug break-keep">
          {thought}
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-5 -mt-5 relative z-10 text-left">
        <div className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> 대안적인 생각
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <span className="text-slate-700 font-bold leading-relaxed break-keep text-base">
            {alternative}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MentalCareCard2({ onSave }: { onSave: () => void }) {
  const step = useAtomValue(careCardStepAtom);
  const setMax = useSetAtom(careCardMaxStepAtom);
  const init = useSetAtom(initCareCardAtom);
  const next = useSetAtom(nextCareCardStepAtom);
  const prev = useSetAtom(prevCareCardStepAtom);
  const prevSection = useSetAtom(prevSectionStepAtom);
  const setStep = useSetAtom(careCardStepAtom);
  const { confirm } = useAlert();
  useCareCardStepScrollReset(step);
  const [showThinkingReview, setShowThinkingReview] = useState(false);
  const [showMessageReview, setShowMessageReview] = useState(false);
  const [showBreathingReview, setShowBreathingReview] = useState(false);
  const [showMeditationReview, setShowMeditationReview] = useState(false);

  useEffect(() => {
    setMax(8);
    return () => {
      init();
      setShowThinkingReview(false);
      setShowMessageReview(false);
      setShowBreathingReview(false);
      setShowMeditationReview(false);
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

        {step === 1 && (
          <MentalCardPanel>
            <div className="relative flex flex-col items-center mb-6">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[22rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl py-5 px-5 mb-4 text-center z-20">
                <div className="relative z-10 space-y-2 text-center font-extrabold leading-relaxed text-primary break-keep text-base sm:text-lg">
                  <p>
                    "마음대로 먹을 수 없는 게 <br />
                    너무 큰 스트레스에요."
                  </p>
                  <p>
                    "냄새가 날까봐 걱정돼서 <br />늘 조마조마해요."
                  </p>
                  <p>"처리가 어려워 외출을 못 하겠어요."</p>
                  <p>"배우자에게 눈치가 보여요."</p>
                </div>
                <div className="mx-auto mt-3 h-[3px] w-6 rounded-full bg-primary/20" />
                {/* 말풍선 꼬리 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/95 drop-shadow-sm" />
              </div>
              {/* 캐릭터 */}
              <img
                src={image62}
                alt="장루"
                className="w-[180px] drop-shadow-md animate-soft-float z-10"
              />
            </div>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              혼자서 마음 고생이 많으셨지요? <br />
              장루는 처음에는 관리하는 것도 서툴고, 조절도 잘 안되고 먹는 것에
              제약이 생기기도 하는 등 여러가지 스트레스를 동반하는 일이에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prevSection} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 2 && (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              우울하거나 불안하기도 하고, 몸에 대한 부정적인 이미지를 갖게
              되기도 해요. <br />
              자연스럽고 건강한 성 관계나 친밀감에도 영향을 미칠 수 있고요.
              <br /> 이런 어려움은 장루 환자들이 보편적으로 겪을 수 있는
              일이에요.
            </MentalCardText>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              생명을 유지하고, 치료 이후에 삶으로 복귀할 수도 있도록 도와주는{" "}
              <ImporText className="!mx-0">장루</ImporText>
            </MentalCardText>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              스트레스를 잘 관리하며 지내실 수 있도록{" "}
              <ImporText className="!mx-0">카마 코치</ImporText>가 도와드릴게요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 3 && (
          <MentalCardPanel>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px] mt-6 mb-2 animate-soft-float filter drop-shadow-md"
            />
            <MentalCardText className="mt-5 text-center leading-relaxed font-extrabold text-lg !text-slate-800 break-keep">
              우선, 장루를 잘 다룰 수 있는 방법을 알아야해요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              특히 수술 초기에는 장루 관리에 대해 적절히 교육을 받는 것이
              중요해요. 또한, 식이조절도 도움이 돼요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              문제가 있을 때 적극적으로 대처하는 건 정말 좋은 방법이랍니다.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 4 && (
          <MentalCardPanel>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px] mt-6 mb-2 animate-soft-float filter drop-shadow-md"
            />
            <MentalCardText className="mt-5 text-center leading-relaxed font-extrabold text-lg !text-slate-800 break-keep">
              냄새에 대한 걱정은 많은 분들의 <br />
              고민이에요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              기본적으로는 냄새가 나지 않도록 하는 기능이 있지만, 주머니를
              청결하게 관리하고 식이 조절을 한다면 배출물을 효과적으로 관리할 수
              있을 거에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 5 && (
          <MentalCardPanel>
            <div className="flex items-end gap-3.5 mb-2 w-full max-w-[28rem] mx-auto">
              <img
                src={advice1Image}
                alt="조언"
                className="w-[75px] shrink-0 drop-shadow-md animate-soft-float"
              />
              <div className="relative flex-1 bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_6px_20px_rgba(0,0,0,0.04)] rounded-2xl py-3.5 px-4 text-left">
                <div className="text-slate-800 font-bold leading-relaxed break-keep text-sm sm:text-base">
                  이러한 스트레스에는 앞에서 배운 <strong className="text-primary font-extrabold">마음근육훈련</strong>도 도움이 돼요. 함께 살펴볼까요?
                </div>
                {/* 말풍선 꼬리 */}
                <div className="absolute bottom-4 -left-2 border-y-[6px] border-y-transparent border-r-[8px] border-r-white/95 drop-shadow-sm" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              {/* 생각바꾸기 */}
              <button
                type="button"
                onClick={() => setShowThinkingReview(true)}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/85 bg-white/80 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(16,185,129,0.08)] hover:border-emerald-200 active:scale-95 group"
              >
                <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-emerald-100 transition-all duration-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm tracking-tight">생각바꾸기</span>
              </button>

              {/* 나 말하기 기법 */}
              <button
                type="button"
                onClick={() => setShowMessageReview(true)}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/85 bg-white/80 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(59,130,246,0.08)] hover:border-blue-200 active:scale-95 group"
              >
                <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-blue-100 transition-all duration-300">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm tracking-tight">나 말하기 기법</span>
              </button>

              {/* 복식호흡 */}
              <button
                type="button"
                onClick={() => setShowBreathingReview(true)}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/85 bg-white/80 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(14,165,233,0.08)] hover:border-sky-200 active:scale-95 group"
              >
                <div className="h-11 w-11 rounded-xl bg-sky-50 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-sky-100 transition-all duration-300 p-1.5">
                  <img src={mentalHeaderImage} alt="복식호흡" className="w-full h-full object-contain" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm tracking-tight">복식호흡</span>
              </button>

              {/* 명상 */}
              <button
                type="button"
                onClick={() => setShowMeditationReview(true)}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/85 bg-white/80 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(168,85,247,0.08)] hover:border-purple-200 active:scale-95 group"
              >
                <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-purple-100 transition-all duration-300 p-1.5">
                  <img src={missionImage} alt="명상" className="w-full h-full object-contain" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm tracking-tight">명상</span>
              </button>
            </div>

            <div className="mt-4 w-full">
              <button
                type="button"
                onClick={() =>
                  void confirm(
                    { html: "도움이 되셨나요?" },
                    () => setStep(6),
                  )
                }
                className="w-full h-12 rounded-xl border border-dashed border-slate-300 bg-white/40 hover:bg-white/80 text-sm font-extrabold text-slate-500 hover:text-slate-700 transition-all duration-300 active:scale-98 flex items-center justify-center gap-1.5 shadow-sm"
              >
                오늘은 그만 할게요.
              </button>
            </div>

            <MentalCardFooter onPrev={prev} showNext={false} />
            <MentalCardSummary4
              open={showThinkingReview}
              setOpen={setShowThinkingReview}
              onComplete={() => {
                setShowThinkingReview(false);
              }}
            />
            <MentalCardSummary2
              open={showMessageReview}
              setOpen={setShowMessageReview}
              onComplete={() => {
                setShowMessageReview(false);
              }}
            />
            <MentalCardSummary1
              open={showBreathingReview}
              setOpen={setShowBreathingReview}
              onComplete={() => {
                setShowBreathingReview(false);
              }}
            />
            <MentalCardSummary3
              open={showMeditationReview}
              setOpen={setShowMeditationReview}
              onComplete={() => {
                setShowMeditationReview(false);
              }}
            />
          </MentalCardPanel>
        )}

        {step === 6 && (
          <MentalCardPanel>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px] mt-6 mb-2 animate-soft-float filter drop-shadow-md"
            />
            <MentalCardText className="mt-5 text-center leading-relaxed font-extrabold text-lg !text-slate-800 break-keep">
              장루를 갖고 있는 환자들이 흔히 할 수 있는 생각들이에요.
            </MentalCardText>
            <div className="space-y-4 mt-6 px-2 text-left w-full">
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  '사람들이 냄새난다고 싫어할거야.'
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  '터지면 어떡하지, 외출을 안 하는게 나아.'
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  '장루 때문에 성적으로 매력이 없을거야.'
                </span>
              </div>
            </div>
            <MentalCardFooter onPrev={() => setStep(5)} onNext={() => setStep(7)} />
          </MentalCardPanel>
        )}

        {step === 7 && (
          <MentalCardPanel>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px] mt-6 mb-2 animate-soft-float filter drop-shadow-md"
            />
            <MentalCardText className="mt-5 text-center leading-relaxed font-extrabold text-lg !text-slate-800 break-keep mb-6">
              마음근육훈련에서 배운 방법으로 생각을 바꿔볼까요?
            </MentalCardText>
            <div className="space-y-6 w-full">
              <ThoughtCard
                thought={<>'사람들이 냄새난다고 싫어할거야.'</>}
                alternative={
                  <>
                    "가까운 사람들은 사정을 알면 <br />
                    이해해줄거야."
                  </>
                }
              />
              <ThoughtCard
                thought={
                  <>
                    '터지면 어떡하지, <br />
                    외출을 안 하는게 나아.'
                  </>
                }
                alternative={
                  <>
                    "미리 관리를 잘 하면 터지지 <br /> 않을 수 있어."
                  </>
                }
              />
              <ThoughtCard
                thought={
                  <>
                    '장루 때문에 성적으로 매력이 <br /> 없을거야.'
                  </>
                }
                alternative={
                  <>"장루도 내 몸의 일부이니 자연스럽게 봐 줄거야."</>
                }
              />
            </div>
            <MentalCardFooter onPrev={() => setStep(6)} onNext={() => setStep(8)} />
          </MentalCardPanel>
        )}

        {step === 8 && (
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
            <div className="flex flex-col items-center w-full mt-6">
              <h3 className="text-2xl font-black text-slate-800 mb-4">
                수고하셨어요.
              </h3>
              <MentalCardText className="text-center leading-relaxed font-bold !text-slate-800 break-keep">
                장루는 이롭기도 하지만 스트레스를 주기도 해요. 장루 관리법을 잘
                이해하고 스트레스를 조절할 수 있다면 더욱 멋진 삶을 살 수
                있을거에요! <br />
                그때까지 언제나 카마코치가 함께할게요.
              </MentalCardText>
            </div>
            <MentalCardFooter onPrev={() => setStep(7)} onNext={onSave} nextLabel="완료" />
          </MentalCardPanel>
        )}
      </div>
    </div>
  );
}
