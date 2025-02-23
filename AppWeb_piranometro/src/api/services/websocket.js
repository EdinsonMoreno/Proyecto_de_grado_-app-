
let socket;

export const connectWebSocket = (onMessage) => {
  socket = new WebSocket("ws://localhost:8000/api/ws");

  socket.onopen = () => {
    console.log("WebSocket conectado.");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onerror = (error) => {
    console.error("Error en WebSocket:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket desconectado.");
  };
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
