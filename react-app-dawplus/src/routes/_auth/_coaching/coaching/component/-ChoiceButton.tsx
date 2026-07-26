import { cn } from "@/lib/utils";

export default function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-4 py-4 text-left text-base font-bold leading-relaxed transition-all",
        active
          ? "border-primary bg-primary/10 text-slate-900"
          : "border-slate-200 bg-white text-slate-700",
      )}
    >
      {children}
    </button>
  );
}
