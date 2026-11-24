import React, { useState } from 'react';
import { ManualAqiInput, AqiScale, AqiReading } from '../services/types';
import { api } from '../services/api';
import { Sliders, X, ShieldAlert, Check, Sparkles } from 'lucide-react';

interface ManualAqiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadingUpdated: (reading: AqiReading) => void;
  currentCity: string;
  currentCountry: string;
}

export const ManualAqiModal: React.FC<ManualAqiModalProps> = ({
  isOpen,
  onClose,
  onReadingUpdated,
  currentCity,
  currentCountry,
}) => {
  const [formData, setFormData] = useState<ManualAqiInput>({
    city: currentCity || 'New Delhi',
    country: currentCountry || 'India',
    aqi: 310,
    scale: 'Indian NAQI (CPCB)',
    pm2_5: 165.0,
    pm10: 250.0,
    no2: 45.0,
    so2: 15.0,
    co: 1.5,
    o3: 30.0,
    notes: 'Simulation scenario for severe winter temperature inversion',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePresetScenario = (aqiLevel: number, pm25: number, pm10: number, label: string) => {
    setFormData({
      ...formData,
      aqi: aqiLevel,
      pm2_5: pm25,
      pm10: pm10,
      notes: `Preset Simulation: ${label}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await api.submitManualAqi(formData);
      onReadingUpdated(result);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-900 text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Manual AQI Simulation Console</h3>
              <p className="text-xs text-amber-200">
                Test recommendations under specific atmospheric pollution scenarios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Honest Transparency Notice */}
        <div className="p-4 bg-amber-50 border-b border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Scientific Data Integrity Notice:</span>
            <span>
              BreathePure never invents environmental measurements. Submitting this form creates a clearly-labeled{' '}
              <strong>"Manual Simulation Entry"</strong> for testing guidance against severe winter smog scenarios.
            </span>
          </div>
        </div>

        {/* Quick Scenario Presets */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Scenario Presets:</span>
          <button
            type="button"
            onClick={() => handlePresetScenario(420, 290, 410, 'Delhi Severe Winter Smog')}
            className="text-xs px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold hover:bg-rose-200"
          >
            Severe (AQI 420)
          </button>
          <button
            type="button"
            onClick={() => handlePresetScenario(310, 165, 250, 'Very Poor Winter Inversion')}
            className="text-xs px-2.5 py-1 rounded bg-orange-100 text-orange-800 font-bold hover:bg-orange-200"
          >
            Very Poor (AQI 310)
          </button>
          <button
            type="button"
            onClick={() => handlePresetScenario(160, 68, 120, 'Moderate Post-Monsoon')}
            className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold hover:bg-amber-200"
          >
            Moderate (AQI 160)
          </button>
          <button
            type="button"
            onClick={() => handlePresetScenario(40, 12, 25, 'Clean Coastal Air')}
            className="text-xs px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200"
          >
            Good (AQI 40)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">AQI Scale</label>
              <select
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: e.target.value as AqiScale })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Indian NAQI (CPCB)">Indian NAQI (CPCB Standard)</option>
                <option value="US EPA AQI">US EPA AQI Standard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Simulated AQI Number (0 - 500+)
            </label>
            <input
              type="number"
              min={0}
              max={999}
              value={formData.aqi}
              onChange={(e) => setFormData({ ...formData, aqi: parseInt(e.target.value) || 0 })}
              className="w-full text-sm font-mono font-bold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">PM2.5 (ug/m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.pm2_5 || ''}
                onChange={(e) => setFormData({ ...formData, pm2_5: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">PM10 (ug/m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.pm10 || ''}
                onChange={(e) => setFormData({ ...formData, pm10: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">NO2 (ug/m³)</label>
              <input
                type="number"
                step="0.1"
                value={formData.no2 || ''}
                onChange={(e) => setFormData({ ...formData, no2: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Applying Simulation...' : 'Apply Simulation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
