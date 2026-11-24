import pytest
from app.services.ai_service import DeterministicDemoAIProvider, ai_service
from app.models.recommendation import ChatRequest
from app.models.profile import UserProfile
from app.models.aqi import AqiReading, AqiCategory, PollutantData

@pytest.mark.anyio
async def test_deterministic_demo_ai_provider():
    """Checks that the deterministic provider produces structured output without external API keys."""
    provider = DeterministicDemoAIProvider()
    reply, model_name = await provider.generate_response(
        system_instruction="System prompt",
        user_prompt="How do I clean indoor dust during winter smog?"
    )
    assert len(reply) > 50
    assert "Deterministic Engine" in model_name
    assert "```json" in reply
    assert "Microfiber" in reply or "HEPA" in reply

@pytest.mark.anyio
async def test_chat_service_demo_fallback_and_disclaimer():
    """Verifies that ChatResponse transparently conveys demo mode status and disclaimers."""
    req = ChatRequest(
        message="What is the safest way to commute when AQI is 350?",
        profile=UserProfile(city="Delhi", primary_transportation="Private Car"),
        aqi_data=AqiReading(
            aqi=350,
            category=AqiCategory.VERY_POOR,
            category_color="#EF4444",
            dominant_pollutant="PM2.5",
            pollutants=PollutantData(pm2_5=200.0),
            city="Delhi",
            country="India",
            timestamp="2026-11-23T10:00:00Z",
            data_source="Test",
            is_live=False,
            general_health_message="Very poor air",
            cautionary_statement="Stay indoors"
        )
    )
    res = await ai_service.chat(req)
    assert res.ai_mode in ["deterministic_demo", "gemini"]
    assert res.safety_checked is True
    assert len(res.reply) > 20
    assert len(res.structured_recommendations) >= 1
    # Verify recommendations have distinct exposure/emission types
    types = [rec.impact_type for rec in res.structured_recommendations]
    assert any("reduction" in t.lower() or "benefit" in t.lower() for t in types)
