import ChartComponent from '../components/ChartComponent';
import { useFetch } from '../hooks/useFetch';

const DetailedChartsPage: React.FC = () => {
  const { data, loading, error } = useFetch();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Detailed Charts</h1>
      <ChartComponent data={data} />
    </div>
  );
};

export default DetailedChartsPage;