from fastapi import APIRouter
from typing import List, Dict, Any
from app.models.profile import UserProfile, ProfileValidationResult

router = APIRouter(prefix="/profile", tags=["User Profile & Onboarding"])

PRESET_PROFILES: Dict[str, Dict[str, Any]] = {
    "delhi_vulnerable": {
        "label": "Delhi Metro Family (Vulnerable Senior & Child)",
        "profile": UserProfile(
            country="India",
            city="New Delhi",
            area="South Delhi / Anand Vihar",
            household_size=5,
            primary_transportation="Public Transit (Metro/Bus)",
            cooking_fuel="Piped Natural Gas (PNG)",
            daily_outdoor_activity="Low (< 1 hour)",
            work_routine="Office Commuter",
            has_children=True,
            has_elderly=True,
            has_respiratory_sensitivity=True,
            primary_concerns=["Severe Winter Smog", "Asthma Triggers", "School Commute Exposure"]
        )
    },
    "mumbai_commuter": {
        "label": "Mumbai Coastal Commuter (Private Car Driver)",
        "profile": UserProfile(
            country="India",
            city="Mumbai",
            area="Andheri - BKC Corridor",
            household_size=3,
            primary_transportation="Private Petrol Car",
            cooking_fuel="LPG Cylinder",
            daily_outdoor_activity="Moderate (1-3 hours)",
            work_routine="Office Commuter",
            has_children=False,
            has_elderly=False,
            has_respiratory_sensitivity=False,
            primary_concerns=["Traffic Exhaust Inhalation", "Evening Congestion Smog"]
        )
    },
    "bengaluru_tech": {
        "label": "Bengaluru Remote Worker (Bicycle / Walking)",
        "profile": UserProfile(
            country="India",
            city="Bengaluru",
            area="Indiranagar",
            household_size=2,
            primary_transportation="Walking / Bicycle",
            cooking_fuel="Electric / Induction",
            daily_outdoor_activity="High (> 3 hours)",
            work_routine="Remote / Work From Home",
            has_children=False,
            has_elderly=False,
            has_respiratory_sensitivity=False,
            primary_concerns=["Road Dust Inhalation", "Outdoor Fitness Timing"]
        )
    },
    "semi_urban_kitchen": {
        "label": "Tier-2 Household (Traditional Fuel Transition)",
        "profile": UserProfile(
            country="India",
            city="Patna",
            area="Residential Ward 12",
            household_size=6,
            primary_transportation="Two-Wheeler / Motorcycle",
            cooking_fuel="Biomass / Chulha",
            daily_outdoor_activity="Moderate (1-3 hours)",
            work_routine="Outdoor Worker",
            has_children=True,
            has_elderly=True,
            has_respiratory_sensitivity=True,
            primary_concerns=["Kitchen Smoke Exposure", "Winter Morning Smog", "Elderly Bronchitis"]
        )
    }
}

@router.post("/validate", response_model=ProfileValidationResult)
def validate_profile(profile: UserProfile):
    """Validates user onboarding profile data and returns warnings or recommendations."""
    warnings: List[str] = []

    if profile.household_size > 15:
        warnings.append("High household occupancy: ensure adequate ventilation exchange in common living areas.")

    if "biomass" in profile.cooking_fuel.lower() or "chulha" in profile.cooking_fuel.lower():
        warnings.append("Solid fuel cooking detected: indoor smoke levels may severely exceed outdoor AQI without active flues.")

    if profile.has_respiratory_sensitivity and not profile.has_elderly and not profile.has_children:
        warnings.append("Adult respiratory sensitivity noted: keep emergency inhalers/medications accessible during winter inversion periods.")

    return ProfileValidationResult(
        is_valid=True,
        warnings=warnings,
        sanitized_profile=profile
    )

@router.get("/presets")
async def get_preset_profiles():
    """Returns curated preset profiles representing diverse demographic & geographic challenges."""
    return PRESET_PROFILES
