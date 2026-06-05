// @ts-nocheck

import { AnimatePresence, motion } from "motion/react";
import React, {
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Each } from "../common/Each";
import type { TabInfosType } from "./IconTabs";

interface TabContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  wobbly: boolean;
  hover: boolean;
  defaultValue: string;
  prevIndex: number;
  setPrevIndex: (value: number) => void;
  tabsOrder: string[];
}
const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

interface TabsProviderProps {
  children: ReactNode;
  defaultValue: string;
  wobbly?: boolean;
  hover?: boolean;
}

export const TabsProvider = ({
  children,
  defaultValue,
  wobbly = true,
  hover = false,
}: TabsProviderProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [prevIndex, setPrevIndex] = useState(0);
  const [tabsOrder, setTabsOrder] = useState<string[]>([]);
  useEffect(() => {
    const order: string[] = [];
    children?.forEach((child) => {
      if (isValidElement(child)) {
        if (child.type === TabsContent) {
          order.push(child.props.value);
        }
      }
    });
    setTabsOrder(order);
  }, [children]);

  return (
    <TabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        wobbly,
        hover,
        defaultValue,
        setPrevIndex,
        prevIndex,
        tabsOrder,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const TabHeader = ({
  data,
  className,
}: {
  data: TabInfosType[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full bg-tab-bg p-1 text-tab-text rounded-md border overflow-auto",
        className,
      )}
    >
      <Each
        of={data}
        render={(item) => (
          <TabsBtn
            value={item.id}
            className="flex-auto whitespace-nowrap px-3 py-1"
          >
            <span className="relative z-[2] uppercase flex items-center gap-1">
              {item.icon &&
                React.cloneElement(item.icon, {
                  size: "22",
                })}
              {item.title}
            </span>
          </TabsBtn>
        )}
      />
    </div>
  );
};

export const TabsBtn = ({ children, className, value }: any) => {
  const {
    activeTab,
    setPrevIndex,
    setActiveTab,
    defaultValue,
    hover,
    wobbly,
    tabsOrder,
  } = useTabs();

  const handleClick = () => {
    setPrevIndex(tabsOrder.indexOf(activeTab));
    setActiveTab(value);
  };

  return (
    <motion.div
      className={cn(
        "cursor-pointer sm:p-2 p-1 sm:px-4 px-2 rounded-md relative flex-center lex-grow-0",
        className,
      )}
      onFocus={() => hover && handleClick()}
      onMouseEnter={() => hover && handleClick()}
      onClick={handleClick}
    >
      <motion.span
        initial={false}
        animate={{
          color: activeTab === value ? "hsl(0 0% 100%)" : "hsl(210 100% 25%)",
        }}
        transition={{
          duration: 0.23, // 색상 바뀌는 속도
          delay: activeTab === value ? 0.1 : 0, // 배경 끝난 뒤 바뀌도록 딜레이
          ease: "easeInOut",
        }}
        className="relative z-[2] uppercase"
      >
        {children}
      </motion.span>
      {activeTab === value && (
        <AnimatePresence mode="wait">
          <motion.div
            layoutId={defaultValue}
            className="absolute w-full h-full left-0 top-0 bg-tab-hoverBg rounded-md z-[1]"
            transition={{
              layout: {
                duration: 0.2,
                ease: "easeInOut",
                delay: 0.2,
              },
            }}
          />
        </AnimatePresence>
      )}

      {wobbly && activeTab === value && (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              layoutId={defaultValue}
              className="absolute w-full h-full left-0 top-0 bg-tab-hoverBg rounded-md z-[1] tab-shadow"
              transition={{
                layout: { duration: 0.2, ease: "easeInOut" },
              }}
            />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              layoutId={`${defaultValue}b`}
              className="absolute w-full h-full left-0 top-0 bg-tab-hoverBg rounded-md z-[1] tab-shadow"
              transition={{
                layout: { duration: 0.2, ease: "easeOut" },
              }}
            />
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export const TabsContent = ({ children, className, value }: any) => {
  const { activeTab } = useTabs();

  return (
    <AnimatePresence mode="wait">
      {activeTab === value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.1,
            ease: "easeInOut",
          }}
          className={cn(" p-2 px-4 rounded-md relative", className)}
        >
          {activeTab === value ? children : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Default 로 사용할 Smooth Tab
export const SmoothTab = ({ data }: { data: TabInfosType[] }) => {
  return (
    <TabsProvider defaultValue={data[0].id} wobbly={true}>
      <TabHeader data={data} />
      <Each
        of={data}
        render={(r) => <TabsContent value={r.id}>{r.content}</TabsContent>}
      />
    </TabsProvider>
  );
};
