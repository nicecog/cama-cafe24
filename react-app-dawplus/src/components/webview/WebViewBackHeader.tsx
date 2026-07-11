import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

type WebViewBackHeaderProps = {
  title: string;
  className?: string;
  /** history.back 대신 이동할 경로 */
  backTo?: string;
};

/** cama-billive LeftBackHeader — 도움말·마이페이지 서브 화면용 */
export function WebViewBackHeader({
  title,
  className,
  backTo,
}: WebViewBackHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate({ to: backTo });
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate({ to: isReactNativeWebView() ? "/home" : "/home" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-[50px] items-center border-b border-gray-200 bg-white px-3",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-1 text-gray-800"
      >
        <ChevronLeft size={22} />
        <span className="text-base font-bold">{title}</span>
      </button>
    </header>
  );
}
