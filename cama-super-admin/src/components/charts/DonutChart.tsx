import useCountUp from "@/hooks/useCountUp";
import ApexChart from "react-apexcharts";
// const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useLayoutEffect, useMemo, useState, memo } from "react";
// import ApexChart from "react-apexcharts"
// Default Options
const defaultOpt = {
  legend: { show: false },
  selection: { enabled: false },
  dataLabels: { enabled: false },
  states: {
    active: {
      filter: {
        type: "none",
        value: 0,
      },
    },
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 10,
        size: "45%",
      },
      dataLabels: {
        show: false,
      },
    },
  },
  tooltip: {
    enabled: false,
  },
  stroke: {
    show: true, //차트 border
    lineCap: "round" as "round" | "butt" | "square" | undefined,
  },
};

export type DonutChartType = {
  per: number;
  title: string;
  cnt: number;
  color?: string;
  options?: {};
  onClick?: () => void;
};

/**
 * Donut Chart
 * @param {string} title 타이틀
 * @param {number} cnt 실제값
 * @param {number} per 차트를채울 Percent
 * @param {object} options Chart Options
 * @param {string} color Chart 색상
 * @param {function} onClick onClickEvent
 */
const DonutChart = (props: DonutChartType) => {
  // Props
  const { options, title, cnt, per, color, onClick } = props;
  // Options
  const opt = useMemo(
    () => ({
      ...defaultOpt,
      ...options,
      fill: {
        opacity: 1,
        colors: [color || "#0066FF"],
      } as ApexFill,
    }),
    [options, color]
  );
  // 숫자
  const currentCount = useCountUp(0, cnt, 2000);
  // 보임여부
  const [visible, setvisible] = useState(false);
  // Apex Chart 의 로딩 속도 문제로 수정
  useLayoutEffect(() => {
    setvisible(true);
  }, []);

  // Render
  return (
    <>
      <div
        className="relative inline-flex items-center justify-center w-full "
        style={{ height: 200 }}
      >
        <ApexChart
          height={250}
          width={250}
          options={opt}
          series={[per]}
          type={"radialBar"}
        />
        <span className="absolute flex items-center justify-center font-bold text-sm">
          {title}
        </span>
        {visible ? (
          <button
            className="absolute flex top-10 rounded-lg right-8 z-99 border bg-white px-3 py-1 text-xs hover:bg-gray-100"
            onClick={onClick}
          >
            <span className="text-[#535AD9] font-bold mr-2">{`${currentCount}건`}</span>{" "}
            {`${per}%`}
          </button>
        ) : null}
      </div>
    </>
  );
};
export default memo(DonutChart);
