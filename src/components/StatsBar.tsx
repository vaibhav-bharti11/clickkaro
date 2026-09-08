import React from 'react';
import { Users, MapPin, ShieldCheck, Headphones, Star, Lock } from 'lucide-react';
import { useCms } from '../context/CmsContext';

const ICON_MAP: Record<string, any> = {
  Users,
  MapPin,
  ShieldCheck,
  Headphones,
  Star,
  Lock,
};

export const StatsBar: React.FC = () => {
  const { content } = useCms();
  const cmsStats = content.statsBar?.stats || [];

  return (
    <section className="py-14 px-4 md:px-6 bg-white/60 backdrop-blur-xl border-y border-black/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cmsStats.map((stat, idx) => {
            const Icon = ICON_MAP[stat.iconName] || ShieldCheck;
            return (
              <div 
                key={stat.id || idx}
                className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border border-black/5 shadow-sm transition-all duration-300 hover:bg-white hover:border-black/10 hover:shadow-apple-lg hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#1d1d1f] mb-1 tabular-numbers">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-[#1d1d1f] font-sans">
                  {stat.label}
                </div>
                <p className="text-xs text-[#86868b] mt-1 leading-snug font-sans">
                  {stat.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
