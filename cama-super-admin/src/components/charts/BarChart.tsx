import ApexChart from "react-apexcharts";
export default function BarChart(props: any) {
  const { data } = props;

  const title = data.map((i: any) => i.categoryNm);
  const per = data.map((i: any) => i.progress);
  const recommendedColors = [
    "#1a8cff", // 진한 청록색
    "#00a9e6", // 하늘색에 가까운 푸른색
    "#4ac9ff", // 밝은 청록색
    "#5ac8fa", // 신선한 파란색
    "#ff1493", // 분홍색
    "#2ca02c", // 초록색
    "#ff7f0e", // 주황색
    "#ffbb78", // 연한 주황색
  ];
  const series = [
    {
      name: "진행률",
      data: per,
    },
  ];
  const options = {
    chart: {
      events: {
        // click: (c: any, w: any, e: any) => {
        //   console.log(w);
        // },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: recommendedColors,
      },
    },

    xaxis: {
      categories: title,
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        formatter: function (val: any) {
          return val + "%";
        },
      },
      max: 100,
    },
  };

  return (
    <ApexChart
      options={options}
      series={series}
      type="bar"
      height={250}
      width={"100%"}
    />
  );
}
