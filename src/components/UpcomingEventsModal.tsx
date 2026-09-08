import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, Users, Sparkles, ArrowRight, CheckCircle2, Search, Ticket } from 'lucide-react';

export interface EventItem {
  id: string;
  title: string;
  category: 'Social Mixer' | 'Concert & Music' | 'Dining & Food' | 'Art & Culture' | 'Gaming & Fun' | 'Nightlife';
  date: string;
  time: string;
  city: string;
  venue: string;
  image: string;
  priceFormatted: string;
  priceNum: number;
  attendeesCount: number;
  maxCapacity: number;
  description: string;
  tags: string[];
}

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 'evt-delhi-acoustic',
    title: 'Delhi Sunset Rooftop Acoustic & Social Mixer',
    category: 'Concert & Music',
    date: 'Sep 12, 2026 (Saturday)',
    time: '05:30 PM – 09:30 PM',
    city: 'Delhi NCR',
    venue: 'The Skyline Lounge & Terrace, Hauz Khas Village',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    priceFormatted: '₹2,000/session',
    priceNum: 2000,
    attendeesCount: 28,
    maxCapacity: 35,
    description: 'An intimate evening of live indie-acoustic melodies, artisanal coffees, mocktails, and verified companion introductions against the sunset skyline.',
    tags: ['Live Music', 'Sunset View', 'Acoustic'],
  },
  {
    id: 'evt-mumbai-yacht',
    title: 'Mumbai Marine Sunset Lounge & Dining Walk',
    category: 'Dining & Food',
    date: 'Sep 13, 2026 (Sunday)',
    time: '04:00 PM – 08:00 PM',
    city: 'Mumbai',
    venue: 'Gateway Promenade & Sea-View Bistro, Colaba',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    priceFormatted: '₹2,000/session',
    priceNum: 2000,
    attendeesCount: 42,
    maxCapacity: 50,
    description: 'Breeze along Marine Drive, coastal gourmet tasting, sunset coffee chats, and verified companion accompaniment for premier photo memories.',
    tags: ['Coastal Walk', 'Fine Dining', 'Sunset'],
  },
  {
    id: 'evt-blr-tech-coffee',
    title: 'Bengaluru Tech & Coffee Creators Gathering',
    category: 'Social Mixer',
    date: 'Sep 19, 2026 (Saturday)',
    time: '11:00 AM – 03:00 PM',
    city: 'Bengaluru',
    venue: 'Roastery Coffee House & Garden, Indiranagar',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    priceFormatted: '₹1,500/session',
    priceNum: 1500,
    attendeesCount: 19,
    maxCapacity: 25,
    description: 'Casual specialty brew cupping, startup & tech ideas dialogue, and relaxed outdoor garden networking with cultured companions.',
    tags: ['Specialty Coffee', 'Tech Talks', 'Networking'],
  },
  {
    id: 'evt-chd-film-fest',
    title: 'Chandigarh Art-House Film & Cinema Night',
    category: 'Art & Culture',
    date: 'Sep 20, 2026 (Sunday)',
    time: '06:00 PM – 10:00 PM',
    city: 'Chandigarh',
    venue: 'Elante Luxury Cinepolis VIP & Gourmet Cafe',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    priceFormatted: '₹2,000/session',
    priceNum: 2000,
    attendeesCount: 22,
    maxCapacity: 30,
    description: 'Premier blockbuster screening followed by film discussion over desserts with a movie enthusiast companion.',
    tags: ['Cinema', 'IMAX Screening', 'Gourmet'],
  },
  {
    id: 'evt-jaipur-heritage',
    title: 'Jaipur Twilight Fort & Heritage Cafe Stroll',
    category: 'Art & Culture',
    date: 'Sep 26, 2026 (Saturday)',
    time: '04:30 PM – 08:30 PM',
    city: 'Jaipur',
    venue: 'Nahargarh Fort Padao & Pink City Heritage Courtyard',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80',
    priceFormatted: '₹2,000/session',
    priceNum: 2000,
    attendeesCount: 16,
    maxCapacity: 20,
    description: 'Explore the illuminated royal courtyards, traditional chai tastings, and panoramic city lights accompanied by a verified cultural companion.',
    tags: ['Heritage Tour', 'Royal Forts', 'Photography'],
  },
  {
    id: 'evt-gaming-night',
    title: 'Cyber Arena LAN & VR Gaming Match-Up',
    category: 'Gaming & Fun',
    date: 'Sep 27, 2026 (Sunday)',
    time: '02:00 PM – 06:00 PM',
    city: 'Delhi NCR',
    venue: 'Smaaash VR & Gaming Arena, Cyber Hub Gurgaon',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    priceFormatted: '₹1,800/session',
    priceNum: 1800,
    attendeesCount: 31,
    maxCapacity: 40,
    description: 'High-energy physical gaming, bowling, arcade showdowns, and VR simulator co-op with an energetic verified gaming partner.',
    tags: ['VR Gaming', 'Arcade', 'CyberHub'],
  },
];

interface UpcomingEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookEventPartner: (event: EventItem) => void;
}

export const UpcomingEventsModal: React.FC<UpcomingEventsModalProps> = ({
  isOpen,
  onClose,
  onBookEventPartner,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredEvents = UPCOMING_EVENTS.filter((evt) => {
    const matchesCity = selectedCity === 'All Cities' || evt.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.22)] relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF2D55] to-[#9333EA] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl sm:text-2xl text-[#111827]">
                  Upcoming Events &amp; Social Mixers
                </h2>
                <span className="text-[10px] uppercase font-extrabold bg-pink-100 text-[#FF2D55] px-2.5 py-0.5 rounded-full border border-pink-200">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Explore curated public meetups and book a verified companion to accompany you
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="py-4 space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event or venue..."
                className="w-full bg-[#f9fafb] border border-stone-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              />
            </div>

            {/* City Filter */}
            <div className="sm:col-span-1">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#f9fafb] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              >
                <option value="All Cities">All Cities (10 Launch Hubs)</option>
                <option value="Delhi NCR">Delhi NCR &amp; Gurgaon</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#f9fafb] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              >
                <option value="All">All Categories</option>
                <option value="Social Mixer">Social Mixers</option>
                <option value="Concert & Music">Concert &amp; Live Music</option>
                <option value="Dining & Food">Fine Dining &amp; Cafes</option>
                <option value="Art & Culture">Art &amp; Heritage</option>
                <option value="Gaming & Fun">Gaming &amp; Activities</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="overflow-y-auto no-scrollbar space-y-4 flex-1 pr-1">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-300">
              <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-stone-800">No events found matching filters</h4>
              <p className="text-xs text-stone-500 mt-1">Try resetting your city or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-3xl border border-pink-100 bg-[#FAF8F8] hover:bg-white hover:border-pink-300 transition-all shadow-xs hover:shadow-apple-md overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Image Banner */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#111827] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {evt.category}
                      </span>

                      <span className="absolute top-3 right-3 bg-[#FF2D55] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                        {evt.priceFormatted}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-display font-bold text-base line-clamp-1 leading-snug drop-shadow-sm">
                          {evt.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-white/90 mt-0.5">
                          <MapPin className="w-3 h-3 text-pink-300 shrink-0" />
                          <span className="truncate">{evt.city} &bull; {evt.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Description */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#4B5563] bg-white p-2.5 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#FF2D55]" />
                          <span className="font-bold text-[#111827]">{evt.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#0071E3]" />
                          <span>{evt.time.split('–')[0]}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {evt.description}
                      </p>

                      {/* Tags & Occupancy */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap gap-1">
                          {evt.tags.map((t, idx) => (
                            <span key={idx} className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>

                        <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                          <Users className="w-3.5 h-3.5" />
                          <span>{evt.attendeesCount}/{evt.maxCapacity} Booked</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Trigger Button */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onBookEventPartner(evt);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book Event Partner for this Event</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Aadhaar Verified Companions Only &bull; Safe Public Venues</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpcomingEventsModal;
