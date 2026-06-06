import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

export default function Chart1(props: { data: any[] }) {
  const { t } = useTranslation();
  
  // Filter out avgSteps from chart display
  const chartData = props.data.filter((r) => r.label !== t("coachingProgress.report.avgSteps"));
  
  const categoryKeys = chartData.map((item) => item.label);
  const values = chartData.map((item) => item.value);

  const categoryColors = [
    "#39906a", // 수면
    "#FE8825", // 식습관
    "#5080DB", // 신체활동
    "#E25C5C", // 심리
    "#A070DD", // 운동
    "#2DCE89", // 건강 뉴스레터 진도율
  ];

  return (
    <ReactApexChart
      options={{
        chart: {
          toolbar: { show: false },
          height: 250,
          zoom: { enabled: false },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            colors: ["#000"],
          },
        },
        grid: {
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } },
        },
        colors: categoryColors,
        plotOptions: {
          bar: {
            distributed: true, // 카테고리별 색상 적용
            borderRadius: 5,
            horizontal: false,
            columnWidth: "55%",
          },
        },
        xaxis: {
          categories: categoryKeys,
          labels: {
            style: {
              fontSize: "13px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "12px",
            },
            formatter: (val: number) => Math.round(val).toString(),
          },
          max: 100,
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val.toFixed(1)}%`,
          },
        },
      }}
      series={[
        {
          name: t("coachingProgress.report.categoryAverage"),
          data: values,
        },
      ]}
      type="bar"
      height={300}
    />
  );
}
