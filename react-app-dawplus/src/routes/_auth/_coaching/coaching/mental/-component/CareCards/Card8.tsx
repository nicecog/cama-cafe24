import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import image65 from "@/assets/images/coaching/mental/65.png";
import MissionTitle from "@/routes/_auth/_coaching/coaching/-components/elements/MissionTitle";
import {
  MentalCardFooter,
  MentalCardImage,
  MentalCardPanel,
  MentalCardText,
  MentalCardBubble,
} from "../Cards/-components";
import {
  CareCardSelectButton,
  CareCardSurface,
  useCareCardStepScrollReset,
} from "./-components";
import ImporText from "../../component/ImportText";
import { MentalCardSummary2 } from "../CardSummary";
import { prevStepAtom as prevSectionStepAtom } from "../../Section6/-session6Atoms";
import {
  careCardMaxStepAtom,
  careCardStepAtom,
  initCareCardAtom,
  nextCareCardStepAtom,
  prevCareCardStepAtom,
} from "./-atoms";

function SummaryBox({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const match = title.match(/^(\d+)\.\s*(.*)$/);
  const num = match ? match[1] : "";
  const name = match ? match[2] : title;

  return (
    <CareCardSurface className="mt-4 p-4 text-left border border-slate-100/60 bg-white/95 shadow-[0_4px_16px_rgba(15,23,42,0.02)]">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
        {num && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary border border-primary/20">
            {num}
          </div>
        )}
        <div className="font-extrabold text-slate-800 text-sm sm:text-base">
          {name}
        </div>
      </div>
      <div className="mt-2.5 flex items-start gap-2 text-primary font-bold break-keep">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
        <p className="text-sm sm:text-base leading-relaxed">{body}</p>
      </div>
    </CareCardSurface>
  );
}

function PermaHeading({
  step,
  title,
  english,
}: {
  step: number;
  title: string;
  english: string;
}) {
  return (
    <div className="relative mb-6 text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
      <h2 className="break-keep text-pretty text-2xl font-black leading-snug tracking-tight text-slate-900 sm:text-3xl">
        {step}. {title}
      </h2>
      <p className="text-sm font-bold text-slate-500 mt-1.5">
        ({english})
      </p>
      <div className="mx-auto mt-4 h-[3px] w-8 rounded-full bg-primary/20" />
    </div>
  );
}

export default function MentalCareCard8({ onSave }: { onSave: () => void }) {
  const step = useAtomValue(careCardStepAtom);
  const setMax = useSetAtom(careCardMaxStepAtom);
  const init = useSetAtom(initCareCardAtom);
  const next = useSetAtom(nextCareCardStepAtom);
  const prev = useSetAtom(prevCareCardStepAtom);
  const prevSection = useSetAtom(prevSectionStepAtom);
  useCareCardStepScrollReset(step);
  const [showReview, setShowReview] = useState(false);
  const [advanceAfterReview, setAdvanceAfterReview] = useState(false);

  useEffect(() => {
    setMax(8);
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
            {step} <span className="text-emerald-800/40">/ 8</span>
          </div>
        </div>

        {step === 1 && (
          <MentalCardPanel>
            <MentalCardBubble>
              행복의 기술
              <br />
              팔마(PERMA)
            </MentalCardBubble>
            <div className="flex flex-col items-center">
              <MissionTitle className="mt-5">'다시 행복할 수 있을까?'</MissionTitle>
              <MentalCardImage src={image65} alt="행복" className="w-full max-w-[220px]" />
              <MentalCardText className="mt-4 text-center leading-relaxed font-bold text-slate-800 break-keep">
                그럼요, 암과 함께하는 동안에도 여전히 <ImporText>행복</ImporText>할 수
                있습니다.
                <br />
                카마 코치가 행복의 기술을 알려드릴게요.
              </MentalCardText>
            </div>
            <MentalCardFooter onPrev={prevSection} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 2 && (
          <MentalCardPanel>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold text-slate-800 break-keep">
              암 치료 중에는 여러 가지 부작용이 나타나거나 피로감, 통증 등을 느낄 수
              있어요. <br />
              기분이 가라앉고 삶에 즐거움도 없는 것 같고, 희망을 찾을 수 없기도
              하지요.
            </MentalCardText>
            <MentalCardText className="mt-6 text-center leading-relaxed font-bold text-slate-800 break-keep">
              <ImporText>팔마[PERMA]</ImporText>는 긍정적인 태도와 행동으로 삶의
              질을 높이고, 재발 불안을 줄이며 희망을 높이는{" "}
              <span className="ml-1 font-extrabold underline">5가지</span> 기술이에요.
            </MentalCardText>
            <MentalCardText className="mt-8 text-center font-extrabold tracking-tighter text-slate-800 break-keep">
              5가지 기술의 앞 글자를 따서
              <br /> 팔마라고 해요!
            </MentalCardText>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-sm shadow-primary/20">
                  P
                </div>
                <p className="text-base font-extrabold text-slate-800">
                  ositive emotion <span className="ml-1.5 text-sm font-bold text-slate-500">(긍정 정서)</span>
                </p>
              </div>
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-sm shadow-primary/20">
                  E
                </div>
                <p className="text-base font-extrabold text-slate-800">
                  ngagement <span className="ml-1.5 text-sm font-bold text-slate-500">(몰입)</span>
                </p>
              </div>
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-sm shadow-primary/20">
                  R
                </div>
                <p className="text-base font-extrabold text-slate-800">
                  elationship <span className="ml-1.5 text-sm font-bold text-slate-500">(관계)</span>
                </p>
              </div>
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-sm shadow-primary/20">
                  M
                </div>
                <p className="text-base font-extrabold text-slate-800">
                  eaning <span className="ml-1.5 text-sm font-bold text-slate-500">(의미)</span>
                </p>
              </div>
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white shadow-sm shadow-primary/20">
                  A
                </div>
                <p className="text-base font-extrabold text-slate-800">
                  ccomplishment <span className="ml-1.5 text-sm font-bold text-slate-500">(성취)</span>
                </p>
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 3 && (
          <MentalCardPanel>
            <PermaHeading step={1} title="긍정정서" english="Positive emotion" />
            <div className="mt-5 space-y-5">
              <h3 className="text-center font-black text-xl text-slate-800 leading-snug break-keep">
                일상에서 좋은느낌이 든 때는 언제인가요?
              </h3>
              <MentalCardText className="text-center leading-relaxed !text-slate-800 break-keep">
                행복을 위한 첫 번째 기술은 긍정적인 정서를 자주 경험하는 거에요.
              </MentalCardText>
              <div className="rounded-3xl border border-slate-200/60 bg-white px-5 py-4 text-center leading-relaxed font-bold text-slate-800 shadow-[0_4px_12px_rgba(15,23,42,0.02)] break-keep">
                <ImporText className="!ml-0 !mr-1">
                  기쁘다, 편안하다, 감사하다, 충분하다, 평온하다, 뿌듯하다, 희망적이다,
                  자신 있다, 행복하다
                </ImporText>
                와 같은 정서를 만끽하세요.
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 4 && (
          <MentalCardPanel>
            <PermaHeading step={2} title="몰입" english="Engagement" />
            <div className="mt-5 space-y-5">
              <h3 className="text-center font-black text-xl text-slate-800 leading-snug break-keep">
                시간이 가는 줄 모르게 몰입해 본 경험이 있으신가요?
              </h3>
              <MentalCardText className="text-center leading-relaxed !text-slate-800 break-keep">
                <ImporText className="!mx-0">깊은 몰입</ImporText>의 경험은 큰
                만족감을 느끼게해요.
                <br />
                일과 관련된 것이 아니어도 여가 생활, 관계에서도 마찬가지이지요.
              </MentalCardText>
              <div className="rounded-3xl border border-slate-200/60 bg-white px-5 py-4 text-center leading-relaxed font-bold text-slate-800 shadow-[0_4px_12px_rgba(15,23,42,0.02)] break-keep">
                몰입했던 기억을 회상하며 충분히 즐기고 누리는 것 또한 나를 행복해지게
                만든답니다.
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 5 && (
          <MentalCardPanel>
            <PermaHeading step={3} title="관계" english="Relationship" />
            <div className="mt-5 space-y-5">
              <h3 className="text-center font-black text-xl text-slate-800 leading-snug break-keep">
                내 곁의 소중한 사람들을 생각하면 누가 떠오르나요?
              </h3>
              <MentalCardText className="text-center leading-relaxed !text-slate-800 break-keep">
                <ImporText className="!mx-0">긍정적인 관계</ImporText>는 우울이나
                불안을 낮춰줘요. <br />
                자주 만나거나 많은 사람을 만나지 않더라도, 끈끈하고 안정적인 관계는
                행복을 높여주는 중요한 요인이 되지요.
                <br />
                <span className="mt-2 block">
                  긍정적인 의사소통 방식을 사용하는 것도 도움이 돼요.
                </span>
              </MentalCardText>
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <MissionTitle className="text-lg font-extrabold text-slate-800">
                함께 살펴볼까요?
              </MissionTitle>
              <CareCardSelectButton
                className="mt-4 border-transparent bg-primary text-white hover:bg-primary/95 hover:text-white shadow-md shadow-primary/10 transition-transform active:scale-[0.98]"
                onClick={() => setShowReview(true)}
              >
                나 말하기 기법
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
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 6 && (
          <MentalCardPanel>
            <PermaHeading step={4} title="의미" english="Meaning" />
            <div className="mt-5 space-y-5">
              <h3 className="text-center font-black text-xl text-slate-800 leading-snug break-keep">
                나는 어떤 삶을 의미있다고 여기시나요?
              </h3>
              <MentalCardText className="text-center leading-relaxed !text-slate-800 break-keep">
                어떤 방식으로든 스스로 생각할 때 멋지다고 생각되는, 의미 있는 삶을
                살아보는 거에요.
              </MentalCardText>
              <div className="rounded-3xl border border-slate-200/60 bg-white px-5 py-4 text-center leading-relaxed font-bold text-slate-800 shadow-[0_4px_12px_rgba(15,23,42,0.02)] break-keep">
                <ImporText className="!ml-0 !mr-1">나만의 의미를 발견하고 만들어가는 과정</ImporText>
                에서 큰 만족감을 느낄 수 있어요.
              </div>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 7 && (
          <MentalCardPanel>
            <PermaHeading step={5} title="성취" english="Accomplishment" />
            <div className="mt-5 space-y-5">
              <h3 className="text-center font-black text-xl text-slate-800 leading-snug break-keep">
                나의 강점은 무엇인가요?
              </h3>
              <MentalCardText className="text-center leading-relaxed !text-slate-800 break-keep">
                강점을 발휘해서 스스로 만족할 수 있는 것을 해 보세요. <br />
                작은 것이어도 <ImporText className="!mx-0">성취감</ImporText>을 느끼고
                성장하는 느낌이 든다면 좋아요.
              </MentalCardText>
            </div>
            <MentalCardFooter onPrev={prev} onNext={next} />
          </MentalCardPanel>
        )}

        {step === 8 && (
          <MentalCardPanel>
            <MentalCardBubble tone="summary">
              카마 코치의 요약
            </MentalCardBubble>
            <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
              <ImporText className="!mx-0">5가지 행복의 기술</ImporText>로 삶의 질을
              높이며 더 많이 행복하게 살아보아요.
            </MentalCardText>
            <div className="space-y-4">
              <SummaryBox title="1. 긍정정서" body="긍정적인 정서를 자주 경험하고 만끽하기" />
              <SummaryBox title="2. 몰입" body="다양한 영역에서 몰입하는 순간 경험하기" />
              <SummaryBox title="3. 관계" body="긍정적인 관계 형성하기" />
              <SummaryBox title="4. 의미" body="나만의 삶의 의미를 발견하고 추구하기" />
              <SummaryBox title="5. 성취" body="강점을 발휘해 성취감 느끼기" />
            </div>
            <MentalCardFooter onPrev={prev} onNext={onSave} nextLabel="완료" />
          </MentalCardPanel>
        )}
      </div>
    </div>
  );
}
