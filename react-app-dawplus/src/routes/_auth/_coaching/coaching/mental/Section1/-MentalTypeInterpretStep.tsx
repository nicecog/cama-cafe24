import Textbox from "../../-components/elements/Textbox";
import type { MentalTypeResult } from "./-types";
import { getMentalTypeMeta } from "./-utils";

interface MentalTypeInterpretStepProps {
  result: MentalTypeResult;
  accountName: string;
}

export function MentalTypeInterpretStep({
  result,
  accountName,
}: MentalTypeInterpretStepProps) {
  const meta = getMentalTypeMeta(result.dispName);

  return (
    <div className="space-y-8 pb-10 pt-4 animate-fade-in">
      {meta.interpretIntro && (
        <div className="px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-bold tracking-wide">
            진단 결과 분석
          </span>
          <Textbox className="text-2xl font-black leading-snug text-slate-900 mt-2 break-keep text-pretty">
            <span className="text-primary">{accountName}</span>
            님은 <br />
            {meta.interpretIntro}
          </Textbox>
        </div>
      )}

      <div className="space-y-8 px-4 pt-4">
        {meta.interpretParagraphs.map((paragraph, idx) => (
          <div
            key={paragraph}
            className="animate-fade-in text-center"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <Textbox className="text-base leading-[1.8] text-slate-700 font-medium break-keep text-pretty">
              {paragraph}
            </Textbox>
          </div>
        ))}
      </div>
    </div>
  );
}
