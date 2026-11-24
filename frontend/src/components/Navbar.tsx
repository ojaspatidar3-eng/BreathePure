import React, { useState } from 'react';
import { Logo } from './Logo';
import { UserProfile, AqiReading } from '../services/types';
import {
  Wind,
  Bot,
  CalendarClock,
  Home,
  Layers,
  Users,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  aqiReading: AqiReading | null;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  aqiReading,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Air Dashboard', icon: Wind },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'GenAI' },
    { id: 'routine', label: 'Daily Planner', icon: CalendarClock },
    { id: 'indoor', label: 'Indoor Guide', icon: Home },
    { id: 'alternatives', label: 'Alternatives', icon: Layers },
    { id: 'community', label: 'Family & Community', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => setActiveTab('landing')}>
            <Logo size="md" showTagline={true} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Chips: Profile & AQI */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* User Profile Chip */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[130px] truncate font-semibold">
                {profile.city}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{profile.household_size} p</span>
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            </button>

            {/* Current AQI Quick Pill */}
            {aqiReading && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: aqiReading.category_color }}
              >
                <span>AQI {aqiReading.aqi}</span>
                <span className="text-[10px] font-normal opacity-90 hidden xl:inline">
                  ({aqiReading.category})
                </span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="py-2 mb-2 flex items-center justify-between border-b border-slate-100">
            <button
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-800"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{profile.city} ({profile.household_size} members) — Edit</span>
            </button>
            {aqiReading && (
              <span
                className="text-xs px-2 py-0.5 rounded text-white font-bold"
                style={{ backgroundColor: aqiReading.category_color }}
              >
                AQI {aqiReading.aqi}
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
