import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Sparkles, HeartHandshake, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="brightness-110">
              <Logo size="md" showTagline={true} />
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              BreathePure is an intelligent environmental companion engineered for families and communities
              to navigate severe winter smog and urban air pollution through contextual AI-powered recommendations.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                Hack2Skill Prompt Wars — Challenge 6
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                CPCB Standard NAQI
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                Google Gemini API
              </span>
            </div>
          </div>

          {/* Environmental Commitment */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Transparency & Ethics
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero fabricated air quality numbers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exposure vs. Emission distinction</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Non-clinical, preventative safety scope</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic demo mode fallback</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Challenge Info */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Competition Track
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Challenge 6: Urban Air Quality Assistant. Built with React, Vite, TypeScript, Tailwind CSS, FastAPI, and Pydantic.
            </p>
            <div className="text-[11px] text-slate-500">
              Open-Meteo Global Atmospheric Telemetry & CPCB Breakpoint Sub-Indices.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BreathePure. Smarter Air. Healthier Life.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Built with environmental conscience and scientific rigor</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
