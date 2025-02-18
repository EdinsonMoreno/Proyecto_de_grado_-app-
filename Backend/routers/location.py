
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import LocationInput

router = APIRouter()

# Variable para almacenar la ubicación en memoria (puede ser persistente en la base de datos si se requiere)
location_data = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/location/")
async def save_location(location: LocationInput):
    try:
        global location_data
        location_data = {
            "latitude": location.latitude,
            "longitude": location.longitude
        }
        return {"message": "Ubicación guardada correctamente.", "location": location_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/location/")
async def get_location():
    try:
        if not location_data:
            raise HTTPException(status_code=404, detail="Ubicaci�n no encontrada.")
        return location_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
