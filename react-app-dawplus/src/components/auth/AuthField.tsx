import * as React from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string | null;
  actionLabel?: string;
  actionLoading?: boolean;
  onPressAction?: () => void;
}

export function AuthField({
  label,
  error,
  actionLabel,
  actionLoading,
  onPressAction,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-500 ml-1">{label}</span>
        {actionLabel && onPressAction ? (
          <button
            type="button"
            onClick={onPressAction}
            disabled={actionLoading}
            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
          >
            {actionLoading ? "확인 중..." : actionLabel}
          </button>
        ) : null}
      </div>
      <Input
        className={cn(
          "h-14 w-full rounded-2xl border border-white bg-white/60 px-5 text-lg text-slate-900 placeholder:text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 md:text-lg",
          error && "border-red-400/50 focus-visible:ring-red-400/30",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm font-medium text-red-500 ml-1">{error}</p> : null}
    </label>
  );
}
