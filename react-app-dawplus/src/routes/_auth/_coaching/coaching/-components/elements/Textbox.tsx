import { cn } from "@/lib/utils";

interface TextboxProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Textbox({ children, className }: TextboxProps) {
  return (
    <div
      className={cn(
        "break-keep whitespace-pre-wrap text-left text-base text-pretty leading-relaxed tracking-tighter",
        className,
      )}
    >
      {children}
    </div>
  );
}
