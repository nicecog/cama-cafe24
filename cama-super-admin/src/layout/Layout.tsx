import { useEffect, useMemo } from "react";
import Sidebar from "@/layout/common/sidebar";
import { useMediaQuery } from "react-responsive";
import { Outlet, redirect, useLocation } from "react-router-dom";
import { useSetAtom } from "jotai";
import { sidebarOpenAtom } from "./common/CommonAtom";
import Header from "./common/header";
import menuList from "@/layout/common/sidebar/menu.json";
import { useTranslation } from "react-i18next";
import {
  FcComboChart,
  FcInfo,
  FcInspection,
  FcNook,
  FcPlus,
  FcPortraitMode,
  FcSmartphoneTablet,
  FcSportsMode,
  FcStart,
  FcStatistics,
  FcSurvey,
  FcViewDetails,
} from "react-icons/fc";

export const loader = ({ request }: any) => {
  const url = new URL(request.url);

  return ["/main", "/main/"].includes(url.pathname)
    ? redirect(import.meta.env.VITE_DEFAULT_PAGE)
    : null;
};

const Layout = () => {
  // Sidebar
  const location = useLocation();
  const { t , i18n} = useTranslation();


  

  const setSidebarOpen = useSetAtom(sidebarOpenAtom);
  // Mid Size
  const isMd = useMediaQuery({
    minWidth: 1160,
  });

  // Componentn Update
  useEffect(() => {
    setSidebarOpen(() => isMd);
  }, [isMd]);

  const iconMap: { [key: string]: JSX.Element } = {
    1: <FcInspection />, // 환자관리
    2: <FcPortraitMode />, // 환자모니터링
    3: <FcSmartphoneTablet />, // 컨텐츠관리
    4: <FcPlus />, // 치료정보
    5: <FcSurvey />, //작성중인치료정보
    6: <FcStart />, // 비디오관리
    7: <FcSportsMode />, // 웰빙자원관리
    8: <FcViewDetails />, // 모니터링
    9: <FcComboChart />, // 월평가지표
    10: <FcNook />, // 사용자별 검색어 로그
    11: <FcStatistics />, // 사용자별 검색어 로그
  };

  const findMenuName: any = (url: any, menuList: any[]) => {
    for (let menu of menuList) {
      if (menu.url === url) {
        return menu;
      }
      if (menu.children) {
        const found = findMenuName(url, menu.children);
        if (found) return found;
      }
    }
    return { menuNm: "", id: "" };
  };
  const title = useMemo(() => {
    const items = menuList
      .flatMap((r) => r.children)
      .find((item) => item.url === location.pathname);

    return items
      ? items
      : {
          id: "",
          menuNm: "",
        };
  }, [location.pathname]);

  return (
    <>
      <div className="w-screen h-screen bg-[#f4f5f7] font-scDream">
        <div className="flex gap-1.5 w-full h-full p-1.5 max-w-[1980px] mx-auto">
          {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <main className="flex flex-col gap-1.5 grow w-full">
            <Header />

            {/* Content */}
            <h1 className="text-[24px] font-bold border px-5 rounded-lg bg-white border-mainBorder py-2 flex items-center gap-2">
              {iconMap[title.id] || <FcInfo />}
              <span className="mt-0.5 text-[23px]">
                {title.menuNm ? t(title.menuNm as any) : i18n.language === "en" ?  "Admin Screen" : "관리자 화면"}
              </span>
            </h1>
            <div className="grow px-5 py-5 bg-white rounded-md border-mainBorder   border overflow-y-auto ">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default Layout;

