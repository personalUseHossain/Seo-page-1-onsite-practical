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
  // Group the leadsData into 10 groups (250 data / 10 bars = 25 data points per bar)
  const groupedData = Array.from({ length: 10 }, (_, index) => {
    // For each group (index), we sum the deal_status for the next 25 data points
    const start = index * 25;
    const end = start + 25;
    return leadsData
      .slice(start, end)
      .reduce((sum, group) => sum + group.deal_status, 0);
  });

  // Prepare data for the chart
  const chartData = {
    labels: Array.from({ length: 10 }, (_, index) => `Group ${index + 1}`), // X-axis labels (Group 1, Group 2, ..., Group 10)
    datasets: [
      {
        label: "Leads Converted to Deals",
        data: groupedData, // Y-axis values (sum of deals won for each group)
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
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
