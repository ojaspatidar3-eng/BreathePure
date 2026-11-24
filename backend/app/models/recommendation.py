from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.profile import UserProfile
from app.models.aqi import AqiReading

class RecommendationItem(BaseModel):
    title: str = Field(..., description="Concise, action-oriented title")
    action: str = Field(..., description="Direct, actionable imperative step")
    reason: str = Field(..., description="Scientific or mechanistic rationale")
    impact_type: str = Field(
        ...,
        description="Must be 'Exposure reduction', 'Emission reduction', or 'Dual benefit'"
    )
    impact_level: str = Field(
        ...,
        description="Must be 'Low', 'Medium', or 'High'"
    )
    difficulty: str = Field(
        ...,
        description="Must be 'Easy', 'Moderate', or 'Difficult'"
    )
    timeframe: str = Field(..., description="When to implement (e.g. Morning, Immediate, Daily)")
    safety_note: str = Field(..., description="Precautionary advice, sensitive group notices")

class ImpactExplanation(BaseModel):
    recommended_action: str
    why_it_matters: str
    exposure_vs_emission: str
    impact_mechanism: str
    qualitative_impact: str
    difficulty: str
    sphere_of_benefit: str  # Personal, Household, Community
    evidence_summary: str

class RoutineTimeSlot(BaseModel):
    slot_id: str
    slot_name: str
    time_window: str
    aqi_context: str
    recommendations: List[RecommendationItem]
    key_caution: str

class DailyRoutinePlan(BaseModel):
    city: str
    aqi_level: str
    aqi_value: int
    generated_at: str
    lifestyle_summary: str
    time_slots: List[RoutineTimeSlot]
    daily_emission_avoidance_tip: str
    daily_exposure_reduction_tip: str

class SustainableComparison(BaseModel):
    category: str
    conventional_habit: str
    sustainable_alternative: str
    pollution_mechanism: str
    exposure_impact: str
    emission_impact: str
    practicality: str
    community_benefit: str

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    profile: Optional[UserProfile] = None
    aqi_data: Optional[AqiReading] = None
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    structured_recommendations: List[RecommendationItem] = []
    ai_mode: str  # "gemini" or "deterministic_demo"
    model_name: str
    safety_checked: bool = True
    disclaimer: str

class PromptInspectionResponse(BaseModel):
    name: str
    description: str
    template_content: str
    engineering_techniques: List[str]
    sample_assembled_prompt: Optional[str] = None
