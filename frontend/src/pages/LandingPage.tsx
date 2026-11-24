import React from 'react';
import { Logo } from '../components/Logo';
import {
  Wind,
  Bot,
  CalendarClock,
  Home,
  Layers,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CloudFog,
  Activity,
  HeartPulse,
  Leaf
} from 'lucide-react';

interface LandingPageProps {
  onLaunchAssistant: () => void;
  onExploreDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchAssistant,
  onExploreDashboard,
}) => {
  return (
    <div className="space-y-24 py-6 md:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-forest-950 via-emerald-950 to-slate-950 text-white p-8 md:p-16 shadow-2xl border border-emerald-900/60">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-mint-400" />
            <span>Hack2Skill Prompt Wars — Challenge 6: Urban Air Quality Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Smarter Air.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-300 via-emerald-400 to-teal-300">
              Healthier Life.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            BreathePure is an intelligent environmental companion engineered to help families and communities
            navigate severe winter smog, understand urban air pollution, drastically reduce personal toxic exposure,
            and adopt cleaner low-emission daily routines through verified telemetry and contextual GenAI.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onLaunchAssistant}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all hover:gap-3"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>Launch AI Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDashboard}
              className="px-6 py-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-700/60 backdrop-blur-md flex items-center gap-2 transition-colors"
            >
              <Wind className="w-4 h-4 text-emerald-300" />
              <span>Live Air Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 border-t border-emerald-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Standard</span>
              <span className="font-bold text-white text-sm">Indian CPCB NAQI</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">AI Architecture</span>
              <span className="font-bold text-white text-sm">Gemini + Demo Engine</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Impact Framing</span>
              <span className="font-bold text-mint-300 text-sm">Exposure vs. Emission</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Data Truth</span>
              <span className="font-bold text-white text-sm">Zero Fabricated Numbers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Awareness: Winter Smog Science */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/90 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <CloudFog className="w-4 h-4" />
            <span>Atmospheric Science Focus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Why Severe Winter Smog is a Silent Urban Crisis
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Every winter across urban corridors, atmospheric temperature inversion acts as a suffocating thermal lid.
            Cold air is trapped beneath a warmer boundary layer, holding vehicle exhaust, biomass smoke, and industrial
            particulates right at pedestrian breathing level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 w-fit">
              <CloudFog className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">PM2.5 Alveolar Penetration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Particles smaller than 2.5 microns bypass nasal cilia and bronchial mucous filters, embedding deep into
              alveolar capillary membranes and crossing into blood circulation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 w-fit">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Nocturnal Inversion Trap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ground-level pollution peaks between dawn and 09:00 AM, precisely when citizens embark on morning walks
              and school runs. Strenuous outdoor breathing during dawn multiplies alveolar toxic deposition.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Exposure vs. Emission Dual-Shield</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Solving air quality requires both sides of the equation: immediate exposure reduction to protect your family
              now, alongside sustainable alternative habits to curb community emissions permanently.
            </p>
          </div>
        </div>
      </section>

      {/* 6 Core Product Modules Overview */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Engineered Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            A Genuinely Functional Clean-Air System
          </h2>
          <p className="text-sm text-slate-600">
            Every section directly contributes to the official challenge objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Wind,
              title: 'Live Air Quality Dashboard',
              desc: 'Telemetry with CPCB Indian NAQI sub-indices, individual pollutant benchmarks, and transparent manual simulation entry.',
            },
            {
              icon: Bot,
              title: 'GenAI Air Quality Assistant',
              desc: 'Conversational assistant with prompt injection defense, dynamic context injection, and structured 8-field JSON recommendations.',
            },
            {
              icon: CalendarClock,
              title: 'Smart Daily Routine Planner',
              desc: 'Personalized 5-slot schedule: Morning, Commute, Afternoon, Evening, and Night Recovery adapted to local AQI severity.',
            },
            {
              icon: Home,
              title: 'Indoor Air Quality Mastery',
              desc: 'Evidence-based guidance on damp mopping, kitchen exhaust protocols, true HEPA filtration, and thermal inversion bedroom sealing.',
            },
            {
              icon: Layers,
              title: 'Sustainable Alternatives Engine',
              desc: 'Rigorous qualitative comparisons: private transit vs metro rail, leaf burning vs composting, and biomass vs induction cooking.',
            },
            {
              icon: Users,
              title: 'Family & Community Mode',
              desc: 'Targeted precautions for infants, seniors, and school runs, plus neighborhood clean-air monitoring and educational guides.',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works: 3-Step Clean Air Path */}
      <section className="bg-emerald-950 text-white rounded-3xl p-8 md:p-12 border border-emerald-900">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-mint-400">
            Intelligent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How BreathePure Safeguards You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-mint-300 font-extrabold flex items-center justify-center text-sm mx-auto md:mx-0">
              1
            </div>
            <h3 className="font-bold text-base text-white">Profile & Telemetry Grounding</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              We ingest your city's verified atmospheric readings alongside your commute mode, household size, and
              vulnerabilities (asthma, children, elderly).
            </p>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-mint-300 font-extrabold flex items-center justify-center text-sm mx-auto md:mx-0">
              2
            </div>
            <h3 className="font-bold text-base text-white">10x Prompt Engineering Pipeline</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Our backend applies negative constraints, few-shot exemplars, prompt injection defense, and schema validation
              to formulate verified actions.
            </p>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-mint-300 font-extrabold flex items-center justify-center text-sm mx-auto md:mx-0">
              3
            </div>
            <h3 className="font-bold text-base text-white">Actionable Impact Deconstruction</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Every recommendation clarifies whether it reduces your personal inhalation or prevents shared emissions,
              breaking down difficulty and feasibility.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="text-center py-6 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ready to take charge of your air quality?
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Start exploring real-time telemetry or launch the GenAI assistant with your customized household profile.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onLaunchAssistant}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Launch AI Assistant
          </button>
          <button
            onClick={onExploreDashboard}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
          >
            Open Air Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};
