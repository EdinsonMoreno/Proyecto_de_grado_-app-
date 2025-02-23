
"use client";

import React, { useState, useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "../api/services/websocket.js";

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
    <div className="p-4 bg-gray-100">
      <h2 className="text-lg font-bold">Lectura Actual</h2>
      <div className="text-2xl text-blue-500">{currentReading} W/m²</div>
      <h3 className="mt-4 text-md font-semibold">Historial de Datos</h3>
      <ul className="list-disc pl-5">
        {historicalData.slice(-10).map((data, index) => (
          <li key={index}>{data.solar_radiation} W/m²</li>
        ))}
      </ul>
    </div>
  );
};

export default Monitor;
