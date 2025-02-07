import DataTableComponent from '../components/DataTableComponent';
import { useFetch } from '../hooks/useFetch';

const HistoricalDataPage: React.FC = () => {
  const { data, loading, error } = useFetch();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Historical Data</h1>
      <DataTableComponent data={data} />
    </div>
  );
};

export default HistoricalDataPage;