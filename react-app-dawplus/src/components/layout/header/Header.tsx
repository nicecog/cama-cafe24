import { useAtomValue, useSetAtom } from "jotai";
import { CircleQuestionMarkIcon, CircleUserRoundIcon } from "lucide-react";
import logo from "@/assets/images/logo/logo.svg";
import { HelpPopupAtom, MyPageAtom } from "@/atoms/CommonAtoms";
import { isScrolledAtom } from "@/atoms/scrollAtom";
import { LanguageController } from "@/components/LanguageController";
import { cn } from "@/lib/utils";
import Help from "./Help";
import MyPage from "./myPage";

export default function Header() {
  // const navigate = useNavigate();
  const isScrolled = useAtomValue(isScrolledAtom);
  // 도움말
  const openHelp = useSetAtom(HelpPopupAtom);
  // 내정보
  const openMyPage = useSetAtom(MyPageAtom);
  // // 임시
  // const setCancerInfoConfigured = useSetAtom(cancerInfoConfigured);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 ",
        "flex items-center   justify-between py-2.5",
        "text-white transition-all duration-200 ease-in-out origin-top",
        isScrolled
          ? "bg-primary shadow-lg scale-100 px-3.5"
          : "bg-transparent scale-95",
      )}
    >
      <img
        src={logo}
        alt="CAMA+ logo"
        className="h-8 w-auto"
        style={{ filter: "brightness(0) invert(1)" }}
      />
      <div className="flex items-baseline gap-2.5 ">
        <LanguageController />
        {/* <FontSizeController /> */}
        <button
          onClick={() => {
            openMyPage(true);
            // setCancerInfoConfigured((prev) => !prev);
          }}
        >
          <CircleUserRoundIcon size={24} />
        </button>
        <button
          onClick={() => {
            openHelp(true);
          }}
        >
          <CircleQuestionMarkIcon size={24} />
        </button>
      </div>
      {/* 도움말 */}
      <Help />
      {/* 내정보 */}
      <MyPage />
    </header>
  );
}
