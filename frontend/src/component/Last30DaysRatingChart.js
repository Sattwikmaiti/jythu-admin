import React from 'react';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Last30DaysRatingChart = ({ data }) => {
  
  const last30DaysData = data.slice(-30);
 
  const dates = last30DaysData.map(item =>  dayjs(item.date).format('MMM-DD-YYYY'));
  const ratings = last30DaysData.map(item => item.rating);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Rating',
        data: ratings,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default Last30DaysRatingChart;
