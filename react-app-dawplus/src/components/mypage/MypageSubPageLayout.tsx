import type { ReactNode } from "react";
import { WebViewBackHeader } from "@/components/webview/WebViewBackHeader";
import { cn } from "@/lib/utils";

type MypageSubPageLayoutProps = {
  title: string;
  children: ReactNode;
  className?: string;
  backTo?: string;
};

export function MypageSubPageLayout({
  title,
  children,
  className,
  backTo = "/mypage",
}: MypageSubPageLayoutProps) {
  return (
    <div className={cn("flex min-h-full flex-col bg-white pb-20", className)}>
      <WebViewBackHeader title={title} backTo={backTo} />
      <div className="flex-1 overflow-y-auto hide-scrollbar">{children}</div>
    </div>
  );
}
