# Proyecto de Grado - Backend

Este es el backend de un proyecto de grado que recopila y almacena datos de un piranómetro (un dispositivo que mide la radiación solar). El backend está construido usando FastAPI y SQLite para la base de datos.

## Estructura del Proyecto

### Dependencias

Para ejecutar este proyecto, necesitas instalar las siguientes librerías:

- **FastAPI**: Para crear la aplicación web.
- **SQLAlchemy**: Para manejar la base de datos.
- **Uvicorn**: Para ejecutar el servidor de FastAPI.

Puedes instalar estas librerías usando `pip`:

```bash
pip install fastapi sqlalchemy uvicorn
Copy
Insert
Apply
Archivos
Backend v1.py: Este es el archivo principal que contiene la lógica del backend.
Configuración de la Base de Datos
La base de datos utilizada es SQLite. La configuración de la base de datos se encuentra en el archivo Backend v1.py:

# Configuración de la base de datos SQLite
DATABASE_URL = "sqlite:///./piranometro.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Copy
Insert
Apply
Modelo de la Base de Datos
El modelo de la base de datos se define en la clase SolarData:

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
Copy
Insert
Apply
Creación de Tablas
Las tablas se crean automáticamente al iniciar la aplicación:

Base.metadata.create_all(bind=engine)
Copy
Insert
Apply
Endpoints
WebSocket
El endpoint WebSocket se utiliza para transmitir datos en tiempo real a los clientes conectados:

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
Copy
Insert
Apply
Recibir y Almacenar Datos
Este endpoint recibe datos del piranómetro y los almacena en la base de datos:

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
Copy
Insert
Apply
Consultar Datos Históricos
Este endpoint devuelve todos los datos almacenados en la base de datos:

@app.get("/data/")
async def get_data(db: Session = Depends(get_db)):
    try:
        data = db.query(SolarData).all()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
Copy
Insert
Apply
Calcular Promedios
Este endpoint calcula y devuelve el promedio de radiación solar según el periodo especificado (diario, mensual, anual):

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
Copy
Insert
Apply
Ejecutar el Servidor
Para iniciar el servidor, ejecuta el siguiente comando en la terminal:

uvicorn Backend_v1:app --reload
Copy
Insert
Apply
El servidor se ejecutará en http://0.0.0.0:8000.

CORS Configuration
Para permitir el acceso desde el frontend en React, se ha configurado CORS:

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Copy
Insert
Apply
Dependencia para Obtener la Sesión de la Base de Datos
La dependencia get_db se utiliza para obtener una sesión de la base de datos:

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
Copy
Insert
Apply
Ejemplo de Uso
WebSocket
Conéctate al WebSocket en ws://localhost:8000/ws.
Recibirás datos simulados cada 5 segundos.
Recibir y Almacenar Datos
Envía una solicitud POST a http://localhost:8000/data/ con los datos de radiación solar y energía recibida.
Los datos se almacenarán en la base de datos.
Consultar Datos Históricos
Envía una solicitud GET a http://localhost:8000/data/.
Recibirás todos los datos almacenados en la base de datos.
Calcular Promedios
Envía una solicitud GET a http://localhost:8000/data/average/?period=daily (o monthly o yearly).
Recibirás el promedio de radiación solar para el periodo especificado.
Notas
Los cálculos de promedios y otros valores (como la radiación pico) son simulaciones y pueden necesitar ajustes según los datos reales.
Asegúrate de tener el frontend configurado para conectarse a estos endpoints.
Contacto
Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en contactarme a cubelogicdesign@gmail.com 
O en nuestra pagina web 
https://cubelogic-creations-48777850.hubspotpagebuilder.com/es/

