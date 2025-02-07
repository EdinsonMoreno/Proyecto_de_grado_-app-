import { SolarData } from '../types';

export const useWebSocket = () => {
  const [realTimeData, setRealTimeData] = useState<SolarData | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealTimeData(data);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  return { realTimeData };
};