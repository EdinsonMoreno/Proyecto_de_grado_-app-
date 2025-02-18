import requests

# URL del endpoint
endpoint_url = "http://localhost:8000/api/data/"

# Probar el endpoint POST para almacenar datos
payload = {
    "solar_radiation": 600.0,
    "energy_received": 15.0
}
response = requests.post(endpoint_url, json=payload)
print("Respuesta del POST /data/:", response.json())

# Probar el endpoint GET para obtener datos
response = requests.get(endpoint_url)
print("Respuesta del GET /data/:", response.json())