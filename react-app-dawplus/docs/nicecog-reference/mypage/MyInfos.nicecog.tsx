import Popup from "@/components/ui/Popup";
import { MyInfosContent } from "@/components/mypage/MyInfosContent";

type MyInfosProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

/** @deprecated 팝업 — /mypage/user-info 페이지 사용 권장 */
export default function MyInfos(props: MyInfosProps) {
  const { open, setOpen } = props;
  return (
    <Popup open={open} setOpen={setOpen} title="내정보">
      <MyInfosContent onClose={() => setOpen(false)} />
    </Popup>
  );
}
