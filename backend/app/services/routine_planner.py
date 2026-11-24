import time
from typing import List, Optional
from app.models.profile import UserProfile
from app.models.aqi import AqiReading, AqiCategory
from app.models.recommendation import (
    DailyRoutinePlan,
    RoutineTimeSlot,
    RecommendationItem
)

class RoutinePlanner:
    @staticmethod
    def generate_routine(
        profile: Optional[UserProfile] = None,
        aqi_reading: Optional[AqiReading] = None
    ) -> DailyRoutinePlan:
        """
        Synthesizes a personalized, 5-stage daily clean-air routine
        adapting to outdoor AQI severity, commute mode, and family vulnerabilities.
        """
        prof = profile or UserProfile()
        aqi_val = aqi_reading.aqi if aqi_reading else 180
        category = aqi_reading.category if aqi_reading else AqiCategory.MODERATELY_POLLUTED
        city = aqi_reading.city if aqi_reading else prof.city

        is_severe = aqi_val > 300
        is_poor = aqi_val > 200
        has_vulnerable = prof.has_children or prof.has_elderly or prof.has_respiratory_sensitivity

        # Slot 1: Morning (06:00 - 09:00)
        morning_recs = []
        if is_severe or is_poor:
            morning_recs.append(
                RecommendationItem(
                    title="Suspend Morning Outdoor Aerobic Exercise",
                    action="Shift running, cycling, or brisk walks indoors to low-intensity mobility or yoga in a sealed room.",
                    reason="Nocturnal temperature inversion traps vehicular and industrial particulates at ground level; morning breathing rates during cardio multiply toxic particulate deposition in alveoli.",
                    impact_type="Exposure reduction",
                    impact_level="High",
                    difficulty="Easy",
                    timeframe="06:00 - 08:30",
                    safety_note="Do not open balcony doors or windows during the morning inversion peak."
                )
            )
        else:
            morning_recs.append(
                RecommendationItem(
                    title="Early Morning Fresh Air Window",
                    action="Open cross-ventilating windows for 20-30 minutes before commuter traffic peaks.",
                    reason="Outdoor ambient air is relatively cleaner before vehicular traffic peaks, flushing accumulated indoor carbon dioxide.",
                    impact_type="Exposure reduction",
                    impact_level="Medium",
                    difficulty="Easy",
                    timeframe="06:30 - 07:15",
                    safety_note="Close windows once ambient street traffic builds up."
                )
            )

        # Slot 2: Commute (08:30 - 10:30 & Return 17:30 - 20:00)
        commute_recs = []
        if "car" in prof.primary_transportation.lower():
            commute_recs.append(
                RecommendationItem(
                    title="Activate Cabin Air Recirculation & Carpool",
                    action="Keep car ventilation on internal recirculation mode; share commuting seats with 2 colleagues along your route.",
                    reason="Internal recirculation prevents pulling exhaust fumes directly into passenger cabins; carpooling removes 1-2 private combustion vehicles from the road grid.",
                    impact_type="Dual benefit",
                    impact_level="High",
                    difficulty="Moderate",
                    timeframe="Morning & Evening peak hours",
                    safety_note="Check that the cabin air filter is rated for particulate filtration."
                )
            )
        elif "two-wheeler" in prof.primary_transportation.lower() or "motorcycle" in prof.primary_transportation.lower():
            commute_recs.append(
                RecommendationItem(
                    title="Wear Certified N95/FFP2 Respirator with Headstraps",
                    action="Don an airtight N95 or FFP2 particulate mask before starting the bike, ensuring the metal nose clip is molded tightly.",
                    reason="Two-wheeler riders are directly exposed to tailpipe plumes of diesel trucks and autos without vehicle cabin shielding.",
                    impact_type="Exposure reduction",
                    impact_level="High",
                    difficulty="Easy",
                    timeframe="During entire transit",
                    safety_note="Cloth bandanas and surgical masks do not filter fine PM2.5 or ultra-fine particles."
                )
            )
        else:
            commute_recs.append(
                RecommendationItem(
                    title="Off-Peak Rapid Electric Transit (Metro/Bus)",
                    action="Take electrified metro rail or public buses, planning boarding 15 minutes before peak crowd surge.",
                    reason="Public mass transit carries orders of magnitude lower emissions per passenger-kilometer than single-occupancy vehicles.",
                    impact_type="Emission reduction",
                    impact_level="High",
                    difficulty="Easy",
                    timeframe="08:15 - 09:30",
                    safety_note="Wear an N95 respirator while navigating underground transfer concourses and street crossings."
                )
            )

        # Slot 3: Afternoon (11:00 - 16:00)
        afternoon_recs = [
            RecommendationItem(
                title="Strategic Midday Window Exchange (If Outdoor AQI Improves)",
                action="Check real-time air quality around 13:30; if solar heating has dispersed surface smog, open high windows briefly for fresh air exchange.",
                reason="Solar convection deepens the atmospheric boundary layer in the afternoon, often reducing ground-level PM2.5 compared to dawn and dusk.",
                impact_type="Exposure reduction",
                impact_level="Medium",
                difficulty="Easy",
                timeframe="13:30 - 14:30",
                safety_note="If outdoor AQI remains in 'Very Poor' or 'Severe', keep building seals intact."
            ),
            RecommendationItem(
                title="Indoor Hydration & Respiratory Mucosal Barrier Care",
                action="Maintain regular warm water and fluid intake throughout work hours; use saline nasal mist if experiencing nasal dryness.",
                reason="Proper airway hydration supports mucociliary clearance, the biological escalator that expels deposited inhaled particles from bronchi.",
                impact_type="Exposure reduction",
                impact_level="Medium",
                difficulty="Easy",
                timeframe="Throughout afternoon",
                safety_note="This supports natural bodily clearance but does not replace particulate inhalation protection."
            )
        ]

        # Slot 4: Evening & Kitchen (18:00 - 21:00)
        evening_recs = []
        if "biomass" in prof.cooking_fuel.lower() or "chulha" in prof.cooking_fuel.lower():
            evening_recs.append(
                RecommendationItem(
                    title="Transition to Induction Plate or Ventilated Flue",
                    action="Prepare dinner on an electric induction hot plate, or cook exclusively in a semi-open veranda away from sleeping quarters.",
                    reason="Biomass and chulha combustion in closed rooms causes extreme indoor particulate peaks, often 20x higher than ambient city smog.",
                    impact_type="Dual benefit",
                    impact_level="High",
                    difficulty="Moderate",
                    timeframe="18:30 - 20:30",
                    safety_note="Never allow infants or elderly family members to sit in the kitchen while solid fuel is burning."
                )
            )
        else:
            evening_recs.append(
                RecommendationItem(
                    title="Exhaust Hood Pre-Activation & Covered Pan Cooking",
                    action="Turn on kitchen mechanical exhaust 2 minutes before igniting burners, cook with snug lids, and close kitchen doors to bedrooms.",
                    reason="Gas stoves and hot frying oil emit NO2 and ultra-fine aerosols that rapidly circulate to family living areas without barrier isolation.",
                    impact_type="Exposure reduction",
                    impact_level="High",
                    difficulty="Easy",
                    timeframe="19:00 - 20:30",
                    safety_note="Maintain a slight crack in the exterior kitchen window to avoid negative pressure backdraft."
                )
            )

        evening_recs.append(
            RecommendationItem(
                title="Microfiber Damp Mopping Instead of Dry Brooming",
                action="Clean floors using a damp microfiber mop; avoid dry broom sweeping or dusting with dry rags.",
                reason="Dry sweeping resuspends settled toxic floor dust and heavy metals back into the air at child breathing height.",
                impact_type="Exposure reduction",
                impact_level="Medium",
                difficulty="Easy",
                timeframe="20:00 - 20:30",
                safety_note="Use plain water or mild biodegradable detergent; avoid harsh chemical sprays."
            )
        )

        # Slot 5: Night / Sleep (21:00 - 06:00)
        night_recs = [
            RecommendationItem(
                title="Create a Sealed Sanctuary Bedroom",
                action="Close bedroom windows tightly, place a draft stopper under the bedroom door, and run a certified HEPA air cleaner on low-noise mode.",
                reason="During sleep, humans inhale 5,000+ liters of air over 7-8 hours; maintaining clean bedroom air provides an uninterrupted physiological recovery period.",
                impact_type="Exposure reduction",
                impact_level="High",
                difficulty="Easy",
                timeframe="21:30 - 06:00",
                safety_note="Never use ozone-producing ionic air fresheners in sleeping quarters."
            )
        ]

        if has_vulnerable:
            night_recs.append(
                RecommendationItem(
                    title="Vulnerable Dependent Micro-Zone Monitoring",
                    action="Position the HEPA cleaner within 2 meters of the sleeping child or senior's bed, with clean airflow directed toward breathing zone.",
                    reason="Minimizes inhalation of ambient leakage before clean air mixes with background indoor pollutants.",
                    impact_type="Exposure reduction",
                    impact_level="High",
                    difficulty="Easy",
                    timeframe="Overnight",
                    safety_note="Keep prescribed emergency inhalers by the bedside for any asthmatic family member."
                )
            )

        slots = [
            RoutineTimeSlot(
                slot_id="morning",
                slot_name="Morning Routine",
                time_window="06:00 - 09:00",
                aqi_context=f"Morning winter smog & thermal inversion ({category.value})",
                recommendations=morning_recs,
                key_caution="Ground-level particulates reach peak concentration between dawn and 08:30."
            ),
            RoutineTimeSlot(
                slot_id="commute",
                slot_name="Daily Transit & Commute",
                time_window="08:30 - 10:30 & 17:30 - 20:00",
                aqi_context=f"Tailpipe corridor concentration ({prof.primary_transportation})",
                recommendations=commute_recs,
                key_caution="In-traffic microenvironments expose commuters to 3-5x higher toxic concentrations."
            ),
            RoutineTimeSlot(
                slot_id="afternoon",
                slot_name="Afternoon Work & Indoors",
                time_window="11:00 - 16:00",
                aqi_context="Atmospheric dispersion window",
                recommendations=afternoon_recs,
                key_caution="Monitor ozone levels during sunny afternoons in industrial or heavy-traffic zones."
            ),
            RoutineTimeSlot(
                slot_id="evening",
                slot_name="Evening Home & Kitchen",
                time_window="18:00 - 21:00",
                aqi_context=f"Cooking emissions & evening traffic inversion ({prof.cooking_fuel})",
                recommendations=evening_recs,
                key_caution="Unvented indoor cooking can exceed outdoor smog levels within 30 minutes."
            ),
            RoutineTimeSlot(
                slot_id="night",
                slot_name="Night Recovery & Sleep",
                time_window="21:00 - 06:00",
                aqi_context="Longest continuous breathing exposure period (Sanctuary Mode)",
                recommendations=night_recs,
                key_caution="Keep sleeping room draft-tight and maintain clean air filtration throughout the night."
            ),
        ]

        return DailyRoutinePlan(
            city=city,
            aqi_level=category.value,
            aqi_value=aqi_val,
            generated_at=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            lifestyle_summary=f"{prof.household_size}-person home in {city}; transit: {prof.primary_transportation}; cooking: {prof.cooking_fuel}",
            time_slots=slots,
            daily_emission_avoidance_tip="Consolidate vehicle trips and prevent any domestic burning of garden leaves or waste.",
            daily_exposure_reduction_tip="Establish one sealed sanctuary room with continuous HEPA cleaning for maximum physiological recovery."
        )

routine_planner = RoutinePlanner()
