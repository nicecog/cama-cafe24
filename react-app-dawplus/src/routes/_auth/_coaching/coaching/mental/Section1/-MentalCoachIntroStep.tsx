import helloType3Image from "@/assets/images/coaching/mental/helloType3.png";
import Textbox from "../../-components/elements/Textbox";

interface MentalCoachIntroStepProps {
  accountName: string;
}

export function MentalCoachIntroStep({
  accountName,
}: MentalCoachIntroStepProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 pb-12 pt-8 animate-fade-in">
      <style>{`
        @keyframes soft-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
      {/* 캐릭터 강조 영역 (카드 테두리 없음) */}
      <div className="relative">
        <div className="absolute -inset-6 rounded-full bg-primary/5 blur-2xl animate-pulse" />
        <img
          src={helloType3Image}
          alt="CAMA Coach"
          className="relative w-36 object-contain animate-[soft-float_4s_ease-in-out_infinite]"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="text-center px-4 w-full">
        <h2 className="mb-6 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 break-keep text-pretty">
          안녕하세요!
        </h2>

        <div className="space-y-6">
          <Textbox className="text-lg leading-relaxed text-slate-800 font-medium break-keep text-pretty">
            전 <span className="font-black text-primary">{accountName}</span>
            님의
            <br />
            마음근육을 키워줄 카마코치에요.
          </Textbox>

          <div className="mx-auto w-8 h-1 rounded-full bg-primary/20" />

          <Textbox className="text-base leading-relaxed text-slate-500 font-medium break-keep text-pretty">
            저와 함께 건강한 마음으로
            <br />암 여정을 슬기롭게 헤쳐 나가 보아요.
          </Textbox>
        </div>
      </div>
    </div>
  );
}
