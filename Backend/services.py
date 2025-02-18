
from sqlalchemy.orm import Session
from models import SolarData
from sqlalchemy.sql import func
import datetime

def calculate_averages(period: str, db: Session):
    try:
        if period == "daily":
            today = datetime.date.today()
            avg = db.query(func.avg(SolarData.solar_radiation)).filter(SolarData.date == today).scalar()
        elif period == "monthly":
            current_month = datetime.date.today().month
            avg = db.query(func.avg(SolarData.solar_radiation)).filter(func.extract('month', SolarData.date) == current_month).scalar()
        elif period == "yearly":
            current_year = datetime.date.today().year
            avg = db.query(func.avg(SolarData.solar_radiation)).filter(func.extract('year', SolarData.date) == current_year).scalar()
        else:
            raise ValueError("Periodo no válido.")
        return avg
    except Exception as e:
        raise ValueError(f"Error al calcular promedios: {str(e)}")
