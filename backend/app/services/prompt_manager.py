import os
from typing import Dict, Any, Optional, List
from app.config import settings
from app.models.profile import UserProfile
from app.models.aqi import AqiReading
from app.models.recommendation import PromptInspectionResponse
from app.services.prompt_defense import prompt_defense

class PromptManager:
    def __init__(self, prompts_dir: str = settings.PROMPTS_DIR):
        self.prompts_dir = prompts_dir
        self._cache: Dict[str, str] = {}
        self._load_prompts()

    def _load_prompts(self):
        prompt_files = [
            "system_prompt.txt",
            "personalization_prompt.txt",
            "recommendation_prompt.txt",
            "impact_explanation_prompt.txt",
            "safety_prompt.txt",
            "evaluation_prompt.txt"
        ]
        for filename in prompt_files:
            filepath = os.path.join(self.prompts_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, "r", encoding="utf-8") as f:
                    self._cache[filename] = f.read()
            else:
                self._cache[filename] = f"# Default fallback for {filename}"

    def get_raw_prompt(self, filename: str) -> str:
        return self._cache.get(filename, "")

    def build_system_prompt(self) -> str:
        """Combines system persona, safety rules, and negative constraints."""
        sys = self.get_raw_prompt("system_prompt.txt")
        safety = self.get_raw_prompt("safety_prompt.txt")
        return f"{sys}\n\n=== MANDATORY SAFETY PROTOCOL ===\n{safety}"

    def build_personalized_context(
        self,
        profile: Optional[UserProfile] = None,
        aqi_reading: Optional[AqiReading] = None
    ) -> str:
        """Interpolates profile and air quality data into personalization template."""
        template = self.get_raw_prompt("personalization_prompt.txt")

        # Defaults
        prof = profile or UserProfile()
        aqi = aqi_reading

        p_vals = aqi.pollutants if aqi else None
        p_pm25 = f"{p_vals.pm2_5:.1f}" if p_vals and p_vals.pm2_5 is not None else "Unavailable"
        p_pm10 = f"{p_vals.pm10:.1f}" if p_vals and p_vals.pm10 is not None else "Unavailable"
        p_no2 = f"{p_vals.no2:.1f}" if p_vals and p_vals.no2 is not None else "Unavailable"
        p_so2 = f"{p_vals.so2:.1f}" if p_vals and p_vals.so2 is not None else "Unavailable"
        p_co = f"{p_vals.co:.2f}" if p_vals and p_vals.co is not None else "Unavailable"
        p_o3 = f"{p_vals.o3:.1f}" if p_vals and p_vals.o3 is not None else "Unavailable"

        status_text = "Live Verified Telemetry" if (aqi and aqi.is_live) else (
            "Manual User Input (Simulation)" if (aqi and aqi.is_manual) else (
                "Educational Sample" if (aqi and aqi.is_sample) else "Telemetry Unavailable"
            )
        )

        concerns_text = ", ".join(prof.primary_concerns) if prof.primary_concerns else "General Clean Air"

        rendered = template.format(
            country=prof.country,
            city=prof.city,
            area=prof.area or "Central Urban Area",
            season_context="Severe Winter Inversion / Smog Season",
            aqi_value=aqi.aqi if aqi else "Unspecified",
            aqi_scale=aqi.scale.value if aqi else "Indian NAQI",
            aqi_category=aqi.category.value if aqi else "Unspecified",
            dominant_pollutant=aqi.dominant_pollutant if aqi else "PM2.5",
            pm25_value=p_pm25,
            pm10_value=p_pm10,
            no2_value=p_no2,
            so2_value=p_so2,
            co_value=p_co,
            o3_value=p_o3,
            data_source_status=status_text,
            last_updated=aqi.timestamp if aqi else "N/A",
            household_size=prof.household_size,
            has_children="Yes (Under 12 years)" if prof.has_children else "No",
            has_elderly="Yes (60+ years)" if prof.has_elderly else "No",
            has_respiratory_sensitivity="Yes (Asthma / Allergy / Vulnerable)" if prof.has_respiratory_sensitivity else "No",
            primary_concerns=concerns_text,
            transportation_mode=prof.primary_transportation,
            cooking_fuel=prof.cooking_fuel,
            outdoor_activity_level=prof.daily_outdoor_activity,
            work_routine=prof.work_routine
        )
        return rendered

    def build_chat_prompt(
        self,
        user_message: str,
        profile: Optional[UserProfile] = None,
        aqi_reading: Optional[AqiReading] = None
    ) -> str:
        """Assembles prompt for conversational assistant with defense wrap."""
        context = self.build_personalized_context(profile, aqi_reading)
        wrapped_user_query = prompt_defense.wrap_untrusted_input(user_message)

        return (
            f"=== VERIFIED CONTEXT INJECTION ===\n"
            f"{context}\n\n"
            f"=== USER QUERY (UNTRUSTED INPUT BOUNDARY) ===\n"
            f"{wrapped_user_query}\n\n"
            f"=== INSTRUCTIONS ===\n"
            f"1. Answer the user's air quality question clearly and empathetically.\n"
            f"2. Explicitly distinguish between exposure reduction and emission reduction where applicable.\n"
            f"3. If relevant, include 1 to 3 structured actionable recommendations conforming to the JSON schema inside a ```json ``` block.\n"
            f"4. Never hallucinate fake numerical statistics or prescribe medical treatments."
        )

    def get_all_prompts_info(self) -> List[PromptInspectionResponse]:
        """Provides full breakdown for the Prompt Engineering Inspector UI."""
        metadata = [
            {
                "file": "system_prompt.txt",
                "name": "1. System Role & Core Operating Principles",
                "desc": "Establishes the expert environmental persona, objective tone, and core negative constraints.",
                "techniques": ["Role Prompting", "Constraint-Based Prompting", "Negative Constraints", "Uncertainty Handling"]
            },
            {
                "file": "personalization_prompt.txt",
                "name": "2. Context Injection & Dynamic Profile Ingestion",
                "desc": "Dynamically injects verified city telemetry, household vulnerabilities, and daily commute routines.",
                "techniques": ["Context Injection", "Contextual Personalization", "Demographic Modeling", "Telemetry Grounding"]
            },
            {
                "file": "recommendation_prompt.txt",
                "name": "3. Structured Output & Few-Shot Exemplars",
                "desc": "Enforces strict JSON schema generation with comprehensive few-shot exemplars across winter smog use-cases.",
                "techniques": ["Structured Output", "Few-Shot Prompting", "Schema Enforcement", "Classification Modeling"]
            },
            {
                "file": "impact_explanation_prompt.txt",
                "name": "4. Multi-Tier Impact Breakdown Framework",
                "desc": "Deconstructs every action into 6 dimensions: Action, Reason, Exposure vs Emission, Impact Level, Difficulty, Sphere of Benefit.",
                "techniques": ["Impact Explainer", "Causal Chain Analysis", "Mechanistic Framing"]
            },
            {
                "file": "safety_prompt.txt",
                "name": "5. Environmental Health Guardrails & Risk Prevention",
                "desc": "Prevents dangerous indoor air practices (ozone machines, unvented combustion) and medical disclaimers.",
                "techniques": ["Negative Constraints", "Safety Guardrails", "Medical Boundary Defense"]
            },
            {
                "file": "evaluation_prompt.txt",
                "name": "6. Self-Checking & Output Verification Protocol",
                "desc": "Evaluates candidate responses against 5 internal criteria before serialization.",
                "techniques": ["Self-Checking", "Pre-Output Verification", "Factuality Checking"]
            }
        ]

        result = []
        for item in metadata:
            content = self.get_raw_prompt(item["file"])
            result.append(
                PromptInspectionResponse(
                    name=item["name"],
                    description=item["desc"],
                    template_content=content,
                    engineering_techniques=item["techniques"]
                )
            )
        return result

prompt_manager = PromptManager()
