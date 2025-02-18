import asyncio
import websockets

# URL del WebSocket
websocket_url = "ws://localhost:8000/api/ws"

async def test_websocket():
    try:
        async with websockets.connect(websocket_url) as websocket:
            print("Conexión al WebSocket exitosa.")
            for _ in range(3):  # Recibir 3 mensajes para probar
                message = await websocket.recv()
                print("Mensaje recibido del WebSocket:", message)
    except Exception as e:
        print("Error al conectar con el WebSocket:", e)

# Ejecutar la prueba
asyncio.run(test_websocket())