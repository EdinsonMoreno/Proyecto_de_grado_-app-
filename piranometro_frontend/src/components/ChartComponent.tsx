import { Line } from 'react-chartjs-2';
import { SolarData } from '../types';

interface ChartComponentProps {
  data: SolarData[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => `${item.date} ${item.time}`),
    datasets: [
      {
        label: 'Solar Radiation',
        data: data.map((item) => item.solar_radiation),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default ChartComponent;