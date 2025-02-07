import { fetchSolarData, fetchAverageData } from '../services/apiService';
import { SolarData } from '../types';

export const useFetch = () => {
  const [data, setData] = useState<SolarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchSolarData();
        setData(result);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};