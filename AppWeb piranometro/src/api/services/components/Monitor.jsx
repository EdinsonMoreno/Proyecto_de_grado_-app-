
import React, { useState, useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "../api/services/websocket";

const Monitor = () => {
  const [currentReading, setCurrentReading] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    connectWebSocket((data) => {
      setCurrentReading(data.solar_radiation);
      setHistoricalData((prev) => [...prev, data]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div className="monitor">
      <h2>Lectura Actual</h2>
      <div>{currentReading} W/m�</div>
      <h3>Historial de Datos</h3>
      <ul>
        {historicalData.slice(-10).map((data, index) => (
          <li key={index}>{data.solar_radiation} W/m�</li>
        ))}
      </ul>
    </div>
  );
};

export default Monitor;
