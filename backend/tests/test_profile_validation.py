from app.models.profile import UserProfile
from app.api.routes_profile import validate_profile, PRESET_PROFILES

def test_profile_validation_rules():
    """Validates user onboarding profile logic, sanitization, and occupancy warnings."""
    normal_profile = UserProfile(
        country="India",
        city="Pune",
        household_size=4,
        primary_transportation="Public Transit (Metro/Bus)",
        cooking_fuel="LPG Cylinder"
    )
    result = validate_profile(normal_profile)
    assert result.is_valid is True
    assert len(result.warnings) == 0

    large_household = UserProfile(
        country="India",
        city="Patna",
        household_size=18,
        primary_transportation="Two-Wheeler / Motorcycle",
        cooking_fuel="Biomass / Chulha"
    )
    result_large = validate_profile(large_household)
    assert result_large.is_valid is True
    assert any("High household occupancy" in w for w in result_large.warnings)
    assert any("Solid fuel cooking" in w for w in result_large.warnings)

def test_preset_profiles_completeness():
    """Checks that preset test personas are diverse and valid."""
    assert len(PRESET_PROFILES) >= 4
    for key, data in PRESET_PROFILES.items():
        assert "label" in data
        assert isinstance(data["profile"], UserProfile)
