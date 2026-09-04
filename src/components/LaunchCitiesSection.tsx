import React, { useState } from 'react';
import { LAUNCH_CITIES } from '../data/launchCities';
import { validatePincode, PincodeValidationResult } from '../utils/pincodeValidator';
import { MOCK_COMPANIONS } from '../data/mockProfiles';
import { CompanionProfile } from '../types';
import { getTopCompanionsByPinOrCity } from '../services/supabase';
import { MapPin, ArrowRight, ShieldCheck, CheckCircle2, Navigation, Star, Lock, Sparkles, UserCheck } from 'lucide-react';

interface LaunchCitiesSectionProps {
  onOpenBooking: (context?: any) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onNavigateSeeker?: () => void;
}

export const LaunchCitiesSection: React.FC<LaunchCitiesSectionProps> = ({ 
  onOpenBooking,
  isLoggedIn = false,
  onOpenAuth,
  onNavigateSeeker,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const [searchPin, setSearchPin] = useState('');
  const [validationResult, setValidationResult] = useState<PincodeValidationResult | null>(null);
  const [previewCompanions, setPreviewCompanions] = useState<CompanionProfile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchingDb, setIsSearchingDb] = useState(false);

  const activeCity = LAUNCH_CITIES.find(c => c.id === selectedCityId) || LAUNCH_CITIES[0];

  const handlePinVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPin.trim() || searchPin.length < 6) return;

    const result = validatePincode(searchPin);
    setValidationResult(result);
    setHasSearched(true);
    setIsSearchingDb(true);

    if (result.city) {
      setSelectedCityId(result.city.id);
    }

    try {
      // Query top 5 verified model companions directly from Supabase database
      const dbResult = await getTopCompanionsByPinOrCity(searchPin);
      if (dbResult.companions && dbResult.companions.length > 0) {
        setPreviewCompanions(dbResult.companions);
      } else {
        // Fallback to active city companions
        const cityName = result.cityName || activeCity.name;
        const matched = MOCK_COMPANIONS.filter(comp => 
          comp.pinCode.trim() === searchPin.trim() || 
          comp.city.toLowerCase().includes(cityName.toLowerCase()) || 
          cityName.toLowerCase().includes(comp.city.toLowerCase())
        );
        const pool = [...matched];
        for (const comp of MOCK_COMPANIONS) {
          if (pool.length >= 5) break;
          if (!pool.some(p => p.id === comp.id)) pool.push(comp);
        }
        setPreviewCompanions(pool.slice(0, 5));
      }
    } catch (err) {
      console.warn('[LaunchCities] Error querying companions:', err);
    } finally {
      setIsSearchingDb(false);
    }
  };

  const handleSelectCityChip = (cityId: string) => {
    setSelectedCityId(cityId);
    setValidationResult(null);
    setSearchPin('');
    setHasSearched(false);
    setPreviewCompanions([]);
  };

  const handleActionClick = (companion?: CompanionProfile) => {
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('signin');
      else onOpenBooking();
    } else {
      if (onNavigateSeeker) onNavigateSeeker();
      else if (companion) onOpenBooking({ companionName: companion.name, city: companion.city });
    }
  };

  return (
    <section id="cities" className="py-24 px-4 sm:px-6 bg-white/60 backdrop-blur-xl border-b border-pink-200/50 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Apple Style Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF2D55] animate-ping" />
            <span>Operational Cities</span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-display font-extrabold tracking-tight text-[#1d1d1f] max-w-3xl leading-tight mb-3 sm:mb-4 headline-balance">
            Now live across premier cities.
          </h2>
          <p className="text-[#1d1d1f]/75 text-sm sm:text-lg max-w-2xl body-pretty font-sans">
            Verified, background-checked companions ready for outings, cinema, dining, and social events across India.
          </p>
        </div>

        {/* Segmented City Selector Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-10">
          {LAUNCH_CITIES.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => handleSelectCityChip(city.id)}
                className={`p-3 sm:p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-start text-left border apple-focus group cursor-pointer ${
                  isSelected
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-apple-lg scale-[1.02] ring-2 ring-[#FF2D55]'
                    : 'bg-white/80 hover:bg-white text-[#1d1d1f] border-pink-200/60 hover:border-pink-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5 sm:mb-2">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#10B981]' : 'bg-emerald-500'}`} />
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#FF2D55]' : 'text-[#86868b]'}`}>
                    Active
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

        {/* Selected City Detail Card (Apple Dual Panel) */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-pink-200 shadow-apple-float overflow-hidden p-5 sm:p-8 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: City Info */}
            <div className="lg:col-span-6 space-y-5">
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

              <h3 className="text-2xl sm:text-3xl font-display font-black text-[#1d1d1f] tracking-tight">
                Experience {activeCity.name} with verified lifestyle companions.
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

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleActionClick()}
                  className="rounded-full bg-gradient-to-r from-[#FF2D55] to-[#E11D48] hover:opacity-95 text-white px-7 py-3.5 font-bold text-xs sm:text-sm transition shadow-sm active:scale-95 flex items-center gap-2 apple-focus cursor-pointer"
                >
                  <span>Explore Companions in {activeCity.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Postal Pin Code Lookup */}
            <div className="lg:col-span-6 bg-[#fdf8f8] rounded-2xl p-6 sm:p-7 border border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-[#0071E3]" />
                <span className="font-display font-bold text-sm text-[#1d1d1f]">
                  Find Companions by Pin Code
                </span>
              </div>
              <p className="text-xs text-[#86868b] mb-4 leading-relaxed font-sans">
                Enter your 6-digit postal PIN code to preview the top 5 verified companions active in your locality.
              </p>

              <form onSubmit={handlePinVerify} className="space-y-3">
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#FF2D55] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={searchPin}
                    onChange={(e) => setSearchPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={`e.g. ${activeCity.popularPinCodes[0] || '110001'}`}
                    className="w-full bg-white border border-pink-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingDb}
                  className="w-full bg-[#1d1d1f] hover:bg-[#FF2D55] disabled:opacity-75 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{isSearchingDb ? 'Searching Database...' : 'Search Top 5 Companions'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {validationResult && (
                <div className="mt-3 text-xs font-medium text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{validationResult.cityName ? `Showing verified companions near ${validationResult.cityName} (${searchPin})` : `Location: ${searchPin}`}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* TOP 5 COMPANIONS PREVIEW SECTION (Full Profile Hidden As Requested) */}
        {hasSearched && previewCompanions.length > 0 && (
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-apple-md mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-pink-100">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF2D55]" />
                  <h3 className="text-xl font-bold text-[#1d1d1f]">
                    Top 5 Companions Near PIN {searchPin}
                  </h3>
                </div>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Verified preview only &bull; Login required to view full profile, gallery &amp; connect
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleActionClick()}
                className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs transition shadow-sm active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isLoggedIn ? 'Go to Seeker Portal' : 'Login to View Full Profiles'}</span>
              </button>
            </div>

            {/* Top 5 Companion Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {previewCompanions.map((comp, idx) => (
                <div 
                  key={comp.id || idx}
                  className="bg-[#fdf8f8] rounded-2xl p-4 border border-pink-200 flex flex-col justify-between hover:shadow-apple-sm transition relative overflow-hidden group"
                >
                  <div>
                    {/* Companion Avatar & Rank */}
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <img 
                        src={comp.avatarUrl} 
                        alt={comp.name} 
                        className="w-full h-full object-cover rounded-full ring-2 ring-pink-300"
                      />
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF2D55] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="text-center mb-2">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-xs sm:text-sm text-[#1d1d1f] truncate">
                          {comp.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
                      </div>
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{comp.rating || '5.0'}</span>
                        <span className="text-[#86868b] font-normal text-[10px]">({comp.reviewCount || 100}+)</span>
                      </div>
                      <div className="text-[11px] text-[#86868b] mt-0.5">
                        {comp.city} &bull; PIN {comp.pinCode}
                      </div>
                    </div>

                    {/* Locked / Blurred Bio Snippet */}
                    <div className="relative p-2.5 rounded-xl bg-white border border-pink-100 mb-3 text-center">
                      <p className="text-[11px] text-[#1d1d1f]/40 filter blur-[2.5px] select-none line-clamp-2">
                        {comp.bio || 'Experienced verified lifestyle companion available for casual meetups, cinema, and dining.'}
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center gap-1 text-[10px] font-bold text-pink-700 bg-white/70 backdrop-blur-[1px] rounded-xl">
                        <Lock className="w-3 h-3 text-[#FF2D55]" />
                        <span>Full Profile Hidden</span>
                      </div>
                    </div>
                  </div>

                  {/* Connect / Unlock Button */}
                  <button
                    type="button"
                    onClick={() => handleActionClick(comp)}
                    className="w-full py-2 rounded-xl bg-[#1d1d1f] hover:bg-[#FF2D55] text-white font-bold text-[11px] transition shadow-xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <span>{isLoggedIn ? 'View Profile & Book' : 'Login to View Profile'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
