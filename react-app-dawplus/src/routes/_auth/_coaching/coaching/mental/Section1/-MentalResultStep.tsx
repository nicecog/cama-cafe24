import resultImage from "@/assets/images/coaching/mental/advice3.png";
import Textbox from "../../-components/elements/Textbox";
import type { MentalTypeResult } from "./-types";

interface MentalResultStepProps {
  result: MentalTypeResult;
}

export function MentalResultStep({ result }: MentalResultStepProps) {
  return (
    <div className="space-y-5 pb-6">
      <div className="rounded-[28px] border border-slate-100 bg-white px-6 py-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <img
            src={resultImage}
            alt=""
            className="mb-3 w-[95px] object-contain"
          />
          <h2 className="break-keep text-3xl font-black tracking-tight text-slate-900 text-pretty">
            <span>당신은</span>{" "}
            <span className="text-primary">{result.dispName}</span>
            <span>이군요!</span>
          </h2>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center px-2 py-4">
        <div className="mb-3 text-center text-lg font-extrabold tracking-tight text-slate-800 break-keep text-pretty">
          <span className="mr-1.5 text-xl">💡</span>
          지피지기면 백전백승!
        </div>
        
        <Textbox className="text-center font-medium leading-relaxed text-slate-500 break-keep text-pretty">
          암에 대한 나의 대처 유형을 알면 스스로를 이해하고 의료진이나 가족과도 효과적으로 소통할 수 있어요.
        </Textbox>
      </div>
    </div>
  );
}
