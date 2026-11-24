import React, { useState } from 'react';
import { AqiReading, UserProfile } from '../services/types';
import { AqiCard } from '../components/AqiCard';
import { PollutantDetails } from '../components/PollutantDetails';
import {
  Search,
  MapPin,
  CalendarClock,
  Bot,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface DashboardPageProps {
  reading: AqiReading | null;
  loading: boolean;
  profile: UserProfile;
  onRefresh: () => void;
  onSearchCity: (city: string) => void;
  onOpenManualEntry: () => void;
  onOpenProfile: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  reading,
  loading,
  profile,
  onRefresh,
  onSearchCity,
  onOpenManualEntry,
  onOpenProfile,
  onNavigateTab,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const cityPresets = ['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Patna', 'Lucknow', 'London', 'New York'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchCity(searchInput.trim());
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Search & Location Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search global city or region (e.g. Delhi, Pune, Tokyo, New York)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onOpenManualEntry}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate AQI</span>
            </button>
          </div>
        </div>

        {/* Quick City Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Quick Cities:</span>
          {cityPresets.map((city) => (
            <button
              key={city}
              onClick={() => onSearchCity(city)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 font-medium transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Main AQI Card */}
      <AqiCard reading={reading} loading={loading} onOpenManualEntry={onOpenManualEntry} />

      {/* Pollutant Breakdown */}
      {reading && <PollutantDetails pollutants={reading.pollutants} />}

      {/* Personalized Precautions Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Personalized Lifestyle Precautions
            </h3>
            <p className="text-xs text-slate-500">
              Generated dynamically for your profile in {profile.city} ({profile.household_size} members)
            </p>
          </div>
          <button
            onClick={onOpenProfile}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit"
          >
            Adjust Household Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Household Sensitivity Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Household Sensitivities
            </span>
            <div className="text-xs text-slate-800 font-semibold">
              {profile.has_respiratory_sensitivity
                ? 'Asthma / Respiratory Sensitivity Present'
                : profile.has_elderly || profile.has_children
                ? 'Vulnerable Dependents Present'
                : 'Standard Exposure Baseline'}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {profile.has_respiratory_sensitivity
                ? 'Keep medical rescue inhalers in reach. Keep bedroom door draft-sealed with an active HEPA air cleaner running continuously.'
                : profile.has_children
                ? 'Avoid early morning outdoor playtime before 09:00 AM while inversion levels are at peak density.'
                : 'Reduce high-intensity outdoor cardiovascular exercise during morning rush hour.'}
            </p>
          </div>

          {/* Commute Mode Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Commute Mode: {profile.primary_transportation.split('(')[0]}
            </span>
            <div className="text-xs text-slate-800 font-semibold">
              Transit Microenvironment
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {profile.primary_transportation.toLowerCase().includes('two-wheeler')
                ? 'Wear a tight-fitting certified N95 respirator. Unshielded riders face 3-5x higher particulate exposure than car passengers.'
                : profile.primary_transportation.toLowerCase().includes('car')
                ? 'Activate internal cabin recirculation. Ensure vehicle cabin particulate filter has been inspected for the winter season.'
                : 'Public transit drastically reduces community emissions. Wear an N95 when crossing busy diesel bus corridors.'}
            </p>
          </div>

          {/* Kitchen Cooking Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Cooking Fuel: {profile.cooking_fuel.split('/')[0]}
            </span>
            <div className="text-xs text-slate-800 font-semibold">
              Indoor Air Source
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {profile.cooking_fuel.toLowerCase().includes('biomass')
                ? 'High danger of domestic smoke accumulation. Cook in ventilated open verandas and transition toward induction plates.'
                : profile.cooking_fuel.toLowerCase().includes('induction')
                ? 'Excellent clean indoor choice. Zero naked flame NO2 emissions generated inside the living space.'
                : 'Turn on overhead exhaust 2 minutes prior to lighting gas burners. Cook with pan lids to contain aerosolized cooking oil.'}
            </p>
          </div>

          {/* Outdoor Activity Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Daily Activity: {profile.daily_outdoor_activity}
            </span>
            <div className="text-xs text-slate-800 font-semibold">
              Timing Strategy
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {reading && reading.aqi > 250
                ? 'Severe smog alert: Shift outdoor errands to the midday solar window (13:00 - 15:30) when ground inversion dissipates.'
                : 'Ambient air is manageable. Maintain moderate outdoor activity but avoid idling behind diesel trucks.'}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigateTab('routine')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            <CalendarClock className="w-4 h-4" />
            <span>Generate Today's 5-Slot Routine Plan</span>
          </button>
          <button
            onClick={() => onNavigateTab('assistant')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Bot className="w-4 h-4 text-emerald-700" />
            <span>Consult AI Clean-Air Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
