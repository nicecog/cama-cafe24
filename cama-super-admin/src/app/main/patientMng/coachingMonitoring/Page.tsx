import { useState } from "react";
import { motion } from "framer-motion";
import CoachingMonitoring from "./Coaching";

import TrackReqHst from "./TrackReqHst";
import SurveyHistory from "./SurveyHistory";
import { useTranslation } from "react-i18next";

export default function CoachingPage() {
  const { t } = useTranslation();
  const TabButton = ({
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
      } relative  px-5 py-2 text-xs font-bold text-black min-w-1 transition focus-visible:outline-2 border-b-2 border-white`}
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

  const [active, setActive] = useState("monitor");
  return (
    <div className="flex grow flex-col h-full">
      <div className="h-[40px] mb-1 flex-none">
        <div className="flex border-b absolute    ">
          <TabButton
            label={t("patientMng_coachingMonitoring.tabs.coachingMonitoring")}
            onClick={() => setActive("monitor")}
            isActive={active === "monitor"}
          />
          <TabButton
            label={t("patientMng_coachingMonitoring.tabs.trackReqHistory")}
            onClick={() => setActive("trackReqHst")}
            isActive={active === "trackReqHst"}
          />
          <TabButton
            label={t("patientMng_coachingMonitoring.tabs.surveyHistory")}
            onClick={() => setActive("history")}
            isActive={active === "history"}
          />
        </div>
      </div>
      <div className="grow h-full">
        {active === "monitor" ? (
          <CoachingMonitoring />
        ) : active === "trackReqHst" ? (
          <TrackReqHst />
        ) : (
          <SurveyHistory />
        )}
      </div>
    </div>
  );
}
