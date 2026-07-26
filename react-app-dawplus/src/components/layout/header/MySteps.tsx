import { useRef } from "react";
import { MyStepsContent } from "@/components/mypage/MyStepsContent";
import Popup from "@/components/ui/Popup";

type MyStepsProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NESTED_DIALOG_CLOSE_GUARD_MS = 350;

export default function MySteps(props: MyStepsProps) {
  const { open, setOpen } = props;
  const nestedDialogOpenRef = useRef(false);
  const ignoreCloseUntilRef = useRef(0);

  const setMyStepsOpen = (nextOpen: boolean) => {
    if (
      !nextOpen &&
      (nestedDialogOpenRef.current || Date.now() < ignoreCloseUntilRef.current)
    ) {
      return;
    }
    setOpen(nextOpen);
  };

  return (
    <Popup open={open} setOpen={setMyStepsOpen} title="걸음수">
      <MyStepsContent
        active={open}
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
