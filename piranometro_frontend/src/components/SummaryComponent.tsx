import { useFetch } from '../hooks/useFetch';
import { fetchAverageData } from '../services/apiService';
import { SolarData } from '../types';

const SummaryComponent: React.FC = () => {
  const { data, loading, error } = useFetch();
  const [averages, setAverages] = useState<{ daily: number; monthly: number; yearly: number }>({
    daily: 0,
    monthly: 0,
    yearly: 0,
  });

  useEffect(() => {
    const fetchAverages = async () => {
      const daily = await fetchAverageData('daily');
      const monthly = await fetchAverageData('monthly');
      const yearly = await fetchAverageData('yearly');
      setAverages({ daily: daily.average_radiation, monthly: monthly.average_radiation, yearly: yearly.average_radiation });
    };

    if (!loading && !error) {
      fetchAverages();
    }
  }, [data, loading, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Summary</h2>
      <p>Daily Average Radiation: {averages.daily}</p>
      <p>Monthly Average Radiation: {averages.monthly}</p>
      <p>Yearly Average Radiation: {averages.yearly}</p>
    </div>
  );
};

export default SummaryComponent;