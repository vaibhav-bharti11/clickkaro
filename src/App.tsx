import React, { useState } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { CoverageSection } from './components/CoverageSection';
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
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>('');
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleRoleSelected = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name || 'Rahul Sharma');
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
        if (!userName) setUserName('Rahul Sharma');
      }
      setCurrentView(mode);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (service?: ServiceItem) => {
    if (service) {
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
    const coverageEl = document.getElementById('coverage');
    if (coverageEl) {
      coverageEl.scrollIntoView({ behavior: 'smooth' });
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
        currentView={currentView}
        onSwitchMode={handleSwitchMode}
      />

      {/* VIEW 1: SEEKER SWIPE DASHBOARD */}
      {currentView === 'seeker' && (
        <SeekerDashboard 
          userName={userName || 'Rahul'}
          onBackToHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onSwitchToCompanion={() => { setUserRole('companion'); setCurrentView('companion'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onBookCompanion={handleBookFromCompanionCard}
        />
      )}

      {/* VIEW 2: COMPANION EARNINGS & REQUESTS DASHBOARD */}
      {currentView === 'companion' && (
        <CompanionDashboard 
          userName={userName || 'Priya Sharma'}
          onBackToHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onSwitchToSeeker={() => { setUserRole('seeker'); setCurrentView('seeker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      )}

      {/* VIEW 3: MAIN LANDING PAGE */}
      {currentView === 'landing' && (
        <main>
          {/* 1. Hero Section with Kinetic Headline & Live Floating Pill */}
          <HeroSection 
            onOpenBooking={() => handleOpenBooking()}
            onOpenPartnerJoin={handleOpenPartnerJoin}
            onQuickSearch={handleQuickSearch}
          />

          {/* 2. Stats Bar */}
          <StatsBar />

          {/* 3. Coverage Across India & Dual-Panel Niche Simulator */}
          <CoverageSection 
            onOpenBooking={() => handleOpenBooking()}
          />

          {/* 4. Complete Services Catalog (16 Services) */}
          <ServicesSection 
            onSelectService={(service) => handleOpenBooking(service)}
          />

          {/* 5. Why Choose Us (Sticky Side-Nav Trust Blueprint) */}
          <WhyChooseUs />

          {/* 6. Success Stories & Real Earnings */}
          <SuccessStories 
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 7. Earning Opportunity & Interactive Calculator */}
          <EarningsCalculator 
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 8. Pricing Section (Clients & Partner 60% OFF plans) */}
          <PricingSection 
            onOpenBooking={() => handleOpenBooking()}
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

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
