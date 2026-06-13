import Textbox from "../../-components/elements/Textbox";
import type { MentalTypeResult } from "./-types";
import { highlightQuotedText } from "./-text";
import { getMentalTypeMeta } from "./-utils";

interface MentalTypeSummaryStepProps {
  result: MentalTypeResult;
}

export function MentalTypeSummaryStep({ result }: MentalTypeSummaryStepProps) {
  const meta = getMentalTypeMeta(result.dispName);

  return (
    <div className="space-y-4 pb-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-100/80 bg-white p-8 shadow-sm">
        <h2 className="text-center text-3xl font-black tracking-tight text-primary">
          {result.dispName}
        </h2>
        <img
          src={meta.resultImage}
          alt=""
          className="mx-auto mt-6 w-60 object-contain drop-shadow-sm"
        />
        {meta.resultTitle ? (
          <p className="mt-8 whitespace-pre-line text-center text-2xl font-black leading-snug tracking-tight text-slate-900">
            {meta.resultTitle}
          </p>
        ) : null}
      </div>

      <div className="relative mt-6 overflow-hidden rounded-3xl bg-slate-50/80 px-6 py-8">
        <div className="relative z-10">
          <Textbox className="text-center font-medium leading-relaxed text-slate-600 break-keep">
            {highlightQuotedText(meta.resultBody)}
          </Textbox>
        </div>
      </div>
    </div>
  );
}
