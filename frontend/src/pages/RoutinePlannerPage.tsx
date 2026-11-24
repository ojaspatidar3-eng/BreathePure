import React, { useState, useEffect } from 'react';
import { UserProfile, AqiReading, DailyRoutinePlan, RoutineTimeSlot } from '../services/types';
import { api } from '../services/api';
import { RecommendationCard } from '../components/RecommendationCard';
import {
  CalendarClock,
  Sun,
  Car,
  CloudSun,
  Moon,
  Home,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface RoutinePlannerPageProps {
  profile: UserProfile;
  aqiReading: AqiReading | null;
  onOpenProfile: () => void;
}

export const RoutinePlannerPage: React.FC<RoutinePlannerPageProps> = ({
  profile,
  aqiReading,
  onOpenProfile,
}) => {
  const [plan, setPlan] = useState<DailyRoutinePlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoutine();
  }, [profile, aqiReading]);

  const loadRoutine = async () => {
    setLoading(true);
    try {
      const data = await api.getDailyRoutine(profile, aqiReading);
      setPlan(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSlotIcon = (slotId: string) => {
    switch (slotId) {
      case 'morning':
        return Sun;
      case 'commute':
        return Car;
      case 'afternoon':
        return CloudSun;
      case 'evening':
        return Home;
      case 'night':
        return Moon;
      default:
        return CalendarClock;
    }
  };

  return (
    <div className="py-4 space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-forest-900 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-emerald-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 text-mint-300 text-xs font-semibold border border-emerald-700/60">
            <Sparkles className="w-3.5 h-3.5 text-mint-300" />
            <span>Circadian Exposure Optimization</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Daily Routine Planner
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Adapts your 24-hour routine around atmospheric boundary layer shifts. By rescheduling cardio away
            from morning inversion peaks and creating an evening bedroom sanctuary, your family cuts toxic particulate
            burden while lowering personal travel emissions.
          </p>

          {plan && (
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200">
              <span>Target: <strong className="text-white">{plan.city}</strong></span>
              <span>•</span>
              <span>Outdoor AQI Level: <strong className="text-mint-300">{plan.aqi_level} ({plan.aqi_value})</strong></span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 flex-shrink-0">
          <button
            onClick={loadRoutine}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Plan</span>
          </button>
          <button
            onClick={onOpenProfile}
            className="px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/60 transition-colors"
          >
            Edit Profile Baseline
          </button>
        </div>
      </div>

      {/* Dual Key Takeaways Strip */}
      {plan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-xs space-y-1">
            <span className="font-extrabold text-cyan-900 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
              Daily Exposure Reduction Rule:
            </span>
            <p className="text-cyan-950 font-medium leading-relaxed">
              {plan.daily_exposure_reduction_tip}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
            <span className="font-extrabold text-emerald-900 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Daily Emission Avoidance Rule:
            </span>
            <p className="text-emerald-950 font-medium leading-relaxed">
              {plan.daily_emission_avoidance_tip}
            </p>
          </div>
        </div>
      )}

      {/* 5-Slot Circadian Timeline */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Synthesizing personalized 5-slot clean-air schedule...</p>
        </div>
      ) : plan ? (
        <div className="space-y-6">
          {plan.time_slots.map((slot, index) => {
            const Icon = getSlotIcon(slot.slot_id);
            return (
              <div
                key={slot.slot_id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-2xs space-y-5"
              >
                {/* Slot Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-base font-bold text-slate-900">{slot.slot_name}</h3>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {slot.time_window}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{slot.aqi_context}</p>
                    </div>
                  </div>

                  {/* Caution pill */}
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 text-[11px] text-amber-900 border border-amber-200/60 max-w-sm">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="font-medium">{slot.key_caution}</span>
                  </div>
                </div>

                {/* Recommendations in this Slot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slot.recommendations.map((rec, rIdx) => (
                    <RecommendationCard key={rIdx} item={rec} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No routine plan available. Click 'Regenerate Plan' above.
        </div>
      )}
    </div>
  );
};
