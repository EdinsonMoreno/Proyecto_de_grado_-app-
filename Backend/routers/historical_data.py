from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime
import pandas as pd
from sqlalchemy.orm import Session
from database import get_db
from models import HistoricalData

router = APIRouter()

@router.get("/api/historical-data/")
def get_historical_data(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    min_radiation: Optional[float] = Query(None),
    max_radiation: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1),
    sort_by: str = Query("time(UTC)"),
    order: str = Query("asc"),
    db: Session = get_db()
):
    try:
        # Validar fechas
        if start_date:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
        if end_date:
            end_date = datetime.strptime(end_date, "%Y-%m-%d")

        # Construir consulta
        query = db.query(HistoricalData)
        if start_date:
            query = query.filter(HistoricalData.time >= start_date)
        if end_date:
            query = query.filter(HistoricalData.time <= end_date        if min_radiation is not None:
            query = query.filter(HistoricalData.G_h >= min_radiation)
        if max_radiation is not None:
            query = query.filter(HistoricalData.G_h <= max_ration)

        # Ordenar resultados
        if order == "desc":
            query = query.order_by(getattr(HistoricalData, sort_by).desc())
        else:
            query = query.order_by(getattr(HistoricalData, sort_by).asc())

        # Paginación
        total_records = query.count()
        total_pages = (total_records + page_size - 1) // page_size
        query = query.offset((page - 1) * page_size).limit(page_size)

        # Formatear respuesta
        data = query.all()
        return {
            "data": [record.to_dict() for record in data],
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "total_records": total_records,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))