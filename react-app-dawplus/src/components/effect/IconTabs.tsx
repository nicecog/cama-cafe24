import { AnimatePresence, motion } from "framer-motion";
// import "./styles.css";
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type TabInfosType = {
  title: string;
  id: string;
  icon: ReactElement;
  color: string;
  content: ReactNode;
};

export default function IconTabs({
  tabs,
  defaultIndex = 0,
  onTabChange,
}: {
  tabs: TabInfosType[];
  defaultIndex?: number;
  onTabChange?: (index: number) => void;
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex);
  // // Configure our tabs and tab content here
  // const [tabs, setTabs] = useState([
  // 	{
  // 		title: "Flights",
  // 		id: "flights",
  // 		icon: <Plane />,
  // 		color: "#5d5dff",
  // 		// content: TabContent,
  // 	},
  // 	{
  // 		title: "Hotels",
  // 		id: "hotels",
  // 		icon: <House />,
  // 		color: "#67bb67",
  // 		// content: TabContent,
  // 	},
  // 	{
  // 		title: "Reservations",
  // 		id: "reservations",
  // 		icon: <Calendar />,
  // 		color: "#63a7c7",
  // 		// content: TabContent,
  // 	},
  // 	{
  // 		title: "Offers",
  // 		id: "offers",
  // 		icon: <BaggageClaim />,
  // 		color: "#f56868",
  // 		// content: TabContent,
  // 	},
  // ]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--active-color",
      tabs[activeTabIndex].color,
    );
  }, [activeTabIndex, tabs[activeTabIndex].color]);

  useEffect(() => {
    const tabFromHash = tabs.findIndex(
      (tab) => `#${tab.id}` === window.location.hash,
    );
    setActiveTabIndex(tabFromHash !== -1 ? tabFromHash : defaultIndex);
  }, [defaultIndex, tabs.findIndex]);

  const onTabClick = (index: number) => {
    setActiveTabIndex(index);
    onTabChange?.(index);
  };
  const prevIndexRef = useRef(activeTabIndex);

  useEffect(() => {
    prevIndexRef.current = activeTabIndex;
  }, [activeTabIndex]);

  return (
    <div className="">
      <ul
        className="p-1 rounded-2xl mb-5 list-none flex justify-between bg-gray-50 border border-gray-200 shadow-sm"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <motion.li
            key={tab.id}
            className={cn("relative whitespace-nowrap p-0.5")}
            role="presentation"
            animate={{
              width:
                activeTabIndex === index
                  ? "35%"
                  : `${(100 - 30) / (tabs.length - 1)}%`,
            }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <a
              href={`#${tab.id}`}
              className={cn(
                "flex items-center p-2 text-base overflow-hidden relative no-underline rounded-xl transition-all duration-300",
                activeTabIndex === index
                  ? "bg-white shadow-md"
                  : "hover:bg-white/50",
              )}
              onClick={(e) => {
                e.preventDefault();
                onTabClick(index);
              }}
            >
              <span
                className={cn(
                  "min-w-[32px] h-8 flex items-center justify-center rounded-lg transition-all duration-300",
                  activeTabIndex === index
                    ? "bg-[var(--active-color)]/10"
                    : "bg-transparent",
                )}
              >
                {tab.icon &&
                  React.isValidElement(tab.icon) &&
                  React.cloneElement(
                    tab.icon as React.ReactElement<{
                      className?: string;
                      size?: string | number;
                    }>,
                    {
                      className: cn(
                        "transition-colors duration-300",
                        activeTabIndex === index
                          ? "text-[var(--active-color)]"
                          : "text-gray-500",
                      ),
                      size: "20",
                    },
                  )}
              </span>
              <motion.span
                className={cn(
                  "font-bold text-sm ml-2 transition-colors duration-300 whitespace-nowrap",
                  activeTabIndex === index
                    ? "text-[var(--active-color)]"
                    : "text-gray-600",
                )}
                animate={{
                  opacity: activeTabIndex === index ? 1 : 0,
                  x: activeTabIndex === index ? 0 : -10,
                  pointerEvents: activeTabIndex === index ? "auto" : "none",
                }}
                transition={{
                  type: "tween",
                  duration: 0.2,
                  delay: activeTabIndex === index ? 0.15 : 0.05,
                }}
              >
                {tab.title}
              </motion.span>
            </a>
          </motion.li>
        ))}
      </ul>
      <div className=" relative overflow-hidden ">
        <AnimatePresence mode="wait">
          {tabs.map((tab, index) =>
            activeTabIndex === index ? (
              <motion.div
                key={tab.id}
                initial={{
                  x: prevIndexRef.current < index ? 100 : -100,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{
                  x: { duration: 0.3, ease: "easeInOut" },
                  opacity: { duration: 0.3 },
                }}
              >
                {index}번
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
