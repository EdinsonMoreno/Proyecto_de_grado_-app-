
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Simulación de envío de comandos al Arduino
@router.post("/commands/")
async def send_command(command: str):
    try:
        # Aqui se implementara la logica para enviar el comando al Arduino
        # Por ejemplo, usando una conexión serial o un protocolo especofico
        return {"message": f"Comando '{command}' enviado al Arduino."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
