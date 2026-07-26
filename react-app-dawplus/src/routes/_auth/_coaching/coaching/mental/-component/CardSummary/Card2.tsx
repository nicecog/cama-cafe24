import { useState } from "react";
import useAlert from "@/hooks/useAlert";
import card2Image from "@/assets/images/coaching/mental/57.png";

import MissionTitle from "@/routes/_auth/_coaching/coaching/-components/elements/MissionTitle";
import { MentalCardImage, MentalCardText } from "../Cards/-components";
import {
  CareCardSelectButton,
  CareCardSurface,
} from "../CareCards/-components";
import ImporText from "../../component/-ImportText";
import {
  CardSummaryPopup,
  CardSummaryShell,
  EncourageAlertDialog,
} from "./-utils";
import type { CardSummaryPopupProps } from "./-types";

function MessageExample({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <CareCardSurface className="border border-slate-100/60 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.03)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-left text-sm font-bold text-slate-505 text-slate-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
        <span className="break-keep">{title}</span>
      </div>
      <div className="mt-4 text-left text-lg font-black leading-relaxed text-primary break-keep">
        {children}
      </div>
    </CareCardSurface>
  );
}

export default function MentalCardSummary2({
  onComplete,
  open,
  setOpen,
  afterClose,
}: CardSummaryPopupProps) {
  const { confirm } = useAlert();
  const [showEncourage, setShowEncourage] = useState(false);

  const handleComplete = () => {
    void confirm(
      { html: "나 말하기 기법을 이해하는 데 <br/>도움이 되셨나요?" },
      () => setShowEncourage(true),
    );
  };

  return (
    <>
      <CardSummaryPopup open={open} setOpen={setOpen} afterClose={afterClose}>
        <CardSummaryShell cardType="card2">
          <div className="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <MentalCardText className="text-justify leading-relaxed !text-slate-800">
              때때로 상대방과 소통하면서 자신의 욕구나 감정이 충족되지 못할때가
              있어요.
              <br />
              이럴 때 화내거나 싸우지 않고, 일방적으로 참거나 양보하지 않더라도
              내 욕구를 충분히 채울 수 있어요.
            </MentalCardText>
            <MentalCardText className="text-justify leading-relaxed !text-slate-800">
              마음건강에 도움이 되는 소통의 비법,{" "}
              <ImporText>'나 말하기 기법'</ImporText>을 소개할게요.
            </MentalCardText>
          </div>

          <div className="mt-10 flex justify-center">
            <MissionTitle className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white px-6 py-2.5 text-slate-800 font-black shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
              나 말하기 기법(I-message)
            </MissionTitle>
          </div>

          <MentalCardImage
            src={card2Image}
            alt="나 말하기 기법"
            className="  w-full max-w-[220px] filter drop-shadow-md"
          />

          <CareCardSurface className=" p-5 text-left border border-primary/10">
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/40 p-4 border border-emerald-500/5 transition-all hover:bg-emerald-50/70">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary border border-primary/20">
                  1
                </div>
                <p className="text-base font-bold leading-normal text-slate-800 break-keep">
                  상대방의{" "}
                  <span className="mx-0.5 font-extrabold text-primary">
                    행동
                  </span>
                  에 대해서 이야기한다.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/40 p-4 border border-emerald-500/5 transition-all hover:bg-emerald-50/70">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary border border-primary/20">
                  2
                </div>
                <p className="text-base font-bold leading-normal text-slate-800 break-keep">
                  그로 인한 나의{" "}
                  <span className="mx-0.5 font-extrabold text-primary">
                    감정
                  </span>
                  을 이야기한다.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/40 p-4 border border-emerald-500/5 transition-all hover:bg-emerald-50/70">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary border border-primary/20">
                  3
                </div>
                <p className="text-base font-bold leading-normal text-slate-800 break-keep">
                  <span className="mx-0.5 font-extrabold text-primary">
                    바라는 것
                  </span>
                  을 구체적으로 이야기한다.
                </p>
              </div>
            </div>
          </CareCardSurface>

          <div className="relative mt-8 mb-4 flex items-center justify-center">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-200/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#f2f7f5] px-4 text-slate-600 font-extrabold text-base">
                예시를 살펴볼까요 ?
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-primary/10 bg-white/95 px-6 py-6 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
            <p className="border-b border-slate-100 pb-3 text-left text-base font-black text-primary">
              상황
            </p>
            <p className="mt-4 text-left text-base font-bold leading-relaxed text-slate-800 break-keep">
              원하지 않는 음식이 몸에 좋다며 자꾸 권하는 가족에게
              <span className="mx-1 font-extrabold text-primary">
                "나 말하기 기법"
              </span>
              을 사용한다면, 어떻게 말할 수 있을까요?
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <MessageExample title={<>첫째 상대방의 행동에 대해서 말한다.</>}>
              "지금 먹고 싶지 않은데 자꾸 권하네"
            </MessageExample>
            <MessageExample title={<>둘째 그로 인한 나의 감정을 이야기한다.</>}>
              "미안하기도 하고 부담스럽기도 해"
            </MessageExample>
            <MessageExample
              title={<>셋째 바라는 것을 구체적으로 이야기한다.</>}
            >
              "다음에 먹고 싶다고 할 때 갖다 주면 좋겠어."
            </MessageExample>
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
