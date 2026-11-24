import React, { useState, useEffect } from 'react';
import { UserProfile } from '../services/types';
import { api } from '../services/api';
import {
  SlidersHorizontal,
  X,
  MapPin,
  Car,
  Flame,
  Clock,
  Briefcase,
  Baby,
  HeartPulse,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);
  const [presets, setPresets] = useState<Record<string, { label: string; profile: UserProfile }>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfile(currentProfile);
    api.getPresetProfiles().then(setPresets).catch(console.error);
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (presetKey: string) => {
    if (presets[presetKey]) {
      setProfile(presets[presetKey].profile);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const validation = await api.validateProfile(profile);
      setWarnings(validation.warnings);
      onSaveProfile(validation.sanitized_profile);
      onClose();
    } catch (err) {
      console.error(err);
      onSaveProfile(profile);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-800 text-mint-300">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Personalize Air Quality Guidance</h3>
              <p className="text-xs text-emerald-200">
                Tailor recommendations to your household, commute, and clean-air goals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Presets:
          </span>
          {Object.entries(presets).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleApplyPreset(key)}
              className="text-xs px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100/80 font-medium transition-colors shadow-2xs"
            >
              {item.label.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Location Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              1. Geographic Location
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Country</label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Area / Ward (Optional)</label>
                <input
                  type="text"
                  value={profile.area || ''}
                  onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                  placeholder="e.g. South Delhi, Bandra"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Household & Commute */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-600" />
              2. Lifestyle & Commute Habits
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Household Members</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={profile.household_size}
                  onChange={(e) => setProfile({ ...profile, household_size: parseInt(e.target.value) || 1 })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Primary Transit Mode</label>
                <select
                  value={profile.primary_transportation}
                  onChange={(e) => setProfile({ ...profile, primary_transportation: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Public Transit (Metro/Bus)">Public Transit (Metro / Bus)</option>
                  <option value="Private Petrol Car">Private Car (Petrol / Diesel)</option>
                  <option value="Two-Wheeler / Motorcycle">Two-Wheeler / Scooter / Bike</option>
                  <option value="Walking / Bicycle">Walking / Bicycle / Active Mobility</option>
                  <option value="Electric Vehicle (EV)">Electric Vehicle (EV)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Cooking Fuel Source</label>
                <select
                  value={profile.cooking_fuel}
                  onChange={(e) => setProfile({ ...profile, cooking_fuel: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="LPG Cylinder">LPG Cylinder</option>
                  <option value="Piped Natural Gas (PNG)">Piped Natural Gas (PNG)</option>
                  <option value="Electric / Induction">Electric / Induction Hotplate</option>
                  <option value="Biomass / Chulha">Biomass / Firewood / Chulha</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Daily Outdoor Activity</label>
                <select
                  value={profile.daily_outdoor_activity}
                  onChange={(e) => setProfile({ ...profile, daily_outdoor_activity: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Low (< 1 hour)">Low (&lt; 1 hour per day)</option>
                  <option value="Moderate (1-3 hours)">Moderate (1 - 3 hours per day)</option>
                  <option value="High (> 3 hours)">High (&gt; 3 hours per day)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Work / Daily Routine</label>
                <select
                  value={profile.work_routine}
                  onChange={(e) => setProfile({ ...profile, work_routine: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Office Commuter">Office Commuter (Daily Travel)</option>
                  <option value="Remote / Work From Home">Remote / Work From Home</option>
                  <option value="Outdoor Worker">Outdoor Worker / Field Operations</option>
                  <option value="Student">Student (School / University)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vulnerabilities & Sensitivities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              3. Household Health Considerations (Non-Medical)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.has_children}
                  onChange={(e) => setProfile({ ...profile, has_children: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Children under 12</span>
                  <span className="text-slate-500 text-[11px]">Developing lungs & school commute</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.has_elderly}
                  onChange={(e) => setProfile({ ...profile, has_elderly: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Seniors (60+ years)</span>
                  <span className="text-slate-500 text-[11px]">Cardiopulmonary vulnerability</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.has_respiratory_sensitivity}
                  onChange={(e) => setProfile({ ...profile, has_respiratory_sensitivity: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Asthma / Allergy Sensitivity</span>
                  <span className="text-slate-500 text-[11px]">Bronchial sensitivity to smog</span>
                </div>
              </label>
            </div>
          </div>

          {/* Validation Warnings */}
          {warnings.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Profile stored securely in your browser session. No tracking cookies.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save & Personalize'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
