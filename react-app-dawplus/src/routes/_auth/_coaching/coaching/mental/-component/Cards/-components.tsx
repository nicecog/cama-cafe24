import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import Textbox from "../../../-components/elements/Textbox";
import { cn } from "@/lib/utils";

export function MentalCardBubble({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "summary";
}) {
  return (
    <div className="mb-6 text-center">
      <h2
        className={cn(
          "break-keep text-pretty text-2xl font-black leading-snug tracking-tight sm:text-3xl",
          tone === "primary" ? "text-slate-900" : "text-primary",
        )}
      >
        {children}
      </h2>
      <div className="mx-auto mt-6 h-[3px] w-8 rounded-full bg-primary/20" />
    </div>
  );
}

export function MentalCardPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "animate-fade-in relative flex flex-col space-y-6 pb-24",
        className,
      )}
    >
      <div className="absolute -top-10 left-1/2 -z-10 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      {children}
    </section>
  );
}

export function MentalCardImage({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src: string;
}) {
  return (
    <div className="flex justify-center py-4">
      <style>{`
        @keyframes soft-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-soft-float {
          animation: soft-float 4s ease-in-out infinite;
        }
      `}</style>
      <div className="relative flex items-center justify-center py-2 ">
        <img
          src={src}
          alt={alt}
          className={cn(
            "animate-soft-float h-auto w-[160px] drop-shadow-md object-contain",
            className,
          )}
        />
      </div>
    </div>
  );
}

export function MentalCardOptionList({
  selectedValues,
  values,
  onToggle,
}: {
  selectedValues: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {values.map((value) => {
        const checked = selectedValues.includes(value);

        return (
          <button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-base font-bold leading-relaxed transition-all",
              checked
                ? "border-primary bg-primary/5 text-slate-900 shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary/30",
            )}
          >
            <span className="break-keep">{value}</span>
            <span
              className={cn(
                "ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                checked
                  ? "border-primary bg-primary text-white"
                  : "border-slate-300 bg-white",
              )}
            >
              {checked ? "✓" : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MentalCardRadioList({
  selectedValue,
  values,
  onSelect,
}: {
  selectedValue: string;
  values: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {values.map((value) => {
        const checked = selectedValue === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-base font-bold leading-relaxed transition-all",
              checked
                ? "border-primary bg-primary/5 text-slate-900 shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary/30",
            )}
          >
            <span className="break-keep">{value}</span>
            <span
              className={cn(
                "ml-4 h-6 w-6 shrink-0 rounded-full border-2 transition-colors",
                checked
                  ? "border-[7px] border-primary bg-white"
                  : "border-slate-300 bg-white",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function MentalCardFooter({
  nextLabel = "다음",
  onNext,
  onPrev,
  showNext = true,
}: {
  nextLabel?: string;
  onNext?: () => void;
  onPrev?: () => void;
  showNext?: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#f2f7f5]/80 backdrop-blur-md p-3   border-t border-emerald-900/5 shadow-[0_-10px_30px_rgba(242,247,245,0.9)]">
      <div className="mx-auto flex max-w-[32rem] gap-2.5">
        {onPrev ? (
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-2xl bg-white/60 hover:bg-white !text-slate-700 text-base font-bold border-slate-200 transition-colors"
            onClick={(event) => {
              event.currentTarget.blur();
              onPrev();
            }}
          >
            이전
          </Button>
        ) : null}
        {showNext ? (
          <Button
            type="button"
            className="h-12 flex-[1.5] rounded-2xl text-base font-bold shadow-md shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={(event) => {
              event.currentTarget.blur();
              onNext?.();
            }}
          >
            {nextLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function MentalCardText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Textbox
      className={cn(
        "break-keep text-pretty text-center text-base font-medium leading-relaxed text-slate-700 sm:text-lg",
        className,
      )}
    >
      {children}
    </Textbox>
  );
}

export const CoachingTitle = ({
  children,
  icon: Icon,
  color = "primary",
}: {
  children: React.ReactNode;
  icon?: any;
  color?: "primary" | "slate";
}) => {
  return (
    <div className="relative mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      {Icon && (
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${color === "primary" ? "bg-gradient-to-br from-primary/20 to-emerald-200/50 text-primary" : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600"}`}
        >
          <Icon className="size-7" strokeWidth={2.5} />
        </div>
      )}
      <h2 className="relative inline-block text-2xl font-black tracking-tight text-slate-800 leading-snug">
        <span className="relative z-10">{children}</span>
        <span
          className={`absolute bottom-1 left-0 -z-10 h-3 w-full -rotate-1 rounded opacity-60 ${color === "primary" ? "bg-emerald-200" : "bg-slate-300"}`}
        />
      </h2>
    </div>
  );
};
