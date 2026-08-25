import React, { useState, useMemo } from 'react';
import { ALL_SERVICES } from '../data/servicesData';
import { ServiceItem } from '../types';
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All 16 Services' },
    { id: 'social', label: 'Social & Hangouts' },
    { id: 'support', label: 'Elder & Care Support' },
    { id: 'lifestyle', label: 'Lifestyle & Travel' },
    { id: 'events', label: 'Events & Nightlife' },
  ];

  const filteredServices = useMemo(() => {
    return ALL_SERVICES.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesQuery = 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="services" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider mb-2 block">
              Curated Offerings
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-tight headline-balance">
              Professional Companionship &amp; Care.
            </h2>
            <p className="text-[#1d1d1f]/75 text-base sm:text-lg mt-2 body-pretty">
              16 verified social support services with upfront, transparent hourly rates. Zero hidden booking fees.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <label htmlFor="service-search-box" className="sr-only">Search services</label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input 
                id="service-search-box"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, elder care, dining..."
                className="w-full bg-white/80 backdrop-blur-md border border-pink-200 text-xs sm:text-sm text-[#1d1d1f] rounded-full pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3] shadow-sm transition"
              />
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all apple-focus ${
                selectedCategory === cat.id
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'bg-white/70 backdrop-blur-md text-[#1d1d1f] border border-pink-200/60 hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Bento Service Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-pink-200/60 shadow-sm hover:border-pink-300 hover:shadow-apple-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Icon + Price Tag */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50/80 border border-pink-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {service.emoji}
                  </div>
                  {service.tag && (
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {service.tag}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors mb-1">
                  {service.title}
                </h3>
                <p className="text-xs text-[#86868b] font-medium mb-3">
                  {service.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-[#1d1d1f]/75 leading-relaxed mb-6 body-pretty">
                  {service.description}
                </p>
              </div>

              {/* Bottom: Price + CTA */}
              <div className="pt-3.5 border-t border-pink-100/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#1d1d1f] tabular-numbers">
                      ₹{service.pricePerHour.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#86868b] font-normal">/hr</span>
                  </div>
                  {service.originalPrice && (
                    <span className="text-[10px] text-[#86868b] line-through tabular-numbers">
                      ₹{service.originalPrice.toLocaleString('en-IN')}/hr
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSelectService(service)}
                  aria-label={`Book ${service.title}`}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition shadow-sm flex items-center gap-1 apple-focus active:scale-95"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Guarantee Strip */}
        <div className="mt-12 bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-pink-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#1d1d1f] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#0071e3] shrink-0" />
            <span>All 16 services operate strictly in accordance with our Consent-First and 100% Verified Identity Code.</span>
          </div>
          <a href="#coverage" className="text-[#0071e3] font-semibold hover:underline shrink-0">
            Check local availability &rarr;
          </a>
        </div>

      </div>
    </section>
  );
};
