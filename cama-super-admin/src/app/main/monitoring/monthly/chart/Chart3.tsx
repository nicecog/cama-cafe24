import ReactApexChart from "react-apexcharts";

// DAU
export default function Chart3(props: { categories: any[]; data: any[] }) {
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
          },

          grid: {
            borderColor: "#e7e7e7",
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          colors: ["#FE8825"],
          markers: {
            size: 1,
          },
          labels: categories,
        }}
        series={[
          {
            name: "DAU",
            data,
          },
        ]}
        type="area"
        height={350}
      />
    </>
  );
}
