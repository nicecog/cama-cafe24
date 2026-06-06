import ReactApexChart from "react-apexcharts";

// 이탈율

// 이탈율 = (측정시작시점 사용자 수 - 측정 종료 시점 사용자 수) ÷ 100

export default function Chart1(props: { categories: any[]; data: any[] }) {
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
          colors: ["#FEBA00"],
          markers: {
            size: 1,
          },
          labels: categories,
        }}
        series={[
          {
            name: "이탈율",
            data,
          },
        ]}
        type="line"
        height={350}
      />
    </>
  );
}
