import React, { useState } from 'react';
import { FAQS } from '../data/servicesData';
import { ChevronDown, MessageCircle } from 'lucide-react';

interface FaqSectionProps {
  onOpenBooking: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenBooking }) => {
  const [openId, setOpenId] = useState<string>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Safety', 'Booking', 'Earnings', 'Partners', 'Pricing'];

  const filteredFaqs = FAQS.filter(
    (faq) => activeCategory === 'All' || faq.category === activeCategory
  );

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 border-b border-pink-200/50 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2 block">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-3 headline-balance">
            Frequently Asked Questions.
          </h2>
          <p className="text-base text-[#1d1d1f]/75 max-w-lg mx-auto body-pretty">
            Everything you need to know about safety protocols, booking procedures, and partner payouts.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition apple-focus ${
                  activeCategory === cat
                    ? 'bg-[#1d1d1f] text-white shadow-sm'
                    : 'bg-white/80 border border-pink-200/60 text-[#1d1d1f] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white/85 backdrop-blur-xl rounded-2xl border border-pink-200/70 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 apple-focus"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#1d1d1f]">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-[#1d1d1f] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#0071e3]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#1d1d1f]/80 leading-relaxed border-t border-pink-100/60 body-pretty">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 24/7 Concierge Strip */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-pink-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 text-[#0071e3] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1d1d1f]">Have a specific query or custom requirement?</h4>
              <p className="text-xs text-[#86868b]">Our dedicated support concierge is available 24/7 across all states.</p>
            </div>
          </div>
          <button
            onClick={onOpenBooking}
            className="bg-[#1d1d1f] hover:bg-[#0071e3] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition shrink-0 apple-focus"
          >
            Contact Concierge
          </button>
        </div>

      </div>
    </section>
  );
};
