import React, { useState } from 'react';
import { ShieldCheck, Phone } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01.',
      title: '100% Aadhaar & KYC Verification',
      subtitle: 'Every companion is thoroughly screened with Government IDs (Aadhaar/PAN) and background checks before ever appearing on our network.',
      pillText: 'Identity Checked',
      chatSender: 'Priya Sharma (Verified)',
      chatText: '“Hi! My ID verification and background check is completed. Looking forward to our movie meetup!”',
    },
    {
      num: '02.',
      title: 'Strict Consent-First & Safety Code',
      subtitle: 'Zero tolerance for harassment or boundary crossing. Real-time in-app SOS safety tracking and continuous location monitoring for total peace of mind.',
      pillText: 'Safe & Respectful',
      chatSender: 'Safety Concierge (24/7)',
      chatText: '“SOS emergency protocol & GPS tracking active for your session in Connaught Place.”',
    },
    {
      num: '03.',
      title: 'Hyperlocal 19,000+ Pin Code Matching',
      subtitle: 'Whether you are in Delhi, Mumbai, Bengaluru, or Tier-2 & Tier-3 towns, find vetted companions near your exact location in under 15 minutes.',
      pillText: 'Hyperlocal Reach',
      chatSender: 'Matching Engine',
      chatText: '“Found 18+ verified companions available in Pin Code 110001 within 2 km radius.”',
    },
  ];

  return (
    <section id="trust-blueprint" className="py-24 px-4 sm:px-6 border-b border-pink-200/50 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Master Heading */}
        <div className="w-full max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2 block">
            The Trust Standard
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-3 headline-balance">
            A Social Support Network Built on Real Trust.
          </h2>
          <p className="text-base text-[#1d1d1f]/75 body-pretty">
            Safe, background-checked companions with transparent protocols and 24/7 assistance.
          </p>
        </div>

        {/* LandingHero Signature 2-Column Sticky Architecture */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Side Navigation */}
          <aside className="hidden md:flex sticky top-28 flex-col w-[300px] z-10">
            <div className="flex flex-col">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`group flex items-center gap-3 py-4 border-t transition-all text-left apple-focus ${
                    activeStep === idx 
                      ? 'text-[#0071e3] border-[#0071e3] font-bold' 
                      : 'text-[#1d1d1f]/60 border-pink-200/60 hover:text-[#1d1d1f]'
                  }`}
                >
                  <span className="text-sm tracking-tight">{step.num}</span>
                  <span className="text-sm tracking-tight">{step.title.split(' ')[0]} {step.title.split(' ')[1]}</span>
                </button>
              ))}
              <div className="h-px w-full bg-pink-200/60"></div>
            </div>

            <div className="mt-8 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-200/60">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1d1d1f] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                <span>Zero-Judgment Guarantee</span>
              </div>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                Connect with verified companions freely for any lifestyle or care requirement.
              </p>
            </div>
          </aside>

          {/* Right Column: Feature Cards with Interactive Visuals */}
          <div className="flex-1 flex flex-col gap-10 w-full">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className={`bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
                  activeStep === idx 
                    ? 'border-pink-300 shadow-apple-md' 
                    : 'border-pink-200/60 shadow-sm'
                }`}
              >
                {/* Visual Simulator Frame */}
                <div className="w-full aspect-[1.9] sm:aspect-[2.2] bg-[#161617] rounded-2xl flex flex-col items-center justify-center p-4 sm:p-6 mb-6 relative overflow-hidden text-white border border-white/10">
                  
                  {/* Floating Interactive Pill */}
                  <div className="flex max-w-full items-center rounded-full border border-pink-500/30 bg-black/80 px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
                    <div className="flex items-center gap-2.5 border-r border-white/15 pr-3 sm:pr-4">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs">
                          CK
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-none">{step.pillText}</span>
                        <span className="text-[9px] text-emerald-400 font-semibold tracking-wider uppercase mt-0.5">Verified</span>
                      </div>
                    </div>

                    {/* Animated Equalizer */}
                    <div className="flex items-center gap-1 px-3 sm:px-5">
                      <div className="w-1 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-5 bg-pink-400 rounded-full animate-pulse delay-150"></div>
                      <div className="w-1 h-4 bg-pink-500 rounded-full animate-pulse delay-300"></div>
                      <div className="w-1 h-6 bg-pink-300 rounded-full animate-pulse delay-75"></div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2">
                      <div className="w-7 h-7 rounded-full bg-[#0071e3] text-white flex items-center justify-center">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Speech Bubble */}
                  <div className="mt-4 max-w-sm">
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl rounded-tl-none shadow-md">
                      <div className="text-[10px] text-pink-300 font-bold mb-0.5">{step.chatSender}</div>
                      <p className="text-xs text-white/90 italic leading-relaxed">
                        {step.chatText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text Description */}
                <div>
                  <div className="text-xs font-bold text-[#0071e3] uppercase tracking-wider mb-1">
                    Step {step.num}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#1d1d1f]/75 leading-relaxed body-pretty">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
