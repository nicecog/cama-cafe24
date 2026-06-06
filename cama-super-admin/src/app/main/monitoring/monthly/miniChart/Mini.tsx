import React from "react";
import ReactApexChart from "react-apexcharts";

const Mini = (props: any) => {
  const { data, categories, name, colors, id } = props;

  const series = [
    {
      name,
      data,
    },
  ];

  var spark1 = {
    chart: {
      id,
      height: 120,
      sparkline: {
        enabled: true,
      },
    },

    fill: {
      opacity: 1,
    },
    labels: categories,
    colors: colors,
    title: {
      text: name,
      offsetX: 5,
      style: {
        fontSize: "20px",
        cssClass: "font-semibold",
      },
    },
  };

  return (
    <>
      <ReactApexChart
        options={spark1}
        series={series}
        type="area"
        height={120}
      />
    </>
  );
};

export default React.memo(Mini);
