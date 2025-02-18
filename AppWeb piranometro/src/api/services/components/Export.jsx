
import React from "react";
import { exportData } from "../api/services/api";

const Export = () => {
  const handleExport = async () => {
    const blob = await exportData();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solar-data.csv";
    a.click();
  };

  return (
    <div className="export">
      <h2>Exportar Datos</h2>
      <button onClick={handleExport}>Exportar CSV</button>
    </div>
  );
};

export default Export;
