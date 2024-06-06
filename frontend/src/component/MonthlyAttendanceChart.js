import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyAttendanceChart = ({ data }) => {
  // Group data by month
  
  const monthlyData = {};
  data.forEach(item => {
    const month = dayjs(item.date).format('MMM-YYYY');
    if (!monthlyData[month]) {
      monthlyData[month] = { present: 0, total: 0 };
    }
    monthlyData[month].total += 1;
    if (item.attendence === 'Present') {
      monthlyData[month].present += 1;
    }
  });

  // Calculate cumulative attendance percentage
 
  const dates = [];
  const cumulativeAttendance = [];

  Object.keys(monthlyData).forEach(month => {
    let cumulativePresent = 0;
    let cumulativeTotal = 0;
    dates.push(month);
    cumulativePresent += monthlyData[month].present;
    cumulativeTotal += monthlyData[month].total;
    
    cumulativeAttendance.push((cumulativePresent / cumulativeTotal) * 100);
  });

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Cumulative Attendance Percentage',
        data: cumulativeAttendance,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`,
        },
        title: {
          display: true,
          text: 'Cumulative Attendance Percentage',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: context => `${context.parsed.y.toFixed(2)}%`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default MonthlyAttendanceChart;
