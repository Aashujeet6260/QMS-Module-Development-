import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const EventsByTypePieChart = ({ events }) => {
  const processData = () => {
    if (!events) return { labels: [], datasets: [] };

    const openEvents = events.filter(e => e.status !== 'Closed');
    const counts = openEvents.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
      labels,
      datasets: [
        {
          label: '# of Events',
          data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // Blue
            'rgba(249, 115, 22, 0.7)', // Orange
            'rgba(234, 179, 8, 0.7)',   // Yellow
            'rgba(139, 92, 246, 0.7)', // Violet
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = processData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Open Events by Type',
        font: { size: 16 }
      },
    },
  };

  return (
    <div className="card p-4" style={{ height: '300px' }}>
        <Pie data={chartData} options={options} />
    </div>
  );
};

export default EventsByTypePieChart;