import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  FileText, 
  PhoneCall, 
  ArrowLeft,
  Lock
} from 'lucide-react';

interface AboutUsPageProps {
  onBack: () => void;
  onExploreCompanions?: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onBack, onExploreCompanions }) => {
  return (
    <div className="min-h-screen bg-[#faf8f8] text-[#1d1d1f] font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-pink-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-[#1d1d1f] hover:text-[#FF2D55] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img 
              src="/assets/brand_logo.png" 
              alt="Click Karo Date Karo" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black tracking-tight text-[#111827]">CLICK KARO DATE KARO</span>
              <span className="text-[10px] text-stone-500 font-medium">A unit of Amber Ventures (OPC) Pvt Ltd</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-[#FF2D55]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Aadhaar Verified</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100/80 to-rose-50 border border-pink-200 text-xs font-bold text-[#FF2D55] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2D55]" />
            <span>Redefining Meaningful Urban Companionship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#111827] leading-tight">
            About <span className="bg-gradient-to-r from-[#FF2D55] to-rose-600 bg-clip-text text-transparent">Click Karo Date Karo</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            India's foremost verified social companionship and lifestyle meetup platform. 
            Operated by <strong>Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD)</strong>, 
            we exist to cure modern urban loneliness through safe, dignified, and cultured human connection.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FF2D55]">100%</p>
            <p className="text-xs font-medium text-stone-500 mt-1">Aadhaar &amp; Face Verified</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#111827]">12 Cities</p>
            <p className="text-xs font-medium text-stone-500 mt-1">Premier Metros &amp; Tier-1</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">15,000+</p>
            <p className="text-xs font-medium text-stone-500 mt-1">Verified Public Outings</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#0071E3]">4.98 / 5.0</p>
            <p className="text-xs font-medium text-stone-500 mt-1">Client Safety &amp; Trust Score</p>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-12 bg-white border-y border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-[#FF2D55] text-xs font-bold">
              <Heart className="w-3.5 h-3.5" />
              <span>Our Founding Vision</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111827]">
              Why Click Karo Date Karo was Created
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              In bustling metropolitan cities like Delhi NCR, Mumbai, Bengaluru, and Chandigarh, thousands of professionals, entrepreneurs, and transplants feel isolated despite being surrounded by millions. Whether you want someone cultured to explore a fine dining spot with, attend an acoustic concert, grab an artisanal coffee, or simply take a stroll around the city, finding trusted company used to be difficult.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              <strong>Click Karo Date Karo</strong> was founded with a singular commitment: to make verified, respectful social companionship safe, effortless, and mainstream. We reject unsafe dating platforms filled with catfishes and spam. Every single companion on Click Karo Date Karo is vetted in person through government ID records and facial biometric validation.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-pink-100">
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80" 
                alt="Social Companionship" 
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-pink-100 max-w-xs hidden sm:block">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-[#111827]">Zero Toleration Policy</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Strict public venues only. Absolutely no adult, escort, or matrimonial operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#111827]">
            Our Four Non-Negotiable Safety Pillars
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Every booking, interaction, and meetup on Click Karo Date Karo is governed by strict safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF2D55] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">100% Aadhaar &amp; AI Face Verification</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Every companion must pass government Aadhaar KYC, phone verification, and dual-frame biometric face recognition. Profile photos are checked against live selfie cameras to ensure zero fake profiles or misleading avatars.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">Public Venues Only</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Outings are strictly restricted to public places — including reputed cafes, fine dining restaurants, shopping malls, multiplexes, exhibitions, and authorized tourist landmarks. Private homes and non-public spaces are strictly forbidden.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">Dignity &amp; Code of Conduct</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Our Code of Conduct ensures mutual respect and personal space boundaries. We are not an escort, adult, or dating portal. Any inappropriate behavior results in immediate permanent ban and reporting to relevant cyber authorities.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0071E3] flex items-center justify-center font-bold">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">24/7 Concierge &amp; 100% Refund Guarantee</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Our safety concierge monitors active sessions and provides an instant SOS helpline. If your booking cannot be fulfilled, or if the companion fails to attend, we guarantee a 100% instant full refund.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Identity & Legal Disclosures */}
      <section className="py-12 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Corporate Governance &amp; Statutory Compliance</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display">
            Corporate Transparency
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            <strong>Click Karo Date Karo</strong> is a commercial brand and trading unit proudly owned and operated by:
          </p>

          <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 max-w-xl mx-auto text-left space-y-2 text-xs sm:text-sm">
            <p><strong>Corporate Entity:</strong> AMBER VENTURES (OPC) PVT LTD</p>
            <p><strong>Brand / Trade Name:</strong> Click Karo Date Karo</p>
            <p><strong>Jurisdiction:</strong> Republic of India (Governed by Information Technology Act, 2000)</p>
            <p><strong>Grievance Office:</strong> grievance@clickkarodatekaro.com</p>
            <p><strong>Data Protection Officer:</strong> dpo@clickkarodatekaro.com</p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={onExploreCompanions || onBack}
              className="px-6 py-3 rounded-full bg-white text-stone-900 font-bold text-xs hover:bg-pink-50 transition cursor-pointer"
            >
              Explore Companions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
