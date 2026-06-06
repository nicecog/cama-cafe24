import ApexChart from "react-apexcharts";

export default function RadialBarChart(props: any) {
  const { color = "#249efa", title, per } = props;
  const value = Math.max(0, Math.min(100, Number(per) || 0));

  const defaultOpt = {
    chart: {
      id: `radial-${title}`,
      animations: {
        enabled: true,
        speed: 400,
      },
    },
    legend: { show: false },
    selection: { enabled: true },
    dataLabels: { enabled: true },
    states: {
      active: {},
      hover: {},
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 12,
          size: "53%",
        },
        dataLabels: {
          show: true,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    colors: [color],
    stroke: {
      show: false, //차트 border
      lineCap: "round" as "round" | "butt" | "square" | undefined,
    },
    labels: [title],
  };

  return (
    <ApexChart
      options={defaultOpt}
      type="radialBar"
      width={200}
      height={200}
      series={[value]}
    />
  );
}
