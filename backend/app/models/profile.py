from typing import List, Optional
from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    country: str = Field("India", description="Country of residence")
    city: str = Field("New Delhi", description="City of residence")
    area: Optional[str] = Field("", description="Optional neighborhood or postal area")
    household_size: int = Field(4, ge=1, le=20, description="Total members in household")
    primary_transportation: str = Field(
        "Public Transit (Metro/Bus)",
        description="Main daily transit mode (e.g. Metro, Car, Two-Wheeler, Walking/Bicycle)"
    )
    cooking_fuel: str = Field(
        "LPG Cylinder",
        description="Cooking energy source (LPG, Piped Natural Gas, Electric Induction, Biomass)"
    )
    daily_outdoor_activity: str = Field(
        "Moderate (1-3 hours)",
        description="Daily hours spent outdoors"
    )
    work_routine: str = Field(
        "Office Commuter",
        description="Primary daytime routine (Office Commuter, Remote/WFH, Outdoor Worker, Student)"
    )
    has_children: bool = Field(False, description="Children under 12 in household")
    has_elderly: bool = Field(False, description="Seniors 60+ in household")
    has_respiratory_sensitivity: bool = Field(
        False,
        description="Members with asthma, COPD, bronchitis or cardiovascular vulnerabilities"
    )
    primary_concerns: List[str] = Field(
        default_factory=lambda: ["Winter Smog", "Children Health", "Commute Exposure"],
        description="Key environmental concerns"
    )

class ProfileValidationResult(BaseModel):
    is_valid: bool
    warnings: List[str] = []
    sanitized_profile: UserProfile
