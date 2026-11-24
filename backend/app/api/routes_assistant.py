from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, List
from app.models.recommendation import (
    ChatRequest,
    ChatResponse,
    DailyRoutinePlan,
    ImpactExplanation,
    SustainableComparison
)
from app.models.profile import UserProfile
from app.models.aqi import AqiReading
from app.services.ai_service import ai_service
from app.services.routine_planner import routine_planner

router = APIRouter(prefix="/assistant", tags=["AI Air Quality Assistant"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """
    Interactive GenAI clean-air assistant with contextual personalization,
    prompt injection defense, and structured recommendation output.
    """
    try:
        return await ai_service.chat(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant service error: {str(e)}")

@router.post("/routine", response_model=DailyRoutinePlan)
async def generate_daily_routine(
    profile: Optional[UserProfile] = Body(None),
    aqi_reading: Optional[AqiReading] = Body(None)
):
    """
    Generates a personalized 5-part daily schedule (Morning, Commute, Afternoon, Evening, Night)
    tailored to location AQI and household lifestyle.
    """
    try:
        return routine_planner.generate_routine(profile, aqi_reading)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routine generation error: {str(e)}")

@router.get("/impact-explainer", response_model=ImpactExplanation)
async def explain_impact(
    action: str = Query(..., description="The recommended action to deconstruct")
):
    """
    Deconstructs any clean-air habit across 6 rigorous dimensions:
    Action, Why it Matters, Exposure vs Emission, Mechanism, Qualitative Impact, Difficulty, Sphere of Benefit.
    """
    try:
        return ai_service.explain_impact(action)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impact explainer error: {str(e)}")

@router.get("/alternatives", response_model=List[SustainableComparison])
async def get_sustainable_alternatives():
    """
    Provides evidence-based comparisons between conventional high-emission habits
    and sustainable alternatives.
    """
    return ai_service.get_sustainable_comparisons()
