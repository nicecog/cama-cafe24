import useAlert from "@/hooks/useAlert";
import mentalImage from "@/assets/images/coaching/mental/mentalheader.png";
import missionImage from "@/assets/images/coaching/mental/mission.png";
import MissionTitle from "@/routes/_auth/_coaching/coaching/-components/elements/MissionTitle";
import { MentalCardText, MentalCardPanel } from "../Cards/-components";
import {
  CareCardImageChoiceButton,
} from "./-components";

export default function MentalCareCard6({
  onSave,
}: {
  onSave: () => Promise<void> | void;
}) {
  const { alert } = useAlert();

  const onClick = (check: boolean) => async () => {
    const html = `아직 운동 코칭을 원하지 않으시는군요. <br/>
    카마코치와 함께 운동 습관을 <br/>길러보고 싶으시면 
    언제든 건강코칭 <span style='color :#FE8825; font-weight:bold'>'16일의 도전'</span>을 클릭하세요.`;

    if (check) {
      await alert("운동코칭으로 이동합니다 ");
      await onSave();
      return;
    }

    await alert({ html });
    await onSave();
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
            1 <span className="text-emerald-800/40">/ 1</span>
          </div>
        </div>

        <MentalCardPanel>
          <div className="mt-5 flex justify-center">
            <MissionTitle className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white px-6 py-2.5 text-slate-800 font-black shadow-[0_4px_12px_rgba(15,23,42,0.03)] text-center break-keep">
              암 치료 전보다 신체 기능이 <br />
              떨어졌다고 느끼시나요?
            </MissionTitle>
          </div>
          <MentalCardText className="mt-5 text-center leading-relaxed font-bold !text-slate-800 break-keep">
            아마 폐기능이 저하되어 나타나는 모습일 수 있어요. 하지만, 조금씩 운동을
            하면 신체 기능도, 폐 기능도 좋아질 수있어요,
          </MentalCardText>

          <div className="mt-10">
            <MissionTitle className="text-center text-xl font-extrabold text-slate-800 break-keep leading-snug">
              "카마에서 제공하는 <br />
              운동코칭을 받아보시겠어요?"
            </MissionTitle>
            <div className="mt-6 flex gap-3">
              <CareCardImageChoiceButton
                onClick={() => void onClick(true)()}
                imageSrc={mentalImage}
                imageAlt="네"
                label="네"
                className="flex-1"
              />
              <CareCardImageChoiceButton
                onClick={() => void onClick(false)()}
                imageSrc={missionImage}
                imageAlt="아니요"
                label="아니요"
                className="flex-1"
              />
            </div>
          </div>
        </MentalCardPanel>
      </div>
    </div>
  );
}
