import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell, Moon, Utensils } from "lucide-react";
import React, { type ReactNode } from "react";
import sleepType from "@/assets/images/coaching/main/type1.png";
import mealType from "@/assets/images/coaching/main/type2.png";
import physicalType from "@/assets/images/coaching/main/type4.png";
import Textbox from "./Textbox";

interface ChallengeStartProps {
  children: React.ReactNode;
  type?: "sleep" | "meal" | "physical";
  title?: ReactNode;
  showCharacter?: boolean;
}

const challengeStartImageByType = {
  sleep: sleepType,
  meal: mealType,
  physical: physicalType,
} as const;

const floatingIconConfig = {
  sleep: {
    Icon: Moon,
    color: "text-indigo-400",
    fill: "currentColor" as const,
  },
  meal: {
    Icon: Utensils,
    color: "text-emerald-500",
    fill: "none" as const,
  },
  physical: {
    Icon: Dumbbell,
    color: "text-primary",
    fill: "none" as const,
  },
} as const;

export default function ChallengeStart({
  children,
  type = "sleep",
  title,
  showCharacter = true,
}: ChallengeStartProps) {
  const challengeStartImage = challengeStartImageByType[type];
  const iconConfig = floatingIconConfig[type];
  const FloatingIcon = iconConfig.Icon;

  return (
    <>
      {title && (
        <div className="rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 text-center shadow-sm">
          <Textbox className="text-base font-bold text-primary break-keep leading-relaxed text-center">
            {title}
          </Textbox>
        </div>
      )}
      <div className="relative w-full py-3">
        <div className="flex flex-col items-center gap-5">
          {/* Character Section with Portal Effect */}
          {showCharacter && (
            <div className="relative group">
              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute inset-0 -m-8 rounded-full border border-primary/5"
              />

              {/* Character Portal */}
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-gradient-to-b from-white to-slate-200 p-2 shadow-inner ring-4 ring-white/90">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
                <motion.img
                  src={challengeStartImage}
                  alt="Coach"
                  className="relative z-10 h-full w-full object-contain"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Floating Icons */}
              <motion.div
                animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute -right-2 -top-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-100 ${iconConfig.color}`}
              >
                <FloatingIcon size={14} fill={iconConfig.fill} />
              </motion.div>
            </div>
          )}

          {/* Message Bubble Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm"
          >
            {/* Main Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50">
              <div className="relative flex flex-col gap-5">
                <AnimatePresence mode="wait">
                  <div className="flex flex-col gap-4">
                    {React.Children.map(children, (child, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.15 }}
                        key={index}
                      >
                        {typeof child === "string" ? (
                          <Textbox className="text-center font-bold text-slate-700 leading-relaxed tracking-tight text-lg">
                            {child}
                          </Textbox>
                        ) : (
                          // If it's a Textbox or other component, we clone it with enhanced styles if needed
                          <div className="text-center">{child}</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
