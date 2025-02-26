import pandas as pd
from sqlalchemy.orm import Session
from database import engine, Base
from models import HistoricalData

# Crear tablas
Base.metadata.create_all(bind=engine)

# Cargar datos
def load_csv_to_db(file_path: str, db: Session):
    df = pd.read_csv(file_path)
    for _, row in df.iterrows():
        record = HistoricalData(
            time=row["time(UTC)"],
            T2m=row["T2m"],
            RH=row["RH"],
            G_h=row["G(h)"],
            Gb_n=row["Gb(n)"],
            Gd_h=row["Gd(h)"],
            IR_h=row["IR(h)"],
            WS10m=row["WS10m"],
            WD10m=row["WD10m"],
            SP=row["SP"],
        )
        db.add(record)
    db.commit()

# Ejecutar script
if __name__ == "__main__":
    from database import SessionLocal
    db = SessionLocal()
    load_csv_to_db("tmy_4.626_-74.151_2005_2020.csv", db)