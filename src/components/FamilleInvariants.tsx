import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Scope Par Famille Invariants %',
      font: {
        size: 14
      }
    },
    datalabels: {
      anchor: 'end' as const,
      align: 'top' as const,
      formatter: (value: number) => value + '%',
      font: {
        size: 11,
        weight: 'bold' as const
      },
      color: '#333'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        display: false
      },
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      }
    }
  }
};

// Labels for the 3 bars: EP, ES, ET
const allLabels = ['EP', 'ES', 'ET'];

const generateColors = () => {
  return [
    'rgba(226, 0, 0, 0.8)',    // Red for EP
    'rgba(230, 210, 0, 0.8)',  // Yellow for ES
    'rgba(0, 123, 255, 0.8)'   // Blue for ET
  ];
};

export const data = {
  labels: allLabels,
  datasets: [
    {
      label: 'Scope Par Famille Invariants %',
      data: [0, 0, 0],
      backgroundColor: generateColors(),
      borderRadius: 8, 
      barThickness: 20, 
    }
  ],
};

export default function FamilleInvariants({propsData}: {propsData: number[]}) {
  const [graphData, setGraphData] = useState<any>(data);
  
  useEffect(() => {
    if(propsData.length > 0){
      console.log("Props Data Famille Invariants: ", propsData);
      setGraphData({
        labels: allLabels,
        datasets: [
          {
            label: 'Scope Par Famille Invariants %',
            data: propsData,
            backgroundColor: generateColors(),
            borderRadius: 4,
            barThickness: 50,
          }
        ]
      });
    }
  }, [propsData])

  return (
    <div style={{ height: '100%', width: '100%' }} className='rounded-md shadow-md'>
      <Bar data={graphData} options={options} />
    </div>
  );
}