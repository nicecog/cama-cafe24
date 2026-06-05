import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Bookmark, Calendar, HeartPulse, Home, Lightbulb } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ShowDockBarAtom } from "@/atoms/CommonAtoms";
import { Each } from "@/components/common/Each";
import { useDialog } from "@/hooks/useDialog";
import { cn } from "@/lib/utils";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

interface DockItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  isComingSoon?: boolean;
}

const dockItems: DockItem[] = [
  {
    id: "home",
    label: "홈",
    icon: Home,
    path: "/home",
  },
  {
    id: "schedule",
    label: "일정관리",
    icon: Calendar,
    path: "/schedule",
  },
  {
    id: "coaching",
    label: "건강코칭",
    icon: HeartPulse,
    path: "/coaching",
  },
  {
    id: "wellbeing",
    label: "웰빙자원",
    icon: Lightbulb,
    path: "/wellbeing",
  },
  {
    id: "favorites",
    label: "즐겨찾기",
    icon: Bookmark,
    path: "/favorite",
  },
];

export default function Dockbar() {
  if (isReactNativeWebView()) {
    return null;
  }

  // Navi
  const navigate = useNavigate();
  // Location
  const location = useLocation();
  // Alert
  const { alert } = useDialog();

  // DockBar 보임여부
  const showDockBar = useAtomValue(ShowDockBarAtom);

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (item: DockItem) => {
    if (item.isComingSoon) {
      alert({ title: "개발 중입니다.  🚀" });
      return;
    }
    if (item.path) {
      navigate({ to: item.path });
    }
  };

  return (
    <AnimatePresence>
      {showDockBar && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80">
            <div className="flex items-center justify-around max-w-screen-xl mx-auto h-14 px-2">
              <Each
                of={dockItems}
                keyItem="id"
                render={(item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <motion.button
                      onClick={() => handleNavigation(item)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-0.5",
                        "flex-1 h-full",
                        "transition-colors duration-200",
                        "relative",
                      )}
                      aria-label={item.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      {/* Icon */}
                      <motion.div
                        animate={
                          active
                            ? {
                                y: [0, -3, 0],
                                transition: {
                                  duration: 0.6,
                                  ease: "easeInOut",
                                },
                              }
                            : {}
                        }
                      >
                        <Icon
                          size={20}
                          strokeWidth={2}
                          className={cn(
                            "transition-colors duration-200",
                            active ? "text-primary" : "text-slate-400",
                          )}
                        />
                      </motion.div>

                      {/* Label */}
                      <motion.span
                        className={cn(
                          "text-[10px] transition-colors duration-200",
                          active
                            ? "text-primary font-semibold"
                            : "text-slate-500 font-medium",
                        )}
                        animate={
                          active
                            ? {
                                scale: [1, 1.05, 1],
                                transition: {
                                  duration: 0.6,
                                  ease: "easeInOut",
                                },
                              }
                            : {}
                        }
                      >
                        {item.label}
                      </motion.span>
                    </motion.button>
                  );
                }}
              />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
