import React from 'react';
import { PollutantData } from '../services/types';
import { Activity, Wind, CloudFog, Flame, Droplets, Sun } from 'lucide-react';

interface PollutantDetailsProps {
  pollutants: PollutantData;
}

interface PollutantConfig {
  key: keyof PollutantData;
  name: string;
  chemical: string;
  unit: string;
  safeLimit: number;
  icon: any;
  description: string;
}

export const PollutantDetails: React.FC<PollutantDetailsProps> = ({ pollutants }) => {
  const configs: PollutantConfig[] = [
    {
      key: 'pm2_5',
      name: 'Fine Particulate Matter',
      chemical: 'PM2.5',
      unit: 'ug/m³',
      safeLimit: 30, // CPCB 24-hr standard
      icon: CloudFog,
      description: 'Microscopic particles (<2.5um) penetrating deep into alveolar tissue and the bloodstream.',
    },
    {
      key: 'pm10',
      name: 'Coarse Particulates',
      chemical: 'PM10',
      unit: 'ug/m³',
      safeLimit: 60, // CPCB 24-hr standard
      icon: Wind,
      description: 'Road dust, construction silt, and soot causing upper respiratory tract irritation.',
    },
    {
      key: 'no2',
      name: 'Nitrogen Dioxide',
      chemical: 'NO₂',
      unit: 'ug/m³',
      safeLimit: 40,
      icon: Flame,
      description: 'Emitted from motor vehicle engines and gas cooking; inflames bronchial airways.',
    },
    {
      key: 'so2',
      name: 'Sulfur Dioxide',
      chemical: 'SO₂',
      unit: 'ug/m³',
      safeLimit: 40,
      icon: Droplets,
      description: 'Combustion of coal and diesel; potent trigger for bronchoconstriction in asthma.',
    },
    {
      key: 'co',
      name: 'Carbon Monoxide',
      chemical: 'CO',
      unit: 'mg/m³',
      safeLimit: 2.0,
      icon: Activity,
      description: 'Incomplete combustion of fuels; reduces oxygen delivery in arterial hemoglobin.',
    },
    {
      key: 'o3',
      name: 'Ground-level Ozone',
      chemical: 'O₃',
      unit: 'ug/m³',
      safeLimit: 50,
      icon: Sun,
      description: 'Formed when NOx and VOCs react in sunlight; causes sharp lung irritation and coughing.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Pollutant Chemical Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time concentration benchmarked against Indian CPCB National Ambient Standards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((cfg) => {
          const val = pollutants[cfg.key];
          const hasVal = val !== undefined && val !== null;
          const numVal = hasVal ? (val as number) : 0;
          const isOverLimit = hasVal && numVal > cfg.safeLimit;
          const ratio = hasVal ? Math.min((numVal / (cfg.safeLimit * 2.5)) * 100, 100) : 0;
          const Icon = cfg.icon;

          return (
            <div
              key={cfg.chemical}
              className={`rounded-xl p-4 border transition-all ${
                isOverLimit
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : 'bg-slate-50/70 border-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isOverLimit ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900">{cfg.chemical}</span>
                    <span className="text-[10px] block text-slate-500 font-medium">{cfg.name}</span>
                  </div>
                </div>

                <div className="text-right">
                  {hasVal ? (
                    <div className="flex items-baseline gap-0.5">
                      <span className={`text-lg font-bold font-mono ${isOverLimit ? 'text-amber-800' : 'text-slate-800'}`}>
                        {typeof numVal === 'number' && !Number.isInteger(numVal) ? numVal.toFixed(1) : numVal}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">{cfg.unit}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unavailable</span>
                  )}
                </div>
              </div>

              {/* Progress meter vs safe benchmark */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-2.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ratio > 70 ? 'bg-rose-500' : ratio > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${ratio}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2">
                <span>CPCB Limit: {cfg.safeLimit} {cfg.unit}</span>
                {hasVal && (
                  <span className={`font-semibold ${isOverLimit ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {numVal > cfg.safeLimit ? `${(numVal / cfg.safeLimit).toFixed(1)}x Limit` : 'Within Limit'}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                {cfg.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
