
import React, { useState, useEffect } from "react";
import { saveLocation, getLocation } from "../api/services/api";

const Location = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const fetchLocation = async () => {
      const data = await getLocation();
      setLocation(data);
    };
    fetchLocation();
  }, []);

  const handleSave = async () => {
    await saveLocation(location);
    alert("Ubicaci�n guardada correctamente");
  };

  return (
    <div className="location">
      <h2>Ubicaci�n</h2>
      <input
        type="number"
        value={location.lat}
        onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
        placeholder="Latitud"
      />
      <input
        type="number"
        value={location.lng}
        onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
        placeholder="Longitud"
      />
      <button onClick={handleSave}>Guardar Ubicaci�n</button>
    </div>
  );
};

export default Location;
