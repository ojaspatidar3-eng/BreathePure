import {
  AqiReading,
  ManualAqiInput,
  UserProfile,
  ProfileValidationResult,
  ChatRequest,
  ChatResponse,
  DailyRoutinePlan,
  ImpactExplanation,
  SustainableComparison,
} from './types';

const API_BASE = '/api';

export const api = {
  // AQI Telemetry
  async getAqi(city: string = 'New Delhi', country: string = 'India'): Promise<AqiReading> {
    const res = await fetch(`${API_BASE}/aqi/current?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
    if (!res.ok) throw new Error(`AQI fetch failed: ${res.statusText}`);
    return res.json();
  },

  async submitManualAqi(data: ManualAqiInput): Promise<AqiReading> {
    const res = await fetch(`${API_BASE}/aqi/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Manual AQI error: ${res.statusText}`);
    return res.json();
  },

  async getScales(): Promise<any> {
    const res = await fetch(`${API_BASE}/aqi/scales`);
    if (!res.ok) throw new Error(`Scales fetch failed`);
    return res.json();
  },

  // Profiles
  async getPresetProfiles(): Promise<Record<string, { label: string; profile: UserProfile }>> {
    const res = await fetch(`${API_BASE}/profile/presets`);
    if (!res.ok) throw new Error(`Presets fetch failed`);
    return res.json();
  },

  async validateProfile(profile: UserProfile): Promise<ProfileValidationResult> {
    const res = await fetch(`${API_BASE}/profile/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error(`Profile validation failed`);
    return res.json();
  },

  // Assistant & Routine
  async sendChat(req: ChatRequest): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Chat request failed: ${res.statusText}`);
    return res.json();
  },

  async getDailyRoutine(profile?: UserProfile | null, aqi?: AqiReading | null): Promise<DailyRoutinePlan> {
    const res = await fetch(`${API_BASE}/assistant/routine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, aqi_reading: aqi }),
    });
    if (!res.ok) throw new Error(`Routine plan failed`);
    return res.json();
  },

  async getImpactExplanation(action: string): Promise<ImpactExplanation> {
    const res = await fetch(`${API_BASE}/assistant/impact-explainer?action=${encodeURIComponent(action)}`);
    if (!res.ok) throw new Error(`Impact explainer failed`);
    return res.json();
  },

  async getSustainableAlternatives(): Promise<SustainableComparison[]> {
    const res = await fetch(`${API_BASE}/assistant/alternatives`);
    if (!res.ok) throw new Error(`Alternatives fetch failed`);
    return res.json();
  },
};
