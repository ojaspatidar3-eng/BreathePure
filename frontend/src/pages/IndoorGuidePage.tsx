import React, { useState } from 'react';
import {
  Home,
  Wind,
  ShieldAlert,
  Flame,
  Droplets,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export const IndoorGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ventilation' | 'dust' | 'cooking' | 'filtration' | 'smog'>('filtration');

  return (
    <div className="py-4 space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Home className="w-3.5 h-3.5 text-emerald-700" />
          <span>Indoor Environmental Mastery</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Indoor Air Quality Guide for Severe Winter Smog
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          During winter smog episodes, indoor air can become 2 to 5 times more toxic than outdoor air due to
          trapped cooking emissions, aerosolized dust, and infiltration through draft gaps. Learn scientifically-proven
          techniques to isolate and purify your family's living sanctuary.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'filtration', label: '1. HEPA Air Filtration' },
            { id: 'smog', label: '2. Winter Smog Sealing' },
            { id: 'cooking', label: '3. Clean Kitchen Practices' },
            { id: 'dust', label: '4. Dust Elimination' },
            { id: 'ventilation', label: '5. Smart Ventilation Timing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: HEPA Air Filtration */}
      {activeTab === 'filtration' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What Works */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Verified Clean Air Technologies</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">True HEPA (H13 / H14) Filters</h4>
                  <p>
                    Mechanical fibrous filters rated to capture at least 99.97% of particles down to 0.3 microns.
                    Operates purely on physical interception, inertial impaction, and Brownian diffusion without producing
                    by-product gases.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Activated Carbon Adsorption</h4>
                  <p>
                    Essential companion to HEPA for capturing gaseous pollutants: Nitrogen Dioxide (NO2), Volatile Organic
                    Compounds (VOCs), and cooking odor compounds that pass straight through particulate filters.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">CADR (Clean Air Delivery Rate) Sizing</h4>
                  <p>
                    Ensure your unit's CADR rating matches or exceeds room square footage: CADR (CFM) should be at least
                    2/3 of room area in square feet to provide 4-5 air changes per hour.
                  </p>
                </div>
              </div>
            </div>

            {/* What to Avoid */}
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Hazardous Filtration Myths to Avoid</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                  <h4 className="font-bold text-rose-950 text-sm">Ozone Generators & Uncertified Ionizers</h4>
                  <p>
                    Never use ozone machines or ionizers that emit ozone into occupied rooms. Ozone is a potent chemical
                    pulmonary irritant that triggers bronchial spasms and attacks lung tissue cells.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                  <h4 className="font-bold text-rose-950 text-sm">Synthetic Fragrance "Purifying" Sprays</h4>
                  <p>
                    Aerosol sprays and chemical diffusers do not clean air; they volatilize volatile terpenes that react
                    with ambient ozone and NOx to create secondary organic aerosols (fine indoor PM2.5).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                  <h4 className="font-bold text-rose-950 text-sm">Relying on Indoor Plants for Smog</h4>
                  <p>
                    While house plants enhance indoor aesthetics, peer-reviewed research proves botanical air exchange rates
                    are hundreds of times too slow to counteract heavy winter PM2.5 infiltration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Winter Smog Sealing */}
      {activeTab === 'smog' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6 animate-fadeIn">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Creating a Clean-Air Bedroom Sanctuary During Inversion Episodes
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              When ambient AQI enters 'Very Poor' or 'Severe' (exceeding 300), prioritize protecting one dedicated sleeping room
              where family members spend 8 continuous hours breathing resting tidal volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Seal Thermal Draft Gaps</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apply adhesive foam weather-stripping along window frames and sliding balcony doors. Place moist rolled
                towels or draft snakes at the base of exterior doors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Continuous Negative Infiltration Offset</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Run your HEPA air purifier on medium or low speed 24/7 in the sanctuary room. Keeping the door closed creates
                a micro-environment where particulate levels remain 70-80% lower than outdoors.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Combustion Safety Rule</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never operate fuel combustion heaters, gas geysers, or open chulhas inside a sealed room. Carbon monoxide (CO)
                can build up rapidly to lethal levels. Keep a CO detector installed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Clean Kitchen Practices */}
      {activeTab === 'cooking' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6 animate-fadeIn">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Kitchen Combustion Protocols: Shielding Family Living Areas
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Gas stove combustion and high-heat oil frying produce ultra-fine particles (UFPs) and NO2 in concentrations
              that frequently surpass street smog peaks within enclosed kitchens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Pre-Exhaust Protocol</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn on your overhead ducted kitchen chimney or exhaust fan <strong>2 minutes prior</strong> to striking
                the burner flame, and leave it running for 5 minutes after cooking finishes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Covered Lid Frying</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cooking with snug lids traps volatilized fatty oil aerosols and prevents aerosolized oil droplets from
                dispersing throughout bedroom hallways and fabrics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Door Isolation Barrier</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep the kitchen door closed to the main living area during cooking while opening an external window slightly
                to allow clean replacement air to feed the exhaust hood.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Induction Hotplate Transition</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Switching routine boiling and simmering to electric induction eliminates naked methane combustion, stopping
                indoor Nitrogen Dioxide release at the source.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Dust Elimination */}
      {activeTab === 'dust' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6 animate-fadeIn">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Dust Suppression: Wet Mopping vs. Resuspension Mechanics
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Coarse and fine dust settling on floors contains brake wear debris, silica, and heavy metals. Traditional
              cleaning habits frequently worsen indoor air quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Recommended: Damp Microfiber Mopping
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Microfiber pads use capillary attraction and moisture to lock toxic settled dust onto the fabric fibers,
                permanently removing it from the floor without launching particles into the air.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                Avoid: Dry Broom Sweeping & Feather Dusting
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Dry brooms mechanically fracture and pulverize particulate clusters, lofting PM10 and PM2.5 right into
                the breathing zone of toddlers and pets for hours after sweeping.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Smart Ventilation Timing */}
      {activeTab === 'ventilation' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 space-y-6 animate-fadeIn">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">
              Solar Boundary Layer Dispersion: When to Open Windows
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ventilation during winter smog must be timed strictly around solar heating convection to avoid inviting
              heavy street smog into your home.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-950">NEVER Ventilate: 05:00 - 09:30 AM & 18:00 - 21:30 PM</h4>
                <p className="text-xs text-rose-900 mt-0.5 leading-relaxed">
                  Morning and evening temperature inversions trap surface vehicular exhaust and biomass smoke at ground
                  level. Opening windows during these hours floods the home with peak toxic PM2.5.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Optimal Window: 13:00 - 15:30 PM (Midday Solar Window)</h4>
                <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                  Solar heating warms the ground, breaking the thermal lid and causing upward convective currents that
                  disperse particulate concentrations. Brief 15-20 minute cross-ventilation during this window flushes
                  accumulated indoor CO2 while outdoor PM2.5 is at daily minimum.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
