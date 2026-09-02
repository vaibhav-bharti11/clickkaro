import React, { useState } from 'react';
import { CompanionProfile } from '../types';
import { X, Star, MapPin, CheckCircle2, ArrowRight, Dices, SlidersHorizontal, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RandomMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companions: CompanionProfile[];
  currentCity: string;
  onSelectCompanion: (companion: CompanionProfile) => void;
}

export const RandomMatchModal: React.FC<RandomMatchModalProps> = ({
  isOpen,
  onClose,
  companions,
  currentCity,
  onSelectCompanion,
}) => {
  const [selectedService, setSelectedService] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchedCompanion, setMatchedCompanion] = useState<CompanionProfile | null>(null);

  if (!isOpen) return null;

  const handleSpinMatch = () => {
    setIsSpinning(true);
    setMatchedCompanion(null);

    // Filter available candidates by seeker's locality and filters
    const candidates = companions.filter((comp) => {
      const cityMatches = currentCity === 'All India' || 
        comp.city.toLowerCase().includes(currentCity.toLowerCase()) || 
        currentCity.toLowerCase().includes(comp.city.toLowerCase());
      const serviceMatches = selectedService === 'all' || comp.services.includes(selectedService);
      const priceMatches = comp.hourlyRate <= maxPrice;
      return cityMatches && serviceMatches && priceMatches;
    });

    const pool = candidates.length > 0 ? candidates : companions;

    setTimeout(() => {
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      setMatchedCompanion(chosen);
      setIsSpinning(false);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-200 shadow-apple-float relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Dices className="w-3.5 h-3.5 text-pink-600" /> Instant Matchmaker
          </div>
          <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight font-display">
            Book a Random Companion
          </h3>
          <p className="text-xs text-[#86868b] mt-1 font-sans">
            Set your filters and let our smart concierge pair you with a verified companion in {currentCity}
          </p>
        </div>

        {/* FILTERS */}
        <div className="space-y-4 mb-6 bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1d1d1f]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Matching Preferences</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#86868b] uppercase mb-1">
              Service / Activity
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            >
              <option value="all">Any Activity</option>
              <option value="coffee-partner">Coffee &amp; Cafe Talk (1 hr)</option>
              <option value="lunch-dinner">Lunch / Dinner (2 hrs)</option>
              <option value="hangout">Social Hangout (4 hrs)</option>
              <option value="movie-partner">Cinema &amp; Movie (4 hrs)</option>
              <option value="clubbing">Clubbing &amp; Party (6 hrs)</option>
              <option value="travel-partner">City Road Trip / Travel (12 hrs)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-bold text-[#86868b] uppercase mb-1">
              <span>Budget Cap</span>
              <span className="text-[#1d1d1f] font-bold">₹{maxPrice}/hr</span>
            </div>
            <input
              type="range"
              min={1500}
              max={3000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0071e3]"
            />
          </div>
        </div>

        {/* MATCH DISPLAY */}
        {matchedCompanion && !isSpinning && (
          <div className="p-4 bg-white rounded-2xl border border-pink-200 shadow-sm mb-6 flex items-center gap-3.5 animate-scale-up">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-pink-100 shadow-xs">
              <img
                src={matchedCompanion.avatarUrl}
                alt={matchedCompanion.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#1d1d1f] truncate">
                  {matchedCompanion.name}, {matchedCompanion.age}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-xs text-[#86868b] mt-0.5">
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" /> {matchedCompanion.rating}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-pink-500" /> {matchedCompanion.city}
                </span>
              </div>
              <div className="text-xs font-bold text-pink-600 mt-1">
                ₹{matchedCompanion.hourlyRate}/hr
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleSpinMatch}
            disabled={isSpinning}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-75"
          >
            {isSpinning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Finding Your Perfect Match...</span>
              </>
            ) : (
              <>
                <Dices className="w-4 h-4" />
                <span>{matchedCompanion ? 'Spin Again 🎲' : 'Spin & Find Companion'}</span>
              </>
            )}
          </button>

          {matchedCompanion && (
            <button
              type="button"
              onClick={() => {
                onSelectCompanion(matchedCompanion);
                onClose();
              }}
              className="w-full bg-[#1d1d1f] hover:bg-black text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Confirm &amp; Book {matchedCompanion.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
