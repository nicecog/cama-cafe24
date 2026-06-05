import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
export type ModalProps = {
  children: React.ReactNode; // Children
  visible: boolean; // 보임여부
  onClose: () => void; // 닫기
  size?: "sm" | "md" | "lg" | "xl" | string | undefined; // 넓이
  height?: "sm" | "md" | "lg" | "xl" | string | undefined; // 높이
  title?: string; // 제목
  subTitle?: string; // 상세 정보(제목 하위)
  actionText?: string; // 확인 버튼 Text
  cancelText?: string; // 닫기 버튼 Text
  onAction?: () => void; // 확인 Click Event
  onCancel?: () => void; // 닫기 Click Event
  autoClose?: boolean; // onAction 이후 자동 닫기  Default : true
  closeEsc?: boolean; // ESC 눌러서 닫기 --false
  closeOutside?: boolean; // 외부 클릭으로 닫기
};

const sizeMap: Record<string, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
};

const heightSizeMap: Record<string, string> = {
  sm: "max-h-[400px]",
  md: "max-h-[600px]",
  lg: "max-h-[700px]",
  slg: "max-h-[800px]",
  xl: "max-h-[900px]",
};
// Modal 컴포넌트
export default function Modal({
  title,
  subTitle,
  children,
  onAction,
  size = "lg",
  height = "lg",
  actionText = "확인",
  cancelText = "닫기",
  visible,
  onClose,
  autoClose = true,
  closeOutside = false,
  closeEsc = false,
}: ModalProps) {
  // 닫기
  const onCancelHandler = () => {
    onClose();
  };

  // 확인버튼
  const onActionHandler = () => {
    onAction?.();
    // autoClose 일경우
    autoClose && onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent
        className={cn(`${sizeMap[size]} ${heightSizeMap[height]}`)}
        {...(!closeOutside && {
          onInteractOutside: (e) => e.preventDefault(),
        })}
        {...(!closeEsc && {
          onEscapeKeyDown: (e) => e.preventDefault(),
        })}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subTitle && <DialogDescription>{subTitle}</DialogDescription>}
        </DialogHeader>

        <div className=" ">{children}</div>

        <DialogFooter>
          <Button type="button" onClick={onCancelHandler}>
            {cancelText}
          </Button>
          {onAction && (
            <Button type="submit" onClick={onActionHandler}>
              {actionText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
