import React from 'react';
import { Users, MapPin, ShieldCheck, Headphones } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: 'Millions+',
      label: 'Registered Partners',
      sublabel: 'Across all Indian metros & towns',
    },
    {
      icon: MapPin,
      value: '19,000+',
      label: 'Indian Pin Codes',
      sublabel: '700+ districts in 28 states & 8 UTs',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'AI-Verified Profiles',
      sublabel: 'Aadhaar, PAN & background screened',
    },
    {
      icon: Headphones,
      value: '24/7',
      label: 'Live SOS Support',
      sublabel: 'In-app safety tracking & response',
    },
  ];

  return (
    <section className="py-12 px-4 md:px-6 bg-white/40 backdrop-blur-md border-y border-pink-200/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-pink-100/70 shadow-sm transition-all hover:bg-white/90 hover:border-pink-300 hover:shadow-apple-md group"
              >
                <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#0071e3] mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-1 tabular-numbers">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#1d1d1f]">
                  {stat.label}
                </div>
                <p className="text-xs text-[#86868b] mt-0.5 leading-snug">
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
