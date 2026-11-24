import pytest
from app.services.prompt_manager import prompt_manager
from app.models.profile import UserProfile
from app.models.aqi import AqiReading, AqiCategory, PollutantData

def test_prompt_manager_loads_templates():
    """Verifies that all 6 required prompt engineering templates are present and populated."""
    required_files = [
        "system_prompt.txt",
        "personalization_prompt.txt",
        "recommendation_prompt.txt",
        "impact_explanation_prompt.txt",
        "safety_prompt.txt",
        "evaluation_prompt.txt"
    ]
    for filename in required_files:
        content = prompt_manager.get_raw_prompt(filename)
        assert len(content) > 50, f"Template {filename} is empty or missing"
        assert not content.startswith("# Default fallback"), f"Template {filename} fell back to default"

def test_system_prompt_includes_negative_constraints():
    """Validates negative constraints in system prompt."""
    sys_prompt = prompt_manager.build_system_prompt()
    assert "NEVER INVENT ENVIRONMENTAL DATA" in sys_prompt
    assert "NO MEDICAL DIAGNOSIS" in sys_prompt
    assert "DISTINGUISH EXPOSURE VS EMISSION" in sys_prompt
    assert "PROMPT INJECTION RESISTANCE" in sys_prompt

def test_prompt_personalization_context_injection():
    """Checks that user lifestyle, sensitivities, and telemetry are injected into prompts."""
    profile = UserProfile(
        country="India",
        city="New Delhi",
        area="Rohini Sector 9",
        household_size=5,
        primary_transportation="Two-Wheeler / Motorcycle",
        cooking_fuel="Biomass / Chulha",
        daily_outdoor_activity="High (> 3 hours)",
        work_routine="Outdoor Worker",
        has_children=True,
        has_elderly=True,
        has_respiratory_sensitivity=True,
        primary_concerns=["Severe Asthma", "Kitchen Smoke"]
    )
    aqi = AqiReading(
        aqi=385,
        category=AqiCategory.VERY_POOR,
        category_color="#EF4444",
        dominant_pollutant="PM2.5",
        pollutants=PollutantData(pm2_5=220.0, pm10=340.0, no2=65.0),
        city="New Delhi",
        country="India",
        timestamp="2026-11-23T09:00:00Z",
        data_source="Station Simulation",
        is_live=True,
        general_health_message="Very Poor Air Quality",
        cautionary_statement="Avoid outdoor exertion"
    )

    rendered = prompt_manager.build_personalized_context(profile, aqi)

    assert "New Delhi" in rendered
    assert "Rohini Sector 9" in rendered
    assert "385" in rendered
    assert "Two-Wheeler / Motorcycle" in rendered
    assert "Biomass / Chulha" in rendered
    assert "Yes (Under 12 years)" in rendered
    assert "Yes (Asthma / Allergy / Vulnerable)" in rendered

def test_prompt_inspector_metadata():
    """Ensures prompt inspector returns all 6 templates with technique breakdown for UI."""
    info_list = prompt_manager.get_all_prompts_info()
    assert len(info_list) == 6
    techniques_found = set()
    for item in info_list:
        for t in item.engineering_techniques:
            techniques_found.add(t)

    assert "Role Prompting" in techniques_found
    assert "Context Injection" in techniques_found
    assert "Structured Output" in techniques_found
    assert "Few-Shot Prompting" in techniques_found
    assert "Self-Checking" in techniques_found
