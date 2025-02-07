import { SolarData } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';

const RealTimeDataComponent: React.FC = () => {
  const { realTimeData } = useWebSocket();

  if (!realTimeData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Real-Time Data</h2>
      <p>Date: {realTimeData.date}</p>
      <p>Time: {realTimeData.time}</p>
      <p>Solar Radiation: {realTimeData.solar_radiation}</p>
      <p>Energy Received: {realTimeData.energy_received}</p>
    </div>
  );
};

export default RealTimeDataComponent;