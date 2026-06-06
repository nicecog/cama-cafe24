import ReactApexChart from "react-apexcharts";

export default function BarChart(props: {
  categories: any[];
  data: any[];
  color: string;
  name: string;
  usePer?: boolean;
}) {
  const { categories, data, color, name, usePer } = props;

  return (
    <>
      <ReactApexChart
        options={{
          chart: {
            toolbar: {
              show: false,
            },
            height: 350,
          },
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: "top", // top, center, bottom
              },
            },
          },
          colors: [color],
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return val + (usePer ? "%" : "");
            },
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"],
            },
          },

          xaxis: {
            categories: categories,
            position: "bottom",
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
            min: 0,

            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              formatter: function (val: any) {
                return val + (usePer ? "%" : "");
              },
            },
          },
        }}
        series={[
          {
            name,
            data,
          },
        ]}
        type="bar"
        height={350}
      />
    </>
  );
}
