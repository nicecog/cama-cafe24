import { useRef } from "react";
import { MyInfosContent } from "@/components/mypage/MyInfosContent";
import Popup from "@/components/ui/Popup";

type MyInfosProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NESTED_DIALOG_CLOSE_GUARD_MS = 350;

export default function MyInfos({ open, setOpen }: MyInfosProps) {
  const nestedDialogOpenRef = useRef(false);
  const ignoreCloseUntilRef = useRef(0);

  const setMyInfosOpen = (nextOpen: boolean) => {
    if (
      !nextOpen &&
      (nestedDialogOpenRef.current || Date.now() < ignoreCloseUntilRef.current)
    ) {
      return;
    }
    setOpen(nextOpen);
  };

  return (
    <Popup open={open} setOpen={setMyInfosOpen} title="내정보">
      <MyInfosContent
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
