import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LogOut, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';
import { LegalPolicyModal } from './LegalPolicyModal';
import { UpcomingEventsModal } from './UpcomingEventsModal';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenEvents?: () => void;
  currentRole?: UserRole;
  userName?: string;
  userAvatar?: string;
  onUpdateAvatar?: (newAvatar: string) => void;
  onLogout?: () => void;
  currentView: 'landing' | 'seeker' | 'companion';
  onSwitchMode: (mode: 'seeker' | 'companion' | 'landing') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenPartnerJoin: _onOpenPartnerJoin,
  onOpenAuth,
  onOpenEvents,
  userName,
  userAvatar,
  onLogout,
  onSwitchMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'refund' | 'terms'>('privacy');
  const [showEventsModal, setShowEventsModal] = useState(false);

  const handleOpenUpcomingEvents = () => {
    if (onOpenEvents) {
      onOpenEvents();
    } else {
      setShowEventsModal(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Apple-Style Sticky Floating Pill Header */}
      <header 
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 group/header hidden lg:flex justify-center transition-all duration-500 ${
          scrolled ? 'top-3 scale-[0.99]' : 'top-5 scale-100'
        }`}
      >
        {/* Main Translucent Glass Navigation Bar - Compact Apple Floating Pill */}
        <nav 
          aria-label="Main Navigation"
          className="h-15 apple-glass rounded-full inline-flex items-center gap-1.5 sm:gap-2.5 px-5 sm:px-6 shadow-apple-md transition-all duration-300 hover:border-pink-300 border border-pink-200/80"
        >
          {/* 1. Left: Logo */}
          <button 
            onClick={() => onSwitchMode('landing')}
            aria-label="Click Karo Date Karo Home"
            className="flex items-center group/logo apple-focus rounded-full p-0.5 transition text-left cursor-pointer shrink-0"
          >
            <img 
              src="/assets/brand_logo.png" 
              alt="Click Karo Date Karo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105 drop-shadow-xs"
            />
          </button>

          <div className="h-5 w-px bg-pink-200/80 mx-1 shrink-0"></div>

          {/* 2. Services */}
          <a 
            href="#services" 
            onClick={() => onSwitchMode('landing')}
            className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus whitespace-nowrap"
          >
            Services
          </a>

          {/* 3. Upcoming Events (Requested by user) */}
          <button 
            type="button"
            onClick={handleOpenUpcomingEvents}
            className="text-xs sm:text-[13px] font-bold text-[#FF2D55] hover:text-[#E11D48] transition-colors px-3 py-1.5 rounded-full hover:bg-pink-50/80 apple-focus cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D55]" />
            <span>Upcoming Events</span>
          </button>

          {/* 4. About Us */}
          <button 
            type="button"
            onClick={() => setShowAboutModal(true)}
            className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus cursor-pointer whitespace-nowrap"
          >
            About Us
          </button>

          {/* 5. Privacy & Legal Policy */}
          <button 
            type="button"
            onClick={() => { setLegalTab('privacy'); setShowLegalModal(true); }}
            className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus cursor-pointer whitespace-nowrap"
          >
            Privacy Policy
          </button>

          <div className="h-5 w-px bg-pink-200/80 mx-1 shrink-0"></div>

          {/* 6. Sign Up / Login (or Active User Profile Badge) */}
          {userName ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSwitchMode('seeker')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#1d1d1f] text-xs font-bold transition shadow-2xs cursor-pointer whitespace-nowrap"
                title="Open Dashboard"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[10px] font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{userName.split(' ')[0]}</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Log Out of Portal"
                  aria-label="Log Out of Portal"
                  className="w-7 h-7 rounded-full text-[#86868b] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => onOpenAuth('signin')}
              className="bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] text-white text-xs sm:text-[13px] font-bold px-4 py-1.5 rounded-full shadow-apple-sm hover:shadow-apple-md hover:opacity-95 active:scale-95 transition-all apple-focus cursor-pointer whitespace-nowrap"
            >
              Sign Up / Login
            </button>
          )}
        </nav>
      </header>

      {/* Mobile Header */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed top-2.5 left-3 right-3 z-50 h-13 apple-glass rounded-full flex items-center justify-between px-3 sm:px-4 shadow-apple-sm"
      >
        {/* Left: Logo */}
        <button onClick={() => onSwitchMode('landing')} className="flex items-center apple-focus rounded-full p-1 text-left shrink-0 cursor-pointer">
          <img 
            src="/assets/brand_logo.png" 
            alt="Click Karo Date Karo" 
            className="h-8 w-auto object-contain"
          />
        </button>

        {/* Right: Sign Up / Login + Hamburger Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {userName ? (
            <button
              onClick={() => onSwitchMode('seeker')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#1d1d1f] text-[11px] font-bold"
            >
              {userAvatar && <img src={userAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />}
              <span>{userName.split(' ')[0]}</span>
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => onOpenAuth('signin')}
              className="bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs cursor-pointer"
            >
              Sign Up / Login
            </button>
          )}

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="w-8 h-8 rounded-full bg-black/[0.05] text-[#1d1d1f] flex items-center justify-center apple-focus shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed inset-3 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-apple-float border border-pink-200 z-[60] p-6 flex flex-col transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-6'
        }`}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-pink-100">
          <img 
            src="/assets/brand_logo.png" 
            alt="Click Karo Date Karo" 
            className="h-8 w-auto object-contain"
          />
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
            className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-[#1d1d1f] apple-focus cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 overflow-y-auto no-scrollbar">
          {/* 1. Services */}
          <a 
            href="#services" 
            onClick={() => { setMobileMenuOpen(false); onSwitchMode('landing'); }}
            className="text-base font-bold text-[#1d1d1f] hover:text-[#0071e3] transition py-2.5 px-3.5 rounded-2xl hover:bg-pink-50/60 flex items-center justify-between"
          >
            <span>Services</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </a>

          {/* 2. Upcoming Events (Requested by user) */}
          <button 
            type="button"
            onClick={() => { 
              setMobileMenuOpen(false); 
              handleOpenUpcomingEvents();
            }}
            className="text-left text-base font-bold text-[#FF2D55] hover:text-[#E11D48] transition py-2.5 px-3.5 rounded-2xl hover:bg-pink-50/60 flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF2D55]" />
              <span>Upcoming Events</span>
            </span>
            <ArrowRight className="w-4 h-4 text-[#FF2D55]" />
          </button>

          {/* 3. About Us */}
          <button 
            type="button"
            onClick={() => { setMobileMenuOpen(false); setShowAboutModal(true); }}
            className="text-left text-base font-bold text-[#1d1d1f] hover:text-[#0071e3] transition py-2.5 px-3.5 rounded-2xl hover:bg-pink-50/60 flex items-center justify-between cursor-pointer"
          >
            <span>About Us</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* 4. Privacy & IT Act Policy */}
          <button 
            type="button"
            onClick={() => { setMobileMenuOpen(false); setLegalTab('privacy'); setShowLegalModal(true); }}
            className="text-left text-base font-bold text-[#1d1d1f] hover:text-[#0071e3] transition py-2.5 px-3.5 rounded-2xl hover:bg-pink-50/60 flex items-center justify-between cursor-pointer"
          >
            <span>Privacy Policy (IT Act 2000)</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* 5. Refund & Cancellation */}
          <button 
            type="button"
            onClick={() => { setMobileMenuOpen(false); setLegalTab('refund'); setShowLegalModal(true); }}
            className="text-left text-base font-bold text-[#1d1d1f] hover:text-[#0071e3] transition py-2.5 px-3.5 rounded-2xl hover:bg-pink-50/60 flex items-center justify-between cursor-pointer"
          >
            <span>Refund Policy (100% Refund)</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* 6. Sign Up / Login */}
          <div className="pt-6 mt-4 border-t border-pink-100">
            {userName ? (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onSwitchMode('seeker'); }}
                  className="w-full bg-[#111827] text-white py-3 rounded-2xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  Dashboard ({userName})
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="w-full bg-rose-50 text-rose-700 py-3 rounded-2xl font-bold text-xs border border-rose-200 cursor-pointer"
                  >
                    Log Out
                  </button>
                )}
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('signin'); }}
                className="w-full bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md cursor-pointer"
              >
                Sign Up / Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ABOUT US MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <img src="/assets/brand_logo.png" alt="Click Karo Date Karo" className="h-8 w-auto object-contain" />
                <span className="font-display font-bold text-lg text-[#111827]">About Us</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-[#111827]">
                <p className="font-bold text-sm text-[#FF2D55] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF2D55]" />
                  <span>India's Premier Social Companionship Platform</span>
                </p>
                <p className="text-xs text-stone-600">
                  Operated by Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD). Click Karo Date Karo was established to create a secure, dignified, and verified social space where people can find trusted, cultured companions for outings, blockbusters, coffee conversations, dining, and city tours.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#111827] text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Our Core Principles</span>
                </h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>100% Aadhaar &amp; Face Verification:</strong> Every companion undergoes rigorous identity verification before being listed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Safe Public Venues:</strong> Outings are strictly held in public venues like malls, reputable cafes, cinemas, and cultural spots.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Zero Harassment Tolerance:</strong> Transparent code of conduct ensuring mutual respect, clear boundaries, and high dignity.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAboutModal(false)}
                  className="w-full py-3 rounded-2xl bg-[#111827] hover:bg-[#FF2D55] text-white font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEGAL & PRIVACY POLICY MODAL (IT Act, 2000 & IT Rules 2011) */}
      <LegalPolicyModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalTab}
      />

      {/* UPCOMING EVENTS MODAL */}
      <UpcomingEventsModal
        isOpen={showEventsModal}
        onClose={() => setShowEventsModal(false)}
        onBookEventPartner={(_event) => {
          setShowEventsModal(false);
          onOpenBooking();
        }}
      />
    </>
  );
};

export default Navbar;
