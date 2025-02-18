# Corregir la ruta y guardar el archivo `page.jsx`
import os

# Crear la carpeta si no existe
os.makedirs("AppWeb piranometro/src/app", exist_ok=True)

# Código actualizado para `page.jsx`
page_code_updated = """
import React, { useReducer } from "react";
import Monitor from "../components/Monitor";
import Location from "../components/Location";
import Export from "../components/Export";

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
    <div className="app">
      <nav className="tabs">
        <button onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "monitor" })}>
          Monitor
        </button>
        <button onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "location" })}>
          Ubicación
        </button>
        <button onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "export" })}>
          Exportar
        </button>
      </nav>

      <div className="content">
        {activeTab === "monitor" && <Monitor />}
        {activeTab === "location" && <Location />}
        {activeTab === "export" && <Export />}
      </div>
    </div>
  );
};

export default MainComponent;
"""

# Guardar el archivo actualizado
with open("AppWeb piranometro/src/app/page.jsx", "w") as f:
    f.write(page_code_updated)

"Archivo `page.jsx` actualizado correctamente."