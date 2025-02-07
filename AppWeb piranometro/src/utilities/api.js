const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Función para realizar solicitudes al backend
export async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${BACKEND_URL}/${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

// Función para conectar al WebSocket del backend
export function connectWebSocket(onMessage) {
  const socket = new WebSocket(`${BACKEND_URL.replace("http", "ws")}/ws`);
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  return socket;
}