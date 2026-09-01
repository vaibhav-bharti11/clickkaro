import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ArrowRight, RefreshCw, Camera, LogOut } from 'lucide-react';
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
  onOpenBooking,
  onOpenPartnerJoin,
  onOpenSearch,
  onOpenAuth,
  currentRole,
  userName,
  userAvatar,
  onUpdateAvatar,
  onLogout,
  currentView,
  onSwitchMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateAvatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 group/header hidden lg:block w-full max-w-5xl px-4 transition-all duration-500 ${
          scrolled ? 'top-3 scale-[0.99]' : 'top-5 scale-100'
        }`}
      >
        <div className="flex flex-col gap-2">
          {/* Main Translucent Glass Navigation Bar */}
          <nav 
            aria-label="Main Navigation"
            className="h-16 apple-glass rounded-full flex items-center justify-between px-4 shadow-apple-md transition-all duration-300 hover:border-pink-300"
          >
            {/* Left: Brand Monogram & Name */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onSwitchMode('landing')}
                aria-label="Click Karo Date Karo Home"
                className="flex items-center gap-2.5 group/logo apple-focus rounded-full p-1 transition text-left"
              >
                <img 
                  src="/assets/brand_logo.png" 
                  alt="Click Karo Date Karo" 
                  className="h-11 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105 drop-shadow-xs"
                />
              </button>

              <div className="h-5 w-px bg-pink-200 mx-1"></div>

              {/* Navigation Links (Bold, High-Contrast Typography) */}
              <div className="flex items-center gap-1">
                <a 
                  href="#services" 
                  onClick={() => onSwitchMode('landing')}
                  className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3.5 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus"
                >
                  Services
                </a>
                <a 
                  href="#launch-cities" 
                  onClick={() => onSwitchMode('landing')}
                  className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3.5 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus"
                >
                  Launch Cities
                </a>
                <a 
                  href="#earnings" 
                  onClick={() => onSwitchMode('landing')}
                  className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3.5 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus"
                >
                  Earnings
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => onSwitchMode('landing')}
                  className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3.5 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus"
                >
                  Pricing
                </a>
                <a 
                  href="#faq" 
                  onClick={() => onSwitchMode('landing')}
                  className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3.5 py-1.5 rounded-full hover:bg-black/[0.04] apple-focus"
                >
                  FAQ
                </a>
              </div>
            </div>

            {/* Right: Dual-Mode Switcher & Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenSearch}
                aria-label="Search pin codes or services"
                className="w-9 h-9 rounded-full text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:bg-pink-50 transition-all flex items-center justify-center apple-focus"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* DUAL MODE INSTANT SWITCHER PILL WITH USER AVATAR */}
              {currentRole ? (
                <div className="flex items-center bg-white/95 p-1 rounded-full border border-pink-200 shadow-sm backdrop-blur-md">
                  {/* User Profile Avatar & Name */}
                  <div className="flex items-center gap-2 pl-1 pr-2.5 py-0.5 border-r border-pink-200/80">
                    <label 
                      htmlFor="nav-desktop-avatar-upload" 
                      className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 cursor-pointer group/avatar ring-2 ring-pink-200 hover:ring-[#0071E3] transition shadow-xs"
                      title="Click to change profile photo"
                    >
                      {userAvatar ? (
                        <img 
                          src={userAvatar} 
                          alt={userName || 'User Profile'} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#0071E3] to-[#FF2D55] text-white flex items-center justify-center text-[10px] font-bold">
                          {userName ? userName.charAt(0).toUpperCase() : 'V'}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition">
                        <Camera className="w-2.5 h-2.5 text-white" />
                      </div>
                    </label>
                    <input 
                      id="nav-desktop-avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />

                    {userName && (
                      <span className="text-[11px] font-bold text-[#1d1d1f] tracking-tight">
                        {userName.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSwitchMode('seeker')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 apple-focus ${
                      currentView === 'seeker'
                        ? 'bg-[#0071e3] text-white shadow-xs'
                        : 'text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
                    }`}
                  >
                    <span>Seeker</span>
                  </button>
                  <button
                    onClick={() => onSwitchMode('companion')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 apple-focus ${
                      currentView === 'companion'
                        ? 'bg-[#1d1d1f] text-white shadow-xs'
                        : 'text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
                    }`}
                  >
                    <span>Companion</span>
                  </button>

                  {/* Log Out of Portal Button */}
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      title="Log Out of Portal"
                      aria-label="Log Out of Portal"
                      className="w-6 h-6 rounded-full text-[#86868b] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition ml-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => onOpenAuth('signin')}
                  className="text-xs sm:text-[13px] font-bold text-[#1d1d1f] hover:text-[#0071e3] px-4 py-2 rounded-full border border-pink-200 hover:border-pink-300 hover:bg-white transition-all apple-focus"
                >
                  Sign In / Join
                </button>
              )}

              <button 
                onClick={onOpenBooking}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-[13px] font-bold px-4 py-2 rounded-full shadow-apple-sm hover:shadow-apple-md active:scale-95 transition-all flex items-center gap-1.5 apple-focus"
              >
                <span>Find Companion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed top-2.5 left-3 right-3 z-50 h-13 apple-glass rounded-full flex items-center justify-between px-3 sm:px-4 shadow-apple-sm"
      >
        <button onClick={() => onSwitchMode('landing')} className="flex items-center gap-1.5 apple-focus rounded-full p-1 text-left shrink-0">
          <img 
            src="/assets/brand_logo.png" 
            alt="Click Karo Date Karo" 
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          {currentRole ? (
            <div className="flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full border border-pink-200 shadow-xs">
              {userAvatar && (
                <img 
                  src={userAvatar} 
                  alt={userName || 'User'} 
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-pink-200"
                />
              )}
              <button 
                onClick={() => onSwitchMode(currentView === 'seeker' ? 'companion' : 'seeker')}
                className="bg-[#1d1d1f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>{currentView === 'seeker' ? 'Seeker' : 'Partner'}</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Log Out"
                  aria-label="Log Out"
                  className="w-5 h-5 rounded-full text-[#86868b] hover:text-rose-600 flex items-center justify-center ml-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <button 
              onClick={() => onOpenAuth('signin')}
              className="bg-pink-100 text-pink-900 text-[11px] font-bold px-2.5 py-1 rounded-full"
            >
              Sign In
            </button>
          )}

          <button 
            onClick={onOpenBooking}
            className="bg-[#0071e3] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm active:scale-95 apple-focus whitespace-nowrap"
          >
            Book
          </button>

          <button 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="w-8 h-8 rounded-full bg-black/[0.05] text-[#1d1d1f] flex items-center justify-center apple-focus shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed inset-3 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-apple-float border border-pink-200 z-[60] p-6 flex flex-col transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-6'
        }`}
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#1d1d1f] text-white rounded-full flex items-center justify-center font-serif text-base font-bold">
              CK
            </div>
            <div>
              <div className="text-sm font-bold text-[#1d1d1f]">Click Karo Date Karo</div>
              <div className="text-[10px] text-[#86868b]">India's #1 Support Platform</div>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
            className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-[#1d1d1f] apple-focus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {/* Dual Role Switch in Mobile Menu */}
          <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-200">
            <div className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider mb-2">Switch Active View</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onSwitchMode('seeker'); }}
                className={`py-2 rounded-xl text-xs font-bold transition text-center ${
                  currentView === 'seeker' ? 'bg-[#0071e3] text-white' : 'bg-white text-[#1d1d1f] border border-pink-200'
                }`}
              >
                Seeker Hub
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onSwitchMode('companion'); }}
                className={`py-2 rounded-xl text-xs font-bold transition text-center ${
                  currentView === 'companion' ? 'bg-[#1d1d1f] text-white' : 'bg-white text-[#1d1d1f] border border-pink-200'
                }`}
              >
                Companion Hub
              </button>
            </div>
          </div>

          <button 
            onClick={() => { setMobileMenuOpen(false); onSwitchMode('landing'); }}
            className="text-left text-lg font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition py-1"
          >
            Home Overview
          </button>
          <a 
            href="#services" 
            onClick={() => { setMobileMenuOpen(false); onSwitchMode('landing'); }}
            className="text-lg font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition flex items-center justify-between py-1"
          >
            <span>All Services</span>
            <span className="text-xs bg-[#f5f5f7] text-[#86868b] px-2 py-0.5 rounded-full font-normal">6 Launch Services</span>
          </a>
          <a 
            href="#earnings" 
            onClick={() => { setMobileMenuOpen(false); onSwitchMode('landing'); }}
            className="text-lg font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition flex items-center justify-between py-1"
          >
            <span>Earnings Opportunity</span>
            <span className="text-xs text-[#0071e3] font-normal">₹2,000/hr</span>
          </a>
          <a 
            href="#pricing" 
            onClick={() => { setMobileMenuOpen(false); onSwitchMode('landing'); }}
            className="text-lg font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition py-1"
          >
            Pricing &amp; Memberships
          </a>
          <a 
            href="#faq" 
            onClick={() => { setMobileMenuOpen(false); onSwitchMode('landing'); }}
            className="text-lg font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition py-1"
          >
            FAQs
          </a>
        </div>

        <div className="mt-auto pt-6 space-y-2.5 border-t border-pink-100">
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
            className="w-full bg-[#0071e3] text-white py-3 rounded-full font-bold text-sm shadow-sm active:scale-98 apple-focus"
          >
            Find a Companion
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenPartnerJoin(); }}
            className="w-full bg-white text-[#1d1d1f] py-3 rounded-full font-bold text-sm border border-pink-200 active:scale-98 apple-focus"
          >
            Become a Partner (Earn ₹2K/hr)
          </button>
          {currentRole && onLogout && (
            <button 
              onClick={() => { setMobileMenuOpen(false); onLogout(); }}
              className="w-full bg-rose-50 text-rose-700 py-3 rounded-full font-bold text-sm border border-rose-200 active:scale-98 apple-focus flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Portal</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
