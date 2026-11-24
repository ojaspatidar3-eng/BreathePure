# BreathePure — Smarter Air. Healthier Life.

> **Hack2Skill Prompt Wars — Challenge 6: Urban Air Quality Assistant**  
> An intelligent environmental companion engineered for families and communities to navigate severe winter smog and urban air pollution through verified telemetry, contextual GenAI, and evidence-based low-emission habits.

---

## 1. Problem Statement & Mission

Severe winter smog and persistent urban air pollution across metropolitan corridors present an acute public health emergency. Ground-level temperature inversions act as a thermal lid, trapping fine particulates (PM2.5, PM10), nitrogen dioxide (NO₂), carbon monoxide (CO), and volatile organic compounds right at pedestrian breathing height.

Citizens frequently face confusing air quality indices, lack actionable microenvironment protection strategies, or fall victim to hazardous air-cleaning myths (e.g. ozone generators or unvented indoor combustion). Furthermore, public guidance rarely clarifies the vital distinction between:
- **Exposure Reduction:** Shielding the human respiratory system from inhaling toxic ambient or indoor air.
- **Emission Reduction:** Preventing combustion by-products and fugitive dust from entering the shared airshed in the first place.

**BreathePure** bridges this gap as a genuinely functional, full-stack, production-grade application delivering personalized lifestyle routines, indoor air quality mastery, sustainable habit alternatives, and deep 6-dimension impact deconstruction.

---

## 2. Product Identity & Brand

- **Name:** BreathePure
- **Tagline:** Smarter Air. Healthier Life.
- **Brand Personality:** Trustworthy, Intelligent, Environmentally Conscious, Modern, Friendly, and Professional.
- **Brand Logo:** An elegant combination of an airflow stream and an organic leaf contour, symbolizing harmonious clean air restoration.

---

## 3. System Architecture

```
                                  [ User Browser ]
                                         │
                         React 18 + Vite + TypeScript
                         Tailwind CSS + Lucide + Recharts
                                         │
                                   REST / JSON
                                         │
                             [ FastAPI REST Backend ]
                      ┌──────────────────┴──────────────────┐
                      ▼                                     ▼
             [ AQI Data Service ]                 [ AI Assistant Service ]
          - Open-Meteo Global API               - Prompt Defense (Anti-Jailbreak)
          - CPCB Sub-Index Math (NAQI)          - Prompt Manager (Context Injection)
          - Transparent Attribution             - Gemini AI Provider (REST)
          - In-Memory TTL Caching               - Deterministic Demo Provider
          - Manual Simulation Engine            - Pydantic Schema Validator
                                                - Safety & Medical Self-Check
```

---

## 4. Key Application Features

### A. Landing Page
- Premium environmental tech startup interface with airflow + leaf branding.
- Winter smog atmospheric inversion scientific breakdown.
- 6-module capability overview and 3-step intelligent workflow.

### B. User Onboarding & Profile Modeling
- Collects country, city, and neighborhood/ward.
- Lifestyle parameters: household size, primary transit (Metro, Car, Two-Wheeler, Walking/EV), cooking fuel (LPG, PNG, Induction, Biomass/Chulha), daily outdoor exposure, and work routine.
- Household considerations: children under 12, seniors 60+, and respiratory sensitivities (asthma, allergies, COPD).
- One-click presets: *Delhi Vulnerable Family*, *Mumbai Commuter*, *Bengaluru Techie*, and *Tier-2 Kitchen Transition*.

### C. Air Quality Dashboard
- Real-time AQI with CPCB Indian NAQI category interpretation (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).
- Sub-indices for PM2.5, PM10, NO₂, SO₂, CO, and O₃ benchmarked against Indian CPCB national ambient limits.
- Honest data labeling: distinguishes **Live Station Telemetry**, **Manual Simulation Entry**, and **Offline Educational Baseline**.
- Interactive Manual AQI simulation console for evaluating extreme scenarios.

### D. AI Air Quality Assistant
- Conversational chat interface grounded in injected user context and local telemetry.
- Delivers structured recommendations with title, action, reason, impact type, impact level, difficulty, timeframe, and safety notes.
- Discloses active AI mode (Google Gemini API vs Deterministic Demo Mode).

### E. Smart Daily Routine Planner
- Circadian 5-slot clean-air schedule:
  1. **Morning Routine (06:00 - 09:00):** Inversion caution and indoor exercise shift.
  2. **Daily Commute (08:30 - 10:30 & 17:30 - 20:00):** Internal cabin recirculation & public transit.
  3. **Afternoon Indoors (11:00 - 16:00):** Midday solar dispersion window & hydration.
  4. **Evening Home & Kitchen (18:00 - 21:00):** Pre-exhaust cooking hood protocol & damp mopping.
  5. **Night Recovery & Sleep (21:00 - 06:00):** Sealed sanctuary bedroom with continuous HEPA cleaning.

### F. Indoor Air Quality Guide
- High-Efficiency Particulate Air (HEPA H13/H14) and activated carbon filtration guidelines.
- Dangers of ozone-generating ionizers and chemical aerosol sprays.
- Kitchen door isolation and induction cooking transition.
- Wet microfiber mopping vs. harmful dry broom dust resuspension.
- Strategic midday solar window ventilation timing (13:00 - 15:30).

### G. Sustainable Alternatives Engine
- Side-by-side comparative analyses:
  - Private vehicle vs. Electrified metro rail.
  - Solo commute vs. Neighborhood carpooling.
  - Biomass / open gas frying vs. Electric induction.
  - Dry leaf burning vs. Community composting.
  - Dry broom sweeping vs. Damp microfiber mopping.
  - Synthetic air fresheners vs. Source odor elimination.
- Qualitative environmental impact without fabricated statistics.

### H. Multi-Tier Impact Explainer
- Deconstructs every recommendation across 6 rigorous dimensions:
  1. Recommended action.
  2. Why it matters (scientific / atmospheric mechanism).
  3. Exposure vs. emission mechanism.
  4. Expected qualitative impact (Low / Medium / High).
  5. Adoption feasibility & difficulty.
  6. Sphere of benefit (Personal, Household, Community).

### I. Family & Community Mode
- Infant stroller tailpipe exposure height precautions.
- Senior citizen morning cold-air cardiopulmonary shielding.
- School bus anti-idling drop-off zones and indoor recess protocols.
- Interactive educational flashcards on PM2.5, thermal inversion, and mucociliary clearance.

---

## 5. Prompt Engineering — Core Competitive Advantage

BreathePure implements 10 prompt engineering techniques located in `backend/prompts/`:

| # | Technique | Implementation in BreathePure | File |
|---|---|---|---|
| **1** | **Role Prompting** | Senior Environmental Technologist, Atmospheric Health Researcher, and Clean-Air Advisor. | `system_prompt.txt` |
| **2** | **Context Injection** | Telemetry, geographic coordinates, household size, transit modes, cooking fuels, and sensitivities dynamically injected. | `personalization_prompt.txt` |
| **3** | **Constraint-Based Prompting** | Strict negative constraints: never invent AQI numbers, no medical diagnoses or prescriptions, no fake statistics. | `system_prompt.txt`, `safety_prompt.txt` |
| **4** | **Structured Output** | Enforces validated JSON schema containing title, action, reason, impact type, level, difficulty, timeframe, and safety note. | `recommendation_prompt.txt` |
| **5** | **Few-Shot Prompting** | Multi-scenario golden exemplars demonstrating high-quality recommendations across smog, transit, and kitchen use cases. | `recommendation_prompt.txt` |
| **6** | **Contextual Personalization** | Differentiates guidance based on vulnerability (infants vs asthmatics) and commute mode (two-wheeler vs car). | `personalization_prompt.txt` |
| **7** | **Self-Checking** | Pre-output evaluation checklist verifying exposure vs emission tags, medical compliance, and schema completeness. | `evaluation_prompt.txt` |
| **8** | **Uncertainty Handling** | Explicitly acknowledges telemetry limitations; flags manual simulation entries without pretending to be live station data. | `system_prompt.txt`, `aqi.py` |
| **9** | **Prompt Injection Defense** | Sanitizes user inputs, scans for jailbreak tokens, and encloses user queries within `<USER_INPUT_UNTRUSTED>` delimiter tags. | `prompt_defense.py` |
| **10** | **Output Validation** | Backend Pydantic schema parsing, Markdown code-fence stripping, and defensive repair fallback. | `ai_service.py` |

---

## 6. Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with customized emerald, forest, and mint palettes
- **Icons:** Lucide React
- **Visualizations:** Recharts & custom SVG meters

### Backend
- **Framework:** FastAPI (Python 3.14+)
- **Validation:** Pydantic 2.8+
- **Telemetry:** Open-Meteo Global Air Quality API & CPCB Sub-Index calculation
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`) via REST with Deterministic Demo fallback
- **Testing:** Pytest

---

## 7. Installation & Quick Start

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ (Tested on Node v24) and npm

### 1. Clone & Setup Backend
```bash
# Clone the repository
git clone https://github.com/your-username/hackskills.git
cd hackskills

# Install backend dependencies
pip install -r backend/requirements.txt

# Configure environment variables
cp .env.example .env
# (Optional) Add your GEMINI_API_KEY to .env for live Gemini calls
```

### 2. Start the Backend Server
```bash
python backend/run_backend.py
# Server starts at http://127.0.0.1:8000
# Interactive API docs available at http://127.0.0.1:8000/docs
```

### 3. Setup & Start Frontend
```bash
cd frontend

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 8. Automated Test Suite

BreathePure includes a comprehensive automated test suite covering all critical pathways.

```bash
# Run backend pytest suite from workspace root
python -m pytest backend/tests -v
```

### Actual Test Execution Output:
```
============================= test session starts =============================
platform win32 -- Python 3.14.3, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Users\Ojas Patidar\OneDrive\Desktop\hackskills
configfile: pytest.ini
collected 31 items

backend/tests/test_ai_service.py::test_json_recommendation_parser_and_validation PASSED [  3%]
backend/tests/test_ai_service.py::test_invalid_json_graceful_recovery PASSED [  6%]
backend/tests/test_ai_service.py::test_impact_explainer_six_dimensions PASSED [  9%]
backend/tests/test_ai_service.py::test_sustainable_comparisons_catalog PASSED [ 12%]
backend/tests/test_api_integration.py::test_root_endpoint PASSED         [ 16%]
backend/tests/test_api_integration.py::test_health_endpoint PASSED       [ 19%]
backend/tests/test_api_integration.py::test_aqi_scales_endpoint PASSED   [ 22%]
backend/tests/test_api_integration.py::test_manual_aqi_endpoint PASSED   [ 25%]
backend/tests/test_api_integration.py::test_profile_presets_and_validation PASSED [ 29%]
backend/tests/test_api_integration.py::test_prompts_list_and_inspect PASSED [ 32%]
backend/tests/test_api_integration.py::test_assistant_routine_generation PASSED [ 35%]
backend/tests/test_api_integration.py::test_assistant_impact_explainer PASSED [ 38%]
backend/tests/test_api_integration.py::test_assistant_alternatives PASSED [ 41%]
backend/tests/test_api_integration.py::test_assistant_chat PASSED        [ 45%]
backend/tests/test_aqi_service.py::test_cpcb_sub_index_calculation PASSED [ 48%]
backend/tests/test_aqi_service.py::test_indian_naqi_dominant_pollutant PASSED [ 51%]
backend/tests/test_aqi_service.py::test_aqi_category_and_advisory PASSED [ 54%]
backend/tests/test_aqi_service.py::test_manual_input_processing PASSED   [ 58%]
backend/tests/test_aqi_service.py::test_missing_pollutant_handling PASSED [ 61%]
backend/tests/test_demo_mode.py::test_deterministic_demo_ai_provider[asyncio] PASSED [ 64%]
backend/tests/test_demo_mode.py::test_chat_service_demo_fallback_and_disclaimer[asyncio] PASSED [ 67%]
backend/tests/test_profile_validation.py::test_profile_validation_rules PASSED [ 70%]
backend/tests/test_profile_validation.py::test_preset_profiles_completeness PASSED [ 74%]
backend/tests/test_prompts.py::test_prompt_manager_loads_templates PASSED [ 77%]
backend/tests/test_prompts.py::test_system_prompt_includes_negative_constraints PASSED [ 80%]
backend/tests/test_prompts.py::test_prompt_personalization_context_injection PASSED [ 83%]
backend/tests/test_prompts.py::test_prompt_inspector_metadata PASSED     [ 87%]
backend/tests/test_security.py::test_prompt_injection_pattern_detection PASSED [ 90%]
backend/tests/test_security.py::test_untrusted_input_wrapping_and_neutralization PASSED [ 93%]
backend/tests/test_security.py::test_tag_stripping_defense PASSED        [ 96%]
backend/tests/test_security.py::test_medical_claim_self_check PASSED     [100%]

======================== 31 passed in 0.82s ========================
```

### Frontend Build Verification:
```bash
cd frontend && npm run build
# Output:
# ✓ 1588 modules transformed.
# dist/index.html                   1.13 kB │ gzip:  0.68 kB
# dist/assets/index-DXUjonE7.css   36.97 kB │ gzip:  6.76 kB
# dist/assets/index-mRX5hO5C.js   277.16 kB │ gzip: 76.37 kB
# ✓ built in 3.10s
```

---

## 9. Deterministic Demonstration Mode

To ensure zero-barrier review for hackathon evaluators without requiring an active Google Gemini API key:
- If `GEMINI_API_KEY` is not set or network is unreachable, BreathePure automatically operates in **Deterministic Demonstration Mode**.
- The system generates contextual, scientifically-grounded recommendations tailored to user profile and telemetry.
- The mode is transparently labeled in the UI as *"Deterministic Demo Engine"* alongside an honest disclaimer.

---

## 10. Repository Size & Hygiene

To maintain the required `< 10 MB` repository size:
- Caches (`.pytest_cache`, `__pycache__`) and build artifacts (`dist`, `build`) are excluded via `.gitignore`.
- Node modules (`node_modules`) and virtual environments are excluded.
- Total core source code size is under **3 MB**.

---

## 11. Known Limitations & Safety Principles

1. **Non-Medical Boundary:** BreathePure provides environmental exposure reduction guidance. It does not provide medical diagnoses, alter drug prescriptions, or replace consultation with a licensed pulmonologist.
2. **Microenvironment Variations:** Regional station telemetry may vary from localized street microenvironments due to nearby construction or street food stalls. Users can utilize the manual simulation mode to test hyper-local readings.
3. **Open Meteorological Dependencies:** Telemetry utilizes Open-Meteo Global Atmospheric Reanalysis models. If third-party station feeds experience outages, BreathePure surfaces an honest offline notice instead of fabricating fake numbers.

---

## 12. License & Attribution

Developed for **Hack2Skill Prompt Wars – Challenge 6: Urban Air Quality Assistant**.  
*BreathePure: Smarter Air. Healthier Life.*
