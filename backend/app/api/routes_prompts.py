from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel
from app.models.recommendation import PromptInspectionResponse
from app.models.profile import UserProfile
from app.models.aqi import AqiReading
from app.services.prompt_manager import prompt_manager
from app.services.prompt_defense import prompt_defense

router = APIRouter(prefix="/prompts", tags=["Prompt Engineering Inspector"])

class InspectPromptRequest(BaseModel):
    user_query: str = "How do I protect my asthmatic mother during winter smog?"
    profile: UserProfile = UserProfile()
    aqi_data: AqiReading = AqiReading(
        aqi=342,
        category="Very Poor",
        category_color="#EF4444",
        dominant_pollutant="PM2.5",
        pollutants={"pm2_5": 188.5, "pm10": 290.0, "no2": 52.0},
        city="New Delhi",
        country="India",
        timestamp="2026-11-23T08:00:00Z",
        data_source="Station Simulation",
        is_live=False,
        is_sample=True,
        general_health_message="Respiratory illness on prolonged exposure.",
        cautionary_statement="Avoid outdoor exertion. Run indoor HEPA purifiers."
    )

@router.get("/list", response_model=List[PromptInspectionResponse])
async def list_prompt_templates():
    """
    Returns the complete prompt engineering suite with annotations
    explaining the 10 prompt engineering techniques applied.
    """
    return prompt_manager.get_all_prompts_info()

@router.post("/inspect")
async def inspect_assembled_prompt(req: InspectPromptRequest):
    """
    Simulates real-time context injection, prompt wrapping, and injection defense,
    allowing judges and evaluators to inspect how prompts are dynamically constructed.
    """
    is_suspicious, patterns = prompt_defense.inspect_for_injection(req.user_query)
    wrapped_query = prompt_defense.wrap_untrusted_input(req.user_query)
    personalized_context = prompt_manager.build_personalized_context(req.profile, req.aqi_data)
    full_prompt = prompt_manager.build_chat_prompt(req.user_query, req.profile, req.aqi_data)
    system_prompt = prompt_manager.build_system_prompt()

    return {
        "techniques_applied": [
            "1. Role Prompting (Atmospheric Health & Environmental Tech Specialist)",
            "2. Context Injection (Dynamic Telemetry & Demographics)",
            "3. Constraint-Based Prompting (No Hallucinated Stats / Medical Disclaimers)",
            "4. Structured Output (Strict JSON Schema Validation)",
            "5. Few-Shot Exemplars (4 Multi-Scenario Golden Examples)",
            "6. Contextual Personalization (Adapted to Commute, Fuel, & Sensitivities)",
            "7. Self-Checking (Pre-output Factual & Schema Verification)",
            "8. Uncertainty Handling (Explicit Demarcation of Missing / Manual Data)",
            "9. Prompt Injection Defense (Delimiter Boundary Wrapping & Attack Scanning)",
            "10. Output Validation (Pydantic Schema Parsing & Code-Fence Stripping)"
        ],
        "injection_defense": {
            "is_suspicious_query": is_suspicious,
            "detected_signatures": patterns,
            "wrapped_boundary_input": wrapped_query
        },
        "assembled_system_prompt": system_prompt,
        "assembled_context_injection": personalized_context,
        "complete_assembled_payload": full_prompt
    }
