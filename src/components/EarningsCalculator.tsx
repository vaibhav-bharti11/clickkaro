import React, { useState } from 'react';
import { Calculator, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface EarningsCalculatorProps {
  onOpenPartnerJoin: () => void;
}

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({ onOpenPartnerJoin }) => {
  const [dailyRate, setDailyRate] = useState<number>(8500);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(15);

  const monthlyGross = dailyRate * daysPerMonth;
  const netEarnings = Math.round(monthlyGross * 0.8);
  const weeklyEstimate = Math.round(netEarnings / 4);

  return (
    <section id="earnings" className="py-24 px-4 sm:px-6 border-b border-pink-200/50 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2 block">
            Companion Financial Freedom
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-4 headline-balance">
            Earn ₹7,000 &ndash; ₹10,000+ Per Day.
          </h2>
          <p className="text-[#1d1d1f]/75 text-base sm:text-lg body-pretty">
            Set your own daily availability, choose your preferred services, and enjoy guaranteed 80% net take-home payouts.
          </p>
        </div>

        {/* 4 Financial Metric Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-pink-200/70 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mb-0.5 tabular-numbers">₹7k &ndash; ₹10k+</div>
            <div className="text-xs text-[#86868b] font-medium">Avg Daily Earning</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-pink-200/70 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-0.5 tabular-numbers">80%</div>
            <div className="text-xs text-[#86868b] font-medium">Guaranteed Take-Home</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-pink-200/70 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#0071e3] mb-0.5 tabular-numbers">Weekly</div>
            <div className="text-xs text-[#86868b] font-medium">Automated Bank Payouts</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-pink-200/70 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-0.5 tabular-numbers">100%</div>
            <div className="text-xs text-[#86868b] font-medium">Schedule Flexibility</div>
          </div>
        </div>

        {/* Interactive Calculator Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-pink-200/80 shadow-apple-lg">
          
          {/* Sliders on Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#0071e3]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1d1d1f]">Live Daily Earnings Simulator</h3>
                <p className="text-xs text-[#86868b]">Select your daily rate and availability to project your net income</p>
              </div>
            </div>

            {/* Slider 1: Daily Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="earnings-rate-slider" className="text-xs font-semibold text-[#1d1d1f]">Daily Earning Rate (₹)</label>
                <span className="text-base font-bold text-[#0071e3] tabular-numbers">₹{dailyRate.toLocaleString('en-IN')} / Day</span>
              </div>
              <input 
                id="earnings-rate-slider"
                type="range"
                min="7000"
                max="12000"
                step="500"
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3] apple-focus"
              />
              <div className="flex justify-between text-[10px] text-[#86868b] mt-1 tabular-numbers">
                <span>₹7,000 (Standard Day)</span>
                <span>₹8,500 (Full Day Outing)</span>
                <span>₹12,000 (VIP Events/Travel)</span>
              </div>
            </div>

            {/* Slider 2: Days Per Month */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="earnings-days-slider" className="text-xs font-semibold text-[#1d1d1f]">Days Active Per Month</label>
                <span className="text-base font-bold text-pink-700 tabular-numbers">{daysPerMonth} Days / Month</span>
              </div>
              <input 
                id="earnings-days-slider"
                type="range"
                min="4"
                max="26"
                step="1"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-[#0071e3] apple-focus"
              />
              <div className="flex justify-between text-[10px] text-[#86868b] mt-1 tabular-numbers">
                <span>4 Days (Weekends only)</span>
                <span>15 Days (Part-time)</span>
                <span>26 Days (Full-time)</span>
              </div>
            </div>

            <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-pink-100 text-xs text-[#1d1d1f]/80 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
              <span>100% control &mdash; reject any request with zero penalty. Only accept dates and meetups that suit your schedule.</span>
            </div>
          </div>

          {/* Projection Card on Right */}
          <div className="lg:col-span-5 bg-[#121214] text-white rounded-3xl p-6 sm:p-8 shadow-apple-md border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Projected Net Earnings
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  80% Guaranteed
                </span>
              </div>

              <div className="mb-6">
                <div className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">Estimated Monthly Take-Home</div>
                <div className="text-3xl sm:text-4xl font-bold text-white mt-1 tabular-numbers">
                  ₹{netEarnings.toLocaleString('en-IN')}
                  <span className="text-xs text-[#86868b] font-normal ml-1">/ month</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#86868b] pt-4 border-t border-white/10 mb-6">
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span className="text-white font-medium tabular-numbers">₹{dailyRate.toLocaleString('en-IN')}/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Gross:</span>
                  <span className="text-white font-medium tabular-numbers">₹{monthlyGross.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly Estimated Payout:</span>
                  <span className="text-white font-medium tabular-numbers">₹{weeklyEstimate.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-white/10">
                  <span>Your Net 80% Take-Home:</span>
                  <span className="tabular-numbers">₹{netEarnings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenPartnerJoin}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 apple-focus"
            >
              <span>Apply to Become a Companion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
