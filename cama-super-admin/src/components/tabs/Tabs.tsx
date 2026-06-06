import { motion } from "framer-motion";
import { ReactNode } from "react";

type TabInfo = {
  label: string;
  component: ReactNode;
};
// Tabs Type
export type TabsType = {
  active: number;
  tabs: TabInfo[];
  onChange: (e: number) => void;
};

// Tab 버튼
export const TabButton = ({
  label,
  onClick,
  isActive,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) => (
  <button
    onClick={onClick}
    className={`${
      isActive ? " " : "hover:text-black text-gray-400 hover:border-black "
    } relative  px-5 py-3 text-xs font-bold text-black min-w-1 transition focus-visible:outline-2 border-b-2 border-white`}
    style={{ WebkitTapHighlightColor: "transparent", minWidth: "130px" }}
  >
    {isActive && (
      <motion.span
        layoutId="underline"
        className="absolute inset-0 z-10 border-b-2 border-black mb-[-2px] "
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {label}
  </button>
);

/**
 * Tab
 * @param {number} active 활성화 탭 Number
 * @param {TabInfo[]} tabs 각 탭의 정보
 * @param {(e : number)=>void}  onChange Tab 변경 Event
 */
const Tabs = ({ active, tabs, onChange }: TabsType) => {
  return (
    <>
      <div className="flex flex-col overflow-auto z-50  h-full">
        <div className="flex  border-b absolute bg-gray-50 w-full">
          {tabs.map((tab: TabInfo, idx: number) => (
            <TabButton
              key={idx}
              label={tab.label}
              onClick={() => onChange(idx)}
              isActive={active === idx}
            />
          ))}
        </div>
        <div className=" pt-[45px] h-full ">{tabs[active].component}</div>
      </div>
    </>
  );
};

export default Tabs;
