import type { ReactNode } from "react";
import { useState } from "react";
import { MessageCircle, Sparkles, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import card2Image from "@/assets/images/coaching/mental/57.png";
import type1Image from "@/assets/images/coaching/mental/type1.png";
import char2Image from "@/assets/images/character/char4.png";
import resultImage from "@/assets/images/character/result.png";

import {
  MentalCardBubble,
  MentalCardFooter,
  MentalCardImage,
  MentalCardOptionList,
  MentalCardPanel,
  MentalCardText,
  CoachingTitle,
} from "../-components";
import { useMentalCardState } from "../-useMentalCardState";
import type { MentalCardProps } from "../-types";
import useAccountName from "@/hooks/useAccountName";

const checklist = [
  "거절하기가 어려워 참는 편이다.",
  "말을 하려고 하면 다툼이 일어난다.",
  "상대방이 싫어할까봐 말하기 어렵다.",
  "상처받아도 괜찮다며 묻어둔다.",
  "상대방의 눈치가 보여 궁금한 것을 묻지 못한다.",
  "해당없음.",
];

function MessageExample({
  children,
  title,
}: {
  children: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-100 bg-white px-5 py-5 shadow-sm">
      <div className="border-b border-slate-100 pb-3 text-left text-base font-bold leading-relaxed text-slate-800">
        {title}
      </div>
      <div className="mt-4 text-left text-lg font-extrabold leading-relaxed text-primary break-keep">
        {children}
      </div>
    </div>
  );
}

export default function MentalCard2({
  onPrev,
  onSave,
  title = "카마코칭",
}: MentalCardProps) {
  const accountName = useAccountName();
  const { currentAnswers, next, prev, step, toggleAnswer } =
    useMentalCardState(9);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  const handleStep1Next = () => {
    if (currentAnswers.length > 0) {
      next();
      return;
    }

    setShowEmptyConfirm(true);
  };

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
            {step} <span className="text-emerald-800/40">/ 9</span>
          </div>
        </div>
        {step === 1 ? (
          <MentalCardPanel>
            <div className="relative flex flex-col items-center mb-2">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[20rem] bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl py-6 px-5 mb-4 text-center z-20">
                <h2 className="relative z-10 text-xl font-black text-slate-800 leading-snug break-keep text-pretty tracking-tight">
                  {title}
                </h2>
                <div className="mx-auto mt-3 h-[3px] w-6 rounded-full bg-primary/20" />

                {/* 말풍선 꼬리 (아래로 향하게) */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/90 drop-shadow-sm" />
              </div>

              {/* 캐릭터 (말풍선 아래에 배치) */}
              <img
                src={char2Image}
                alt="카마 코치"
                className="w-[110px] drop-shadow-md animate-soft-float z-10"
              />
            </div>
            <MentalCardText className="mt-8 text-slate-600">
              평소 {accountName}님의 생각은 어떠신가요?{"\n"}해당되는 것에 모두
              체크해보아요.
            </MentalCardText>
            <div className="mt-6">
              <MentalCardOptionList
                values={checklist}
                selectedValues={currentAnswers}
                onToggle={toggleAnswer}
              />
            </div>
            {showEmptyConfirm ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center text-base font-bold leading-relaxed text-amber-800">
                해당되는 항목이 없으신가요 ?
                <div className="mt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 rounded-2xl text-base font-extrabold"
                    onClick={() => setShowEmptyConfirm(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-2xl text-base font-extrabold"
                    onClick={() => {
                      setShowEmptyConfirm(false);
                      next();
                    }}
                  >
                    확인
                  </Button>
                </div>
              </div>
            ) : null}
            <MentalCardFooter onPrev={onPrev} onNext={handleStep1Next} />
          </MentalCardPanel>
        ) : null}

        {step === 2 ? (
          <MentalCardPanel>
            <MentalCardImage src={type1Image} alt="type" />
            <MentalCardText className="mt-5">
              앞선 보기에 많이 해당할수록 상대방과 소통하면서 자신의 욕구나
              감정이 충족되지 못할 가능성이 커요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 3 ? (
          <MentalCardPanel>
            <MentalCardImage src={advice1Image} alt="advice" />
            <MentalCardText className="mt-5">
              화내거나 싸우지 않고, 일방적으로 참거나 양보하지 않더라도 내
              욕구를 충분히 채울 수 있어요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              마음건강에 도움이 되는 소통의 비법,{" "}
              <span className="font-extrabold text-primary">
                '나 말하기 기법'
              </span>
              을 소개할게요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 4 ? (
          <MentalCardPanel>
            <CoachingTitle icon={MessageCircle}>
              나 말하기 기법(I-message)
            </CoachingTitle>
            <MentalCardImage
              src={card2Image}
              alt="나 말하기 기법"
              className="w-full max-w-[240px] -mt-10"
            />
            <div className="w-full space-y-3 mt-4">
              <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                  1
                </div>
                <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                  상대방의 <span className="text-primary font-black">행동</span>에 대해서 이야기한다.
                </p>
              </div>

              <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                  2
                </div>
                <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                  그로 인한 나의 <span className="text-primary font-black">감정</span>을 이야기한다.
                </p>
              </div>

              <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                  3
                </div>
                <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                  <span className="text-primary font-black">바라는 것</span>을 구체적으로 이야기한다.
                </p>
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 5 ? (
          <MentalCardPanel>
            <MentalCardBubble>예시를 살펴볼까요 ?</MentalCardBubble>
            <div className="mt-8 w-full rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-5 py-5">
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full w-fit mb-3">
                상황
              </div>
              <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                원하지 않는 음식을 몸에 좋다며 자꾸 권하는 가족
              </p>
            </div>
            <MentalCardText className="mt-5">
              <span className="font-extrabold text-primary">
                "나 말하기 기법"
              </span>
              을 사용한다면, 어떻게 말할 수 있을까요?
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 6 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              나 말하기 기법 <br />
              (I-message)
            </MentalCardBubble>
            <div className="mt-5 space-y-4">
              <MessageExample
                title={
                  <>
                    첫째 상대방의{" "}
                    <span className="text-primary underline">행동</span>에
                    대해서 말한다.
                  </>
                }
              >
                "지금 먹고 싶지 않은데 자꾸 권하네."
              </MessageExample>
              <MessageExample
                title={
                  <>
                    둘째 그로 인한 나의{" "}
                    <span className="text-primary underline">감정</span>을
                    이야기한다.
                  </>
                }
              >
                "미안하기도 하고 부담스럽기도 해."
              </MessageExample>
              <MessageExample
                title={
                  <>
                    셋째{" "}
                    <span className="text-primary underline">바라는 것</span>을
                    구체적으로 이야기한다.
                  </>
                }
              >
                "다음에 먹고 싶다고 할 때 갖다 주면 좋겠어."
              </MessageExample>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 7 ? (
          <MentalCardPanel>
            <MentalCardBubble>
              <p className="mb-1.5">어떠신가요 ?</p>또 다른 예시를 살펴볼까요 ?
            </MentalCardBubble>
            <div className="mt-5 w-full rounded-[28px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-5 py-5">
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full w-fit mb-3">
                상황
              </div>
              <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                치료 방법에 대해 고민하며 배우자에게 걱정을 털어놓자 핸드폰을
                쳐다보며 '걱정마'라고 이야기한다.
              </p>
            </div>
            <div className="mt-5 space-y-4">
              <MessageExample
                title={
                  <>
                    첫째 상대방의{" "}
                    <span className="text-primary underline">행동</span>에
                    대해서 말한다.
                  </>
                }
              >
                "핸드폰을 쳐다보며 걱정하지 말라고 말했다."
              </MessageExample>
              <MessageExample
                title={
                  <>
                    둘째 그로 인한 나의{" "}
                    <span className="text-primary underline">감정</span>을
                    이야기한다.
                  </>
                }
              >
                "함께 의논하고 싶었는데 서운해."
              </MessageExample>
              <MessageExample
                title={
                  <>
                    셋째{" "}
                    <span className="text-primary underline">바라는 것</span>을
                    구체적으로 이야기한다.
                  </>
                }
              >
                "나는 혼자 결정하는 것이 두려우니까 의사결정을 도와주면 좋겠어."
              </MessageExample>
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
            <MentalCardText className="mt-5">
              <span className="font-extrabold text-primary">
                '나 말하기 기법'
              </span>
              으로 건강하게 소통해보세요. 스트레스는 줄고 소중한 관계는 깊어질
              거에요.
            </MentalCardText>
            <div className="mt-5 rounded-[28px] bg-slate-50 px-5 py-6">
              <CoachingTitle icon={MessageCircle}>"나 말하기"</CoachingTitle>
              <div className="w-full space-y-3 mt-4">
                <div className="flex items-center gap-3.5 bg-white border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] rounded-2xl p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                    1
                  </div>
                  <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                    상대방의 <span className="text-primary font-black">행동</span>에 대해서 이야기해요.
                  </p>
                </div>

                <div className="flex items-center gap-3.5 bg-white border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] rounded-2xl p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                    2
                  </div>
                  <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                    그로 인한 나의 <span className="text-primary font-black">감정</span>을 말하고,
                  </p>
                </div>

                <div className="flex items-center gap-3.5 bg-white border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] rounded-2xl p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                    3
                  </div>
                  <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                    <span className="text-primary font-black">바라는 것</span>을 구체적으로 알리는거에요.
                  </p>
                </div>
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 9 ? (
          <MentalCardPanel>
            <CoachingTitle icon={Sparkles}>
              오늘부터 일상에서 연습해 보세요
            </CoachingTitle>
            <MentalCardText className="!mt-2">
              특히 다음과 같은 상황은 훈련하기에 아주 좋은 순간이에요!
            </MentalCardText>
            
            <div className="w-full space-y-3 mt-4">
              <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                  마음이 불편하지만 꾹 참고 넘어가려고 할 때
                </p>
              </div>
              <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                  자꾸 상대방을 비난하게 될 때
                </p>
              </div>
              <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <p className="text-left text-base font-extrabold leading-relaxed text-slate-800">
                  거절하기 어렵다고 느낄 때
                </p>
              </div>
            </div>

            <div className="w-full mt-6 p-5 rounded-[2rem] bg-emerald-50/60 border border-emerald-100/80 relative overflow-hidden">
              <div className="absolute -right-5 -bottom-5 text-primary/10 opacity-30">
                <Heart className="w-24 h-24" />
              </div>
              <p className="text-left text-sm font-semibold leading-relaxed text-slate-600 relative z-10 whitespace-pre-line">
                지금까지 말하기 어려웠던 이유가 분명 있을 거에요.{"\n"}괜찮아요. 지금부터 연습하면 편안하고 홀가분한 순간이 많아질 거에요.
              </p>
              <p className="mt-4 text-left text-base font-black text-primary relative z-10 flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-primary text-primary" />
                언제나 당신 편인 카마코치가 함께할게요!
              </p>
            </div>

            <MentalCardFooter
              onPrev={prev}
              onNext={() => onSave([])}
              nextLabel="완료"
            />
          </MentalCardPanel>
        ) : null}
      </div>
    </div>
  );
}
