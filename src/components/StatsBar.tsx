import React from 'react';
import { Users, MapPin, ShieldCheck, Headphones } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: 'Millions+',
      label: 'Registered Partners',
      sublabel: 'Across all Indian metros & towns',
      color: 'from-[#FF2D55] to-[#E11D48]',
      textColor: 'text-[#FF2D55]',
      bgLight: 'bg-[#FF2D55]/10',
      borderLight: 'border-[#FF2D55]/20',
    },
    {
      icon: MapPin,
      value: '19,000+',
      label: 'Indian Pin Codes',
      sublabel: '700+ districts in 28 states & 8 UTs',
      color: 'from-[#FF5E3A] to-[#F59E0B]',
      textColor: 'text-[#FF5E3A]',
      bgLight: 'bg-[#FF5E3A]/10',
      borderLight: 'border-[#FF5E3A]/20',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'AI-Verified Profiles',
      sublabel: 'Aadhaar, PAN & background screened',
      color: 'from-[#10B981] to-[#06B6D4]',
      textColor: 'text-[#10B981]',
      bgLight: 'bg-[#10B981]/10',
      borderLight: 'border-[#10B981]/20',
    },
    {
      icon: Headphones,
      value: '24/7',
      label: 'Live SOS Support',
      sublabel: 'In-app safety tracking & rapid response',
      color: 'from-[#0071E3] to-[#7928CA]',
      textColor: 'text-[#0071E3]',
      bgLight: 'bg-[#0071E3]/10',
      borderLight: 'border-[#0071E3]/20',
    },
  ];

  return (
    <section className="py-14 px-4 md:px-6 bg-white/60 backdrop-blur-xl border-y border-black/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border border-black/5 shadow-sm transition-all duration-300 hover:bg-white hover:border-black/10 hover:shadow-apple-lg hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} border ${stat.borderLight} flex items-center justify-center ${stat.textColor} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#1d1d1f] mb-1 tabular-numbers">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-[#1d1d1f] font-sans">
                  {stat.label}
                </div>
                <p className="text-xs text-[#86868b] mt-1 leading-snug font-sans">
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
