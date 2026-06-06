import ApexChart from "react-apexcharts";

export default function RadialBarChart(props: any) {
  const { color = "#249efa", title, per } = props;

  const defaultOpt = {
    chart: {
      events: {
        // click: (c: any, w: any, e: any) => {
        //   console.log(c, w, e);
        // },
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
      series={[per]}
    />
  );
}
