import { useState } from "react";
import useAlert from "@/hooks/useAlert";
import card1Image from "@/assets/images/coaching/mental/56.png";
import {
  MentalCardImage,
  MentalCardText,
} from "../Cards/-components";
import {
  CareCardSelectButton,
} from "../CareCards/-components";
import ImporText from "../../component/ImportText";
import { CardSummaryPopup, CardSummaryShell, EncourageAlertDialog } from "./-utils";
import type { CardSummaryPopupProps } from "./-types";

export function MentalCardSummary1Content({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { confirm } = useAlert();
  const [showEncourage, setShowEncourage] = useState(false);

  const handleComplete = () => {
    void confirm(
      { html: "복식호흡을 이해하는 데 <br/>도움이 되셨나요?" },
      () => setShowEncourage(true),
    );
  };

  return (
    <>
      <CardSummaryShell cardType="card1">
        <MentalCardImage
          src={card1Image}
          alt="복식호흡"
          className="mt-6 w-full max-w-[200px] object-contain drop-shadow-md animate-soft-float"
        />
        <div className="mt-6 px-2 space-y-5 text-left w-full">
          <MentalCardText className="text-justify leading-relaxed !text-slate-800 break-keep">
            마음은 <span className="font-extrabold text-primary">신체의 감각과 긴밀하게 연결</span>되어 있어요.
          </MentalCardText>
          <MentalCardText className="text-justify leading-relaxed !text-slate-800 break-keep">
            불안해지면 심장이 더 빨리 뛰고, 땀이 나고, 호흡이 가빠지는 것처럼요.
            특히 암과 같은 어려운 상황에 직면할 때 신체는 긴장되고 근육에는 힘이
            들어가지요.
          </MentalCardText>
          <MentalCardText className="text-justify leading-relaxed !text-slate-800 break-keep">
            하지만 이 상태가 계속되면 브레이크가 고장난 자동차처럼 엔진이 과열될 수
            있어요. 이때 <ImporText className="!mx-0 font-extrabold">브레이크 역할</ImporText>을 해주는 게 <ImporText className="!mx-0 font-extrabold">복식호흡 훈련</ImporText>이에요.
          </MentalCardText>
          <MentalCardText className="text-justify leading-relaxed !text-slate-800 break-keep">
            복식호흡은 <span className="font-extrabold text-primary">몸을 이완시키고 평온함</span>을 찾도록 도와주지요. 몸과 마음을
            놀랍도록 편안하게 해주는 간단하면서도 마법 같은 방법이에요. 복식호흡을
            꾸준히 실천하는 습관을 들이고, 전반적인 건강에 미치는 변화를 느껴보세요.
            우선, 편안한 자세로 자리에 앉거나 누워보세요. 준비되셨으면 시작할게요.
          </MentalCardText>
        </div>
        <div className="mt-6 overflow-hidden rounded-[2rem] border-2 border-white/85 bg-slate-950 shadow-[0_16px_40px_rgba(15,23,42,0.15)] aspect-video w-full transition-all duration-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
          <iframe
            title="복식호흡"
            src="https://www.youtube.com/embed/o42JtHKTcew"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <CareCardSelectButton
          className="mt-8 border-transparent bg-primary text-white hover:bg-primary/90 hover:text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          onClick={handleComplete}
        >
          완료
        </CareCardSelectButton>
      </CardSummaryShell>
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

export default function MentalCardSummary1({
  onComplete,
  open,
  setOpen,
  afterClose,
}: CardSummaryPopupProps) {
  return (
    <CardSummaryPopup open={open} setOpen={setOpen} afterClose={afterClose}>
      <MentalCardSummary1Content onComplete={onComplete} />
    </CardSummaryPopup>
  );
}
