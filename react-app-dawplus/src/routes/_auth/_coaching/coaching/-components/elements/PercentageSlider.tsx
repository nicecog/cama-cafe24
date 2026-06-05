import type { CSSProperties } from "react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { cn } from "@/lib/utils";

interface PercentageSliderProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
  label: React.ReactNode;
}

export function PercentageSlider(props: PercentageSliderProps) {
  // Props
  const { value, onChange, label, className } = props;
  const { pt } = usePageTranslation("coaching/coachingCommon");
  //
  const numericValue = Number(value || "0");

  //스타일
  const trackStyle = {
    background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(14 165 233) ${numericValue}%, rgb(226 232 240) ${numericValue}%, rgb(226 232 240) 100%)`,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <p className="text-center text-base font-black leading-6 tracking-tight break-keep whitespace-pre-wrap text-slate-800">
        {label}
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between px-0.5 mb-1.5 text-[11px] font-bold text-slate-400">
          <span>{pt("slider.min_label")}</span>
          <span>{pt("slider.max_label")}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={numericValue}
          onChange={({ target: { value: nextValue } }) => {
            onChange(nextValue);
          }}
          style={trackStyle}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-sky-100 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[4px] [&::-moz-range-thumb]:border-sky-600 [&::-moz-range-thumb]:bg-sky-50 [&::-moz-range-thumb]:shadow-sm"
        />
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
          <p className="text-xs font-medium text-slate-400">
            {pt("slider.helper_text")}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
              {pt("slider.current_label")}
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-sky-600 tabular-nums">
                {numericValue}
              </span>
              <span className="text-xs font-black text-sky-500">
                {pt("slider.percent_suffix")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
