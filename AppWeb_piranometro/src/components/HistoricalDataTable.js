import React, { useState, useEffect } from "react";
import axios from "../api/services/historicalData";

const HistoricalDataTable = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, page_size: 10 });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/historical-data/", { params: filters });
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div class="table-container">
      <table class="historical-data-table">
        <thead>
 <tr>
           <th>TimeUTC)</th>
           <th>Temperature°C)</th>
           <th>Humidity</th>
           <th>Global (W/m²)</th>
           <th>Direct (W/m²)</th>
           <th>Diffuse (W/m²)</th>
           <th>Infra Radiation (W/m²)</th>
           <th>Wind (m/s)</th>
           <th>Wind (°)</th>
           <th>Surface (Pa)</th>
         </tr>
       </thead        <tbody>
 {data.map((row, index) => (
            <tr keyindex}>
              <td>{rowtime(UTC)"]}</td>
             <td>{row2m}</td>
             <td>{rowH}</td>
             <td>{rowG(h)"]}</td>
             <td>{rowGb(n)"]}</td>
             <td>{rowGd(h)"]}</td>
             <td>{rowIR(h)"]}</td>
             <td>{rowS10m}</td>
             <td>{rowD10m}</td>
             <td>{row}</td>
           </tr>
                 </tbody      </table      <div class="pagination">
        <button={pagination.page === 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>
          Previous
        </button        <span>
 Page {pagination.page} of {pagination.total_pages}
        </span>
 <button          disabled={pagination.page === pagination.total_pages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </button      </div>
 </div>
 );
};

export default HistoricalDataTable;