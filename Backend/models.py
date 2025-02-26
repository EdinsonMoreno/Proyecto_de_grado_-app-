from sqlalchemy import Column, Integer, Float, String, Date, Time
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

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

