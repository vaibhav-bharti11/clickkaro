import React, { useState, useEffect } from 'react';
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
import { UserDashboard } from './components/UserDashboard';
import { MyServicesPage } from './components/MyServicesPage';
import { SeekerDashboard } from './components/SeekerDashboard';
import { CompanionDashboard } from './components/CompanionDashboard';
import { BuyServicesModal } from './components/BuyServicesModal';
import { ServiceItem, UserRole, CompanionProfile, BookingContext, ServiceCredit } from './types';
import { ALL_SERVICES } from './data/servicesData';
import { subscribeToAuthChanges } from './services/firebase';

export type AppView = 'landing' | 'dashboard' | 'seeker' | 'companion' | 'my-services';

const DEFAULT_AVAILABLE_CREDITS: ServiceCredit[] = [
  {
    id: 'cred-1',
    serviceId: 'hangout',
    serviceName: 'Hangout Outing',
    displayTitle: 'Hangout Outing Partner',
    price: '₹1,770.00',
    priceNum: 1770,
    purchasedDate: 'Purchased 9/2/2026',
    status: 'available',
  }
];

const DEFAULT_USED_CREDITS: ServiceCredit[] = [
  {
    id: 'used-1',
    serviceId: 'hangout',
    serviceName: 'Hangout Outing',
    displayTitle: 'Hangout (4 Hours)',
    price: '₹1,770.00',
    priceNum: 1770,
    purchasedDate: 'Purchased 8/28/2026',
    bookingCode: 'Booking: #CK-A17337',
    status: 'used',
    bookedCompanion: 'Roshni Punjabi',
  }
];

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('ck_user_role') as UserRole) || null;
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('ck_user_name') || null;
  });
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return localStorage.getItem('ck_user_avatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  });
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [buyServicesModalOpen, setBuyServicesModalOpen] = useState(false);
  const [bookingContext, setBookingContext] = useState<BookingContext | null>(null);
  const [activeHeroSceneIndex, setActiveHeroSceneIndex] = useState(0);

  // WALLET / SERVICE CREDITS STATE (Requested booking flow)
  const [availableCredits, setAvailableCredits] = useState<ServiceCredit[]>(() => {
    const saved = localStorage.getItem('ck_credits');
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_AVAILABLE_CREDITS; }
    }
    return DEFAULT_AVAILABLE_CREDITS;
  });

  const [usedCredits, setUsedCredits] = useState<ServiceCredit[]>(() => {
    const saved = localStorage.getItem('ck_used_credits');
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_USED_CREDITS; }
    }
    return DEFAULT_USED_CREDITS;
  });

  const [activeBookingCredit, setActiveBookingCredit] = useState<ServiceCredit | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
          localStorage.setItem('ck_user_name', user.displayName);
        }
        if (user.photoURL) {
          setUserAvatar(user.photoURL);
          localStorage.setItem('ck_user_avatar', user.photoURL);
        }
        if (user.email) {
          localStorage.setItem('ck_user_email', user.email);
        }
        if (user.phoneNumber) {
          localStorage.setItem('ck_user_phone', user.phoneNumber);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleUpdateAvatar = (newAvatar: string) => {
    setUserAvatar(newAvatar);
    localStorage.setItem('ck_user_avatar', newAvatar);
  };

  // When sign-in or signup completes, direct immediately to the User Dashboard (Image 2)
  const handleRoleSelected = (role: UserRole, name: string, avatarUrl?: string) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('ck_user_role', role);
    }
    if (name) {
      setUserName(name);
      localStorage.setItem('ck_user_name', name);
    }
    if (avatarUrl) {
      setUserAvatar(avatarUrl);
      localStorage.setItem('ck_user_avatar', avatarUrl);
    }
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchMode = (mode: 'seeker' | 'companion' | 'landing') => {
    if (mode === 'landing') {
      setCurrentView('landing');
    } else {
      if (!userName) {
        setAuthModalMode('signin');
        setAuthModalOpen(true);
        return;
      }
      setUserRole(mode);
      localStorage.setItem('ck_user_role', mode);
      setCurrentView(mode);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName(null);
    localStorage.removeItem('ck_user_role');
    localStorage.removeItem('ck_user_name');
    localStorage.removeItem('ck_user_email');
    localStorage.removeItem('ck_user_phone');
    localStorage.removeItem('ck_user_avatar');
    localStorage.removeItem('ck_kyc_verified');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Buy Services Modal (Image 2 replica)
  const handleOpenBuyServices = () => {
    if (!userName) {
      handleOpenAuth('signin');
    } else {
      setBuyServicesModalOpen(true);
    }
  };

  // When a service credit is successfully purchased -> wallet recharged -> opens My Services
  const handlePurchaseSuccess = (newCredit: ServiceCredit) => {
    const updated = [newCredit, ...availableCredits];
    setAvailableCredits(updated);
    localStorage.setItem('ck_credits', JSON.stringify(updated));
    setCurrentView('my-services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When clicking "Book Now" on an available credit in My Services -> takes to Find a Companion
  const handleBookWithCredit = (credit: ServiceCredit) => {
    setActiveBookingCredit(credit);
    setCurrentView('seeker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When clicking "Yes, Confirm Booking" in SeekerDashboard popup -> credit redeemed
  const handleConfirmBooking = (companion: CompanionProfile, credit: ServiceCredit, bookingCode: string) => {
    // 1. Remove from available credits
    const filteredAvailable = availableCredits.filter(c => c.id !== credit.id);
    setAvailableCredits(filteredAvailable);
    localStorage.setItem('ck_credits', JSON.stringify(filteredAvailable));

    // 2. Add to used credits
    const usedEntry: ServiceCredit = {
      ...credit,
      status: 'used',
      bookingCode: `Booking: #${bookingCode}`,
      bookedCompanion: companion.name,
      bookedCompanionAvatar: companion.avatarUrl,
      bookedDate: new Date().toLocaleDateString(),
    };
    const updatedUsed = [usedEntry, ...usedCredits];
    setUsedCredits(updatedUsed);
    localStorage.setItem('ck_used_credits', JSON.stringify(updatedUsed));

    // 3. Clear active credit
    setActiveBookingCredit(null);
  };

  // Unified booking opener for fallback
  const handleOpenBooking = (
    target?: ServiceItem | string | BookingContext,
    extraContext?: Partial<BookingContext>
  ) => {
    if (!userName) {
      handleOpenAuth('signin');
      return;
    }
    let ctx: BookingContext = {};

    if (typeof target === 'string') {
      const matchedService = ALL_SERVICES.find(
        (s) => s.id === target || s.title.toLowerCase() === target.toLowerCase()
      );
      if (matchedService) {
        ctx.service = matchedService;
      } else {
        ctx.companionName = target;
      }
    } else if (target && 'id' in target && 'price' in target) {
      ctx.service = target as ServiceItem;
    } else if (target && typeof target === 'object') {
      ctx = { ...(target as BookingContext) };
    }

    if (extraContext) {
      ctx = { ...ctx, ...extraContext };
    }

    setBookingContext(ctx);
    setBookingModalOpen(true);
  };

  const handleOpenPartnerJoin = () => {
    if (!userName) {
      handleOpenAuth('signup');
    } else {
      setCurrentView('companion');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickSearch = (_query: string) => {
    const citiesEl = document.getElementById('cities');
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

  const isLoggedIn = Boolean(userName);

  return (
    <div className="min-h-screen text-[#1d1d1f] relative selection:bg-pink-300 selection:text-pink-950">
      {/* 0. Ethereal Baby Pink Animated Background & Video Motion Layer */}
      <BackgroundVideo />

      {/* Floating Navbar (Rendered on Landing page) */}
      {currentView === 'landing' && (
        <Navbar 
          onOpenBooking={() => {
            if (!isLoggedIn) handleOpenAuth('signin');
            else setCurrentView('seeker');
          }}
          onOpenPartnerJoin={handleOpenPartnerJoin}
          onOpenSearch={handleOpenSearchModal}
          onOpenAuth={handleOpenAuth}
          currentRole={userRole || undefined}
          userName={userName || undefined}
          userAvatar={userAvatar}
          onUpdateAvatar={handleUpdateAvatar}
          onLogout={handleLogout}
          currentView={currentView}
          onSwitchMode={handleSwitchMode}
        />
      )}

      {/* VIEW 1: UNIFIED USER DASHBOARD */}
      {currentView === 'dashboard' && (
        <UserDashboard 
          userName={userName || 'Member'}
          userAvatar={userAvatar}
          userRole={userRole === 'companion' ? 'Companion' : 'Seeker'}
          onBackToHome={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onBrowseCompanions={() => { setCurrentView('seeker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onBuyServices={handleOpenBuyServices}
          onBecomeCompanion={() => { setCurrentView('companion'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onViewBookings={() => { setCurrentView('my-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onLogout={handleLogout}
          onUpdateAvatar={handleUpdateAvatar}
        />
      )}

      {/* VIEW 2: MY SERVICES / BUY SERVICES (Exact Image 4 + Real Credits) */}
      {currentView === 'my-services' && (
        <MyServicesPage 
          userName={userName || 'Member'}
          userAvatar={userAvatar}
          onBackToDashboard={() => { setCurrentView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onOpenBuyModal={handleOpenBuyServices}
          onBookWithCredit={handleBookWithCredit}
          availableCredits={availableCredits}
          usedCredits={usedCredits}
          onLogout={handleLogout}
        />
      )}

      {/* VIEW 3: FIND A COMPANION (Exact Image 3 + Yes/No Confirmation Popup) */}
      {currentView === 'seeker' && (
        <SeekerDashboard 
          userName={userName || 'Seeker'}
          userAvatar={userAvatar}
          onUpdateAvatar={handleUpdateAvatar}
          onBackToHome={() => { setCurrentView(isLoggedIn ? 'dashboard' : 'landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onSwitchToCompanion={() => { setCurrentView('companion'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onLogout={handleLogout}
          activeCredit={activeBookingCredit}
          availableCredits={availableCredits}
          onConfirmBooking={handleConfirmBooking}
          onOpenBuyServices={handleOpenBuyServices}
          onGoToDashboard={() => { setCurrentView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onViewMyBookings={() => { setCurrentView('my-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      )}

      {/* VIEW 4: COMPANION EARNINGS & REQUESTS DASHBOARD */}
      {currentView === 'companion' && (
        <CompanionDashboard 
          userName={userName || 'Companion'}
          userAvatar={userAvatar}
          onUpdateAvatar={handleUpdateAvatar}
          onBackToHome={() => { setCurrentView(isLoggedIn ? 'dashboard' : 'landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onSwitchToSeeker={() => { setCurrentView('seeker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onLogout={handleLogout}
        />
      )}

      {/* VIEW 5: MAIN LANDING PAGE */}
      {currentView === 'landing' && (
        <main>
          {/* 1. Hero Section */}
          <HeroSection 
            activeSceneIndex={activeHeroSceneIndex}
            onSceneChange={setActiveHeroSceneIndex}
            onOpenBooking={handleOpenBooking}
            onOpenPartnerJoin={handleOpenPartnerJoin}
            onQuickSearch={handleQuickSearch}
            isLoggedIn={isLoggedIn}
            onOpenAuth={handleOpenAuth}
            onNavigateSeeker={() => { setCurrentView('seeker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onNavigateCompanion={() => { setCurrentView('companion'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />

          {/* 2. Operational Cities Section */}
          <LaunchCitiesSection 
            onOpenBooking={handleOpenBooking}
            isLoggedIn={isLoggedIn}
            onOpenAuth={handleOpenAuth}
            onNavigateSeeker={() => { setCurrentView('seeker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />

          {/* 3. High-Conversion Bento Services Grid */}
          <ServicesSection 
            onSelectService={(_svc) => {
              if (!isLoggedIn) handleOpenAuth('signin');
              else handleOpenBuyServices();
            }}
            isLoggedIn={isLoggedIn}
            onOpenAuth={handleOpenAuth}
            onNavigateSeeker={() => { setCurrentView('seeker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />

          {/* 4. Why Choose Us / Trust Blueprint */}
          <WhyChooseUs />

          {/* 5. Real Verified Social Proof Stories */}
          <SuccessStories 
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 6. Realistic Earnings Simulator */}
          <EarningsCalculator 
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 7. Transparent Subscription Pricing */}
          <PricingSection 
            onOpenBooking={() => {
              if (!isLoggedIn) handleOpenAuth('signin');
              else handleOpenBuyServices();
            }}
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />

          {/* 8. Millions Registered Section */}
          <StatsBar />

          {/* 9. FAQs Accordion */}
          <FaqSection 
            onOpenBooking={() => {
              if (!isLoggedIn) handleOpenAuth('signin');
              else setCurrentView('seeker');
            }}
          />

          {/* 10. High-Impact CTA Banner */}
          <CtaBanner 
            onOpenBooking={() => {
              if (!isLoggedIn) handleOpenAuth('signin');
              else setCurrentView('seeker');
            }}
            onOpenPartnerJoin={handleOpenPartnerJoin}
          />
        </main>
      )}

      {/* Footer (Rendered on landing page) */}
      {currentView === 'landing' && (
        <Footer 
          onOpenBooking={() => {
            if (!isLoggedIn) handleOpenAuth('signin');
            else setCurrentView('seeker');
          }}
          onOpenPartnerJoin={handleOpenPartnerJoin}
        />
      )}

      {/* Interactive Modals */}
      <AuthRoleModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSelectRole={handleRoleSelected}
        initialMode={authModalMode}
      />

      {/* Buy Services Modal (Image 2 Replica) */}
      <BuyServicesModal
        isOpen={buyServicesModalOpen}
        onClose={() => setBuyServicesModalOpen(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

      <BookingModal 
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialContext={bookingContext}
        userName={userName || undefined}
      />

      <PartnerJoinModal 
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
      />
    </div>
  );
};

export default App;
