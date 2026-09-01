import React, { useState, useEffect } from 'react';
import { ArrowUp, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenPartnerJoin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenPartnerJoin }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-white/60 backdrop-blur-xl text-[#86868b] py-16 text-xs border-t border-pink-200/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Top Legal Disclaimer */}
          <div className="pb-8 mb-8 border-b border-pink-200/50 text-[11px] leading-relaxed text-[#1d1d1f]/70">
            <p className="mb-2">
              * Click Karo Date Karo is strictly a professional social companionship, lifestyle support, and daily care platform. All interactions strictly follow our consent-first rules and professional code of conduct. We do not provide dating, matrimonial, or adult escort services.
            </p>
            <p>
              ** Earnings calculations are estimates based on standard partner hourly rates and weekly active bookings. Individual earnings may vary based on city, availability, and client reviews.
            </p>
          </div>

          {/* 5-Column Sitemap */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-[#1d1d1f] mb-3">
                <img 
                  src="/assets/brand_logo.png" 
                  alt="Click Karo Date Karo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="mb-3 text-[11px] text-[#86868b] leading-relaxed">
                India's #1 Social &amp; Lifestyle Support Platform. Safe, verified, consent-first companionship across 19,000+ pin codes.
              </p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 text-[#1d1d1f] text-[10px] font-semibold border border-pink-200">
                <ShieldCheck className="w-3 h-3 text-[#0071e3]" /> 100% Aadhaar KYC
              </div>
            </div>

            {/* Services */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[#1d1d1f] font-bold text-xs tracking-tight">
                Services
              </h4>
              <a href="#services" className="hover:text-[#0071e3] transition">Movie Partner</a>
              <a href="#services" className="hover:text-[#0071e3] transition">Elder Care</a>
              <a href="#services" className="hover:text-[#0071e3] transition">Shopping Buddy</a>
              <a href="#services" className="hover:text-[#0071e3] transition">Clubbing &amp; Events</a>
              <a href="#services" className="hover:text-[#0071e3] transition">Travel Partner</a>
              <a href="#services" className="hover:text-[#0071e3] transition">Coffee &amp; Cafes</a>
            </div>

            {/* Platform */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[#1d1d1f] font-bold text-xs tracking-tight">
                Platform
              </h4>
              <a href="#launch-cities" className="hover:text-[#0071e3] transition">12 Launch Cities</a>
              <a href="#launch-cities" className="hover:text-[#0071e3] transition">Pin Code Checker</a>
              <a href="#earnings" className="hover:text-[#0071e3] transition">Earnings Calculator</a>
              <a href="#pricing" className="hover:text-[#0071e3] transition">Membership Plans</a>
              <button onClick={onOpenBooking} className="hover:text-[#0071e3] transition text-left text-xs">Find a Companion</button>
              <button onClick={onOpenPartnerJoin} className="hover:text-[#0071e3] transition text-left text-xs text-[#0071e3] font-semibold">Become a Partner</button>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[#1d1d1f] font-bold text-xs tracking-tight">
                Company
              </h4>
              <a href="#faq" className="hover:text-[#0071e3] transition">About Us</a>
              <a href="#faq" className="hover:text-[#0071e3] transition">Code of Conduct</a>
              <a href="#faq" className="hover:text-[#0071e3] transition">Privacy Policy</a>
              <a href="#faq" className="hover:text-[#0071e3] transition">Terms of Service</a>
              <a href="#faq" className="hover:text-[#0071e3] transition">Refund Policy</a>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[#1d1d1f] font-bold text-xs tracking-tight">
                Support
              </h4>
              <a href="#faq" className="hover:text-[#0071e3] transition">Help Center</a>
              <a href="#faq" className="hover:text-[#0071e3] transition">24/7 Safety SOS</a>
              <a href="#faq" className="hover:text-[#0071e3] transition">KYC Verification</a>
              <span className="text-[11px] text-[#86868b] mt-1">support@clickkarodatekaro.in</span>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="mt-12 pt-6 border-t border-pink-200/50 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-[#86868b]">
            <div>
              Copyright &copy; 2025 Click Karo Date Karo. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>12 Launch Cities Active</span>
              </div>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 fill-pink-500 text-pink-500" /> in India
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 bg-[#1d1d1f] text-white w-10 h-10 rounded-full shadow-apple-md transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-[#0071e3] active:scale-95 apple-focus ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </>
  );
};
