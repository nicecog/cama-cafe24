import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { StepData } from "./types";
import { useTranslation } from "react-i18next";

interface StepChartProps {
  data: StepData[];
}

const StepChartAccordion: React.FC<StepChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.executionDate).getTime() - new Date(b.executionDate).getTime()
  );
  const recentData = sortedData.slice(-30);

  const categories = recentData.map((item) => item.executionDate);
  const stepCounts = recentData.map((item) => item.stepNum);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#A5D7E8"],
    dataLabels: {
      enabled: true,
      offsetY: -10,
      style: { fontSize: "12px", colors: ["#304758"] },
    },
    stroke: { curve: "smooth", width: 3 },

    grid: {
      row: { colors: ["#f8f8f8", "transparent"], opacity: 0.5 },
    },
    xaxis: {
      categories: categories,

      labels: {
        rotateAlways: true,
        rotate: -45,
        style: { colors: "#888", fontSize: "10px" },
      },
    },

    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => val.toLocaleString() + " " + t("patientMng_coachingMonitoring.coaching.stepChart.steps") },
    },
    markers: {
      size: 4,
      colors: ["#FFF"],
      strokeColors: "#A5D7E8",
      strokeWidth: 2,
    },
  };

  const series = [{ name: t("patientMng_coachingMonitoring.coaching.stepChart.stepCount"), data: stepCounts }];

  //   const [chartVisible, setChartVisible] = useState(false);

  return (
    <div className="w-full">
      <div
        className="cursor-pointer flex justify-between items-center w-full bg-green-50 px-3 py-1.5 rounded-lg text-gray-700"
        onClick={toggleAccordion}
      >
        <h3 className="text-xs font-semibold">{t("patientMng_coachingMonitoring.coaching.stepChart.title")}</h3>
        <span className="text-xs font-bold">
          {isOpen ? t("patientMng_coachingMonitoring.coaching.stepChart.close") : t("patientMng_coachingMonitoring.coaching.stepChart.open")}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="  w-full px-2"
          >
            <div className="">
              <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={350}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StepChartAccordion;
