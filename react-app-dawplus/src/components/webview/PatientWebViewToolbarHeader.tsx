import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ChevronLeft, Home } from "lucide-react";
import * as motion from "motion/react-client";
import { coachingHeaderTTSAtom } from "@/atoms/coachingHeaderAtom";
import { FontSizeController } from "@/components/FontSizeController";
import TTSButton from "@/components/TTSButton";
import { useDialog } from "@/hooks/useDialog";
import {
  isReactNativeWebView,
  requestNativeHome,
} from "@/lib/webview/rnBridge";
import { cn } from "@/lib/utils";

export interface PatientWebViewToolbarHeaderProps {
  /** 허브 모드 좌측 제목 / 상세 모드 뒤로가기 라벨 */
  title: string;
  onBackClick?: () => void;
  className?: string;
  /** RN WebView 탭 허브: 뒤로가기 숨김 */
  hubMode?: boolean;
  /** 홈 버튼 확인 문구 */
  homeConfirmMessage?: string;
  /** 상세 모드 뒤로가기 확인 (미지정 시 바로 실행) */
  backConfirmMessage?: string;
  /** 우측 앱 홈 버튼 (기본 표시, 웰빙자원 등 탭 전용 화면은 false) */
  showHomeButton?: boolean;
}

export function PatientWebViewToolbarHeader({
  title,
  onBackClick,
  className,
  hubMode = false,
  homeConfirmMessage = "홈으로 가시겠습니까?",
  backConfirmMessage,
  showHomeButton = true,
}: PatientWebViewToolbarHeaderProps) {
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const ttsText = useAtomValue(coachingHeaderTTSAtom);

  const handleHomeClick = () => {
    confirm(homeConfirmMessage, () => {
      if (isReactNativeWebView()) {
        requestNativeHome();
        return;
      }
      navigate({ to: "/" });
    });
  };

  const runBack = onBackClick ?? (() => navigate({ to: "/" }));

  const handleBack = () => {
    if (backConfirmMessage) {
      confirm(backConfirmMessage, runBack);
      return;
    }
    runBack();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full h-14",
        "bg-white/80 backdrop-blur-md border-b border-gray-100",
        "flex items-center justify-between px-4 shadow-sm",
        className,
      )}
    >
      {hubMode ? (
        <span className="text-[15px] font-jalnan text-gray-900">{title}</span>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-1.5 py-2 px-1 text-gray-700 hover:text-primary transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[13px] font-bold tracking-tight">{title}</span>
        </motion.button>
      )}

      <div className="flex items-center gap-1.5">
        {ttsText && (
          <div className="[&>button]:rounded-full [&>button]:border-0 [&>button]:bg-transparent [&>button]:px-1.5 [&>button]:py-1 [&>button]:text-gray-600 [&>button]:transition-all [&>button]:duration-200 [&>button:hover]:bg-primary/10 [&>button:hover]:text-primary [&>button]:hover:scale-105 [&>button:active]:scale-95">
            <TTSButton text={ttsText} showLabel={false} rate={0.9} />
          </div>
        )}
        <div className="[&>button]:rounded-full [&>button]:border-0 [&>button]:bg-transparent [&>button]:p-1 [&>button]:text-gray-600 [&>button]:transition-all [&>button]:duration-200 [&>button:hover]:bg-primary/10 [&>button:hover]:text-primary [&>button]:hover:scale-105 [&>button:active]:scale-95 [&>button:disabled]:opacity-30">
          <FontSizeController />
        </div>
        {showHomeButton && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            onClick={handleHomeClick}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="홈으로"
          >
            <Home size={18} />
          </motion.button>
        )}
      </div>
    </header>
  );
}
