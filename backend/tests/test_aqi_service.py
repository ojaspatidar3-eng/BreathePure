import pytest
from app.services.aqi_service import aqi_service, NAQI_BREAKPOINTS
from app.models.aqi import PollutantData, AqiScale, AqiCategory, ManualAqiInput

def test_cpcb_sub_index_calculation():
    """Validates accurate sub-index calculation according to CPCB breakpoint tables."""
    # PM2.5: 0-30 -> 0-50
    assert aqi_service.calculate_sub_index(15.0, NAQI_BREAKPOINTS["pm2_5"]) == 25
    assert aqi_service.calculate_sub_index(30.0, NAQI_BREAKPOINTS["pm2_5"]) == 50

    # PM2.5: 31-60 -> 51-100
    sub_60 = aqi_service.calculate_sub_index(60.0, NAQI_BREAKPOINTS["pm2_5"])
    assert sub_60 == 100

    # PM2.5: 121-250 -> 301-400 (Very Poor)
    sub_150 = aqi_service.calculate_sub_index(150.0, NAQI_BREAKPOINTS["pm2_5"])
    assert 301 <= sub_150 <= 400

    # PM2.5: > 250 -> 401-500 (Severe)
    sub_300 = aqi_service.calculate_sub_index(300.0, NAQI_BREAKPOINTS["pm2_5"])
    assert sub_300 >= 401

def test_indian_naqi_dominant_pollutant():
    """Checks that the maximum sub-index sets the dominant pollutant and overall AQI."""
    pollutants = PollutantData(
        pm2_5=130.0,  # Very Poor sub-index ~ 308
        pm10=80.0,    # Satisfactory sub-index ~ 80
        no2=30.0,     # Good sub-index
        so2=15.0,
        co=0.8,
        o3=20.0
    )
    aqi_val, dominant = aqi_service.compute_indian_naqi(pollutants)
    assert aqi_val >= 301
    assert dominant == "PM2.5"

def test_aqi_category_and_advisory():
    """Checks official categories, colors, and cautionary statements."""
    good = aqi_service.get_category_and_advisory(45)
    assert good["category"] == AqiCategory.GOOD.value
    assert good["color"] == "#10B981"

    severe = aqi_service.get_category_and_advisory(420)
    assert severe["category"] == AqiCategory.SEVERE.value
    assert "indoors" in severe["caution"].lower()

def test_manual_input_processing():
    """Verifies that manual simulation entries are marked truthfully without hallucination."""
    manual = ManualAqiInput(
        city="Varanasi",
        country="India",
        aqi=260,
        scale=AqiScale.INDIAN_NAQI,
        pm2_5=105.0,
        pm10=180.0
    )
    reading = aqi_service.process_manual_input(manual)
    assert reading.aqi == 260
    assert reading.is_manual is True
    assert reading.is_live is False
    assert "MANUAL ENTRY NOTICE" in reading.data_disclaimer
    assert reading.category == AqiCategory.POOR

def test_missing_pollutant_handling():
    """Handles partial or completely missing pollutant figures honestly without crashing."""
    empty_pollutants = PollutantData()
    aqi_val, dominant = aqi_service.compute_indian_naqi(empty_pollutants)
    assert aqi_val == 0
    assert dominant == "None"
