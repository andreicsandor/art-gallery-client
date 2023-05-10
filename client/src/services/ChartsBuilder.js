import React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import "chart.js/auto";

const DoughnutChart = ({ data }) => {
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

const PieChart = ({ data }) => {
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export { DoughnutChart, PieChart };
