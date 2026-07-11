import { useAtom } from "jotai";
import { MyPageAtom } from "@/atoms/CommonAtoms";
import Popup from "@/components/ui/Popup";
import { MyPageMainContent } from "./MyPageMainContent";

/** 브라우저용 내정보 팝업 — WebView는 /mypage 전체 화면 */
export default function MyPage() {
  const [open, setOpen] = useAtom(MyPageAtom);

  return (
    <Popup open={open} setOpen={setOpen} direction="right" title="내정보">
      <div className="flex h-full flex-col overflow-y-auto hide-scrollbar">
        <MyPageMainContent />
      </div>
    </Popup>
  );
}
