
"use client";

import React, { useState, useEffect } from "react";
import { saveLocation, getLocation } from "../api/services/api";

const Location = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await getLocation();
        setLocation(data);
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        alert("Hubo un error al cargar la ubicación. Por favor, intántalo de nuevo.");
      }
    };
    fetchLocation();
  }, []);

  const handleSave = async () => {
    try {
      await saveLocation(location);
      alert("Ubicación guardada correctamente");
    } catch (error) {
      console.error("Error al guardar la ubicación:", error);
      alert("Hubo un error al guardar la ubicación. Por favor, intántalo de nuevo.");
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-lg font-bold">Ubicación</h2>
      <input
        className="border border-gray-300 rounded p-2 mt-2"
        type="number"
        value={location.lat}
        onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
        placeholder="Latitud"
      />
      <input
        className="border border-gray-300 rounded p-2 mt-2"
        type="number"
        value={location.lng}
        onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
        placeholder="Longitud"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleSave}
      >
        Guardar Ubicación
      </button>
    </div>
  );
};

export default Location;
