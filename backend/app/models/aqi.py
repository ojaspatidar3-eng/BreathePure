from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field

class AqiScale(str, Enum):
    INDIAN_NAQI = "Indian NAQI (CPCB)"
    US_EPA = "US EPA AQI"

class AqiCategory(str, Enum):
    GOOD = "Good"
    SATISFACTORY = "Satisfactory"
    MODERATELY_POLLUTED = "Moderate"
    POOR = "Poor"
    VERY_POOR = "Very Poor"
    SEVERE = "Severe"

class PollutantData(BaseModel):
    pm2_5: Optional[float] = Field(None, description="PM2.5 particulate concentration in ug/m3")
    pm10: Optional[float] = Field(None, description="PM10 particulate concentration in ug/m3")
    no2: Optional[float] = Field(None, description="Nitrogen Dioxide in ug/m3")
    so2: Optional[float] = Field(None, description="Sulfur Dioxide in ug/m3")
    co: Optional[float] = Field(None, description="Carbon Monoxide in mg/m3")
    o3: Optional[float] = Field(None, description="Ozone in ug/m3")

class AqiReading(BaseModel):
    aqi: int
    scale: AqiScale = AqiScale.INDIAN_NAQI
    category: AqiCategory
    category_color: str
    dominant_pollutant: str
    pollutants: PollutantData
    city: str
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timestamp: str
    data_source: str
    is_live: bool
    is_manual: bool = False
    is_sample: bool = False
    general_health_message: str
    cautionary_statement: str
    data_disclaimer: Optional[str] = None

class ManualAqiInput(BaseModel):
    city: str = Field(..., min_length=1, max_length=100)
    country: str = Field("India", min_length=1, max_length=100)
    aqi: int = Field(..., ge=0, le=1000)
    scale: AqiScale = AqiScale.INDIAN_NAQI
    pm2_5: Optional[float] = Field(None, ge=0)
    pm10: Optional[float] = Field(None, ge=0)
    no2: Optional[float] = Field(None, ge=0)
    so2: Optional[float] = Field(None, ge=0)
    co: Optional[float] = Field(None, ge=0)
    o3: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = "Manual entry for educational/simulation purposes"
