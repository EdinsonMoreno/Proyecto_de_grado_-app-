"use client";
import React from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MainComponent() {
  const { useState, useEffect, useCallback, useMemo, useReducer } = React;
  const [currentReading, setCurrentReading] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState({
    wifi: true,
    sensor: true,
    lastUpdate: new Date(),
  });
  const [location, setLocation] = useState({
    lat: 40.4168,
    lng: -3.7038,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "#10B981",
        tension: 0.4,
        fill: false,
      },
    ],
  });
  const checkConnection = useCallback(async () => {
    try {
      const status = {
        wifi: Math.random() > 0.5,
        sensor: Math.random() > 0.5,
        lastUpdate: new Date(),
      };
      setDeviceStatus(status);
      if (!status.wifi || !status.sensor) {
        throw new Error("Dispositivo desconectado");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error de conexión:", error);
    }
  }, []);
  const downloadCSV = useCallback(() => {
    try {
      const link = document.createElement("a");
      link.href = "/api/export-data";
      link.download = `solar-data-${new Date().toISOString()}.csv`;
      link.click();
    } catch (error) {
      setError("Error al descargar datos");
      console.error("Error de descarga:", error);
    }
  }, []);
  const initialState = {
    darkMode: false,
    activeTab: "monitor",
    timeRange: "day",
  };
  function reducer(state, action) {
    switch (action.type) {
      case "SET_DARK_MODE":
        return { ...state, darkMode: action.payload };
      case "SET_ACTIVE_TAB":
        return { ...state, activeTab: action.payload };
      case "SET_TIME_RANGE":
        return { ...state, timeRange: action.payload };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const { darkMode, activeTab, timeRange } = state;
  const memoizedChartData = useMemo(() => {
    if (!historicalData.length) return chartData;
    return {
      labels: historicalData.slice(-50).map((d) => d.timestamp),
      datasets: [
        {
          data: historicalData.slice(-50).map((d) => d.value),
          borderColor: "#10B981",
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [historicalData]);
  const validateLocation = useCallback((lat, lng) => {
    const validLat = Number(lat);
    const validLng = Number(lng);
    return {
      lat: isNaN(validLat) ? 40.4168 : Math.max(-90, Math.min(90, validLat)),
      lng: isNaN(validLng) ? -3.7038 : Math.max(-180, Math.min(180, validLng)),
    };
  }, []);
  const [mapError, setMapError] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markerInstance, setMarkerInstance] = useState(null);

  const [gptResponse, setGptResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Define the custom icon
  const customIcon = L.icon({
  iconUrl: '/mappointer_114502.ico',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const analyzeMap = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const mapElement = document.getElementById("map");
      if (!mapElement) return;

      const canvas = await html2canvas(mapElement);
      const base64Image = canvas.toDataURL("image/png").split(",")[1];

      const response = await fetch("/integrations/gpt-vision/", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "¿Qué área geográfica se muestra en este mapa y cuáles son las principales ciudades visibles?",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      setGptResponse(data.choices[0].message.content);
    } catch (error) {
      setError("Error al analizar el mapa: " + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);
  
// Integra OpenStretMap con Leaflet 
useEffect(() => {
  if (activeTab === "location") {
    // Inicializar el mapa de Leaflet
    const map = L.map('map').setView([location.lat, location.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Crear un marcador arrastrable
    const marker = L.marker([location.lat, location.lng], { draggable: true, icon: customIcon }).addTo(map);

    // Crear una ventana de información
    const infoWindow = L.popup().setContent("Arrastra el marcador para actualizar la ubicación");

    // Mostrar la ventana de información al hacer clic en el marcador
    marker.on('click', function () {
      infoWindow.setLatLng(marker.getLatLng()).openOn(map);
    });

    // Evento para actualizar la ubicación al arrastrar el marcador
    marker.on('dragend', function (e) {
      const { lat, lng } = e.target.getLatLng();
      const validatedLocation = validateLocation(lat, lng);
      setLocation(validatedLocation);
      infoWindow.setContent(`Lat: ${validatedLocation.lat.toFixed(6)}, Lng: ${validatedLocation.lng.toFixed(6)}`);
    });

    // Evento para posicionar el marcador al hacer clic en el mapa
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      const validatedLocation = validateLocation(lat, lng);
      marker.setLatLng(validatedLocation);
      setLocation(validatedLocation);
      infoWindow.setContent(`Lat: ${validatedLocation.lat.toFixed(6)}, Lng: ${validatedLocation.lng.toFixed(6)}`);
      infoWindow.setLatLng(validatedLocation).openOn(map);
    });

    // Evento para posicionar el marcador al hacer clic en el mapa
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      const validatedLocation = validateLocation(lat, lng);
      marker.setLatLng(validatedLocation);
      setLocation(validatedLocation);
      infoWindow.setContent(`Lat: ${validatedLocation.lat.toFixed(6)}, Lng: ${validatedLocation.lng.toFixed(6)}`);
      infoWindow.setLatLng(validatedLocation).openOn(map);
    });

    // Guardar instancias del mapa y marcador
    setMapInstance(map);
    setMarkerInstance(marker);

    // Limpiar instancias al desmontar
    return () => {
      map.remove();
    };
  }
}, [activeTab, location, customIcon]);

  useEffect(() => {
    if (mapInstance && markerInstance) {
      try {
        const validatedLocation = validateLocation(location.lat, location.lng);
        markerInstance.setPosition(validatedLocation);
        mapInstance.panTo(validatedLocation);
      } catch (error) {
        setMapError("Error al actualizar la ubicación: " + error.message);
      }
    }
  }, [location, mapInstance, markerInstance, customIcon]);

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-yellow-50 to-orange-50"
      } p-4 font-roboto transition-colors duration-300`}
      role="main"
    >
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <i className="fas fa-solar-panel text-yellow-500 text-3xl"></i>
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              SolarSense
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                dispatch({ type: "SET_DARK_MODE", payload: !darkMode })
              }
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-yellow-500"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-opacity-80 transition-colors duration-200`}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
            >
              <i
                className={`fas ${darkMode ? "fa-sun" : "fa-moon"} text-xl`}
              ></i>
            </button>
          </div>
        </nav>
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_TAB", payload: "monitor" })
            }
            className={`px-4 py-2 rounded-lg ${
              activeTab === "monitor"
                ? "bg-yellow-500 text-white"
                : darkMode
                ? "bg-gray-700 text-yellow-500"
                : "bg-white text-gray-700"
            } hover:bg-opacity-90 transition-colors duration-200`}
          >
            <i className="fas fa-chart-line mr-2"></i>Monitor
          </button>
          <button
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_TAB", payload: "diagnostic" })
            }
            className={`px-4 py-2 rounded-lg ${
              activeTab === "diagnostic"
                ? "bg-yellow-500 text-white"
                : darkMode
                ? "bg-gray-700 text-yellow-500"
                : "bg-white text-gray-700"
            } hover:bg-opacity-90 transition-colors duration-200`}
          >
            <i className="fas fa-tools mr-2"></i>Diagnóstico
          </button>
          <button
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_TAB", payload: "location" })
            }
            className={`px-4 py-2 rounded-lg ${
              activeTab === "location"
                ? "bg-yellow-500 text-white"
                : darkMode
                ? "bg-gray-700 text-yellow-500"
                : "bg-white text-gray-700"
            } hover:bg-opacity-90 transition-colors duration-200`}
          >
            <i className="fas fa-map-marker-alt mr-2"></i>Ubicación
          </button>
          <button
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_TAB", payload: "education" })
            }
            className={`px-4 py-2 rounded-lg ${
              activeTab === "education"
                ? "bg-yellow-500 text-white"
                : darkMode
                ? "bg-gray-700 text-yellow-500"
                : "bg-white text-gray-700"
            } hover:bg-opacity-90 transition-colors duration-200`}
          >
            <i className="fas fa-graduation-cap mr-2"></i>Educación
          </button>
        </div>

        {activeTab === "monitor" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg p-6 transition-colors duration-300`}
            >
              <h2 className="text-xl font-semibold mb-4">Lectura Actual</h2>
              <div className="flex items-center justify-center h-48">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-yellow-500 animate-pulse">
                      {currentReading} W/m²
                    </span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className={`${
                        darkMode ? "stroke-gray-700" : "stroke-gray-200"
                      }`}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      strokeWidth="8"
                    />
                    <circle
                      className="stroke-yellow-500"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      strokeWidth="8"
                      strokeDasharray={`${(currentReading / 1000) * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Historial de Datos</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange("day")}
                  className={`px-3 py-1 rounded ${
                    timeRange === "day"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Día
                </button>
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-3 py-1 rounded ${
                    timeRange === "week"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-3 py-1 rounded ${
                    timeRange === "month"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Mes
                </button>
              </div>
            </div>
            <div className="h-64 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500">
                  {error}
                </div>
              ) : (
                <div className="h-full w-full">Chart would render here</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "diagnostic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={darkMode ? "text-gray-200" : "text-gray-700"}
                  >
                    Conexión WiFi
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      deviceStatus.wifi ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {deviceStatus.wifi ? "Conectado" : "Desconectado"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={darkMode ? "text-gray-200" : "text-gray-700"}
                  >
                    Sensor
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      deviceStatus.sensor ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {deviceStatus.sensor ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => checkConnection()}
                    className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                  >
                    Verificar Conexión
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <h2 className="text-xl font-semibold mb-4">Guía de Solución</h2>
              <div className="space-y-2">
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  1. Verifique la conexión WiFi de la Raspberry Pi
                </p>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  2. Asegúrese que el sensor esté correctamente conectado
                </p>
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  3. Reinicie el dispositivo si persisten los problemas
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div
            className={`p-6 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
            role="region"
            aria-label="Ubicación del Panel Solar"
          >
            <h2 className="text-xl font-semibold mb-4">
              Ubicación del Panel Solar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="latitude"
                    className={`block mb-2 ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Latitud
                  </label>
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    value={location.lat}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        setLocation((prev) => ({
                          ...prev,
                          lat: validateLocation(value, prev.lng).lat,
                        }));
                      }
                    }}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                    step="0.000001"
                    placeholder="Ej: 40.4168"
                  />
                </div>
                <div>
                  <label
                    htmlFor="longitude"
                    className={`block mb-2 ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Longitud
                  </label>
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    value={location.lng}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        setLocation((prev) => ({
                          ...prev,
                          lng: validateLocation(prev.lat, value).lng,
                        }));
                      }
                    }}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                    step="0.000001"
                    placeholder="Ej: -3.7038"
                  />
                </div>
                <button
                  onClick={analyzeMap}
                  disabled={isAnalyzing}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <span>Analizando...</span>
                  ) : (
                    <span>Analizar Área del Mapa</span>
                  )}
                </button>
                {gptResponse && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700">{gptResponse}</p>
                  </div>
                )}
              </div>
              <div className="relative min-h-[400px]">
                <div
                  id="map"
                  className="absolute inset-0 rounded-lg"
                  role="application"
                  aria-label="Mapa de ubicación"
                ></div>
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
                    <p className="text-red-500">{mapError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "education" && (
          <div
            className={`p-6 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6">
              Guía de Instalación Solar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-yellow-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3">
                  Conceptos Básicos
                </h3>
                <ul className="space-y-2">
                  <li
                    className={`flex items-center ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <i className="fas fa-sun text-yellow-500 mr-2"></i>
                    Orientación óptima del panel
                  </li>
                  <li
                    className={`flex items-center ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <i className="fas fa-angle-double-up text-yellow-500 mr-2"></i>
                    Ángulo de inclinación
                  </li>
                  <li
                    className={`flex items-center ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <i className="fas fa-cloud-sun text-yellow-500 mr-2"></i>
                    Eficiencia energética
                  </li>
                </ul>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-yellow-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3">Mantenimiento</h3>
                <ul className="space-y-2">
                  <li
                    className={`flex items-center ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <i className="fas fa-broom text-yellow-500 mr-2"></i>
                    Limpieza regular
                  </li>
                  <li
                    className={`flex items-center ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <i className="fas fa-tools text-yellow-500 mr-2"></i>
                    Inspección periódica
                  </li>
                  <li
                    className={`flex items-center ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <i className="fas fa-chart-line text-yellow-500 mr-2"></i>
                    Monitoreo de rendimiento
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Exportar Datos</h2>
            <button
              onClick={downloadCSV}
              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              Export CSV
            </button>
          </div>
          <p className="text-gray-600">
            Download historical solar radiation data in CSV format
          </p>
        </div>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;