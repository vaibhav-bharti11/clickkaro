import React, { useState } from 'react';
import { LAUNCH_CITIES } from '../data/launchCities';
import { validatePincode, PincodeValidationResult } from '../utils/pincodeValidator';
import { MapPin, ArrowRight, ShieldCheck, CheckCircle2, Navigation, AlertCircle, BellRing, Check } from 'lucide-react';
import { recordWaitlistLeadInSupabase } from '../services/supabase';

interface LaunchCitiesSectionProps {
  onOpenBooking: (context?: any) => void;
}

export const LaunchCitiesSection: React.FC<LaunchCitiesSectionProps> = ({ onOpenBooking }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('mumbai');
  const [searchPin, setSearchPin] = useState('');
  const [validationResult, setValidationResult] = useState<PincodeValidationResult | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const activeCity = LAUNCH_CITIES.find(c => c.id === selectedCityId) || LAUNCH_CITIES[0];

  const handlePinVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPin.trim()) return;

    setWaitlistSuccess(false);
    const result = validatePincode(searchPin);
    setValidationResult(result);

    if (result.isLaunchCity && result.city) {
      setSelectedCityId(result.city.id);
    }
  };

  const handleSelectCityChip = (cityId: string) => {
    setSelectedCityId(cityId);
    setValidationResult(null);
    setSearchPin('');
  };

  const handleJoinWaitlist = async () => {
    setWaitlistSuccess(true);
    await recordWaitlistLeadInSupabase(searchPin, validationResult?.cityName);
  };

  return (
    <section id="launch-cities" className="py-24 px-4 sm:px-6 bg-white/50 backdrop-blur-xl border-b border-black/5 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Apple Style Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/70 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF2D55] animate-ping" />
            <span>Launch Network</span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1d1d1f] max-w-3xl leading-tight mb-3 sm:mb-4 headline-balance">
            Now live across 12 launch cities.
          </h2>
          <p className="text-[#1d1d1f]/75 text-sm sm:text-lg max-w-2xl body-pretty font-sans">
            Verified, background-checked social and lifestyle companions ready within 15 minutes exclusively in India's 12 designated launch hubs.
          </p>
        </div>

        {/* Apple Segmented City Selector Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-10">
          {LAUNCH_CITIES.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => handleSelectCityChip(city.id)}
                className={`p-3 sm:p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-start text-left border apple-focus group ${
                  isSelected
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-apple-lg scale-[1.02] ring-2 ring-[#FF2D55]'
                    : 'bg-white/80 hover:bg-white text-[#1d1d1f] border-black/5 hover:border-pink-300/80 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5 sm:mb-2">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#10B981]' : 'bg-emerald-500'}`} />
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#FF2D55]' : 'text-[#86868b]'}`}>
                    {city.status}
                  </span>
                </div>
                <div className="font-display font-bold text-xs sm:text-base leading-tight group-hover:translate-x-0.5 transition-transform">
                  {city.name}
                </div>
                <div className={`text-[10px] sm:text-[11px] font-sans mt-0.5 truncate w-full ${isSelected ? 'text-white/70' : 'text-[#86868b]'}`}>
                  {city.state}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected City Detail Card (Apple Liquid Glass Dual Panel) */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-black/5 shadow-apple-float overflow-hidden p-5 sm:p-10 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: City Info & Metrics */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeCity.name}, {activeCity.state}</span>
                </span>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeCity.activeCompanions}+ Active Companions Online</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-display font-black text-[#1d1d1f] tracking-tight">
                Experience {activeCity.name} with verified co-travelers &amp; buddies.
              </h3>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                  Popular Meetup Hubs in {activeCity.name}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeCity.featuredSpots.map((spot, idx) => (
                    <span key={idx} className="text-xs font-semibold bg-[#f5f5f7] text-[#1d1d1f] px-3 py-1.5 rounded-xl border border-black/5">
                      📍 {spot}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
                  Top Requested Services in {activeCity.name}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeCity.popularServices.map((srv, idx) => (
                    <span key={idx} className="text-xs font-bold bg-pink-50 text-[#FF2D55] px-3 py-1.5 rounded-xl border border-pink-200/60">
                      ✨ {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => onOpenBooking({ city: activeCity.name, pinCode: activeCity.popularPinCodes[0] })}
                  className="rounded-full bg-gradient-to-r from-[#0071E3] to-[#0A84FF] hover:from-[#0077ED] hover:to-[#0055B3] text-white px-8 py-3.5 font-bold text-xs sm:text-sm transition shadow-apple-md hover:shadow-apple-lg active:scale-95 flex items-center gap-2 apple-focus"
                >
                  <span>Book a Companion in {activeCity.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Accurate Pin Code Lookup (Strict 12 Launch Cities Validation) */}
            <div className="lg:col-span-5 bg-[#f5f5f7]/80 rounded-2xl p-6 sm:p-8 border border-black/5">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-[#0071E3]" />
                <span className="font-display font-bold text-sm text-[#1d1d1f]">
                  Strict Coverage Check
                </span>
              </div>
              <p className="text-xs text-[#86868b] mb-4 leading-relaxed font-sans">
                Enter your 6-digit postal PIN code to verify if your locality is part of our official 12 launch cities.
              </p>

              <form onSubmit={handlePinVerify} className="space-y-3">
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#0071E3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={searchPin}
                    onChange={(e) => setSearchPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={`e.g. ${activeCity.popularPinCodes[0] || '110001'}`}
                    className="w-full bg-white border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1d1d1f] hover:bg-[#0071E3] text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Verify Availability</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Validation Result Feedback */}
              {validationResult && (
                <div className="mt-4 animate-fade-in">
                  {validationResult.isLaunchCity ? (
                    // SUCCESS CASE: PIN code is inside the 12 Launch Cities
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-2">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Verified Live Launch Hub: {validationResult.cityName}</span>
                      </div>
                      <p className="text-emerald-700 leading-relaxed">
                        {validationResult.message}
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenBooking({ city: validationResult.cityName, pinCode: searchPin })}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <span>Book Instant Companion in {validationResult.cityName}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    // OUTSIDE LAUNCH NETWORK CASE: PIN code belongs to a non-launch city
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-3">
                      <div className="flex items-start gap-2 text-rose-800 font-bold">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Outside Launch Network ({searchPin})</span>
                      </div>
                      <p className="text-rose-800/90 leading-relaxed font-sans">
                        PIN code <strong className="text-rose-950">{searchPin}</strong> {validationResult.cityName ? `(${validationResult.cityName})` : ''} is not in our 12 launch hubs. We are currently operational exclusively in:
                      </p>
                      
                      {/* Clickable Launch City Shortcuts */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {LAUNCH_CITIES.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectCityChip(c.id)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-900 text-[11px] font-semibold hover:bg-rose-100/60 transition"
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>

                      {/* Waitlist Button */}
                      {!waitlistSuccess ? (
                        <button
                          type="button"
                          onClick={handleJoinWaitlist}
                          className="w-full mt-2 py-2 px-3 rounded-xl bg-[#1d1d1f] hover:bg-[#FF2D55] text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <BellRing className="w-3.5 h-3.5" />
                          <span>Notify Me When Live in {searchPin}</span>
                        </button>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>You're on the priority waitlist! We'll SMS you upon launch.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
