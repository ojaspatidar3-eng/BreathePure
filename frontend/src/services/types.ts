export type AqiScale = 'Indian NAQI (CPCB)' | 'US EPA AQI';

export type AqiCategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export interface PollutantData {
  pm2_5?: number | null;
  pm10?: number | null;
  no2?: number | null;
  so2?: number | null;
  co?: number | null;
  o3?: number | null;
}

export interface AqiReading {
  aqi: number;
  scale: AqiScale;
  category: AqiCategory;
  category_color: string;
  dominant_pollutant: string;
  pollutants: PollutantData;
  city: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  timestamp: string;
  data_source: string;
  is_live: boolean;
  is_manual: boolean;
  is_sample: boolean;
  general_health_message: string;
  cautionary_statement: string;
  data_disclaimer?: string | null;
}

export interface ManualAqiInput {
  city: string;
  country: string;
  aqi: number;
  scale: AqiScale;
  pm2_5?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
  notes?: string;
}

export interface UserProfile {
  country: string;
  city: string;
  area?: string;
  household_size: number;
  primary_transportation: string;
  cooking_fuel: string;
  daily_outdoor_activity: string;
  work_routine: string;
  has_children: boolean;
  has_elderly: boolean;
  has_respiratory_sensitivity: boolean;
  primary_concerns: string[];
}

export interface ProfileValidationResult {
  is_valid: boolean;
  warnings: string[];
  sanitized_profile: UserProfile;
}

export interface RecommendationItem {
  title: string;
  action: string;
  reason: string;
  impact_type: 'Exposure reduction' | 'Emission reduction' | 'Dual benefit';
  impact_level: 'Low' | 'Medium' | 'High';
  difficulty: 'Easy' | 'Moderate' | 'Difficult';
  timeframe: string;
  safety_note: string;
}

export interface ImpactExplanation {
  recommended_action: string;
  why_it_matters: string;
  exposure_vs_emission: string;
  impact_mechanism: string;
  qualitative_impact: string;
  difficulty: string;
  sphere_of_benefit: string;
  evidence_summary: string;
}

export interface RoutineTimeSlot {
  slot_id: string;
  slot_name: string;
  time_window: string;
  aqi_context: string;
  recommendations: RecommendationItem[];
  key_caution: string;
}

export interface DailyRoutinePlan {
  city: string;
  aqi_level: string;
  aqi_value: number;
  generated_at: string;
  lifestyle_summary: string;
  time_slots: RoutineTimeSlot[];
  daily_emission_avoidance_tip: string;
  daily_exposure_reduction_tip: string;
}

export interface SustainableComparison {
  category: string;
  conventional_habit: string;
  sustainable_alternative: string;
  pollution_mechanism: string;
  exposure_impact: string;
  emission_impact: string;
  practicality: string;
  community_benefit: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  structured_recommendations?: RecommendationItem[];
}

export interface ChatRequest {
  message: string;
  profile?: UserProfile | null;
  aqi_data?: AqiReading | null;
  conversation_history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  structured_recommendations: RecommendationItem[];
  ai_mode: 'gemini' | 'deterministic_demo';
  model_name: string;
  safety_checked: boolean;
  disclaimer: string;
}
