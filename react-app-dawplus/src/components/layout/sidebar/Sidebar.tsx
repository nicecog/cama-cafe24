import { useAtom } from "jotai";
import { useEffect } from "react";
import { SidebarOpenAtom } from "@/atoms/CommonAtoms";
import { Each } from "@/components/common/Each";
import { cn } from "@/lib/utils";
import Menus from "./Menu";
import menusList from "./menu.json";

export default function Sidbebar() {
  //  Atoms
  const [sidebarOpen, setSidebarOpen] = useAtom(SidebarOpenAtom);

  // 자동 닫힘
  useEffect(() => {
    const breakpoint = 1024; // px 단위, 이보다 작으면 자동 닫힘
    const handleResize = () => {
      if (window.innerWidth < breakpoint) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // 초기 상태 설정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <aside
      className={`relative shrink-0 bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out 
            ${sidebarOpen ? "w-72 border " : "w-0 border-0 "}`}
    >
      {/* 내부 컨텐츠가 부모의 너비 영향을 받지 않도록 absolute 설정 */}
      <div
        className={cn(
          "h-full p-3 transition-opacity duration-200 w-72 flex flex-col ",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="py-8 bg-primary-light/55 bg-opacity-15  text-lg font-semibold flex items-center justify-center flex-col mb-10  rounded-xl">
          <div>로고</div>
          <h1>문구 123412341234</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Each of={menusList} render={(menu) => <Menus menu={menu} />} />
        </div>
        <div className="h-20 flex items-center justify-center mt-10   bg-muted backdrop-blur-lg border shadow-sm rounded-lg  ">
          정보창 1234
        </div>
      </div>
    </aside>
  );
}
