import { type InputHTMLAttributes, useRef } from "react";

export default function MissionInput(props: {
  value: string;
  onChange: (value: string) => void;
  example?: string;
  placeholder?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  maxLength?: number;
  inputClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        value={props.value}
        onChange={({ target: { value } }) => {
          props.onChange(value);
        }}
        placeholder={props.placeholder}
        onFocus={() => {
          window.requestAnimationFrame(() => {
            inputRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          });
        }}
        inputMode={props.inputMode}
        pattern={props.pattern}
        maxLength={props.maxLength}
        className={`mt-3 w-full rounded-2xl border-2 border-slate-100 bg-white px-4 py-3 text-base leading-7 text-slate-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 ${props.inputClassName ?? ""}`}
      />

      {props.example && (
        <div className="mt-2 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          {/* 말풍선 삼각형 꼬리 */}
          <div className="z-0 h-2 w-2 rotate-45 border-l border-t border-slate-100 bg-slate-50" />

          {/* 텍스트 박스: 너비를 제한하고 스타일을 더 정교하게 수정 */}
          <div className="-mt-1 inline-flex max-w-[85%] flex-col items-center rounded-2xl border border-slate-100 bg-white/80 px-6 py-3 shadow-sm shadow-slate-200/10">
            {/* 상단 라벨: 더 작고 간격 있게 */}
            <span className="mb-1.5 text-xs font-black tracking-wide text-slate-300 uppercase">
              예시
            </span>

            {/* 예시 본문: 이탤릭과 따옴표를 활용한 감성 스타일 */}
            <p className="break-keep whitespace-pre-wrap text-center  leading-relaxed text-slate-500">
              {props.example}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
