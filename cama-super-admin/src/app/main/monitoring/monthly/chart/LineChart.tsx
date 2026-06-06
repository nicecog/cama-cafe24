import ReactApexChart from "react-apexcharts";

export default function LineChart(props: {
  categories: any[];
  data: any[];
  color: string;
  name: string;
}) {
  const { categories, data, color, name } = props;

  return (
    <>
      <ReactApexChart
        options={{
          chart: {
            toolbar: {
              show: false,
            },
            height: 350,

            zoom: {
              enabled: false,
            },
            dropShadow: {
              enabled: true,
              color: "#000",
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.5,
            },
          },

          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return val + "%";
            },
          },
          stroke: {
            curve: "smooth",
          },
          grid: {
            borderColor: "#e7e7e7",
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          colors: [color],
          markers: {
            size: 1,
          },

          labels: categories,
        }}
        series={[
          {
            name,
            data,
          },
        ]}
        type="line"
        height={350}
      />
    </>
  );
}
