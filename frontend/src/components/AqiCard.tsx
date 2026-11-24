import React from 'react';
import { AqiReading } from '../services/types';
import {
  ShieldAlert,
  Clock,
  Radio,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

interface AqiCardProps {
  reading: AqiReading | null;
  loading: boolean;
  onOpenManualEntry: () => void;
}

export const AqiCard: React.FC<AqiCardProps> = ({
  reading,
  loading,
  onOpenManualEntry,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-100 rounded-xl mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-800">Air Quality Data Unavailable</h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Unable to retrieve telemetry. You can enter an AQI reading manually for simulation.
        </p>
        <button
          onClick={onOpenManualEntry}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg"
        >
          Enter Manual AQI
        </button>
      </div>
    );
  }

  const isSevereOrVeryPoor = reading.aqi > 300;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Top Banner: Status & Attribution */}
      <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {reading.is_live ? (
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Station Telemetry
            </span>
          ) : reading.is_manual ? (
            <span className="flex items-center gap-1.5 font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Manual Simulation Entry
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Offline Educational Baseline
            </span>
          )}
          <span className="text-slate-400 font-mono hidden sm:inline">|</span>
          <span className="text-slate-500 truncate max-w-xs">{reading.data_source}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            {reading.timestamp.replace('T', ' ').slice(0, 16)} UTC
          </span>
          <button
            onClick={onOpenManualEntry}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium text-xs bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors"
          >
            <Sliders className="w-3 h-3" />
            <span>Simulate AQI</span>
          </button>
        </div>
      </div>

      {/* Main Metric Section */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Big AQI Gauge Display */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
              {reading.city}, {reading.country}
            </span>

            <div className="flex items-baseline gap-3 my-1">
              <span
                className="text-6xl md:text-7xl font-extrabold tracking-tight"
                style={{ color: reading.category_color }}
              >
                {reading.aqi}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {reading.scale}
                </span>
                <span
                  className="inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: reading.category_color }}
                >
                  {reading.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Dominant Toxic Factor:{' '}
              <span className="font-bold text-slate-700">{reading.dominant_pollutant}</span>
            </p>
          </div>

          {/* Right Column: Health Guidance & Caution */}
          <div className="lg:col-span-7 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                Atmospheric Health Impact
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {reading.general_health_message}
              </p>
            </div>

            <div className="border-t border-slate-200/70 pt-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Immediate Action Precaution
              </h4>
              <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                {reading.cautionary_statement}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Callout if Manual / Sample */}
        {reading.data_disclaimer && (
          <div className="mt-5 p-3 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{reading.data_disclaimer}</span>
          </div>
        )}
      </div>
    </div>
  );
};
