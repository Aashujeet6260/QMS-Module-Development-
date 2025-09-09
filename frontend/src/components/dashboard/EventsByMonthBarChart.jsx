import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EventsByMonthBarChart = ({ events }) => {
    const processData = () => {
        const monthCounts = Array(12).fill(0);
        if (events) {
            events.forEach(event => {
                const month = new Date(event.created_at).getMonth();
                monthCounts[month]++;
            });
        }
        
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return {
            labels,
            datasets: [{
                label: 'Events Created',
                data: monthCounts,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            }]
        }
    };

    const chartData = processData();

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Events Created Per Month',
            font: { size: 16 }
          },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
      };

    return (
        <div className="card p-4" style={{ height: '300px' }}>
            <Bar options={options} data={chartData} />
        </div>
    );
}

export default EventsByMonthBarChart;