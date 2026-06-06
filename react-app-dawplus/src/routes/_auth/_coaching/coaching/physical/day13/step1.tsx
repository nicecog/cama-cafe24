import { usePageTranslation } from "@/hooks/usePageTranslation";
import day13Title from "@/assets/images/coaching/physical/day13_1.png";
import ChallengeQuestion from "../../-components/elements/ChallengeQuestion";

export function Day13Step1(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day13");
  const { step1, setStep1 } = props;
  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-[2.25rem] border border-primary/10 bg-white p-5 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        {/* 상단 텍스트 배지 */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            🎉 {pt("MSG_004")}
          </div>
        </div>

        {/* 이미지 컨테이너 */}
        <div className="flex justify-center rounded-2xl bg-slate-50/80 p-4 border border-slate-100/50">
          <img
            src={day13Title}
            alt=""
            aria-hidden="true"
            className="w-full max-w-[15rem] object-contain rounded-xl drop-shadow-sm"
          />
        </div>

        {/* 하단 텍스트 */}
        <p className="pt-1 text-[1.05rem] font-bold text-slate-800 break-keep leading-relaxed">
          {pt("MSG_005")}
        </p>
      </div>
      <ChallengeQuestion
        title={pt("MSG_025")}
        options={[pt("MSG_023"), pt("MSG_024")]}
        value={step1}
        onChange={setStep1}
      />
    </div>
  );
}
