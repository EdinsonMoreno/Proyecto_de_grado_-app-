# Corregir el error importando el módulo `os` y optimizar el archivo page.jsx
import os

# Código optimizado para page.jsx
page_code_optimized = """
"use client";

import React, { useReducer } from "react";
import Monitor from "../api/services/components/Monitor";
import Location from "../api/services/components/Location";
import Export from "../api/services/components/Export";

const MainComponent = () => {
  const initialState = {
    activeTab: "monitor",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_ACTIVE_TAB":
        return { ...state, activeTab: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeTab } = state;

  return (
    <div className="p-4 bg-gray-100">
      <nav className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "monitor" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "monitor" })}
        >
          Monitor
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "location" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "location" })}
        >
          Ubicación
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "export" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "export" })}
        >
          Exportar
        </button>
      </nav>

      <div className="mt-4">
        {activeTab === "monitor" && <Monitor />}
        {activeTab === "location" && <Location />}
        {activeTab === "export" && <Export />}
      </div>
    </div>
  );
};

export default MainComponent;
"""

# Crear la carpeta si no existe
os.makedirs("AppWeb piranometro/src/app", exist_ok=True)

# Guardar el archivo corregido
with open("AppWeb piranometro/src/app/page.jsx", "w") as f:
    f.write(page_code_optimized)

"Archivo page.jsx corregido e integrado correctamente."