import { cn } from "@/lib/utils";

interface MissionTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export default function MissionTitle({
  children,
  className,
}: MissionTitleProps) {
  return (
    <h2
      className={cn(
        "break-keep text-center text-2xl font-black tracking-tight text-slate-900",
        className,
      )}
    >
      {children}
    </h2>
  );
}
