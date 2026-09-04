import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LogOut, ShieldCheck, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentRole?: UserRole;
  userName?: string;
  userAvatar?: string;
  onUpdateAvatar?: (newAvatar: string) => void;
  onLogout?: () => void;
  currentView: 'landing' | 'seeker' | 'companion';
  onSwitchMode: (mode: 'seeker' | 'companion' | 'landing') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  userName,
  userAvatar,
  onLogout,
  onSwitchMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
          className="h-15 apple-glass rounded-full inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 shadow-apple-md transition-all duration-300 hover:border-pink-300 border border-pink-200/80"
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

          {/* 3. About Us */}
          <button 
            type="button"
            onClick={() => setShowAboutModal(true)}
            className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus cursor-pointer whitespace-nowrap"
          >
            About Us
          </button>

          {/* 4. Privacy Policy */}
          <button 
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus cursor-pointer whitespace-nowrap"
          >
            Privacy Policy
          </button>

          <div className="h-5 w-px bg-pink-200/80 mx-1 shrink-0"></div>

          {/* 5. Sign Up / Login (or Active User Profile Badge) */}
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

          {/* 2. About Us */}
          <button 
            type="button"
            onClick={() => { setMobileMenuOpen(false); setShowAboutModal(true); }}
            className="text-left text-base font-bold text-[#1d1d1f] hover:text-[#0071e3] transition py-2.5 px-3.5 rounded-2xl hover:bg-pink-50/60 flex items-center justify-between cursor-pointer"
          >
            <span>About Us</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* 3. Privacy Policy */}
          <button 
            type="button"
            onClick={() => { setMobileMenuOpen(false); setShowPrivacyModal(true); }}
            className="text-left text-base font-bold text-[#1d1d1f] hover:text-[#0071e3] transition py-2.5 px-3.5 rounded-2xl hover:bg-pink-50/60 flex items-center justify-between cursor-pointer"
          >
            <span>Privacy Policy</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* 4. Sign Up / Login */}
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
                  Click Karo Date Karo was established with a singular vision: to create a secure, dignified, and verified social space where people can find trusted, cultured companions for outings, movie screenings, coffee conversations, dining, and city tours.
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
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Direct Connect &amp; No Hidden Fees:</strong> Direct phone call coordination after mutual confirmation with zero extra commission.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#111827] text-sm mb-1.5">Live Across 10 Operational Cities</h4>
                <p className="text-xs text-stone-500">
                  Delhi NCR, Mumbai, Bangalore, Chandigarh, Dehradun, Gurgaon, Noida, Jaipur, Meerut, and Indore.
                </p>
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

      {/* PRIVACY POLICY MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#0071e3]" />
                <span className="font-display font-bold text-lg text-[#111827]">Privacy &amp; Safety Policy</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              <p className="text-xs text-stone-500">
                Last Updated: September 2026. Click Karo Date Karo is dedicated to safeguarding the confidentiality, safety, and personal data of every seeker and companion.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-[#111827] text-xs mb-1">1. Phone Number &amp; Contact Masking</h5>
                  <p className="text-xs text-stone-600">
                    Your personal mobile number and private contacts are never publicly viewable on open profiles. Companion and client numbers are only unlocked between the two confirmed parties upon booking acceptance.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-[#111827] text-xs mb-1">2. Identity &amp; KYC Protection</h5>
                  <p className="text-xs text-stone-600">
                    Aadhaar records and live face verifications are encrypted under strict compliance with Indian IT Act provisions. Documents are exclusively used for safety auditing and are never sold or marketed.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-[#111827] text-xs mb-1">3. Payment &amp; Wallet Security</h5>
                  <p className="text-xs text-stone-600">
                    All payment transactions, subscription recharges, and payouts use RBI-authorized payment gateways (UPI, Razorpay, NetBanking) protected by 256-bit SSL encryption. We never store credit card or CVV details.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-[#111827] text-xs mb-1">4. Zero Third-Party Data Selling</h5>
                  <p className="text-xs text-stone-600">
                    We maintain a strict zero-sharing policy: your activity history, location logs, and communication details are never sold, rented, or distributed to advertising networks.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full py-3 rounded-2xl bg-[#111827] hover:bg-[#0071e3] text-white font-bold text-xs transition cursor-pointer"
                >
                  I Understand &amp; Agree
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
