import Textbox from "../../-components/elements/Textbox";
import type { MentalTypeResult } from "./-types";
import { getMentalTypeMeta } from "./-utils";

interface MentalTrainingStartStepProps {
  result: MentalTypeResult;
}

export function MentalTrainingStartStep({
  result,
}: MentalTrainingStartStepProps) {
  const meta = getMentalTypeMeta(result.dispName);

  return (
    <div className="space-y-4 pb-6">
      <div className="rounded-[28px] border border-primary/10 bg-gradient-to-br from-primary/5 to-sky-50 p-6 shadow-sm">
        <p className="text-sm font-black tracking-wide text-primary">
          훈련 시작 안내
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 break-keep text-pretty">
          이제 마음근육 훈련을 시작해 볼게요
        </h3>
        <Textbox className="mt-4 text-slate-700 break-keep text-pretty">
          {result.dispName}인 당신에게는 아래 순서가 잘 맞아요. 먼저 몸의 긴장을
          낮추고, 생각을 정리하고, 필요한 마음을 건강하게 표현하는 흐름으로
          이어집니다.
        </Textbox>
      </div>

      <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
        <ol className="space-y-3">
          {meta.techniques.map((technique, index) => (
            <li key={technique} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                {index + 1}
              </span>
              <div>
                <p className="text-base font-black text-slate-800 break-keep text-pretty">
                  {technique}
                </p>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500 break-keep text-pretty">
                  한 번에 완벽하게 하려 하기보다, 내 속도에 맞춰 차근차근
                  연습하면 충분해요.
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
