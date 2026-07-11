import Popup from "@/components/ui/Popup";
import { MyStepsContent } from "@/components/mypage/MyStepsContent";

type MyStepsProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

/** @deprecated 팝업 — /mypage/steps 페이지 사용 권장 */
export default function MySteps(props: MyStepsProps) {
  const { open, setOpen } = props;
  return (
    <Popup open={open} setOpen={setOpen} title="걸음수">
      <MyStepsContent active={open} />
    </Popup>
  );
}
