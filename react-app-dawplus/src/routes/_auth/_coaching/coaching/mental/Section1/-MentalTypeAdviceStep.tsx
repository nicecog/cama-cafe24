import { CheckCircle2 } from "lucide-react";
import Textbox from "../../-components/elements/Textbox";
import type { MentalTypeResult } from "./-types";
import { getMentalTypeMeta } from "./-utils";
import { highlightQuotedText } from "./-text";

interface MentalTypeAdviceStepProps {
  result: MentalTypeResult;
  accountName: string;
}

export function MentalTypeAdviceStep({
  result,
  accountName,
}: MentalTypeAdviceStepProps) {
  const meta = getMentalTypeMeta(result.dispName);

  return (
    <div className="space-y-10 pb-12 pt-4 animate-fade-in px-4">
      {/* 헤더 섹션 (카드 없음) */}
      <div className="relative text-center">
        <p className="text-2xl  font-black tracking-tight text-slate-900 leading-snug break-keep text-pretty">
          <span className="text-primary">'{meta.adviceLead}'</span>의 <br />
          {accountName}님!
        </p>
      </div>

      {/* 조언 단락 섹션 (깔끔한 텍스트 중심) */}
      <div className="space-y-8 px-2">
        {meta.adviceParagraphs.map((paragraph, index) => (
          <div key={paragraph} className="relative flex flex-col items-center">
            <Textbox className="mx-auto max-w-[26rem] text-center text-base leading-relaxed font-medium text-slate-700 text-pretty break-keep">
              {highlightQuotedText(paragraph)}
            </Textbox>
            {index < meta.adviceParagraphs.length - 1 && (
              <div className="mt-8 w-8 h-[3px] rounded-full bg-primary/20" />
            )}
          </div>
        ))}
      </div>

      {/* 실천 포인트 (Bullets) 섹션 (배경/테두리 없음, 깔끔한 리스트) */}
      {meta.adviceBullets?.length ? (
        <div className="mt-12 pt-6 border-t border-slate-100">
          <h3 className="mb-6 font-bold text-xl text-slate-900 flex items-center gap-2 break-keep text-pretty">
            <span className="text-primary text-2xl">💡</span>
            이렇게 실천해 보세요
          </h3>
          <ul className="space-y-5">
            {meta.adviceBullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-base font-medium text-slate-700 leading-relaxed break-keep text-pretty">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
