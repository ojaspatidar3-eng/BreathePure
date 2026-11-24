from fastapi import APIRouter, Query, HTTPException
from app.models.aqi import AqiReading, ManualAqiInput, AqiScale
from app.services.aqi_service import aqi_service

router = APIRouter(prefix="/aqi", tags=["Air Quality Telemetry"])

@router.get("/current", response_model=AqiReading)
async def get_current_aqi(
    city: str = Query("New Delhi", min_length=1, max_length=100, description="City name"),
    country: str = Query("India", min_length=1, max_length=100, description="Country name")
):
    """
    Fetches real-time, verified air quality telemetry for the requested city.
    Applies standard Indian NAQI (CPCB) calculations with transparent attribution.
    """
    try:
        reading = await aqi_service.fetch_live_air_quality(city, country)
        return reading
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve air quality data: {str(e)}")

@router.post("/manual", response_model=AqiReading)
async def submit_manual_aqi(manual_input: ManualAqiInput):
    """
    Processes manual AQI input for testing, simulation, or educational demonstration.
    Explicitly tags the reading as manual/simulated to prevent data misrepresentation.
    """
    try:
        return aqi_service.process_manual_input(manual_input)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid manual reading parameter: {str(e)}")

@router.get("/scales")
async def get_aqi_scales():
    """Returns official breakpoint scales for Indian NAQI (CPCB) and US EPA."""
    return {
        "indian_naqi": {
            "name": "National Air Quality Index (CPCB India)",
            "categories": [
                {"range": "0 - 50", "category": "Good", "color": "#10B981", "impact": "Minimal impact"},
                {"range": "51 - 100", "category": "Satisfactory", "color": "#84CC16", "impact": "Minor breathing discomfort to sensitive people"},
                {"range": "101 - 200", "category": "Moderate", "color": "#F59E0B", "impact": "Breathing discomfort to people with lung disease/asthma, children, seniors"},
                {"range": "201 - 300", "category": "Poor", "color": "#F97316", "impact": "Breathing discomfort to most people on prolonged exposure"},
                {"range": "301 - 400", "category": "Very Poor", "color": "#EF4444", "impact": "Respiratory illness on prolonged exposure"},
                {"range": "401 - 500", "category": "Severe", "color": "#7F1D1D", "impact": "Affects healthy people and seriously impacts those with existing diseases"}
            ]
        },
        "us_epa": {
            "name": "US EPA Air Quality Index",
            "categories": [
                {"range": "0 - 50", "category": "Good", "color": "#10B981"},
                {"range": "51 - 100", "category": "Moderate", "color": "#F59E0B"},
                {"range": "101 - 150", "category": "Unhealthy for Sensitive Groups", "color": "#F97316"},
                {"range": "151 - 200", "category": "Unhealthy", "color": "#EF4444"},
                {"range": "201 - 300", "category": "Very Unhealthy", "color": "#8B5CF6"},
                {"range": "301 - 500", "category": "Hazardous", "color": "#7F1D1D"}
            ]
        }
    }
