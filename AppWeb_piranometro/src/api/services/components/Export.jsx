
import { exportData } from "AppWeb_piranometro\src\api\services\api.js";

const Export = () => {
  const handleExport = async () => {
    try {
      const blob = await exportData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "solar-data.csv";
      a.click();
    } catch (error) {
      console.error("Error al exportar los datos:", error);
      alert("Hubo un error al exportar los datos. Por favor, intántalo de nuevo.");
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-lg font-bold">Exportar Datos</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleExport} aria-label="Exportar datos a CSV">
        Exportar CSV
      </button>
    </div>
  );
};

export default Export;
