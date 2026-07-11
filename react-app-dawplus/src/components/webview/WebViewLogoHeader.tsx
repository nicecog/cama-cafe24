import { useNavigate } from "@tanstack/react-router";
import iconHelp from "@/assets/icons/billive/icon_help.svg";
import iconMyOff from "@/assets/icons/billive/icon_my_off.svg";
import logo from "@/assets/images/logo/logo.svg";
import { cn } from "@/lib/utils";

/**
 * cama-billive LogoHeader 와 동일: 좌측 로고, 우측 내정보 + 도움말 아이콘
 */
export function WebViewLogoHeader({ className }: { className?: string }) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate({ to: "/home" });
  };

  const goMyPage = () => {
    navigate({ to: "/mypage" });
  };

  const goHelp = () => {
    navigate({ to: "/webview/help" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-[50px] items-center justify-between border-b border-gray-200 bg-white pl-3",
        className,
      )}
    >
      <button type="button" onClick={goHome} className="flex items-center">
        <img src={logo} alt="CAMA+ logo" className="h-8 w-auto" />
      </button>

      <div className="flex items-center">
        <button
          type="button"
          onClick={goMyPage}
          className="flex h-[50px] items-center justify-center pr-1.5"
          aria-label="내정보"
        >
          <img src={iconMyOff} alt="" width={26} height={26} />
        </button>
        <button
          type="button"
          onClick={goHelp}
          className="flex h-[50px] items-center justify-center pr-2.5"
          aria-label="도움말"
        >
          <img src={iconHelp} alt="" width={26} height={26} />
        </button>
      </div>
    </header>
  );
}
