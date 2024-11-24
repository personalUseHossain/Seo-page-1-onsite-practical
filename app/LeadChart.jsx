// components/BarChart.js

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ leadsData }) => {
  // Prepare data for the chart
  const chartData = {
    labels: leadsData.map(
      (_, index) => `${index * 25 + 1} - ${index * 25 + 25}`
    ), // X-axis labels
    datasets: [
      {
        label: "Leads Converted to Deals",
        data: leadsData.map((group) => group.deal_status), // Y-axis values (deals won for each group)
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options (you can customize as needed)
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Leads Converted to Deals for Every 25 Leads",
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
