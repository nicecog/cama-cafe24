import ReactApexChart from "react-apexcharts";

// MAU

export default function Chart4(props: { categories: any[]; data: any[] }) {
  const { categories, data } = props;
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
          colors: ["#1474D0"],
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return val + "%";
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
                return val + "%";
              },
            },
          },
        }}
        series={[
          {
            name: "MAU",
            data,
          },
        ]}
        type="bar"
        height={350}
      />
    </>
  );
}
