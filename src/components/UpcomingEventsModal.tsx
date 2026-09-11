import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  Search, 
  Ticket, 
  PlusCircle, 
  Trash2, 
  ShieldCheck,
  CreditCard,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCms } from '../context/CmsContext';
import { 
  CustomEventRecord, 
  fetchAllEvents, 
  recordEventInSupabase, 
  deleteEventById, 
  bookOrJoinEvent 
} from '../services/supabase';

export const SERVING_CITIES_LIST = [
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Chandigarh',
  'Jaipur',
  'Dehradun',
  'Gurgaon',
  'Noida',
  'Ghaziabad',
  'Indore',
  'Lucknow',
  'Meerut',
];

export interface EventItem {
  id: string;
  title: string;
  category: string;
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
  creatorName?: string;
  creatorPhone?: string;
  duration?: string;
  maleFemaleRatio?: string;
  isCustom?: boolean;
  attendees?: Array<{ name: string; phone?: string; avatar?: string; joined_at: string }>;
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
    duration: '4 Hours',
    maleFemaleRatio: '1:1 Balanced',
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
    duration: '4 Hours',
    maleFemaleRatio: '1:1 Balanced',
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
    duration: '4 Hours',
    maleFemaleRatio: '1:1 Balanced',
  },
];

interface UpcomingEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookEventPartner: (event: EventItem) => void;
  onOpenAuth?: () => void;
  userName?: string;
  userPhone?: string;
}

export const UpcomingEventsModal: React.FC<UpcomingEventsModalProps> = ({
  isOpen,
  onClose,
  onBookEventPartner,
  onOpenAuth,
  userName,
  userPhone,
}) => {
  const { content, isAdminLoggedIn } = useCms();
  const [activeTab, setActiveTab] = useState<'all' | 'my-events'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom events loaded from Supabase / localStorage
  const [customEvents, setCustomEvents] = useState<EventItem[]>([]);
  
  // Create Event Form state
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Social Mixer');
  const [formVenue, setFormVenue] = useState('');
  const [formCity, setFormCity] = useState(() => localStorage.getItem('ck_user_city') || 'Delhi NCR');
  const [formDate, setFormDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [formTime, setFormTime] = useState('06:00 PM');
  const [formDuration, setFormDuration] = useState('3 Hours');
  const [formCapacity, setFormCapacity] = useState(4);
  const [formRatio, setFormRatio] = useState('1:1 Balanced');
  const [formDescription, setFormDescription] = useState('');
  const [isPayingFee, setIsPayingFee] = useState(false);

  // View attendees modal state
  const [inspectingEvent, setInspectingEvent] = useState<EventItem | null>(null);

  // Join event modal state
  const [joiningEvent, setJoiningEvent] = useState<EventItem | null>(null);

  const currentUserName = userName || localStorage.getItem('ck_user_name') || '';

  // Load custom events on open
  useEffect(() => {
    if (!isOpen) return;
    loadCustomEvents();
  }, [isOpen]);

  const loadCustomEvents = async () => {
    try {
      const records = await fetchAllEvents();
      const mapped: EventItem[] = records.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        date: r.date,
        time: r.time,
        city: r.city,
        venue: r.venue,
        image: r.image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        priceFormatted: '₹499 (Host Pass)',
        priceNum: 499,
        attendeesCount: r.attendees_count || (r.attendees ? r.attendees.length : 1),
        maxCapacity: r.max_capacity || 10,
        description: r.description,
        tags: [r.category, r.city, 'Host Event'],
        creatorName: r.creator_name,
        creatorPhone: r.creator_phone,
        duration: r.duration,
        maleFemaleRatio: r.male_female_ratio,
        isCustom: true,
        attendees: r.attendees || [],
      }));
      setCustomEvents(mapped);
    } catch (e) {
      console.warn('[Events] Error loading custom events:', e);
    }
  };

  if (!isOpen) return null;

  const cmsEvents: EventItem[] = (content.upcomingEvents?.events && content.upcomingEvents.events.length > 0)
    ? content.upcomingEvents.events.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category || 'Social Mixer',
        date: e.date,
        time: e.time || '04:00 PM – 08:00 PM',
        city: e.city,
        venue: e.venue,
        image: e.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        priceFormatted: `₹${e.price}/session`,
        priceNum: e.price,
        attendeesCount: e.attendeesCount || 20,
        maxCapacity: e.maxSlots || 30,
        description: e.description,
        tags: [e.badge || 'Curated', e.city],
        duration: '4 Hours',
        maleFemaleRatio: '1:1 Balanced',
      }))
    : UPCOMING_EVENTS;

  // Combine standard + live user-created events
  const allEvents = [...customEvents, ...cmsEvents];

  // Filter based on tab & search
  const myEvents = allEvents.filter((e) => 
    e.isCustom && currentUserName && e.creatorName?.toLowerCase() === currentUserName.toLowerCase()
  );

  const displayedEvents = (activeTab === 'my-events' ? myEvents : allEvents).filter((evt) => {
    const matchesCity = selectedCity === 'All Cities' || evt.city.toLowerCase().includes(selectedCity.toLowerCase()) || selectedCity.toLowerCase().includes(evt.city.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && (selectedCity === 'All Cities' || matchesCity);
  });

  // Handle Event Creation with ₹499 Fee
  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserName) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setIsPayingFee(true);

    // Simulate instant secure payment confirmation of ₹499
    setTimeout(async () => {
      const newEventId = `evt-user-${Date.now()}`;
      const newRecord: CustomEventRecord = {
        id: newEventId,
        title: formTitle,
        category: formCategory,
        venue: formVenue,
        city: formCity,
        date: formDate,
        time: formTime,
        duration: formDuration,
        male_female_ratio: formRatio,
        max_capacity: Number(formCapacity),
        attendees_count: 1,
        description: formDescription,
        creator_name: currentUserName,
        creator_phone: userPhone || localStorage.getItem('ck_user_phone') || '',
        creator_email: localStorage.getItem('ck_user_email') || '',
        listing_fee_paid: true,
        listing_fee_amount: 499,
        attendees: [
          {
            name: `${currentUserName} (Host)`,
            joined_at: new Date().toISOString(),
          }
        ],
      };

      await recordEventInSupabase(newRecord);
      await loadCustomEvents();

      setIsPayingFee(false);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });

      setTimeout(() => {
        setIsCreatingEvent(false);
        setActiveTab('my-events');
        // Reset form
        setFormTitle('');
        setFormVenue('');
        setFormDescription('');
      }, 1200);
    }, 1200);
  };

  // Handle Admin / Creator Deleting an Event
  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to remove this event from the website?')) {
      await deleteEventById(eventId);
      await loadCustomEvents();
      if (inspectingEvent?.id === eventId) setInspectingEvent(null);
    }
  };

  // Handle Joining an Event
  const handleJoinEvent = async (event: EventItem) => {
    const resolvedName = currentUserName || 'Verified Member';
    await bookOrJoinEvent(event.id, {
      name: resolvedName,
      phone: userPhone || localStorage.getItem('ck_user_phone') || '+91 97193 33339',
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    await loadCustomEvents();
    setTimeout(() => {
      setJoiningEvent(null);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in font-sans"
    >
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.22)] relative flex flex-col max-h-[92vh] overflow-hidden">
        
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
                Explore curated public meetups, or create your own event and find a verified partner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!currentUserName) {
                  if (onOpenAuth) onOpenAuth();
                  else alert('Please sign in to create an event');
                  return;
                }
                setIsCreatingEvent(true);
              }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white text-xs font-bold shadow-sm hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event (₹499)</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector & Filters */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 shrink-0">
          <div className="flex rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-[#111827] shadow-xs' : 'text-stone-500'
              }`}
            >
              All Events ({allEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my-events')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my-events' ? 'bg-white text-[#FF2D55] shadow-xs' : 'text-stone-500'
              }`}
            >
              <span>My Created Events</span>
              {myEvents.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FF2D55] text-white text-[10px] flex items-center justify-center font-bold">
                  {myEvents.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="bg-[#f9fafb] border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#f9fafb] border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-700 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Social Mixer">Social Mixer</option>
              <option value="Dining & Food">Dining & Food</option>
              <option value="Concert & Music">Concert & Music</option>
              <option value="Art & Culture">Art & Culture</option>
              <option value="Gaming & Fun">Gaming & Fun</option>
              <option value="Nightlife">Nightlife</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#f9fafb] border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-700 focus:outline-none"
            >
              <option value="All Cities">All Cities</option>
              {SERVING_CITIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {displayedEvents.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Ticket className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="font-bold text-sm text-[#111827]">No events found</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {activeTab === 'my-events' 
                  ? "You haven't hosted any events yet. Click 'Create Event' to host your outing for ₹499!" 
                  : "Try adjusting your search query or city filter to see upcoming events."}
              </p>
              {activeTab === 'my-events' && (
                <button
                  onClick={() => setIsCreatingEvent(true)}
                  className="px-5 py-2.5 rounded-full bg-[#FF2D55] text-white text-xs font-bold cursor-pointer"
                >
                  Create Your First Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedEvents.map((evt) => (
                <div 
                  key={evt.id}
                  className="bg-[#fcfbfb] rounded-2xl border border-stone-200 hover:border-pink-300 transition-all overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Top image & badges */}
                    <div className="relative h-40 w-full overflow-hidden bg-stone-100">
                      <img 
                        src={evt.image} 
                        alt={evt.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#FF2D55] text-white text-[10px] font-bold shadow-xs">
                          {evt.category}
                        </span>
                        {evt.isCustom && (
                          <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-xs">
                            Member Hosted
                          </span>
                        )}
                      </div>

                      {/* Admin Delete Power or Creator Delete */}
                      {(isAdminLoggedIn || (evt.isCustom && evt.creatorName?.toLowerCase() === currentUserName.toLowerCase())) && (
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md cursor-pointer transition"
                          title="Delete this event from site"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-bold text-sm leading-snug line-clamp-1">{evt.title}</h4>
                        <p className="text-[11px] text-stone-200 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
                          <span className="truncate">{evt.venue}, {evt.city}</span>
                        </p>
                      </div>
                    </div>

                    {/* Meta Specs: Ratio, Duration, Capacity */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#FF2D55]" />
                          <span className="font-bold text-[#111827]">{evt.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#0071E3]" />
                          <span>{evt.time} ({evt.duration || '3 Hours'})</span>
                        </div>
                      </div>

                      {evt.maleFemaleRatio && (
                        <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                          <span className="text-[11px] text-stone-400">Ratio Preference:</span>
                          <span className="font-bold text-[#111827] bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100 text-[11px]">
                            {evt.maleFemaleRatio}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {evt.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{evt.attendeesCount} / {evt.maxCapacity} Booked</span>
                        </span>

                        {evt.creatorName && (
                          <span className="text-[11px] text-stone-500">
                            Host: <strong>{evt.creatorName}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 flex gap-2">
                    {evt.isCustom && evt.creatorName?.toLowerCase() === currentUserName.toLowerCase() ? (
                      <button
                        type="button"
                        onClick={() => setInspectingEvent(evt)}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Joined Attendees ({evt.attendees?.length || 1})</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onBookEventPartner(evt);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Book Companion</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setJoiningEvent(evt)}
                          className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#111827] font-bold text-xs transition cursor-pointer"
                        >
                          Join Event
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Aadhaar Verified Companions &bull; Public Venues Only</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

      {/* CREATE EVENT MODAL (₹499 Listing Fee) */}
      {isCreatingEvent && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-pink-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF2D55]" />
                <h3 className="font-display font-bold text-lg text-[#111827]">
                  Host Your Event (₹499 Fee)
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingEvent(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Saturday Night Cocktails & Jazz at Hauz Khas"
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3 py-2 font-bold focus:outline-none"
                  >
                    <option value="Social Mixer">Social Mixer</option>
                    <option value="Dining & Food">Dining & Food</option>
                    <option value="Concert & Music">Concert & Music</option>
                    <option value="Art & Culture">Art & Culture</option>
                    <option value="Gaming & Fun">Gaming & Fun</option>
                    <option value="Nightlife">Nightlife</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">City</label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3 py-2 font-bold focus:outline-none"
                  >
                    {SERVING_CITIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Venue / Address</label>
                <input
                  type="text"
                  required
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  placeholder="e.g. CyberHub Social / Elante Mall / Colaba Bistro"
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3 py-2 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 07:00 PM"
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3 py-2 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">No. of People</label>
                  <select
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-2 py-2 font-bold focus:outline-none"
                  >
                    <option value={2}>2 People</option>
                    <option value={4}>4 People</option>
                    <option value={6}>6 People</option>
                    <option value={10}>10 People</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Gender Ratio</label>
                  <select
                    value={formRatio}
                    onChange={(e) => setFormRatio(e.target.value)}
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-2 py-2 font-bold focus:outline-none text-[11px]"
                  >
                    <option value="1:1 Balanced">1:1 Balanced</option>
                    <option value="Females Preferred">Females Pref.</option>
                    <option value="Males Preferred">Males Pref.</option>
                    <option value="All Welcome">All Welcome</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-2 py-2 font-bold focus:outline-none text-[11px]"
                  >
                    <option value="2 Hours">2 Hours</option>
                    <option value="3 Hours">3 Hours</option>
                    <option value="4 Hours">4 Hours</option>
                    <option value="Full Evening">Full Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Event Note / Plan</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe your plan e.g. Looking for companions to join for a live gig followed by dinner."
                  className="w-full bg-[#fdf8f8] border border-pink-200 rounded-xl px-3.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                />
              </div>

              {/* Fee Breakdown */}
              <div className="p-3 rounded-2xl bg-pink-50/80 border border-pink-200 space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Event Listing &amp; Verification Fee:</span>
                  <span className="text-[#FF2D55]">₹499.00</span>
                </div>
                <p className="text-[10px] text-stone-500">
                  Includes live publishing on website, companion notification, and booking management.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPayingFee}
                className="w-full py-3.5 rounded-2xl bg-[#FF2D55] hover:bg-[#E11D48] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPayingFee ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹499 &amp; Publish Live</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT ATTENDEES MODAL (FOR CREATOR) */}
      {inspectingEvent && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-base text-[#111827]">
                  Event Applicants &amp; Bookings
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1">{inspectingEvent.title}</p>
              </div>
              <button
                onClick={() => setInspectingEvent(null)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(!inspectingEvent.attendees || inspectingEvent.attendees.length === 0) ? (
                <p className="text-xs text-stone-500 text-center py-6">No outside bookings yet. Companions are currently reviewing your event.</p>
              ) : (
                inspectingEvent.attendees.map((att, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FF2D55]/10 text-[#FF2D55] font-bold flex items-center justify-center">
                        {att.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#111827]">{att.name}</p>
                        <p className="text-[10px] text-stone-400">Joined via Portal</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setInspectingEvent(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* JOIN EVENT CONFIRMATION MODAL */}
      {joiningEvent && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-[#FF2D55] flex items-center justify-center mx-auto">
              <Ticket className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-base text-[#111827]">Join this Event?</h4>
              <p className="text-xs text-stone-600 mt-1 line-clamp-2">{joiningEvent.title}</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 text-left text-xs space-y-1">
              <p><strong>Venue:</strong> {joiningEvent.venue}, {joiningEvent.city}</p>
              <p><strong>Date &amp; Time:</strong> {joiningEvent.date} at {joiningEvent.time}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setJoiningEvent(null)}
                className="py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleJoinEvent(joiningEvent)}
                className="py-2.5 rounded-xl bg-[#FF2D55] text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Confirm Join
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UpcomingEventsModal;
