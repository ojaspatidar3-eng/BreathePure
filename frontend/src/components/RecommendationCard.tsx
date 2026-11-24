import React, { useState } from 'react';
import { RecommendationItem } from '../services/types';
import {
  ShieldCheck,
  Clock,
  Gauge,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

interface RecommendationCardProps {
  item: RecommendationItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingExplainer, setLoadingExplainer] = useState(false);
  const [explainerData, setExplainerData] = useState<any | null>(null);

  const fetchExplainer = async () => {
    if (explainerData) {
      setExpanded(!expanded);
      return;
    }
    setLoadingExplainer(true);
    try {
      const data = await api.getImpactExplanation(item.action);
      setExplainerData(data);
      setExpanded(true);
    } catch (e) {
      console.error(e);
      setExpanded(true);
    } finally {
      setLoadingExplainer(false);
    }
  };

  // Color badges for impact type
  const isExposure = item.impact_type.toLowerCase().includes('exposure');
  const isEmission = item.impact_type.toLowerCase().includes('emission');
  const isDual = item.impact_type.toLowerCase().includes('dual');

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Exposure vs Emission Badge */}
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              isDual
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : isExposure
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            {item.impact_type}
          </span>

          {/* Impact Level */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wide">
            Impact: {item.impact_level}
          </span>

          {/* Difficulty */}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {item.difficulty}
          </span>

          {/* Timeframe */}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {item.timeframe}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
          {item.title}
        </h4>

        {/* Direct Action Step */}
        <p className="text-xs md:text-sm text-slate-800 font-medium mb-3 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60 leading-relaxed">
          {item.action}
        </p>

        {/* Scientific Reason */}
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          <span className="font-semibold text-slate-700">Mechanism: </span>
          {item.reason}
        </p>

        {/* Precaution / Safety Note */}
        {item.safety_note && (
          <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{item.safety_note}</span>
          </div>
        )}
      </div>

      {/* Deep Impact Breakdown Expansion */}
      <div className="border-t border-slate-100 pt-3 mt-1">
        <button
          onClick={fetchExplainer}
          disabled={loadingExplainer}
          className="w-full flex items-center justify-between text-xs font-semibold text-emerald-700 hover:text-emerald-900 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            {loadingExplainer ? 'Deconstructing Impact...' : 'Deconstruct 6-Dimension Impact'}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && explainerData && (
          <div className="mt-3 p-3.5 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-200/70 text-slate-700 animate-fadeIn">
            <div>
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-emerald-800">
                1. Scientific Mechanism
              </span>
              <p className="mt-0.5 leading-relaxed">{explainerData.why_it_matters}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-emerald-800">
                2. Exposure vs. Emission Classification
              </span>
              <p className="mt-0.5 leading-relaxed">{explainerData.exposure_vs_emission}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-emerald-800">
                3. Physiological / Atmospheric Benefit
              </span>
              <p className="mt-0.5 leading-relaxed">{explainerData.impact_mechanism}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Sphere of Benefit</span>
                <p className="font-bold text-slate-800">{explainerData.sphere_of_benefit}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Adoption Feasibility</span>
                <p className="font-bold text-slate-800">{explainerData.difficulty}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
