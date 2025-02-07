import { SolarData } from '../types';

interface DataTableComponentProps {
  data: SolarData[];
}

const DataTableComponent: React.FC<DataTableComponentProps> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Solar Radiation</th>
          <th>Energy Received</th>
          <th>Peak Radiation</th>
          <th>Max Radiation Hour</th>
          <th>Min Radiation Hour</th>
          <th>Daily Avg Radiation</th>
          <th>Monthly Avg Radiation</th>
          <th>Yearly Avg Radiation</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.date}</td>
            <td>{item.time}</td>
            <td>{item.solar_radiation}</td>
            <td>{item.energy_received}</td>
            <td>{item.peak_radiation}</td>
            <td>{item.max_radiation_hour}</td>
            <td>{item.min_radiation_hour}</td>
            <td>{item.daily_avg_radiation}</td>
            <td>{item.monthly_avg_radiation}</td>
            <td>{item.yearly_avg_radiation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTableComponent;