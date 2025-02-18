
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import SolarData
from schemas import SolarDataInput
from database import SessionLocal
from sqlalchemy.sql import func
import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/data/")
async def receive_data(data: SolarDataInput, db: Session = Depends(get_db)):
    try:
        # Calculos previos
        peak_radiation = data.solar_radiation
        max_radiation_hour = str(datetime.datetime.now().time())
        min_radiation_hour = str(datetime.datetime.now().time())
        daily_avg_radiation = data.solar_radiation
        monthly_avg_radiation = data.solar_radiation
        yearly_avg_radiation = data.solar_radiation

        # Crear registro en la base de datos
        solar_data = SolarData(
            solar_radiation=data.solar_radiation,
            energy_received=data.energy_received,
            peak_radiation=peak_radiation,
            max_radiation_hour=max_radiation_hour,
            min_radiation_hour=min_radiation_hour,
            daily_avg_radiation=daily_avg_radiation,
            monthly_avg_radiation=monthly_avg_radiation,
            yearly_avg_radiation=yearly_avg_radiation,
        )
        db.add(solar_data)
        db.commit()
        db.refresh(solar_data)
        return {"message": "Datos almacenados correctamente."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, WebSocket, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import SolarData
import datetime
import asyncio

router = APIRouter()
connected_clients = []

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await asyncio.sleep(5)  # Intervalo de transmision
            # Obtener el ultimo dato almacenado en la base de datos
            latest_data = db.query(SolarData).order_by(SolarData.id.desc()).first()
            if latest_data:
                data = {
                    "date": str(latest_data.date),
                    "time": str(latest_data.time),
                    "solar_radiation": latest_data.solar_radiation,
                    "energy_received": latest_data.energy_received,
                }
                for client in connected_clients:
                    await client.send_json(data)
            else:
                for client in connected_clients:
                    await client.send_json({"message": "No hay datos disponibles."})
    except Exception as e:
        connected_clients.remove(websocket)
