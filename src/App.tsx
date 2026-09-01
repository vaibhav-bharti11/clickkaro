import React, { useState } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { LaunchCitiesSection } from './components/LaunchCitiesSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { SuccessStories } from './components/SuccessStories';
import { EarningsCalculator } from './components/EarningsCalculator';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { BookingModal, PartnerJoinModal } from './components/Modals';
import { AuthRoleModal } from './components/AuthRoleModal';
import { SeekerDashboard } from './components/SeekerDashboard';
import { CompanionDashboard } from './components/CompanionDashboard';
import { ServiceItem, UserRole, CompanionProfile } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'seeker' | 'companion'>('landing');
  const [userRole, setUserRole] = useState<UserRole>('seeker');
  const [userName, setUserName] = useState<string>('vaibhav');
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return localStorage.getItem('ck_user_avatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  });
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeHeroSceneIndex, setActiveHeroSceneIndex] = useState(0);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleUpdateAvatar = (newAvatar: string) => {
    setUserAvatar(newAvatar);
    localStorage.setItem('ck_user_avatar', newAvatar);
  };

  const handleRoleSelected = (role: UserRole, name: string, avatarUrl?: string) => {
    setUserRole(role);
    setUserName(name || 'vaibhav');
    if (avatarUrl) {
      setUserAvatar(avatarUrl);
      localStorage.setItem('ck_user_avatar', avatarUrl);
    }
    if (role === 'seeker') {
      setCurrentView('seeker');
    } else if (role === 'companion') {
      setCurrentView('companion');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchMode = (mode: 'seeker' | 'companion' | 'landing') => {
    if (mode === 'landing') {
      setCurrentView('landing');
    } else {
      if (!userRole) {
        setUserRole(mode);
        if (!userName) setUserName('vaibhav');
      }
      setCurrentView(mode);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
    localStorage.removeItem('ck_user_role');
    localStorage.removeItem('ck_user_name');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (service?: ServiceItem | string) => {
    if (typeof service === 'object' && service !== null) {
      setSelectedService(service);
    }
    setBookingModalOpen(true);
  };

  const handleBookFromCompanionCard = (companion: CompanionProfile) => {
    const dummyService: ServiceItem = {
      id: companion.services[0] || 'movie-partner',
      title: `${companion.name} (${companion.badges[0] || 'Companion'})`,
      subtitle: `${companion.city} • Verified Match`,
      pricePerHour: companion.hourlyRate,
      icon: 'ph-user-check',
      emoji: '✨',
      category: 'social',
      description: companion.bio,
    };
    setSelectedService(dummyService);
    setBookingModalOpen(true);
  };

  const handleOpenPartnerJoin = () => {
    setPartnerModalOpen(true);
  };

  const handleQuickSearch = (_query: string) => {
    const citiesEl = document.getElementById('launch-cities');
    if (citiesEl) {
      citiesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSearchModal = () => {
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-[#1d1d1f] relative selection:bg-pink-300 selection:text-pink-950">
      {/* 0. Ethereal Baby Pink Animated Background & Video Motion Layer */}
      <BackgroundVideo />

      {/* Floating Navbar */}
      <Navbar 
        onOpenBooking={() => handleOpenBooking()}
        onOpenPartnerJoin={handleOpenPartnerJoin}
        onOpenSearch={handleOpenSearchModal}
        onOpenAuth={handleOpenAuth}
        currentRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
        onUpdateAvatar={handleUpdateAvatar}
        onLogout={handleLogout}
        currentView={currentView}
        onSwitchMode={handleSwitchMode}
      />

      {/* VIEW 1: SEEKER SWIPE DASHBOARD */}
      {currentView === 'seeker' && (
        <SeekerDashboard 
          userName={userName || 'vaibhav'}
          onBackToHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onSwitchToCompanion={() => { setUserRole('companion'); setCurrentView('companion'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onBookCompanion={handleBookFromCompanionCard}
          onLogout={handleLogout}
        />
      )}

      {/* VIEW 2: COMPANION EARNINGS & REQUESTS DASHBOARD */}
      {currentView === 'companion' && (
        <CompanionDashboard 
          userName="Priya Sharma"
          onBackToHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onSwitchToSeeker={() => { setUserRole('seeker'); setCurrentView('seeker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onLogout={handleLogout}
        />
      )}

      {/* VIEW 3: MAIN LANDING PAGE */}
      {currentView === 'landing' && (
        <main>
          {/* 1. Hero Section with Kinetic Headline & Live Floating Pill */}
          <HeroSection 
            activeSceneIndex={activeHeroSceneIndex}
            onSceneChange={setActiveHeroSceneIndex}
            onOpenBooking={() => handleOpenBooking()}
            onOpenPartnerJoin={handleOpenPartnerJoin}
            onQuickSearch={handleQuickSearch}
          />

          {/* 2. Official 12 Launch Cities (Client Note: Dehradun, Delhi, Gurgaon, Noida, Bangalore, Mumbai, etc.) */}
          <LaunchCitiesSection 
            onOpenBooking={(cityName) => handleOpenBooking(cityName)}
          />

          {/* 3. Complete Services Catalog (including Travel Partner ₹14,999/12h & Coffee Partner ₹1,999/1h) */}
          <ServicesSection 
            onSelectService={(service) => handleOpenBooking(service)}
          />

          {/* 4. Why Choose Us (Sticky Side-Nav Trust Blueprint) */}
          <WhyChooseUs />

          {/* 5. Success Stories & Real Earnings */}
          <SuccessStories 
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 6. Earning Opportunity & Interactive Calculator */}
          <EarningsCalculator 
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 7. Pricing Section with Official ₹999 / 3 Months Subscription */}
          <PricingSection 
            onOpenBooking={() => handleOpenBooking()}
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 8. Millions Registered Section - MOVED TO BOTTOM ABOVE FAQS AS REQUESTED */}
          <StatsBar />

          {/* 9. FAQs Accordion */}
          <FaqSection 
            onOpenBooking={() => handleOpenBooking()}
          />

          {/* 10. High-Impact CTA Banner */}
          <CtaBanner 
            onOpenBooking={() => handleOpenBooking()}
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />
        </main>
      )}

      {/* Footer */}
      <Footer 
        onOpenBooking={() => handleOpenBooking()}
        onOpenPartnerJoin={handleOpenPartnerJoin}
      />

      {/* Interactive Modals */}
      <AuthRoleModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSelectRole={handleRoleSelected}
        initialMode={authModalMode}
      />

      <BookingModal 
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={selectedService}
      />

      <PartnerJoinModal 
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
      />
    </div>
  );
};

export default App;
