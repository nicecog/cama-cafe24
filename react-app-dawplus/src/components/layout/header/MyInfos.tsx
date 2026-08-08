import { useRef } from "react";
import { MyInfosContent } from "@/components/mypage/MyInfosContent";
import Popup from "@/components/ui/Popup";

type MyInfosProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  forceOpenPasswordChange?: boolean;
  onForcePasswordChangeDone?: () => void;
};

const NESTED_DIALOG_CLOSE_GUARD_MS = 350;

export default function MyInfos({
  open,
  setOpen,
  forceOpenPasswordChange = false,
  onForcePasswordChangeDone,
}: MyInfosProps) {
  const nestedDialogOpenRef = useRef(false);
  const ignoreCloseUntilRef = useRef(0);

  const setMyInfosOpen = (nextOpen: boolean) => {
    if (
      !nextOpen &&
      (nestedDialogOpenRef.current || Date.now() < ignoreCloseUntilRef.current)
    ) {
      return;
    }
    // 임시 비밀번호 강제 변경 중에는 내정보 팝업을 닫지 않음
    if (!nextOpen && forceOpenPasswordChange) {
      return;
    }
    setOpen(nextOpen);
  };

  return (
    <Popup open={open} setOpen={setMyInfosOpen} title="내정보">
      <MyInfosContent
        forceOpenPasswordChange={forceOpenPasswordChange}
        onForcePasswordChangeDone={onForcePasswordChangeDone}
        onClose={() => setOpen(false)}
        onNestedDialogOpenChange={(dialogOpen) => {
          nestedDialogOpenRef.current = dialogOpen;
          if (!dialogOpen) {
            ignoreCloseUntilRef.current =
              Date.now() + NESTED_DIALOG_CLOSE_GUARD_MS;
          }
        }}
      />
    </Popup>
  );
}
