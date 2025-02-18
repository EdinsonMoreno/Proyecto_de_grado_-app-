
from pydantic import BaseModel

class SolarDataInput(BaseModel):
    solar_radiation: float
    energy_received: float

class LocationInput(BaseModel):
    latitude: float
    longitude: float
