
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import data, location, commands
from database import engine
from models import Base

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Inicializar la aplicación FastAPI
app = FastAPI()

# Configuración de CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar los routers
app.include_router(data.router, prefix="/api")
app.include_router(location.router, prefix="/api")
app.include_router(commands.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
