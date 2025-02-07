import SummaryComponent from '../components/SummaryComponent';
import RealTimeDataComponent from '../components/RealTimeDataComponent';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Solar Data Dashboard</h1>
      <SummaryComponent />
      <RealTimeDataComponent />
    </div>
  );
};

export default HomePage;