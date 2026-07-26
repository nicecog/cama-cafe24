import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Check } from "lucide-react";
import image61 from "@/assets/images/coaching/mental/61.png";
import advice1Image from "@/assets/images/coaching/mental/advice1.png";
import advice3Image from "@/assets/images/coaching/mental/advice3.png";
import mentalHeaderImage from "@/assets/images/coaching/mental/mentalheader.png";
import missionImage from "@/assets/images/coaching/mental/mission.png";
import MissionTitle from "@/routes/_auth/_coaching/coaching/-components/elements/MissionTitle";
import useAlert from "@/hooks/useAlert";
import resultImage from "@/assets/images/character/result.png";

import ImporText from "../../component/-ImportText";
import { MentalCardSummary1, MentalCardSummary3 } from "../CardSummary";
import {
  MentalCardFooter,
  MentalCardImage,
  MentalCardPanel,
  MentalCardText,
  MentalCardBubble,
} from "../Cards/-components";
import {
  CareCardImageChoiceButton,
  CareCardSurface,
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

function SummaryItem({ title, body }: { title: string; body: string }) {
  const match = title.match(/^(\d+)\.\s*(.*)$/);
  const num = match ? match[1] : "";
  const name = match ? match[2] : title;

  return (
    <div className="flex items-start gap-3.5 py-3 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0">
      {num && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary border border-primary/20 mt-0.5">
          {num}
        </div>
      )}
      <div className="text-left font-bold text-slate-800 break-keep">
        <p className="font-extrabold text-slate-800 text-sm sm:text-base">
          {name}
        </p>
        <p className="text-sm font-semibold leading-normal text-slate-500 mt-1">
          {body}
        </p>
      </div>
    </div>
  );
}

export default function MentalCareCard1({ onSave }: { onSave: () => void }) {
  const step = useAtomValue(careCardStepAtom);
  const setMax = useSetAtom(careCardMaxStepAtom);
  const init = useSetAtom(initCareCardAtom);
  const next = useSetAtom(nextCareCardStepAtom);
  const prev = useSetAtom(prevCareCardStepAtom);
  const prevSection = useSetAtom(prevSectionStepAtom);
  const { alert, confirm } = useAlert();
  const [showBreathingReview, setShowBreathingReview] = useState(false);
  const [showMeditationReview, setShowMeditationReview] = useState(false);

  useCareCardStepScrollReset(step);

  useEffect(() => {
    setMax(12);
    return () => {
      init();
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
            {step} <span className="text-emerald-800/40">/ 12</span>
          </div>
        </div>

        {step === 1 && (
          <MentalCardPanel>
            <div className="relative flex flex-col items-center mb-6">
              {/* 말풍선 카드 */}
              <div className="relative w-11/12 max-w-[22rem] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl py-5 px-5 mb-4 text-center z-20">
                <div className="relative z-10 space-y-2 text-center font-extrabold leading-relaxed text-primary break-keep text-base sm:text-lg">
                  <p>"왜 이렇게 피곤하고 무기력하지?"</p>
                  <p>"재미가 없어."</p>
                  <p>"아… 힘이 없어…"</p>
                  <p>"자꾸 깜빡깜빡하게 돼."</p>
                  <p>"잠을 자도 피로가 풀리지 않아…"</p>
                </div>
                <div className="mx-auto mt-3 h-[3px] w-6 rounded-full bg-primary/20" />

                {/* 말풍선 꼬리 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 border-x-[12px] border-x-transparent border-t-[14px] border-t-white/95 drop-shadow-sm" />
              </div>

              {/* 캐릭터 */}
              <img
                src={image61}
                alt="피로감"
                className="w-[180px] drop-shadow-md animate-soft-float z-10"
              />
            </div>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              혹시 암을 경험하며 유독 피로감을 느끼진 않으신가요? <br />
              피로감 때문에 일상생활에 지장이 있을 정도라 곤혹스러울 수도
              있어요.
            </MentalCardText>
            <MentalCardFooter onPrev={prevSection} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 2 && (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              이런 것을
              <br />
              <ImporText className="!mx-0">
                '암성 피로(Cancer-related fatigue)'
              </ImporText>
              <br />
              라고 해요.
              <br />
              암환자가 흔히겪는 증상 중 하나입니다.
            </MentalCardText>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px]"
            />
            <MentalCardText className="mt-3 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              암성피로는 일반적으로 느끼는 피로와는 달라요. 암성피로는 암이라는
              병 자체 또는 <ImporText className="!mx-0">치료과정</ImporText>에서
              생기기도 하고,{" "}
              <ImporText className="!mx-0">신체적·심리적 문제</ImporText> 때문에
              생길 수도 있어요. 그렇지만 으레 피곤하려니 하며 넘어가는 경우도
              많지요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 3 && (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              암 관련 피로는 원인이 매우 다양하기 때문에 먼저 피로의 원인을
              알고, 그에 맞게 관리하는 것이 필요해요.
              <br />
              암환자가 흔히겪는 증상 중 하나입니다.
            </MentalCardText>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px]"
            />
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              많이 피로하다고 암이 재발하는 건 <br />
              아니니 너무 걱정하지 마세요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              피로는 관리해야 할 증상 중 하나에요. <br />
              도움이 되는 꿀팁을 알려드릴게요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 4 && (
          <MentalCardPanel>
            <MentalCardBubble>1. 에너지를 효율적으로 쓰기</MentalCardBubble>
            <MentalCardText className="mt-6 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              핸드폰으로 이것 저것 조금 검색했더니 금방 배터리가 닳아버릴 때가
              있지요?
            </MentalCardText>
            <MentalCardText className="mt-4 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              배터리를 아끼기 위해선 꼭 필요한 것들만 하고, 불필요한 것들을
              삭제하고, 충분히 충전해야하는 것처럼 우리 몸과 마음도
              마찬가지에요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              몸과 마음의 에너지가 고갈되지 않도록 자원을 효율적으로 써야하는
              것이지요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 5 && (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              하루의 일과를 적어보고 우선순위를 매겨보세요. 그리고 중요한
              일부터, 가능한만큼 하는거에요.
            </MentalCardText>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px]"
            />
            <MentalCardText className="mt-3 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              혹시 너무 많은 것을 해야한다고 생각하나요? <br />
              모든걸 아주 잘 해내야만 한다고 느끼시나요?
            </MentalCardText>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center leading-relaxed font-bold text-slate-800 shadow-[0_4px_12px_rgba(15,23,42,0.02)] break-keep mt-5">
              나의 기대치가 어느 정도인지 점검하고, <br />
              현실적으로 조정하는 것도 현명한 방법이에요.
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 6 && (
          <MentalCardPanel>
            <div className="space-y-8 mt-6 px-2 text-left w-full">
              <div>
                <h3 className="text-lg font-black text-slate-800 leading-snug mb-4 break-keep">
                  필요하다면 도움을 받기도 하세요.
                </h3>
                <div className="space-y-4 font-bold text-slate-700 text-base leading-relaxed break-keep">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                    <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                      혼자서 다 할 수 없어요.
                    </span>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                    <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                      도움을 받으면 나중에 나도 도움을 줄 수 있어요.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-800 leading-snug mb-4 break-keep">
                  하지 않아도 되는 일은 내버려두는 <br />
                  것도 필요해요.
                </h3>
                <div className="space-y-4 font-bold text-slate-700 text-base leading-relaxed break-keep">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                    <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                      하지 않는 것도 선택이에요.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 7 && (
          <MentalCardPanel>
            <div className="text-left mt-6 px-2 w-full">
              <h3 className="text-lg font-black text-slate-800 leading-snug mb-3 break-keep">
                활동 일기를 써 보는 것은 어떨까요?
              </h3>
              <p className="font-bold text-slate-700 text-base leading-relaxed break-keep">
                꼭 해야 할 일을 적고, 정한 만큼만 하는거에요. 휴식 시간도 꼭
                포함해야 한다는 것, <br />
                잊지마세요!
              </p>
            </div>
            <MentalCardImage
              src={advice1Image}
              alt="조언"
              className="w-full max-w-[110px] mt-4 mb-2"
            />
            <MentalCardText className="text-center leading-relaxed font-bold !text-slate-800 break-keep">
              휴식한다는 게 꼭 낮잠을 뜻하지는 않아요. <br />
              밤에 잘 자기 위해선{" "}
              <ImporText className="!mx-0">낮잠은 30분</ImporText> 이내가
              좋아요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 8 && (
          <MentalCardPanel>
            <MentalCardBubble>2. 규칙적으로 생활하기</MentalCardBubble>
            <MentalCardText className="mt-6 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              잠이 보약이라고 하지요. <br />
              잠을 잘 못 자면 피로가 악화될 수 있어요.
            </MentalCardText>
            <MentalCardText className="text-center leading-relaxed font-bold !text-slate-800 break-keep">
              잠을 잘하기 위해서는 수면 습관이 중요해요.
            </MentalCardText>
            <div className="space-y-4 mt-6 px-2 text-left w-full">
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  일정한 시각에 일어나고 잠들기
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  빛과 소음을 차단하기{" "}
                  <span className="text-sm font-medium text-slate-500 pl-1">
                    (암막 커튼 이용, 백색 소음 끄기)
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  카페인, 알코올, 담배 피하기
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  잠들기 전에 물은 너무 많이 마시지 않기
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  잠자리에는 졸릴 때만 눕기
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5 border border-primary/10">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <span className="text-left font-bold leading-relaxed text-slate-700 text-base break-keep mt-0.5">
                  잠들기 전에 흥분될 정도로 재밌는 활동 하지않기
                </span>
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 9 && (
          <MentalCardPanel>
            <MentalCardImage
              src={advice3Image}
              alt="조언"
              className="w-full max-w-[110px]"
            />
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              만약 잠에 들기 어렵거나, 자다 중간에 자꾸 깨거나, 아침에 일어나는
              게 몹시 힘든 날이 계속된다면{" "}
              <ImporText className="!mx-0">전문가</ImporText>의 도움을
              받아보세요.
            </MentalCardText>
            <div className="mt-8 flex justify-center">
              <MissionTitle className="flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/30 px-6 py-2.5 text-rose-700 font-black shadow-[0_4px_12px_rgba(244,63,94,0.02)] text-center text-lg sm:text-xl break-keep">
                단지 피로의 문제가 아닐 수 있어요!
              </MissionTitle>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 10 && (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              또한 규칙적으로 생활하는 것이 좋아요. <br />
              잠을 자는 시간 뿐만 아니라, 운동과 식사도 되도록 일정하게 해
              보세요.
            </MentalCardText>
            <MentalCardText className="mt-4 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              몸과 마음의 균형이 바로 잡히고 에너지 관리에도 도움이 될거에요.
            </MentalCardText>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 11 && (
          <MentalCardPanel>
            <MentalCardBubble>3. 긴장을 풀어요.</MentalCardBubble>
            <div className="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm text-justify mt-5">
              <MentalCardText className="leading-relaxed !text-slate-800 break-keep">
                나도 모르게 긴장하고 있을 때, 피로해지기 쉬워요. 그럴 땐
                마음근육훈련에서 배웠던{" "}
                <ImporText className="!mx-0">복식호흡과 명상</ImporText>
                으로 몸과 마음의 긴장을 푸는 것이 도움돼요.
              </MentalCardText>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex gap-3">
                <CareCardImageChoiceButton
                  className="flex-1"
                  onClick={() =>
                    void alert("카마코치와 복습해볼게요.", () =>
                      setShowBreathingReview(true),
                    )
                  }
                  imageSrc={mentalHeaderImage}
                  imageAlt="복식호흡"
                  label="복식호흡"
                />
                <CareCardImageChoiceButton
                  className="flex-1"
                  onClick={() => setShowMeditationReview(true)}
                  imageSrc={missionImage}
                  imageAlt="명상"
                  label="명상"
                />
              </div>
              <CareCardSurface className="p-0">
                <button
                  type="button"
                  className="h-14 w-full rounded-[28px] px-5 text-base font-extrabold text-slate-500 transition-all hover:text-slate-700"
                  onClick={() =>
                    void confirm(
                      {
                        html: "복식 호흡 과 명상을 이해하는 데 <br/>도움이 되셨나요?",
                      },
                      () => next(),
                    )
                  }
                >
                  오늘은 그만 할게요.
                </button>
              </CareCardSurface>
            </div>
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
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 12 && (
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
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              일상적인 피로감과 달리, 의지와 상관없이 암과 관련된 피로를 느낄 수
              있어요. <br />
              그럴 땐 이런 방법이 도움돼요.
            </MentalCardText>
            <CareCardSurface className="mt-5 border border-slate-200/60 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.03)] p-5">
              <SummaryItem
                title="1. 에너지를 효율적으로 쓰기"
                body="꼭 필요한 일을 우선순위에 따라 하기"
              />
              <SummaryItem
                title="2. 규칙적으로 생활 하기"
                body="규칙적인 식사와 운동, 수면 챙기기"
              />
              <SummaryItem
                title="3. 긴장 풀기"
                body="이완훈련과 명상으로 몸과 마음을 편안하게 하기"
              />
            </CareCardSurface>
            <MentalCardFooter onPrev={prev} onNext={onSave} nextLabel="완료" />
          </MentalCardPanel>
        )}
      </div>
    </div>
  );
}
