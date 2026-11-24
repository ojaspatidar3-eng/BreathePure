import pytest
from starlette.testclient import TestClient
from app.main import app
from app.models.profile import UserProfile
from app.models.aqi import ManualAqiInput

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["product"] == "BreathePure"
    assert data["status"] == "operational"

def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_aqi_scales_endpoint():
    res = client.get("/api/aqi/scales")
    assert res.status_code == 200
    data = res.json()
    assert "indian_naqi" in data
    assert "us_epa" in data

def test_manual_aqi_endpoint():
    payload = {
        "city": "Jaipur",
        "country": "India",
        "aqi": 320,
        "scale": "Indian NAQI (CPCB)",
        "pm2_5": 175.0,
        "pm10": 260.0,
        "notes": "Integration test manual input"
    }
    res = client.post("/api/aqi/manual", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["aqi"] == 320
    assert data["is_manual"] is True
    assert data["category"] == "Very Poor"

def test_profile_presets_and_validation():
    presets_res = client.get("/api/profile/presets")
    assert presets_res.status_code == 200
    presets = presets_res.json()
    assert len(presets) >= 4

    val_res = client.post("/api/profile/validate", json=presets["delhi_vulnerable"]["profile"])
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["is_valid"] is True

def test_prompts_list_and_inspect():
    list_res = client.get("/api/prompts/list")
    assert list_res.status_code == 200
    templates = list_res.json()
    assert len(templates) == 6

    inspect_payload = {
        "user_query": "How do I protect my newborn from winter smog?",
        "profile": {
            "country": "India",
            "city": "New Delhi",
            "household_size": 3,
            "primary_transportation": "Public Transit",
            "cooking_fuel": "LPG",
            "daily_outdoor_activity": "Low",
            "work_routine": "WFH",
            "has_children": True,
            "has_elderly": False,
            "has_respiratory_sensitivity": False,
            "primary_concerns": ["Infant health"]
        },
        "aqi_data": {
            "aqi": 340,
            "category": "Very Poor",
            "category_color": "#EF4444",
            "dominant_pollutant": "PM2.5",
            "pollutants": {"pm2_5": 180.0},
            "city": "New Delhi",
            "country": "India",
            "timestamp": "2026-11-23T10:00:00Z",
            "data_source": "Test Telemetry",
            "is_live": False,
            "general_health_message": "Very poor air",
            "cautionary_statement": "Stay indoors"
        }
    }
    inspect_res = client.post("/api/prompts/inspect", json=inspect_payload)
    assert inspect_res.status_code == 200
    inspect_data = inspect_res.json()
    assert len(inspect_data["techniques_applied"]) == 10
    assert "assembled_context_injection" in inspect_data

def test_assistant_routine_generation():
    routine_res = client.post("/api/assistant/routine", json={})
    assert routine_res.status_code == 200
    plan = routine_res.json()
    assert len(plan["time_slots"]) == 5
    slot_ids = [s["slot_id"] for s in plan["time_slots"]]
    assert "morning" in slot_ids
    assert "commute" in slot_ids
    assert "afternoon" in slot_ids
    assert "evening" in slot_ids
    assert "night" in slot_ids

def test_assistant_impact_explainer():
    res = client.get("/api/assistant/impact-explainer?action=Run+a+true+HEPA+purifier+in+bedroom")
    assert res.status_code == 200
    data = res.json()
    assert "why_it_matters" in data
    assert "exposure_vs_emission" in data
    assert "qualitative_impact" in data

def test_assistant_alternatives():
    res = client.get("/api/assistant/alternatives")
    assert res.status_code == 200
    alts = res.json()
    assert len(alts) >= 5

def test_assistant_chat():
    chat_payload = {
        "message": "What should I do during severe winter smog?",
        "profile": {
            "country": "India",
            "city": "New Delhi",
            "household_size": 4,
            "primary_transportation": "Public Transit",
            "cooking_fuel": "LPG",
            "daily_outdoor_activity": "Moderate",
            "work_routine": "Office Commuter",
            "has_children": True,
            "has_elderly": True,
            "has_respiratory_sensitivity": True,
            "primary_concerns": ["Winter smog"]
        }
    }
    chat_res = client.post("/api/assistant/chat", json=chat_payload)
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert "reply" in chat_data
    assert "structured_recommendations" in chat_data
    assert chat_data["safety_checked"] is True
