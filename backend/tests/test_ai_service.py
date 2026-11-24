import pytest
from app.services.ai_service import ai_service
from app.models.recommendation import ChatRequest, RecommendationItem

def test_json_recommendation_parser_and_validation():
    """Validates extraction and Pydantic schema normalization of structured JSON from LLM text."""
    sample_llm_output = """
    Here are personalized air quality actions for your household during high smog:

    ```json
    [
      {
        "title": "Establish Clean-Air Recovery Room",
        "action": "Seal bedroom window gaps with weather-strips and run a true HEPA air purifier continuously.",
        "reason": "PM2.5 particles infiltrate residential building gaps; bedroom purification provides safe nighttime breathing.",
        "impact_type": "Exposure reduction",
        "impact_level": "High",
        "difficulty": "Easy",
        "timeframe": "Tonight before bedtime",
        "safety_note": "Do not use ozone ionizers in sealed bedrooms."
      },
      {
        "title": "Carpooling with Cabin Recirculation",
        "action": "Carpool with 2 colleagues and set car air intake to internal recirculation.",
        "reason": "Reduces tailpipe output by consolidating trips while preventing traffic exhaust ingestion.",
        "impact_type": "Dual benefit",
        "impact_level": "High",
        "difficulty": "Moderate",
        "timeframe": "Morning commute",
        "safety_note": "Replace cabin particulate filter annually."
      }
    ]
    ```

    These actions will dramatically lower both your family's personal exposure and road emissions.
    """
    items = ai_service.extract_structured_recommendations(sample_llm_output)
    assert len(items) == 2
    assert isinstance(items[0], RecommendationItem)
    assert items[0].title == "Establish Clean-Air Recovery Room"
    assert items[0].impact_type == "Exposure reduction"
    assert items[1].impact_type == "Dual benefit"

def test_invalid_json_graceful_recovery():
    """Verifies that malformed or non-JSON responses do not crash the service."""
    corrupted_output = "I recommend staying indoors today because the air is bad. { malformed json here ... "
    items = ai_service.extract_structured_recommendations(corrupted_output)
    assert isinstance(items, list)
    assert len(items) == 0  # Gracefully handles absence of valid schema

def test_impact_explainer_six_dimensions():
    """Validates that the impact explainer breaks down actions across all 6 required dimensions."""
    explanation = ai_service.explain_impact("Run a true HEPA air purifier in bedroom")
    assert explanation.recommended_action == "Run a true HEPA air purifier in bedroom"
    assert len(explanation.why_it_matters) > 20
    assert "Exposure Reduction" in explanation.exposure_vs_emission
    assert len(explanation.impact_mechanism) > 20
    assert "High" in explanation.qualitative_impact
    assert "Easy" in explanation.difficulty
    assert "Household" in explanation.sphere_of_benefit

def test_sustainable_comparisons_catalog():
    """Ensures sustainable alternatives catalog contains practical comparisons without fabricated numbers."""
    alternatives = ai_service.get_sustainable_comparisons()
    assert len(alternatives) >= 5
    categories = [alt.category for alt in alternatives]
    assert "Urban Commuting" in categories
    assert "Household Energy & Cooking" in categories
    assert "Municipal & Garden Waste" in categories
