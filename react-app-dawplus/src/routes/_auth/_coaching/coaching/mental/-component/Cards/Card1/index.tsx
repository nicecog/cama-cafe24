import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import breathingImage from "@/assets/images/coaching/mental/56.png";
import type1Image from "@/assets/images/coaching/mental/type1.png";
import char4Image from "@/assets/images/character/char4.png";
import resultImage from "@/assets/images/character/result.png";
import readyImage from "@/assets/images/character/hello/helloType1.png";

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

const bodyChecklist = [
  "늘 긴장되어 있다.",
  "신경성 두통이 있다.",
  "목뒤와 어깨가 뻐근하다.",
  "스트레스를 받으면 소화가 잘 안된다.",
  "눈이 뻑뻑하다.",
  "해당없음.",
];

const timeOptions = ["아침(일어난 직후)", "점심", "저녁", "밤(잠들기 전)"];
const areaOptions = ["방", "거실", "기타"];

export default function MentalCard1({
  onPrev,
  onSave,
  title = "카마코칭",
  type,
}: MentalCardProps) {
  const { confirm, alert } = useDialog();
  const { currentAnswers, next, prev, step, toggleAnswer } =
    useMentalCardState(7);
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [areaExtra, setAreaExtra] = useState("");

  const handleStep1Next = async () => {
    if (currentAnswers.length > 0) {
      next();
      return;
    }

    await confirm("해당되는 항목이 없으신가요 ? ", () => {
      next();
    });
  };

  const handleStep5Next = async () => {
    await confirm(
      {
        title: "안내",
        body: "복식호흡 훈련은 잘 마치셨나요 ? ",
      },
      () => {
        next();
      },
    );
  };

  const handleSave = async () => {
    if (!time || !area) {
      await alert("답변을 선택해 주세요.");
      return;
    }

    if (area === "기타" && !areaExtra.trim()) {
      await alert("답변을 입력해 주세요 ");
      return;
    }

    onSave(
      [time, area === "기타" ? `${area}-${areaExtra}` : area].map(
        (answerChoice) => ({
          answerChoice,
          progressTypeCd: "07",
        }),
      ),
    );
  };

  const summaryLead = {
    전투형: "나는 지금 잘 싸우고 있는 나를 위해 ",
    순응형: "나는 지금 나를 위해 휴식할 ",
    억압형: "나는 지금 나를 위해 휴식할 ",
    자포자기형: " 나는 지금 무기력한 나를 위해 ",
    걱정형: "나는 지금 나를 위해 휴식할 ",
  }[type];

  const step2TypeText = {
    전투형: "내 몸이 전투태세를 갖추느라 늘 긴장상태를 유지하는 것이지요.",
    순응형: "모르는 척 하고 있어도, 몸과 마음은 스트레스를 받고 있는 것이지요",
    억압형: "모르는 척 하고 있어도, 몸과 마음은 스트레스를 받고 있는 것이지요.",
    자포자기형:
      "혼란스럽고 낙담하게 되는 진단과 치료, 몸과 마음을 이완시켜 줄 복식호흡을 소개할게요.",
    걱정형:
      "암에 대한 걱정으로 마음이 꽉 차 있는 만큼, 몸도 늘 긴장하고 있는 거예요.",
  }[type];

  const step6FirstText = {
    전투형: "늘 전투태세인 '전투형' 당신에게 꼭 필요한 건 마음의 휴식!",
    순응형: "오늘은 복식호흡 훈련을 해보았어요.",
    억압형: "스트레스를 피하려고 애쓰는 억압형에게 휴식과 이완은 중요해요.",
    자포자기형:
      "무기력한 당신을 위해, 마음이 쉴 수 있는 복식호흡 훈련을 해보았어요.",
    걱정형: "늘 긴장중인 '걱정형' 당신에게 꼭 필요한 건 편안한 느낌!",
  }[type];

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
            {step} <span className="text-emerald-800/40">/ 7</span>
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
                src={char4Image}
                alt="카마 코치"
                className="w-[110px] drop-shadow-md animate-soft-float z-10"
              />
            </div>
            <MentalCardText className="mt-8 text-slate-600">
              평소 당신의 몸은 어떠신가요 ?{"\n"}해당되는 것에 모두 체크해
              주세요.
            </MentalCardText>
            <div className="mt-6">
              <MentalCardOptionList
                values={bodyChecklist}
                selectedValues={currentAnswers}
                onToggle={toggleAnswer}
              />
            </div>
            <MentalCardFooter onPrev={onPrev} onNext={handleStep1Next} />
          </MentalCardPanel>
        ) : null}

        {step === 2 ? (
          <MentalCardPanel>
            <MentalCardImage src={type1Image} alt="type" />
            <MentalCardText className="mt-5">
              앞선 보기에 많이 해당할수록 평소에 더 많이 긴장하거나 불안해하고
              있다는 뜻이에요.
            </MentalCardText>
            <MentalCardText className="mt-5">{step2TypeText}</MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 3 ? (
          <MentalCardPanel>
            <MentalCardImage src={advice1Image} alt="advice" />
            <MentalCardText className="mt-5">
              마음은 몸의 반응, 즉 신체의 감각과도 아주 긴밀하게 연결되어
              있어요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              불안할 때 심장이 두근거리고 식은땀이 나고 호흡이 가빠지는
              것처럼요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              암에 맞서 나를 지키기 위해, 몸은 신경을 바짝 곤두세우게 된답니다.
              근육에는 힘이 들어가고요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              그러나 늘 이런 상태로 지낸다면 마치 브레이크가 고장난 자동차처럼
              엔진이 과열되어 버릴거에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 4 ? (
          <MentalCardPanel>
            <CoachingTitle icon={Sparkles}>
              놀랍도록 몸과 마음이{"\n"}편안해지는 마법!
            </CoachingTitle>
            <div className="flex flex-col items-center -mt-3 ">
              <MentalCardImage
                src={breathingImage}
                alt="복식호흡"
                className="w-full max-w-[240px] -mt-5"
              />
              <p className="text-center text-base font-extrabold text-slate-800 break-keep -mt-10">
                <span className="text-primary font-black">복식호흡</span>을
                꾸준히 연습해 보아요.
              </p>
            </div>
            <MentalCardText>
              이때 브레이크 역할을 해주는 게{" "}
              <span className="font-extrabold text-primary">복식호흡</span>{" "}
              훈련이에요. 몸의 긴장을 풀고 평온함을 찾도록 도와주지요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 5 ? (
          <MentalCardPanel>
            <div className="overflow-hidden rounded-[28px] bg-slate-900 shadow-md">
              <div className="aspect-video w-full">
                <iframe
                  title="복식호흡"
                  src="https://www.youtube.com/embed/o42JtHKTcew"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="relative flex flex-col items-center mt-4 mb-2">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[22rem] bg-white/90 backdrop-blur-xl border border-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.05)] rounded-3xl py-6 px-6 mb-4 text-center z-20">
                <p className="relative z-10 text-lg font-medium text-slate-700 leading-relaxed break-keep">
                  우선,{" "}
                  <span className="text-primary font-black">편안한 자세</span>로
                  자리에
                  <br />
                  <span className="text-slate-900 font-black">앉거나 누워</span>{" "}
                  보세요.
                </p>
                <div className="mt-3">준비되셨으면 시작할게요.</div>

                {/* 말풍선 꼬리 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/90 drop-shadow-sm" />
              </div>

              {/* 캐릭터 */}
              <img
                src={readyImage}
                alt="준비"
                className="w-[110px] drop-shadow-md animate-soft-float z-10"
              />
            </div>
            <MentalCardFooter onPrev={prev} onNext={handleStep5Next} />
          </MentalCardPanel>
        ) : null}

        {step === 6 ? (
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

            <MentalCardText className="mt-6">{step6FirstText}</MentalCardText>
            {type !== "자포자기형" ? (
              <MentalCardText className="mt-5">
                오늘은 <span className="text-primary font-black">복식호흡</span>{" "}
                훈련을 해보았어요.
              </MentalCardText>
            ) : null}
            <MentalCardText className="mt-5">
              마음이 편안해지는 것을 느끼셨나요?{"\n"}잘 못하셔도 괜찮아요.
            </MentalCardText>
            <MentalCardText className="mt-5">
              <span className="text-primary font-black">복식호흡</span>이
              익숙해지는 그 날까지,{"\n"}카마코치가 함께할게요.
            </MentalCardText>

            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        ) : null}

        {step === 7 ? (
          <MentalCardPanel>
            <MentalCardText>
              마음근육을 키우기 위해서는 규칙적으로 훈련하는게 좋아요.{"\n"}
              <span className="text-primary font-black">
                1주일에 2번, 10분 이상
              </span>
              씩 연습해 보아요. 카마코치와 함께 일정을 정해 볼게요.
            </MentalCardText>

            <div className="mt-6 text-center">
              <p className="text-lg font-black leading-snug text-slate-800 break-keep">
                1. 복식호흡을 하기에 가장 편안한 {"\n"}시간을 찾아볼까요?
              </p>
              <div className="grid grid-cols-2 gap-1.5 mt-3.5">
                {timeOptions.map((value) => {
                  const checked = time === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTime(value)}
                      className={`rounded-xl border py-2.5 text-center text-sm font-black leading-relaxed transition-all ${
                        checked
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary/20"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg font-black leading-snug text-slate-800 break-keep">
                2. 복식호흡을 하기에 가장 편안한 {"\n"}장소를 찾아볼까요?
              </p>
              <div className="grid grid-cols-3 gap-1.5 mt-3.5">
                {areaOptions.map((value) => {
                  const checked = area === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setArea(value)}
                      className={`rounded-xl border py-2.5 text-center text-sm font-black leading-relaxed transition-all ${
                        checked
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary/20"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              {area === "기타" ? (
                <input
                  value={areaExtra}
                  onChange={(event) => setAreaExtra(event.target.value)}
                  className="mt-3.5 h-12 w-full rounded-xl border border-slate-200 px-4 text-base font-bold text-slate-800 outline-none"
                />
              ) : null}
            </div>

            {time && area && (area !== "기타" || areaExtra.trim()) ? (
              <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/10 p-5 text-center text-base font-extrabold leading-relaxed text-slate-800 break-keep">
                <p className="mb-2">
                  {summaryLead}계획을 세웠어요.{"\n"}몸과 마음을 충전해서 잘
                  대처해 나가볼게요.
                </p>
                <div className="mt-3.5 pt-3.5 border-t border-primary/10 text-center font-extrabold text-slate-800 flex flex-col items-center gap-1.5">
                  <span className="text-base text-primary font-black">
                    {time}에 {area === "기타" ? areaExtra : area}에서 연습해 볼
                    거에요.
                  </span>
                </div>
              </div>
            ) : null}

            <MentalCardFooter
              onPrev={prev}
              onNext={handleSave}
              nextLabel="완료"
            />
          </MentalCardPanel>
        ) : null}
      </div>
    </div>
  );
}
