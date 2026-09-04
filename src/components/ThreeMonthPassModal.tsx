import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface ThreeMonthPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindCompanion?: () => void;
  userName?: string;
}

export const ThreeMonthPassModal: React.FC<ThreeMonthPassModalProps> = ({
  isOpen,
  onClose,
  onFindCompanion,
  userName = 'Member',
}) => {
  if (!isOpen) return null;

  const benefits = [
    {
      title: 'Zero Platform Commission',
      desc: '100% commission-free bookings directly with verified companions.',
    },
    {
      title: 'Direct Phone & Call Access',
      desc: 'Instantly view verified companion direct numbers upon booking acceptance.',
    },
    {
      title: 'Pan-India Directory Access',
      desc: 'Browse and book verified companions across all 10+ operational tier-1 cities.',
    },
    {
      title: 'Instant Confirmation & SMS Alerts',
      desc: 'Priority booking notifications dispatched straight to your phone and email.',
    },
    {
      title: '24/7 Dedicated Concierge & Safety',
      desc: 'Round-the-clock safety verification, SOS monitoring, and client care.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)] relative overflow-y-auto max-h-[90vh] no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Digital Pass Card */}
        <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1E1B2E] via-[#2A1828] to-[#110811] text-white shadow-xl relative overflow-hidden mb-6 border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#FF2D55]/35 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Pass Tag */}
          <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/brand_logo.png" 
                alt="Click Karo Date Karo" 
                className="h-8 w-auto object-contain drop-shadow-xs brightness-110"
              />
              <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider">
                VIP Pass
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          {/* Pass Name & Details */}
          <div className="space-y-1 mb-6 relative z-10">
            <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              3-Month All-Access Pass
            </h3>
            <p className="text-xs text-white/70 font-medium">
              Official Client Membership &bull; Pass #CK-PASS-3M-9021
            </p>
          </div>

          {/* Pass Meta Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs relative z-10">
            <div>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider block">
                Member
              </span>
              <span className="font-bold text-white text-sm mt-0.5 block truncate">
                {userName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider block">
                Validity Period
              </span>
              <span className="font-bold text-pink-300 text-sm mt-0.5 block">
                Valid Until Dec 2, 2026
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider block">
                Pass Fee
              </span>
              <span className="font-mono font-bold text-white text-sm mt-0.5 block">
                ₹999.00 / 3 Months
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider block">
                Remaining Time
              </span>
              <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                88 Days Active
              </span>
            </div>
          </div>
        </div>

        {/* Benefits Breakdown */}
        <div className="space-y-3 mb-6">
          <h4 className="font-display font-bold text-sm text-[#111827] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF2D55]" />
            <span>Unlocked 3-Month Membership Privileges</span>
          </h4>

          <div className="space-y-2">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-[#FAF8F8] border border-stone-200/70 flex items-start gap-2.5 text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-pink-100 text-[#FF2D55] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-[#111827] block">{b.title}</strong>
                  <span className="text-stone-500 text-[11px] leading-relaxed">{b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {onFindCompanion && (
            <button
              onClick={() => {
                onClose();
                onFindCompanion();
              }}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#111827] hover:bg-[#FF2D55] text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Companions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#111827] font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default ThreeMonthPassModal;
