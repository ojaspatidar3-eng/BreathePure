import React, { useState, useEffect } from 'react';
import { UserProfile, AqiReading } from './services/types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { RoutinePlannerPage } from './pages/RoutinePlannerPage';
import { IndoorGuidePage } from './pages/IndoorGuidePage';
import { SustainableAlternativesPage } from './pages/SustainableAlternativesPage';
import { FamilyCommunityPage } from './pages/FamilyCommunityPage';
import { OnboardingModal } from './pages/OnboardingModal';
import { ManualAqiModal } from './pages/ManualAqiModal';

const DEFAULT_PROFILE: UserProfile = {
  country: 'India',
  city: 'New Delhi',
  area: 'Central Urban Area',
  household_size: 4,
  primary_transportation: 'Public Transit (Metro/Bus)',
  cooking_fuel: 'LPG Cylinder',
  daily_outdoor_activity: 'Moderate (1-3 hours)',
  work_routine: 'Office Commuter',
  has_children: true,
  has_elderly: true,
  has_respiratory_sensitivity: false,
  primary_concerns: ['Winter Smog', 'Children Health', 'Commute Exposure'],
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('breathe_pure_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROFILE;
  });

  const [aqiReading, setAqiReading] = useState<AqiReading | null>(null);
  const [loadingAqi, setLoadingAqi] = useState<boolean>(true);

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [manualAqiModalOpen, setManualAqiModalOpen] = useState<boolean>(false);

  // Fetch AQI on city change or mount
  useEffect(() => {
    fetchAqiData(profile.city, profile.country);
  }, [profile.city, profile.country]);

  const fetchAqiData = async (city: string, country: string = 'India') => {
    setLoadingAqi(true);
    try {
      const data = await api.getAqi(city, country);
      setAqiReading(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAqi(false);
    }
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('breathe_pure_user_profile', JSON.stringify(newProfile));
    if (newProfile.city !== profile.city) {
      fetchAqiData(newProfile.city, newProfile.country);
    }
  };

  const handleSearchCity = (city: string) => {
    const updated = { ...profile, city };
    handleSaveProfile(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        aqiReading={aqiReading}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onLaunchAssistant={() => setActiveTab('assistant')}
            onExploreDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            reading={aqiReading}
            loading={loadingAqi}
            profile={profile}
            onRefresh={() => fetchAqiData(profile.city, profile.country)}
            onSearchCity={handleSearchCity}
            onOpenManualEntry={() => setManualAqiModalOpen(true)}
            onOpenProfile={() => setProfileModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantPage
            profile={profile}
            aqiReading={aqiReading}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {activeTab === 'routine' && (
          <RoutinePlannerPage
            profile={profile}
            aqiReading={aqiReading}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {activeTab === 'indoor' && <IndoorGuidePage />}

        {activeTab === 'alternatives' && <SustainableAlternativesPage />}

        {activeTab === 'community' && <FamilyCommunityPage />}
      </main>

      {/* Modals */}
      <OnboardingModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <ManualAqiModal
        isOpen={manualAqiModalOpen}
        onClose={() => setManualAqiModalOpen(false)}
        onReadingUpdated={(updated) => setAqiReading(updated)}
        currentCity={profile.city}
        currentCountry={profile.country}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
