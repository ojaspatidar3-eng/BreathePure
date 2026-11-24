import React, { useState, useEffect } from 'react';
import { SustainableComparison } from '../services/types';
import { api } from '../services/api';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

export const SustainableAlternativesPage: React.FC = () => {
  const [comparisons, setComparisons] = useState<SustainableComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    api
      .getSustainableAlternatives()
      .then((data) => {
        setComparisons(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(comparisons.map((c) => c.category))];

  const filtered = selectedCategory === 'All'
    ? comparisons
    : comparisons.filter((c) => c.category === selectedCategory);

  return (
    <div className="py-4 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-emerald-700" />
          <span>Factual Habit Transformation</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sustainable Alternatives & Qualitative Impact
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Compare conventional high-emission urban habits against verified sustainable alternatives. In accordance with
          scientific integrity principles, BreathePure explains environmental and physiological advantages qualitatively
          and factually without fabricating unsupported percentage claims.
        </p>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Comparisons Stream */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading sustainable comparisons...
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-2xs space-y-5"
            >
              {/* Category Pill */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">Comparative Analysis</span>
              </div>

              {/* Side-by-side Conventional vs Alternative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conventional Habit */}
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wide">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Conventional Habit</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.conventional_habit}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-700">Pollution Mechanism: </strong>
                    {item.pollution_mechanism}
                  </p>
                </div>

                {/* Sustainable Alternative */}
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sustainable Clean-Air Alternative</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.sustainable_alternative}</h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    <strong className="text-emerald-900">Adoption Feasibility: </strong>
                    {item.practicality}
                  </p>
                </div>
              </div>

              {/* Dual Impact Breakdown Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-cyan-50/70 border border-cyan-100 space-y-1">
                  <span className="font-bold text-cyan-900 text-[10px] uppercase block tracking-wider">
                    Personal Exposure Impact:
                  </span>
                  <p className="text-slate-700">{item.exposure_impact}</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <span className="font-bold text-emerald-900 text-[10px] uppercase block tracking-wider">
                    Airshed Emission Impact:
                  </span>
                  <p className="text-slate-700">{item.emission_impact}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 text-[10px] uppercase block tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-600" />
                    Community Benefit:
                  </span>
                  <p className="text-slate-700">{item.community_benefit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
