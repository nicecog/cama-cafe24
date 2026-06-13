import { useState } from "react";
import useAlert from "@/hooks/useAlert";
import MissionTitle from "@/routes/_auth/_coaching/coaching/-components/elements/MissionTitle";
import ideaImage from "@/assets/images/coaching/mental/60.png";
import { MentalCardText } from "../Cards/-components";
import {
  CareCardSelectButton,
  CareCardSurface,
} from "../CareCards/-components";
import ImporText from "../../component/ImportText";
import {
  CardSummaryPopup,
  CardSummaryShell,
  EncourageAlertDialog,
} from "./-utils";
import type { CardSummaryPopupProps } from "./-types";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2 px-4 rounded-xl hover:bg-emerald-50/30 transition-all border border-transparent hover:border-emerald-500/5">
      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-sm shadow-primary/20" />
      <p className="text-base font-bold leading-relaxed text-slate-800 break-keep">
        {children}
      </p>
    </div>
  );
}

export default function MentalCardSummary4({
  onComplete,
  open,
  setOpen,
  afterClose,
}: CardSummaryPopupProps) {
  const { confirm } = useAlert();
  const [showEncourage, setShowEncourage] = useState(false);

  const handleComplete = () => {
    void confirm(
      { html: "생각바꾸기를 이해하는 데 <br/>도움이 되셨나요?" },
      () => setShowEncourage(true),
    );
  };

  return (
    <>
      <CardSummaryPopup open={open} setOpen={setOpen} afterClose={afterClose}>
        <CardSummaryShell cardType="card4">
          <div className="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <MentalCardText className="text-justify leading-relaxed !text-slate-800">
              건강하고 균형 잡힌 생각은 유연하고 합리적입니다. 반면에 경직되고
              비합리적인 생각은 균형이 맞지 않습니다. 긍정적인 마음가짐을
              위해서는 생각의 균형을 맞추는 것이 필요합니다.
            </MentalCardText>
          </div>

          <div className="mt-10 flex justify-center flex-col items-center">
            <img src={ideaImage} alt="idea" className="w-[200px]" />
            <MissionTitle className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white px-6 py-2.5 text-slate-800 font-black shadow-[0_4px_12px_rgba(15,23,42,0.03)] text-center">
              생각을 바꾸는 게 어떤 <br />
              도움이 되나요?
            </MissionTitle>
          </div>

          <MentalCardText className="mt-5 text-justify leading-relaxed !text-slate-800">
            인간의 감정, 생각, 행동은 톱니바퀴처럼 긴밀하게 연결되어 있어요.
            따라서 하나가 바뀌면 나머지도 영향을 받게 되지요.
            <br /> 즉, <ImporText>생각을 바꾸면</ImporText> 기분이 좋아지고
            기분이 좋아지면 행동에 자신감이 생깁니다.
          </MentalCardText>

          <CareCardSurface className="mt-5 p-5 text-left border border-primary/10 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <MissionTitle className="border-b border-slate-100 pb-3 text-left !text-lg !font-black text-primary">
              카마 코치의 조언
            </MissionTitle>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0 mt-2.5" />
                <p className="text-base font-bold text-slate-800 leading-relaxed break-keep">
                  긍정적인 면과 부정적인 면을 모두 살펴보세요.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0 mt-2.5" />
                <p className="text-base font-bold text-slate-800 leading-relaxed break-keep">
                  다양한 가능성을 고려하세요.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0 mt-2.5" />
                <p className="text-base font-bold text-slate-800 leading-relaxed break-keep">
                  생각이 맞는지 증거를 찾고, 틀린지 증거를 찾으세요.
                </p>
              </div>
            </div>
          </CareCardSurface>

          <CareCardSurface className="mt-5 p-5 text-left border border-slate-200/60 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <MissionTitle className="border-b border-slate-100 pb-3 text-left !text-lg !font-black text-slate-800">
              균형잡힌 생각의 예
            </MissionTitle>
            <p className="mt-4 text-base font-bold leading-relaxed text-slate-700 italic text-left pl-3 border-l-2 border-slate-300 break-keep">
              "한 가지가 좋지 않으면 모든 노력이 실패한 것이다."
            </p>
          </CareCardSurface>

          <div className="mt-4 space-y-1.5">
            <Bullet>나머지는 좋았으니 다음 결과도 좋을 것이다.</Bullet>
            <Bullet>많은 것이 개선되었으니 희망적이다.</Bullet>
            <Bullet>아쉽지만 최선을 다했으니 그 덕분에 결과가 좋다.</Bullet>
          </div>

          <div className="mt-6 space-y-4">
            <MentalCardText className="text-justify leading-relaxed !text-slate-800">
              생각을 다르게 함으로써 기분을 바꿀 수 있습니다. 생각이 고집스럽고
              한 번에 바뀌지 않을 수 있지만 괜찮습니다.
            </MentalCardText>
            <MentalCardText className="text-justify leading-relaxed !text-slate-800">
              계속 노력하면 곧 생각의 균형을 맞추는 전문가가 될 것입니다.
            </MentalCardText>
            <MentalCardText className="text-justify leading-relaxed !text-slate-800">
              그때까지 카마코치가 함께할게요!
            </MentalCardText>
          </div>

          <CareCardSelectButton
            className="mt-6 border-transparent bg-primary text-white hover:bg-primary hover:text-white"
            onClick={handleComplete}
          >
            완료
          </CareCardSelectButton>
        </CardSummaryShell>
      </CardSummaryPopup>
      <EncourageAlertDialog
        open={showEncourage}
        onConfirm={() => {
          setShowEncourage(false);
          onComplete();
        }}
      />
    </>
  );
}
