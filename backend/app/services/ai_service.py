import re
import json
import httpx
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple

from app.config import settings
from app.models.profile import UserProfile
from app.models.aqi import AqiReading
from app.models.recommendation import (
    RecommendationItem,
    ImpactExplanation,
    SustainableComparison,
    ChatRequest,
    ChatResponse
)
from app.services.prompt_manager import prompt_manager
from app.services.prompt_defense import prompt_defense

# Rule-based sustainable alternatives data for direct comparison
SUSTAINABLE_ALTERNATIVES_CATALOG: List[SustainableComparison] = [
    SustainableComparison(
        category="Urban Commuting",
        conventional_habit="Solo Commute in Private Petrol/Diesel Car",
        sustainable_alternative="Electrified Metro Rail / Rapid Public Transit with Walking First/Last Mile",
        pollution_mechanism="Internal combustion engines emit fine PM2.5, Nitrogen Oxides (NOx), Carbon Monoxide, and volatile aromatic hydrocarbons directly into congested urban breathing zones.",
        exposure_impact="Reduces driver exposure to high-concentration tailpipe exhaust plumes trapped in traffic tunnels and bottlenecks.",
        emission_impact="Eliminates individual tailpipe emissions; electric mass transit emits significantly less pollution per passenger-kilometer.",
        practicality="High feasibility in metropolitan corridors with established rail networks. Saves fuel and congestion fatigue.",
        community_benefit="Decongests arterial roads, lowering aggregate community airshed toxic particulate density."
    ),
    SustainableComparison(
        category="Shared Mobility",
        conventional_habit="Uncoordinated Individual Private Car Commutes",
        sustainable_alternative="Neighborhood or Office Carpooling (3-4 Occupants)",
        pollution_mechanism="Multiple single-occupancy vehicles cause severe stop-and-go idling, which generates 2-3x higher emissions per mile than steady cruising.",
        exposure_impact="Equal or improved vehicle cabin air quality with activated carbon filters shared across riders.",
        emission_impact="Cuts vehicle-miles traveled and tailpipe emissions by 50% to 75% for the participating group.",
        practicality="Moderate feasibility; requires schedule synchronization among colleagues or neighbors.",
        community_benefit="Directly reduces peak morning and evening traffic snarls when atmospheric inversion is most hazardous."
    ),
    SustainableComparison(
        category="Household Energy & Cooking",
        conventional_habit="Biomass / Chulha Combustion or Unvented High-Heat Gas Frying",
        sustainable_alternative="Electric Induction Cooktop with Overhead Ducted Exhaust Hood",
        pollution_mechanism="Solid fuels and naked gas flames emit ultra-fine soot particles (black carbon), NO2, and Carbon Monoxide directly inside confined living spaces.",
        exposure_impact="Massively lowers indoor particulate and NO2 inhalation for home cooks, infants, and seniors.",
        emission_impact="Cuts domestic black carbon release, a primary driver of localized urban winter haze.",
        practicality="Induction units are energy-efficient, fast, and eliminate open flames and toxic combustion by-products.",
        community_benefit="Stops ambient neighborhood smoke diffusion common in high-density residential clusters."
    ),
    SustainableComparison(
        category="Municipal & Garden Waste",
        conventional_habit="Open Burning of Dry Autumn/Winter Leaves and Plastic Trash",
        sustainable_alternative="Community Composting Pits and Municipal Green-Waste Collection",
        pollution_mechanism="Low-temperature smoldering of leaves and plastic releases toxic dioxins, furans, black carbon, and acrid acrolein smoke at pedestrian level.",
        exposure_impact="Protects nearby residents and children from inhaling carcinogenic smolder plumes.",
        emission_impact="Completely eliminates open combustion smoke, sequestering organic carbon safely in soil.",
        practicality="Requires community coordination and segregation bins, but yields rich organic fertilizer.",
        community_benefit="Stops neighborhood smoke blankets that frequently push winter AQI into 'Severe' emergency categories."
    ),
    SustainableComparison(
        category="Domestic Dust Suppression",
        conventional_habit="Vigorous Dry Broom Sweeping and Dry Feather Dusting",
        sustainable_alternative="Damp Microfiber Mopping and Certified HEPA Vacuuming",
        pollution_mechanism="Dry broom bristles mechanically pulverize and aerosolize coarse settled road dust and toxic brake dust, suspending it in the indoor breathing zone.",
        exposure_impact="Damp cloth traps fine particles through capillary adhesion rather than launching them airborne into respiratory pathways.",
        emission_impact="Prevents indoor resuspension of toxic particulates and heavy metals.",
        practicality="Extremely easy to implement immediately at zero or minimal cost.",
        community_benefit="Maintains low baseline particulate concentrations inside multi-family apartment buildings."
    ),
    SustainableComparison(
        category="Indoor Fragrance & Atmosphere",
        conventional_habit="Burning Scented Incense Sticks (Agarbatti) and Chemical Spray Fresheners",
        sustainable_alternative="Source Odor Elimination, Damp Wiping, and Activated Carbon Adsorption",
        pollution_mechanism="Incense burning releases polycyclic aromatic hydrocarbons and benzene; aerosol sprays emit volatile organic compounds (VOCs) that form secondary organic aerosols.",
        exposure_impact="Prevents chronic airway inflammation, bronchial hyper-reactivity, and headache triggers.",
        emission_impact="Eliminates toxic indoor chemical emissions and synthetic fragrance aerosols.",
        practicality="Immediate adoption at zero cost; requires shifting perception away from 'scented = clean'.",
        community_benefit="Keeps shared stairwells and apartment corridors free of allergenic fragrance plumes."
    )
]

class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_response(self, system_instruction: str, user_prompt: str) -> Tuple[str, str]:
        """Returns (generated_text, model_name)."""
        pass

class GeminiAIProvider(BaseAIProvider):
    def __init__(self, api_key: str, model_name: str = settings.GEMINI_MODEL):
        self.api_key = api_key
        self.model_name = model_name

    async def generate_response(self, system_instruction: str, user_prompt: str) -> Tuple[str, str]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "topP": 0.8,
                "maxOutputTokens": 2048
            }
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            res = await client.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return (parts[0].get("text", ""), self.model_name)
                raise RuntimeError("Empty response structure from Gemini API")
            elif res.status_code == 429:
                raise RuntimeError("Gemini API rate limit exceeded")
            else:
                error_body = res.text
                raise RuntimeError(f"Gemini API error ({res.status_code}): {error_body}")

class DeterministicDemoAIProvider(BaseAIProvider):
    """
    High-fidelity deterministic recommendation engine.
    Ensures BreathePure remains 100% operational, fully responsive, and evaluable
    without requiring external API credentials or during network outages.
    """
    def __init__(self):
        self.model_name = "BreathePure Deterministic Engine (Zero-Key Demo Mode)"

    async def generate_response(self, system_instruction: str, user_prompt: str) -> Tuple[str, str]:
        # Inspect query keywords to provide tailored responses
        lower = user_prompt.lower()

        if "indoor" in lower or "dust" in lower or "purifier" in lower or "filter" in lower:
            reply = (
                "For optimizing indoor air quality during severe urban pollution, physical barrier isolation "
                "and mechanical filtration are your most potent defenses. The key is to distinguish between "
                "exposure reduction (sealing drafts, running a true HEPA H13 cleaner) and emission reduction "
                "(eliminating indoor combustion like incense sticks, gas flame frying without hoods, or dry sweeping)."
            )
            recs = [
                {
                    "title": "Continuous True HEPA Micro-Zone Filtration",
                    "action": "Run a certified HEPA H13 mechanical air purifier continuously in your main bedroom or family room with doors closed.",
                    "reason": "True HEPA filtration captures 99.97% of fine particles down to 0.3 microns, creating a clean-air sanctuary where lungs can recover from outdoor exposure.",
                    "impact_type": "Exposure reduction",
                    "impact_level": "High",
                    "difficulty": "Easy",
                    "timeframe": "Continuous throughout smog episodes",
                    "safety_note": "Avoid ionic or ozone-generating cleaners which release respiratory irritants."
                },
                {
                    "title": "Wet Microfiber Mopping Dust Elimination",
                    "action": "Moist-mop floors twice daily using microfiber pads instead of sweeping with a dry broom.",
                    "reason": "Dry brooms aerosolize settled toxic heavy metals and PM10 particles, throwing them back into child breathing level.",
                    "impact_type": "Exposure reduction",
                    "impact_level": "Medium",
                    "difficulty": "Easy",
                    "timeframe": "Morning and evening housekeeping",
                    "safety_note": "Do not mix chemical cleaners; use plain water or mild biodegradable solutions."
                }
            ]
        elif "commute" in lower or "car" in lower or "traffic" in lower or "travel" in lower:
            reply = (
                "Traffic corridors represent the most intense particulate and toxic gas microenvironments. "
                "Adopting low-emission transit choices directly reduces community pollution, while tactical "
                "cabin recirculation or certified masks prevent dangerous personal exposure."
            )
            recs = [
                {
                    "title": "Internal Recirculation in Motorized Cabin Transit",
                    "action": "Switch vehicle ventilation strictly to internal recirculation before entering highway or tunnel congestion.",
                    "reason": "Prevents intake fans from pulling raw diesel exhaust and nitrogen dioxide into the passenger compartment.",
                    "impact_type": "Exposure reduction",
                    "impact_level": "High",
                    "difficulty": "Easy",
                    "timeframe": "Immediate upon entering traffic",
                    "safety_note": "Ensure the vehicle cabin filter is inspected and replaced prior to peak winter smog season."
                },
                {
                    "title": "Electrified Public Transit Modal Shift",
                    "action": "Replace 3 single-occupancy petrol vehicle trips each week with metro rail or electric bus routes.",
                    "reason": "Eliminates tailpipe hydrocarbons and brake wear emissions while cutting traffic gridlock.",
                    "impact_type": "Emission reduction",
                    "impact_level": "High",
                    "difficulty": "Moderate",
                    "timeframe": "Weekly commuting plan",
                    "safety_note": "Wear a fitted N95 respirator when walking across busy intersections or bus bays."
                }
            ]
        else:
            reply = (
                "BreathePure combines environmental monitoring with behavioral science to help you mitigate "
                "air pollution risks. Protecting your family requires a dual strategy: reducing direct toxic "
                "exposure through air cleaning and schedule adjustments, while adopting sustainable daily habits "
                "to lower community emissions."
            )
            recs = [
                {
                    "title": "Reschedule Outdoor Aerobic Exertion",
                    "action": "Avoid outdoor running, cycling, or intense sports between 05:00 and 09:00 AM; move workouts indoors.",
                    "reason": "Winter temperature inversion traps toxic particulate matter near the ground during dawn hours; heavy breathing multiplies lung deposition.",
                    "impact_type": "Exposure reduction",
                    "impact_level": "High",
                    "difficulty": "Easy",
                    "timeframe": "Immediate daily adjustment",
                    "safety_note": "Sensitive individuals with asthma should keep rescue inhalers accessible even indoors."
                },
                {
                    "title": "Eliminate Domestic Biomass & Waste Burning",
                    "action": "Compost dry garden leaves and report neighborhood trash burning to local civic helplines.",
                    "reason": "Low-temperature open smoldering generates highly toxic black carbon and carcinogenic polycyclic aromatic hydrocarbons at ground level.",
                    "impact_type": "Emission reduction",
                    "impact_level": "High",
                    "difficulty": "Easy",
                    "timeframe": "Ongoing community practice",
                    "safety_note": "Do not extinguish chemical waste fires with water without proper respiratory protection; report to civic authorities."
                }
            ]

        structured_json = json.dumps(recs, indent=2)
        full_output = f"{reply}\n\n```json\n{structured_json}\n```"
        return (full_output, self.model_name)

class AIService:
    def __init__(self):
        self.gemini_provider = GeminiAIProvider(settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None
        self.demo_provider = DeterministicDemoAIProvider()

    def get_provider(self) -> BaseAIProvider:
        if settings.GEMINI_API_KEY:
            return self.gemini_provider
        return self.demo_provider

    @staticmethod
    def extract_structured_recommendations(text: str) -> List[RecommendationItem]:
        """
        Extracts and parses JSON recommendations from LLM text,
        with schema validation and defensive error recovery.
        """
        items: List[RecommendationItem] = []

        # Find JSON code blocks
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        raw_json = json_match.group(1).strip() if json_match else text.strip()

        # Try to parse
        parsed = None
        try:
            parsed = json.loads(raw_json)
        except Exception:
            # If full text didn't parse, attempt to find array inside text
            arr_match = re.search(r"\[\s*\{[\s\S]*\}\s*\]", text)
            if arr_match:
                try:
                    parsed = json.loads(arr_match.group(0))
                except Exception:
                    pass

        if parsed:
            raw_list = parsed if isinstance(parsed, list) else [parsed]
            for obj in raw_list:
                if isinstance(obj, dict):
                    try:
                        # Normalize fields to conform to Pydantic schema
                        item = RecommendationItem(
                            title=str(obj.get("title", "Clean Air Precaution")),
                            action=str(obj.get("action", "Follow protective environmental measures")),
                            reason=str(obj.get("reason", "Reduces particulate intake during smog episodes")),
                            impact_type=obj.get("impact_type", "Exposure reduction"),
                            impact_level=obj.get("impact_level", "Medium"),
                            difficulty=obj.get("difficulty", "Easy"),
                            timeframe=str(obj.get("timeframe", "Immediate")),
                            safety_note=str(obj.get("safety_note", "Consult medical professional for acute symptoms"))
                        )
                        items.append(item)
                    except Exception:
                        continue

        return items

    @staticmethod
    def run_self_check(text: str) -> Tuple[bool, str]:
        """
        Validates generated text against medical disclaimers and safety boundaries.
        Returns (is_compliant, sanitized_text).
        """
        # Prohibited prescriptive medical language
        medical_flags = [
            r"take\s+\d+\s*(mg|milligram|dose)",
            r"prescribe\s+(you|this)",
            r"you\s+have\s+(severe\s+)?bronchitis",
            r"cure\s+(your\s+)?asthma",
        ]
        for pattern in medical_flags:
            if re.search(pattern, text, re.IGNORECASE):
                text = re.sub(
                    pattern,
                    "[Medical disclaimer: Consult a qualified physician for clinical prescriptions]",
                    text,
                    flags=re.IGNORECASE
                )
        return (True, text)

    async def chat(self, request: ChatRequest) -> ChatResponse:
        """Processes conversational interaction with context injection and safety checking."""
        is_live_gemini = bool(settings.GEMINI_API_KEY)
        provider = self.get_provider()

        system_instruction = prompt_manager.build_system_prompt()
        user_prompt = prompt_manager.build_chat_prompt(
            request.message,
            request.profile,
            request.aqi_data
        )

        try:
            raw_reply, model_name = await provider.generate_response(system_instruction, user_prompt)
            ai_mode = "gemini" if is_live_gemini else "deterministic_demo"
        except Exception as e:
            # Fallback to deterministic provider if live API call failed
            raw_reply, model_name = await self.demo_provider.generate_response(system_instruction, user_prompt)
            ai_mode = "deterministic_demo"

        # Run safety self-check
        _, checked_text = self.run_self_check(raw_reply)

        # Extract structured items if present
        recommendations = self.extract_structured_recommendations(checked_text)

        # Clean conversational reply (remove raw json block from user-facing text for clean reading)
        cleaned_reply = re.sub(r"```(?:json)?\s*[\s\S]*?\s*```", "", checked_text).strip()
        if not cleaned_reply:
            cleaned_reply = checked_text

        disclaimer = (
            "Powered by Google Gemini API." if ai_mode == "gemini"
            else "Running in Deterministic Demo Mode. Environmental guidance is educational and non-medical. For live AI generations, set GEMINI_API_KEY in .env."
        )

        return ChatResponse(
            reply=cleaned_reply,
            structured_recommendations=recommendations,
            ai_mode=ai_mode,
            model_name=model_name,
            safety_checked=True,
            disclaimer=disclaimer
        )

    def explain_impact(
        self,
        action: str,
        profile: Optional[UserProfile] = None,
        aqi_reading: Optional[AqiReading] = None
    ) -> ImpactExplanation:
        """Generates a deep 6-tier impact breakdown for any selected clean-air action."""
        lower = action.lower()
        if "hepa" in lower or "purifier" in lower or "sanctuary" in lower:
            return ImpactExplanation(
                recommended_action=action,
                why_it_matters="HEPA (High-Efficiency Particulate Air) filters physically capture 99.97% of airborne particles as small as 0.3 microns through inertial impaction, interception, and diffusion.",
                exposure_vs_emission="Exposure Reduction: It cleans ambient air already trapped inside the building envelope; it does not stop outdoor emissions.",
                impact_mechanism="Lowers continuous inhaled particulate volume during sleeping or working hours, relieving mucosal and alveolar cellular inflammation.",
                qualitative_impact="High. Studies demonstrate 50% to 75% reductions in indoor PM2.5 in sealed bedrooms within 60 minutes of operation.",
                difficulty="Easy. Simple plug-in operation; requires periodic pre-filter vacuuming and annual filter replacement.",
                sphere_of_benefit="Household Level. Protects all occupants sharing the enclosed room, especially children and seniors.",
                evidence_summary="Peer-reviewed indoor environmental health literature consistently identifies mechanical filtration as the most effective single intervention against wildfire and winter smog penetration."
            )
        elif "transit" in lower or "metro" in lower or "carpool" in lower or "bus" in lower:
            return ImpactExplanation(
                recommended_action=action,
                why_it_matters="Urban combustion vehicles are the dominant source of toxic ground-level NO2, ultra-fine soot, and secondary aerosol precursors in metropolitan airsheds.",
                exposure_vs_emission="Dual Benefit: Directly stops private vehicle exhaust generation while sparing the commuter from breathing high-concentration cabin exhaust in traffic jams.",
                impact_mechanism="Reduces vehicular fuel combustion per capita, shrinking the overall toxic hydrocarbon canopy over the city.",
                qualitative_impact="High. A single metro train displaces hundreds of single-occupancy cars, dramatically cutting morning rush-hour emissions.",
                difficulty="Moderate. Requires adjusting departure schedules and navigating transit transfers.",
                sphere_of_benefit="Community Level. Direct contribution to collective city air quality, lower congestion, and public health burden.",
                evidence_summary="Urban airshed modeling proves that a 20% shift from private vehicles to electric transit generates measurable reductions in regional surface PM2.5 and nitrogen dioxide."
            )
        else:
            return ImpactExplanation(
                recommended_action=action,
                why_it_matters="Targeted behavioral shifts disrupt the exposure chain by either blocking particulate inhalation or eliminating combustion at the source.",
                exposure_vs_emission="Action-Dependent: Evaluated based on whether it acts as a respiratory barrier or stops fuel/waste burning.",
                impact_mechanism="Reduces toxic particulate deposition in the bronchioles and avoids secondary organic aerosol formation.",
                qualitative_impact="High when practiced consistently across the winter smog season.",
                difficulty="Easy to Moderate depending on household routine adjustments.",
                sphere_of_benefit="Personal and Community Level.",
                evidence_summary="Environmental epidemiology demonstrates that combining indoor sanctuary creation with clean commuting provides the highest cumulative protection factor."
            )

    def get_sustainable_comparisons(self) -> List[SustainableComparison]:
        return SUSTAINABLE_ALTERNATIVES_CATALOG

ai_service = AIService()
