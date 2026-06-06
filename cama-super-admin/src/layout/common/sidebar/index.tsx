import { useAtomValue } from "jotai";
import { sidebarOpenAtom } from "../CommonAtom";
import menuList from "./menu.json";
import Menus from "./Menu";
import logo from "@/assets/images/character/question.png";
import { useTranslation } from "react-i18next";
// SideBar Component

const Sidebar = () => {
  const sidebarOpen = useAtomValue(sidebarOpenAtom);

  const { t } = useTranslation();
  // Render
  return (
    <aside
      className={`relative shrink-0 bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out
            ${sidebarOpen ? "w-72 border  border-mainBorder" : "w-0 border-0"}`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-72 p-3 transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="py-8  rounded-lg text-lg font-semibold flex items-center justify-center flex-col mb-10">
          <div>
            <img src={logo} className="w-20" />
          </div>
          <h1 className="text-gray-700 font-semibold mt-2">
            {t("common.sidebar.title")}
          </h1>
        </div>
        {menuList.map((menu: any, index: number) => (
          <Menus key={index} menu={menu} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
