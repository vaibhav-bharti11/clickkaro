import React from 'react';
import { TESTIMONIALS } from '../data/servicesData';
import { Star, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';

interface SuccessStoriesProps {
  onOpenPartnerJoin: () => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ onOpenPartnerJoin }) => {
  return (
    <section className="py-24 px-4 sm:px-6 border-b border-pink-200/50 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2 block">
              Real Impact
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] leading-tight headline-balance">
              Partner Earnings Stories.
            </h2>
            <p className="text-[#1d1d1f]/75 text-base sm:text-lg mt-2 max-w-2xl body-pretty">
              Hear from students and professionals across India who have unlocked financial independence.
            </p>
          </div>

          <button
            onClick={onOpenPartnerJoin}
            className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-semibold px-6 py-3 rounded-full transition shadow-sm flex items-center gap-2 shrink-0 apple-focus"
          >
            <span>Start Earning Today</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {TESTIMONIALS.map((story) => (
            <div
              key={story.id}
              className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 border border-pink-200/70 shadow-sm hover:border-pink-300 hover:shadow-apple-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Avatar Row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1d1d1f] to-stone-700 text-white font-bold flex items-center justify-center text-xs">
                    {story.avatarText}
                  </div>
                  <div>
                    <div className="font-bold text-[#1d1d1f] text-xs sm:text-sm flex items-center gap-1">
                      {story.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />
                    </div>
                    <div className="text-[11px] text-[#86868b]">
                      {story.city} &bull; {story.tenure}
                    </div>
                  </div>
                </div>

                {/* Monthly Earnings Highlight */}
                <div className="bg-pink-50/70 rounded-xl p-2.5 mb-4 flex items-center justify-between border border-pink-100">
                  <div className="flex items-center gap-1 text-[11px] text-[#86868b] font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Monthly:</span>
                  </div>
                  <span className="text-xs font-bold text-[#1d1d1f] tabular-numbers">
                    {story.monthlyEarnings}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-[#1d1d1f]/80 text-xs leading-relaxed mb-6 body-pretty">
                  "{story.quote}"
                </p>
              </div>

              {/* Stars & Badge */}
              <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Verified Partner
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
