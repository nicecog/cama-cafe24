import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import "@/assets/fonts/jalnan-gothic.css";
import { cn } from "@/lib/utils";

type PopupProps = {
  children: ReactNode;
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: ReactNode;
  direction?: "top" | "bottom" | "left" | "right";
  /**
   * 애니메이션 지속 시간 (밀리초)
   * @default 300
   * @example duration={500} // 0.5초
   */
  duration?: number;
  /**
   * 팝업이 완전히 닫힌 후(애니메이션 종료 시) 호출될 콜백
   */
  afterClose?: () => void;
};

export default function Popup(props: PopupProps) {
  // Props
  const {
    children,
    open,
    setOpen,
    title = "",
    direction = "bottom",
    className,
    duration = 300, // 기본값: 300ms (0.3초) - 자연스러운 속도
    afterClose,
  } = props;

  // ===== 애니메이션 설정 =====
  // 📌 tailwindcss-animate 플러그인이 자체 duration을 강제하기 때문에
  //    Tailwind 클래스(duration-300 등)로는 오버라이드가 불가능합니다.
  //    따라서 inline style로 직접 animationDuration을 설정해야 합니다.
  //    cn()으로도 안 되는 이유: CSS 우선순위에서 플러그인이 더 높기 때문
  const animationDuration = `${duration}ms`;

  // Direction에 따른 애니메이션 스타일
  const getAnimationClasses = () => {
    switch (direction) {
      case "right":
        return "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right";
      case "left":
        return "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left";
      case "top":
        return "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top";
      default:
        return "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom";
    }
  };

  // Direction에 따른 위치 스타일
  const getPositionClasses = () => {
    switch (direction) {
      case "right":
        return "inset-y-0 right-0 h-full w-full sm:max-w-lg";
      case "left":
        return "inset-y-0 left-0 h-full w-full sm:max-w-lg";
      case "top":
        return "inset-x-0 top-0 w-full h-full sm:max-h-[90vh]";
      default:
        return "inset-x-0 bottom-0 w-full h-full sm:max-h-[90vh]";
    }
  };

  //render
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen} modal>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[200] bg-black/80",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          style={{
            animationDuration, // Props로 받은 duration 사용
          }}
        />

        {/* Content */}
        <DialogPrimitive.Content
          className={cn(
            "fixed z-[201] flex flex-col bg-background",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            // 열릴 때: fade 없이 slide만 (깔끔함)
            // 닫힐 때: slide만 (fade 없음)
            getAnimationClasses(),
            getPositionClasses(),
            className,
          )}
          style={{
            animationDuration, // Props로 받은 duration 사용
          }}
          // 열릴 때 포커스 관리
          onOpenAutoFocus={() => {
            // 기본 동작 허용 (첫 번째 포커스 가능한 요소로 이동)
          }}
          // 닫힐 때 포커스 관리 - aria-hidden 경고 방지
          onCloseAutoFocus={(e) => {
            // 기본 포커스 복원 동작을 방지하여 aria-hidden 경고 해결
            e.preventDefault();
          }}
          // 애니메이션 종료 감지
          onAnimationEnd={(e) => {
            // 닫히는 상태(closed)이면서 fade-out이나 slide-out 애니메이션이 끝났을 때
            if (
              !open &&
              (e.animationName.includes("out") ||
                e.animationName.includes("exit"))
            ) {
              afterClose?.();
            }
          }}
        >
          {/* Safari 노치 영역 배경 (흰색) */}
          <div
            className="absolute top-0 left-0 right-0 bg-blue-50 pointer-events-none"
            style={{
              height: "env(safe-area-inset-top)",
            }}
          />

          {/* Header */}
          <div
            className="border-b border-primary-thin flex items-center justify-between px-4 bg-blue-50 shrink-0"
            style={{
              paddingTop: "max(0.75rem, env(safe-area-inset-top))", // 노치 영역 고려
              paddingBottom: "0.75rem",
            }}
          >
            <DialogPrimitive.Title className="flex-1 text-center pl-4 font-jalnanGothic text-lg-fixed">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {typeof title === "string" ? title : "모달창"}
            </DialogPrimitive.Description>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="닫기"
                className="shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X size={20} />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-auto hide-scrollbar"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
            }}
          >
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
