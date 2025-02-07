from fastapi import FastAPI, WebSocket, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, Float, String, Date, Time, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import datetime
import asyncio

# Configuración de la base de datos SQLite
DATABASE_URL = "sqlite:///./piranometro.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Modelo de la base de datos
class SolarData(Base):
    __tablename__ = "solar_data"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today)
    time = Column(Time, default=datetime.datetime.now().time)
    solar_radiation = Column(Float, nullable=False)
    energy_received = Column(Float, nullable=False)
    peak_radiation = Column(Float, nullable=False)
    max_radiation_hour = Column(String, nullable=False)
    min_radiation_hour = Column(String, nullable=False)
    daily_avg_radiation = Column(Float, nullable=False)
    monthly_avg_radiation = Column(Float, nullable=False)
    yearly_avg_radiation = Column(Float, nullable=False)

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Inicializar la aplicación FastAPI
app = FastAPI()

# Configuración de CORS para permitir el acceso desde el frontend en React
origins = ["http://localhost:5000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# WebSocket para transmisión de datos en tiempo real
connected_clients = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await asyncio.sleep(5)  # Intervalo de transmisión
            # Simulación de datos en tiempo real
            data = {
                "date": str(datetime.date.today()),
                "time": str(datetime.datetime.now().time()),
                "solar_radiation": 500.0,  # Ejemplo de radiación solar
                "energy_received": 10.0,  # Ejemplo de energía recibida
            }
            for client in connected_clients:
                await client.send_json(data)
    except Exception as e:
        connected_clients.remove(websocket)

# Endpoint para recibir y almacenar datos del piranómetro
@app.post("/data/")
async def receive_data(
    solar_radiation: float,
    energy_received: float,
    db: Session = Depends(get_db),
):
    try:
        # Cálculos previos
        peak_radiation = solar_radiation  # Ejemplo: se puede ajustar según los datos
        max_radiation_hour = str(datetime.datetime.now().time())
        min_radiation_hour = str(datetime.datetime.now().time())
        daily_avg_radiation = solar_radiation  # Simulación
        monthly_avg_radiation = solar_radiation  # Simulación
        yearly_avg_radiation = solar_radiation  # Simulación

        # Crear registro en la base de datos
        solar_data = SolarData(
            solar_radiation=solar_radiation,
            energy_received=energy_received,
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
        return JSONResponse(content={"message": "Datos almacenados correctamente."})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para consultar datos históricos
@app.get("/data/")
async def get_data(db: Session = Depends(get_db)):
    try:
        data = db.query(SolarData).all()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para calcular promedios según el periodo
@app.get("/data/average/")
async def get_average(period: str, db: Session = Depends(get_db)):
    try:
        if period == "daily":
            avg = db.query(func.avg(SolarData.daily_avg_radiation)).scalar()
        elif period == "monthly":
            avg = db.query(func.avg(SolarData.monthly_avg_radiation)).scalar()
        elif period == "yearly":
            avg = db.query(func.avg(SolarData.yearly_avg_radiation)).scalar()
        else:
            raise HTTPException(status_code=400, detail="Periodo no válido.")
        return {"period": period, "average_radiation": avg}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ejemplo de cómo iniciar el servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)