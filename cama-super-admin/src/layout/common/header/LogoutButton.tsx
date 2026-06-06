import { FiPower } from "react-icons/fi";
import { MouseEvent } from "react";
import useAuth from "@/hooks/useAuth";
import useAlert from "@/hooks/useAlert";
import { useTranslation } from "react-i18next";

export default function LogoutButton() {
  const { logout } = useAuth();
  const {t} = useTranslation();
  const { confirm } = useAlert();

  const logoutHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    confirm(
      {
        title: t("common.logout"),
        text: t("common.logoutComment"),
        icon: "question",
        confirmButtonText : t("common.confirm"),
        cancelButtonText: t("common.cancel"),
        
      },
      () => {
        logout();
      }
    );
  };

  return (
    <>
      <li className="relative">
        <button
          className="  cursor-pointer bg-[#619e83] hover:bg-[#74ac90]  border border-mainBorder  rounded-full p-2

          transition-all duration-300 ease-in-out hover:scale-110
            
          "
          title={t("common.logout")}
          onClick={logoutHandler}
        >
          <FiPower />
        </button>
      </li>
    </>
  );
}
