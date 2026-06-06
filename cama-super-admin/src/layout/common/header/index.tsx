import { MouseEvent } from "react";
import LogoutButton from "./LogoutButton";
import useAuth from "@/hooks/useAuth";
import { sidebarOpenAtom } from "../CommonAtom";
import { useAtom } from "jotai";
import { FaUser } from "react-icons/fa";
import { MdMenuOpen, MdMenu } from "react-icons/md";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

// Header Component
const Header = () => {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const { t } = useTranslation();

  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  // onToggle
  const onToggleHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSidebarOpen((prev) => !prev);
  };
  // Render
  return (
    <>
      <header className="shrink-0 h-16 border rounded-md bg-[#39906a] text-white   border-mainBorder flex items-center px-5">
        <button
          onClick={onToggleHandler}
          className="  hover:bg-[#619e83] p-2 rounded-lg"
        >
          {sidebarOpen ? (
            <MdMenuOpen className={"text-[28px]"} />
          ) : (
            <MdMenu className={"text-[28px]"} />
          )}
        </button>
        <div className="flex ml-auto">
          <ul className="flex items-center gap-2 2xsm:gap-2">
            <li>
              <p className="text-xs mr-1 flex items-center gap-1">
                <FaUser />
                <span className="`font-bold text-sm  ">{userInfo.name}</span>
                {t('common.welcomeMessage')}
              </p>
            </li>
            <li>
              <LanguageSwitcher />
            </li>
            <LogoutButton />
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
