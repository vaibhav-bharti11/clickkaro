import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_COMPANIONS } from '../data/mockProfiles';
import { CompanionProfile, ServiceCredit } from '../types';
import { 
  MapPin, 
  Search, 
  Star, 
  Heart, 
  ArrowLeft, 
  CheckCircle2, 
  LogOut, 
  Filter, 
  Bell, 
  Settings, 
  CreditCard,
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Receipt,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchCompanionsFromSupabase, recordBookingInSupabase, deleteClientAccountFromSupabase } from '../services/supabase';
import { MyBookingsModal } from './MyBookingsModal';
import { TransactionsModal } from './TransactionsModal';
import { ThreeMonthPassModal } from './ThreeMonthPassModal';
import { LegalPolicyModal } from './LegalPolicyModal';
import { UpcomingEventsModal, EventItem } from './UpcomingEventsModal';
import { CompanionProfileView } from './CompanionProfileView';

interface SeekerDashboardProps {
  userName: string;
  userAvatar?: string;
  onUpdateAvatar?: (url: string) => void;
  onBackToHome: () => void;
  onSwitchToCompanion: () => void;
  onLogout?: () => void;
  activeCredit?: ServiceCredit | null;
  availableCredits?: ServiceCredit[];
  onConfirmBooking?: (companion: CompanionProfile, credit: ServiceCredit, bookingCode: string) => void;
  onOpenBuyServices?: () => void;
  onGoToDashboard?: () => void;
  onViewMyBookings?: () => void;
}

// Expanded mock list for companion grid to match Image 3 aesthetics
const ADDITIONAL_COMPANIONS: CompanionProfile[] = [
  {
    id: 'comp-akshita',
    name: 'Akshita Bhutra',
    age: 24,
    city: 'Mumbai',
    pinCode: '400050',
    rating: 5.00,
    reviewCount: 2,
    hourlyRate: 1999,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    badges: ['Face Verified', 'Top Rated Companion', '100% KYC'],
    bio: 'Easygoing, ambitious, and always up for meaningful conversations. I value honesty, kindness, and mutual respect. Looking to connect with someone who enjoys good company, laughter, and building something real together.',
    verifiedKYC: true,
    online: false,
    distanceKm: 2.5,
    languages: ['Hindi', 'English', 'Marathi'],
    services: [
      'Hangout',
      'Movie Partner',
      'Clubbing',
      'Lunch/Dinner',
      'Travel Partner',
      'Coffee Partner',
    ],
    hobbies: ['Book reading', 'Shopping', 'Movies', 'Pottery'],
    availability: {
      Mon: '11:00 – 23:00',
      Tue: '11:00 – 23:00',
      Wed: '11:00 – 23:00',
      Thu: '11:00 – 23:00',
      Fri: '11:00 – 23:00',
      Sat: '11:00 – 23:00',
      Sun: '11:00 – 23:00',
    },
    memberSince: 'Jun 2026',
    reviewsList: [
      { rating: 5, date: '8/8/2026', comment: 'Awesome' },
      { rating: 5, date: '8/4/2026', comment: '' },
    ],
    coverGradient: 'bg-gradient-to-r from-[#9333EA] via-[#D946EF] to-[#EC4899]',
  },
  {
    id: 'comp-roshni',
    name: 'Roshni Punjabi',
    age: 23,
    city: 'Veraval',
    pinCode: '362265',
    rating: 5.00,
    reviewCount: 2,
    hourlyRate: 1999,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    badges: ['Face Verified', 'Social Butterfly'],
    bio: '“A social butterfly, love sushi or any good food, will have a hard time if you ask me to choose a place...”',
    verifiedKYC: true,
    online: true,
    distanceKm: 2.1,
    languages: ['Hindi', 'English', 'Gujarati'],
    services: ['hangout', 'dining', 'coffee-partner'],
  },
  {
    id: 'comp-aarav',
    name: 'Aarav Mehta',
    age: 25,
    city: 'Mumbai',
    pinCode: '400050',
    rating: 4.95,
    reviewCount: 4,
    hourlyRate: 2000,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    badges: ['Face Verified', 'Film Enthusiast'],
    bio: '“Cinephile, coffee lover, and passionate conversationalist. Great company for art-house movies and premier lounges.”',
    verifiedKYC: true,
    online: true,
    distanceKm: 3.4,
    languages: ['Hindi', 'English', 'Marathi'],
    services: ['movie-partner', 'hangout'],
  },
  {
    id: 'comp-tanya',
    name: 'Tanya Sharma',
    age: 22,
    city: 'Delhi',
    pinCode: '110001',
    rating: 4.98,
    reviewCount: 3,
    hourlyRate: 1800,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    badges: ['Face Verified', 'Foodie Guide'],
    bio: '“Explorer at heart! Let us discover the best cafes, hidden culinary spots, and serene evening book walks.”',
    verifiedKYC: true,
    online: true,
    distanceKm: 1.8,
    languages: ['Hindi', 'English', 'Punjabi'],
    services: ['dining', 'coffee-partner'],
  },
  {
    id: 'comp-kabir',
    name: 'Kabir Singhania',
    age: 27,
    city: 'Bengaluru',
    pinCode: '560001',
    rating: 4.90,
    reviewCount: 5,
    hourlyRate: 2200,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    badges: ['Face Verified', 'Tech & Networking'],
    bio: '“Tech entrepreneur and fitness enthusiast. Ideal partner for social networking events, high-end dinners, and marathon talks.”',
    verifiedKYC: true,
    online: false,
    distanceKm: 5.2,
    languages: ['English', 'Hindi'],
    services: ['events', 'hangout'],
  },
  {
    id: 'comp-simran',
    name: 'Simran Verma',
    age: 24,
    city: 'Chandigarh',
    pinCode: '160017',
    rating: 5.00,
    reviewCount: 3,
    hourlyRate: 1999,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    badges: ['Face Verified', 'Cultural Enthusiast'],
    bio: '“Lover of live theater, museum tours, and cozy acoustic music concerts. Friendly, empathetic, and always punctual.”',
    verifiedKYC: true,
    online: true,
    distanceKm: 4.1,
    languages: ['Hindi', 'English', 'Punjabi'],
    services: ['hangout', 'events', 'movie-partner'],
  },
  {
    id: 'comp-ananya',
    name: 'Ananya Roy',
    age: 23,
    city: 'Kolkata',
    pinCode: '700016',
    rating: 4.92,
    reviewCount: 2,
    hourlyRate: 1750,
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    badges: ['Face Verified', 'Art & Photography'],
    bio: '“Photography geek and heritage walker. If you need someone with great energy for a gallery opening or street food crawl, I am here.”',
    verifiedKYC: true,
    online: true,
    distanceKm: 2.7,
    languages: ['Bengali', 'Hindi', 'English'],
    services: ['travel-partner', 'coffee-partner'],
  },
];

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({
  userName,
  userAvatar,
  onBackToHome,
  onLogout,
  activeCredit,
  availableCredits = [],
  onConfirmBooking,
  onOpenBuyServices,
  onGoToDashboard,
  onViewMyBookings: _onViewMyBookings,
}) => {
  // Search & Filter State (Matching Image 3)
  const [filterName, setFilterName] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterService, setFilterService] = useState('All Services');
  const [filterGender, setFilterGender] = useState('All Genders');
  
  // Selected Profile Modal state
  const [selectedProfile, setSelectedProfile] = useState<CompanionProfile | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const userPhone = localStorage.getItem('ck_user_phone') || '9719333339';

  // POPUP CONFIRMATION STATES (Requested by user)
  const [confirmingCompanion, setConfirmingCompanion] = useState<CompanionProfile | null>(null);
  const [bookingSuccessData, setBookingSuccessData] = useState<{ companion: CompanionProfile; bookingCode: string; serviceTitle: string; dateTime: string } | null>(null);
  const [bookingsModal, setBookingsModal] = useState(false);
  const [transactionsModal, setTransactionsModal] = useState(false);
  const [threeMonthPassModal, setThreeMonthPassModal] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'refund' | 'terms'>('privacy');
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [serviceMismatchAlert, setServiceMismatchAlert] = useState<{ compName: string; requiredService: string } | null>(null);

  // Booking Date & Time selection states (Requested by user)
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState('06:00 PM');
  const [customTime, setCustomTime] = useState('');
  const [bookingHours, setBookingHours] = useState(4);
  const [selectedCreditId, setSelectedCreditId] = useState<string>('');

  // Helper to determine exact service duration in hours from credit
  const getCreditDurationHours = (credit?: ServiceCredit | null): number => {
    if (!credit) return 4;
    const sId = (credit.serviceId || '').toLowerCase();
    const title = (credit.displayTitle || credit.serviceName || '').toLowerCase();
    
    if (sId.includes('travel') || sId.includes('tour') || title.includes('12 hour')) return 12;
    if (sId.includes('club') || sId.includes('night') || title.includes('6 hour')) return 6;
    if (sId.includes('hangout') || sId.includes('movie') || title.includes('4 hour')) return 4;
    if (sId.includes('lunch') || sId.includes('dinner') || title.includes('2 hour')) return 2;
    if (sId.includes('coffee') || sId.includes('cafe') || sId.includes('quick') || title.includes('1 hour')) return 1;
    
    const match = title.match(/(\d+)\s*hour/i);
    if (match) return parseInt(match[1], 10);
    return 4;
  };

  const currentCredit = (selectedCreditId 
    ? availableCredits.find(c => c.id === selectedCreditId) 
    : null) || activeCredit || (availableCredits && availableCredits.length > 0 ? availableCredits[0] : null);

  useEffect(() => {
    if (currentCredit) {
      setBookingHours(getCreditDurationHours(currentCredit));
    }
  }, [currentCredit]);

  const [companions, setCompanions] = useState<CompanionProfile[]>(MOCK_COMPANIONS);
  const [_loadingCompanions, setLoadingCompanions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all 100 verified model companions directly from Supabase database
  useEffect(() => {
    let isMounted = true;
    setLoadingCompanions(true);
    fetchCompanionsFromSupabase().then((data) => {
      if (isMounted) {
        if (data && data.length > 0) {
          const existingNames = new Set(data.map(d => d.name.toLowerCase()));
          const extra = ADDITIONAL_COMPANIONS.filter(a => !existingNames.has(a.name.toLowerCase()));
          setCompanions([...extra, ...data]);
        } else {
          setCompanions([...ADDITIONAL_COMPANIONS, ...MOCK_COMPANIONS]);
        }
        setLoadingCompanions(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const filteredCompanions = useMemo(() => {
    return companions.filter((comp) => {
      const q = filterName.trim().toLowerCase();
      const matchesName = !q || comp.name.toLowerCase().includes(q) || (comp.bio && comp.bio.toLowerCase().includes(q));
      
      const c = filterCity.trim().toLowerCase();
      const matchesCity = !c || c === 'all cities' || comp.city.toLowerCase().includes(c) || comp.pinCode.includes(c);
      
      const matchesService = filterService === 'All Services' || 
        comp.services.some(s => s.toLowerCase().includes(filterService.toLowerCase().replace(/\s+/g, '-')));

      const femaleRegex = /Priya|Ananya|Kavya|Simran|Alia|Sneha|Natasha|Zoya|Ayesha|Diya|Riddhi|Pooja|Kritika|Tanya|Shivani|Palak|Garima|Aditi|Bhavna|Radhika|Harleen|Meera|Avneet|Jasleen|Parneet|Maya|Shreya|Kavitha|Tara|Prerna|Sonal|Ritika|Divya|Gauri|Suhani|Meenakshi|Tanvi|Ishani|Muskan|Saloni|Kavita|Shanaya|Alisha/i;
      const isFemale = femaleRegex.test(comp.name);
      const matchesGender = filterGender === 'All Genders' || 
        (filterGender === 'Female' && isFemale) ||
        (filterGender === 'Male' && !isFemale);

      return matchesName && matchesCity && matchesService && matchesGender;
    });
  }, [companions, filterName, filterCity, filterService, filterGender]);

  // Click on companion card "Book" button -> enforce service lock if user recharged for a specific service
  const handleBookClick = (companion: CompanionProfile) => {
    const hasCredit = Boolean(activeCredit) || (availableCredits && availableCredits.length > 0);
    if (!hasCredit) {
      if (onOpenBuyServices) {
        onOpenBuyServices();
      }
      return;
    }

    const targetCredit = currentCredit;
    if (targetCredit) {
      const requiredId = (targetCredit.serviceId || 'hangout').toLowerCase().replace(/\s+/g, '-');
      const compServices = (companion.services || []).map((s) => s.toLowerCase().replace(/\s+/g, '-'));
      
      // Strict rule: When recharged for Hangout (or any service), companion must offer that service!
      const offersService = compServices.some(s => s === requiredId || s.includes(requiredId) || requiredId.includes(s));
      if (!offersService) {
        setServiceMismatchAlert({
          compName: companion.name,
          requiredService: targetCredit.displayTitle || targetCredit.serviceName,
        });
        return;
      }

      // Strictly set bookingHours to the recharged service duration
      const hours = getCreditDurationHours(targetCredit);
      setBookingHours(hours);
    }

    setConfirmingCompanion(companion);
  };

  // User clicked "Yes, Confirm Booking"
  const handleConfirmBookingYes = async () => {
    if (!confirmingCompanion) return;
    
    // Strict credit validation: cannot book without an active or available credit
    const targetCredit = currentCredit;
    if (!targetCredit) {
      setConfirmingCompanion(null);
      if (onOpenBuyServices) onOpenBuyServices();
      return;
    }

    const comp = confirmingCompanion;
    setConfirmingCompanion(null);

    const bookingCode = `CK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const selectedTime = customTime.trim() || bookingTimeSlot;
    const fullDateTime = `${bookingDate} at ${selectedTime}`;
    const hours = getCreditDurationHours(targetCredit);

    // 1. Ingest booking directly to Supabase bookings table
    try {
      await recordBookingInSupabase({
        client_name: userName || 'Member',
        client_phone: userPhone,
        client_email: localStorage.getItem('ck_user_email') || `${userName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        service_id: targetCredit.serviceId || 'hangout',
        service_title: targetCredit.displayTitle || targetCredit.serviceName,
        city: comp.city,
        pin_code: comp.pinCode,
        booking_date: fullDateTime,
        hours: hours,
        total_price: targetCredit.priceNum || 1770,
        companion_name: comp.name,
        companion_avatar: comp.avatarUrl,
        concierge_notes: `Booking Code: ${bookingCode} | Scheduled: ${fullDateTime} (${hours} Hours - ${targetCredit.displayTitle || targetCredit.serviceName})`,
      });
    } catch (err) {
      console.warn('[SeekerDashboard] Record booking Supabase notice:', err);
    }

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });

    if (onConfirmBooking) {
      onConfirmBooking(comp, targetCredit, bookingCode);
    }

    setBookingSuccessData({
      companion: comp,
      bookingCode,
      serviceTitle: targetCredit.displayTitle || targetCredit.serviceName,
      dateTime: fullDateTime,
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f8] text-[#1d1d1f] font-sans pb-24">
      
      {/* 1. TOP NAV BAR (ClickKaro Bespoke Design) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-pink-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onGoToDashboard || onBackToHome}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1d1d1f] hover:text-[#FF2D55] transition apple-focus cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Official Click Karo Date Karo Company Logo */}
            <div 
              onClick={onGoToDashboard || onBackToHome}
              className="flex items-center cursor-pointer select-none group/logo"
              title="Click Karo Date Karo"
            >
              <img 
                src="/assets/brand_logo.png" 
                alt="Click Karo Date Karo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105 drop-shadow-xs"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-bold text-[#1d1d1f]/75">
            <button onClick={onGoToDashboard || onBackToHome} className="hover:text-[#FF2D55] transition">Services</button>
            <button onClick={onGoToDashboard || onBackToHome} className="hover:text-[#FF2D55] transition">Why Choose Us</button>
            <button onClick={onGoToDashboard || onBackToHome} className="hover:text-[#FF2D55] transition">Pricing</button>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <button className="w-10 h-10 rounded-full hover:bg-pink-50 flex items-center justify-center text-[#1d1d1f]">
                <Bell className="w-5 h-5 text-[#4B5563]" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF2D55] text-white text-[10px] font-bold flex items-center justify-center">
                  5
                </span>
              </button>
            </div>

            {/* Settings Menu Dropdown */}
            <div className="relative" ref={settingsMenuRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-white border border-pink-200/80 hover:border-[#FF2D55]/50 shadow-xs transition-all cursor-pointer group"
              >
                <img
                  src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-100 group-hover:ring-[#FF2D55]/30 transition"
                />
                <Settings className="w-4 h-4 text-[#4B5563] group-hover:rotate-45 transition-transform duration-300" />
              </button>

              {/* Exact Settings Dropdown from Screenshot */}
              {showSettingsMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-stone-200/80 p-2 z-50 animate-fade-in divide-y divide-stone-100">
                  <div className="px-4 py-3.5">
                    <div className="font-display font-bold text-sm text-[#111827] truncate">
                      {userName}
                    </div>
                    <div className="text-xs text-[#6B7280] font-mono mt-0.5">
                      {userPhone}
                    </div>
                  </div>

                  <div className="py-2 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (onGoToDashboard) onGoToDashboard();
                        else onBackToHome();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#6B7280]" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setBookingsModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#6B7280]" />
                      <span>My Bookings</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (onOpenBuyServices) onOpenBuyServices();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#6B7280]" />
                      <span>Buy Services</span>
                    </button>

                    {/* Upcoming Events */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setEventsModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#FF2D55] hover:bg-pink-50/80 transition text-left cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#FF2D55]" />
                      <span>Upcoming Events</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setTransactionsModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#FF2D55] transition text-left cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-[#6B7280]" />
                      <span>Transactions</span>
                    </button>

                    {/* Privacy Policy */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setLegalTab('privacy');
                        setLegalModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-[#0071E3] transition text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#0071E3]" />
                      <span>Privacy Policy (IT Act)</span>
                    </button>

                    {/* Refund Policy */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setLegalTab('refund');
                        setLegalModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#374151] hover:bg-pink-50/80 hover:text-emerald-700 transition text-left cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      <span>Refund Policy (100%)</span>
                    </button>

                    {/* Delete Account */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setDeleteAccountModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Delete Account</span>
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* 2. BODY CONTENT: FULL PROFILE VIEW OR BROWSE COMPANIONS FEED */}
      {selectedProfile ? (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-20">
          <CompanionProfileView
            companion={selectedProfile}
            onBack={() => setSelectedProfile(null)}
            onBook={(comp) => {
              setSelectedProfile(null);
              handleBookClick(comp);
            }}
            isSeeker={true}
            activeCredit={activeCredit}
            availableCredits={availableCredits}
          />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#111827]">
            Find a Companion
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Browse verified Companions and book services using your available credits
          </p>
        </div>

        {/* 1 Credit Available Green Status Banner (Dynamic based on wallet credits) */}
        {availableCredits.length > 0 ? (
          <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-2xl p-3.5 sm:p-4 text-[#15803D] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-[#16A34A]" />
              <span>
                {availableCredits.length} credit{availableCredits.length > 1 ? 's' : ''} available for booking: <span className="underline">{activeCredit ? (activeCredit.displayTitle || activeCredit.serviceName) : (availableCredits[0].displayTitle || availableCredits[0].serviceName)}</span>
              </span>
            </div>
            <span className="text-[11px] font-mono bg-emerald-100 px-2.5 py-1 rounded-full text-emerald-900 font-extrabold border border-emerald-300">
              Ready to Redeem
            </span>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 sm:p-4 text-amber-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>No service credits in your wallet. Buy a service credit to book companions.</span>
            </div>
            {onOpenBuyServices && (
              <button
                onClick={onOpenBuyServices}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer"
              >
                + Buy Services
              </button>
            )}
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-pink-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF2D55]">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Input: Name */}
            <div className="lg:col-span-3">
              <input
                type="text"
                placeholder="Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full bg-[#f9fafb] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              />
            </div>

            {/* Input: City */}
            <div className="lg:col-span-3">
              <input
                type="text"
                placeholder="City"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full bg-[#f9fafb] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              />
            </div>

            {/* Dropdown: All Services */}
            <div className="lg:col-span-2">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full bg-[#f9fafb] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              >
                <option value="All Services">All Services</option>
                <option value="Hangout">Hangout</option>
                <option value="Movie Partner">Movie Partner</option>
                <option value="Clubbing">Clubbing</option>
                <option value="Lunch/Dinner">Lunch/Dinner</option>
                <option value="Travel Partner">Travel Partner</option>
                <option value="Coffee Partner">Coffee Partner</option>
              </select>
            </div>

            {/* Dropdown: All Genders */}
            <div className="lg:col-span-2">
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full bg-[#f9fafb] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              >
                <option value="All Genders">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-2">
              <button
                type="button"
                className="w-full bg-[#111827] hover:bg-[#FF2D55] text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Counter text */}
        <div className="text-xs sm:text-sm font-semibold text-[#4B5563]">
          Found 73688 Companions (showing {filteredCompanions.length})
        </div>

        {/* COMPANIONS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanions.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-apple-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Avatar and Rating header */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="relative">
                    <img
                      src={comp.avatarUrl}
                      alt={comp.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-100 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[#111827] truncate">
                      {comp.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      <span>{comp.rating ? comp.rating.toFixed(2) : '5.00'}</span>
                      <span className="text-[#9CA3AF] font-normal">({comp.reviewCount || 2})</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6B7280] mt-0.5">
                      <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                      <span>{comp.city}</span>
                    </div>
                  </div>
                </div>

                {/* Quote / Bio snippet */}
                <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3 mb-4 font-sans italic">
                  {comp.bio}
                </p>
              </div>

              {/* Two Action Buttons: View Profile & Book */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProfile(comp)}
                  className="w-full py-2.5 rounded-xl border border-pink-200 hover:bg-pink-50 text-[#FF2D55] font-bold text-xs sm:text-sm transition flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <span>View Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBookClick(comp)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{Boolean(activeCredit) || (availableCredits && availableCredits.length > 0) ? 'Book' : 'Recharge & Book'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
      )}

      {/* POPUP 1: CONFIRM THE BOOKING? YES / NO (Includes Booking Date and Time Selection) */}
      {confirmingCompanion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.22)] space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-[#FF2D55] flex items-center justify-center mx-auto mb-2 shadow-xs">
                <Heart className="w-6 h-6 fill-[#FF2D55]" />
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#111827]">
                Confirm Companion Booking
              </h3>
              <p className="text-xs text-[#6B7280]">
                Choose your preferred meeting date, time slot, and duration
              </p>
            </div>

            {/* Companion Details Card */}
            <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-pink-100 flex items-center gap-4">
              <img
                src={confirmingCompanion.avatarUrl}
                alt={confirmingCompanion.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-200 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#111827] truncate">{confirmingCompanion.name}</h4>
                <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-bold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                  <span>{confirmingCompanion.rating ? confirmingCompanion.rating.toFixed(2) : '5.00'}</span>
                  <span className="text-[#6B7280] font-normal">&bull; {confirmingCompanion.city}</span>
                </div>
                {Boolean(activeCredit) || (availableCredits && availableCredits.length > 0) ? (
                  <div className="text-[11px] text-[#FF2D55] font-bold mt-1 bg-pink-50/80 px-2.5 py-1 rounded-lg border border-pink-200">
                    🔒 Locked Service: <span className="underline">{currentCredit ? (currentCredit.displayTitle || currentCredit.serviceName) : availableCredits[0]?.displayTitle}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-700 font-bold mt-1">
                    ⚠️ Wallet Balance: 0 Credits Available
                  </div>
                )}
              </div>
            </div>

            {/* BOOKING DATE & TIME SELECTION SECTION */}
            {Boolean(activeCredit) || (availableCredits && availableCredits.length > 0) ? (
              <div className="space-y-3.5 text-left bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
                
                {/* 1. Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1 font-sans flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF2D55]" />
                    <span>Select Booking Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  />
                </div>

                {/* 2. Time Slot Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5 font-sans flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Select Time Slot</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {['11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM', '08:00 PM', '09:30 PM'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => { setBookingTimeSlot(slot); setCustomTime(''); }}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          bookingTimeSlot === slot && !customTime
                            ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-pink-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {/* Or Custom Time input */}
                  <input
                    type="text"
                    placeholder="Or enter custom time (e.g. 05:45 PM)"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  />
                </div>

                {/* 3. Authorized Recharged Service Package (Strictly locked - other services cannot be selected) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#111827] font-sans flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#FF2D55]" />
                      <span>Authorized Service Package</span>
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Locked to Recharge
                    </span>
                  </div>

                  {/* If user has multiple available credits, allow picking which purchased credit to use */}
                  {availableCredits && availableCredits.length > 1 && (
                    <div className="mb-2.5">
                      <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                        Select from your purchased recharges:
                      </label>
                      <select
                        value={selectedCreditId || currentCredit?.id}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setSelectedCreditId(newId);
                          const cred = availableCredits.find(c => c.id === newId);
                          if (cred) {
                            setBookingHours(getCreditDurationHours(cred));
                          }
                        }}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                      >
                        {availableCredits.map((cred) => (
                          <option key={cred.id} value={cred.id}>
                            {cred.displayTitle || cred.serviceName} ({cred.price || 'Active'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Single Locked Service Display - NO OTHER SERVICES ARE SELECTABLE */}
                  <div className="bg-gradient-to-r from-pink-50/70 via-white to-purple-50/50 border-2 border-pink-200 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-pink-100/90 border border-pink-200 flex items-center justify-center text-lg shrink-0">
                          🎯
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-sm text-[#111827] truncate">
                            {currentCredit ? (currentCredit.displayTitle || currentCredit.serviceName) : 'Recharged Service'}
                          </p>
                          <p className="text-xs text-stone-600 font-medium mt-0.5">
                            Duration: <span className="font-extrabold text-[#FF2D55]">{bookingHours} {bookingHours === 1 ? 'Hour' : 'Hours'} Session</span> &bull; <span className="text-emerald-700 font-bold">Pre-funded</span>
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-700 bg-pink-100/70 px-2.5 py-1 rounded-lg border border-pink-200">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-pink-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Other services are locked. You can only book the service tier you recharged for.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* YES / NO BUTTONS */}
            {Boolean(activeCredit) || (availableCredits && availableCredits.length > 0) ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmingCompanion(null)}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-stone-100 text-[#374151] border border-stone-300 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  No, Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBookingYes}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF2D55] via-[#E11D48] to-[#9333EA] text-white hover:opacity-95 font-bold text-xs sm:text-sm transition shadow-md shadow-pink-500/25 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Yes, Confirm</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmingCompanion(null)}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-stone-100 text-[#374151] border border-stone-300 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmingCompanion(null);
                    if (onOpenBuyServices) onOpenBuyServices();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#111827] hover:bg-[#FF2D55] text-white font-bold text-xs sm:text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Recharge Wallet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* POPUP 2: BOOKING SUCCESSFUL CONFIRMATION */}
      {bookingSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)] text-center space-y-5">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl text-[#111827]">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-[#6B7280]">
                Your booking with <strong className="text-[#111827]">{bookingSuccessData.companion.name}</strong> has been confirmed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Booking ID:</span>
                <span className="font-mono font-bold text-[#FF2D55]">{bookingSuccessData.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Service:</span>
                <span className="font-bold text-[#111827]">{bookingSuccessData.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Scheduled Date &amp; Time:</span>
                <span className="font-bold text-[#111827]">{bookingSuccessData.dateTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Companion:</span>
                <span className="font-bold text-[#111827]">{bookingSuccessData.companion.name} ({bookingSuccessData.companion.city})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Confirmed</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              Your companion has been notified and will connect with you via phone/WhatsApp shortly to coordinate meeting details.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBookingSuccessData(null);
                  setBookingsModal(true);
                }}
                className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#111827] font-bold text-xs transition cursor-pointer"
              >
                View My Bookings
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingSuccessData(null);
                  if (onGoToDashboard) onGoToDashboard();
                  else onBackToHome();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white hover:opacity-95 font-bold text-xs transition shadow-md shadow-pink-500/25 cursor-pointer"
              >
                Dashboard
              </button>
            </div>

          </div>
        </div>
      )}



      {/* 1. MY BOOKINGS MODAL */}
      <MyBookingsModal
        isOpen={bookingsModal}
        onClose={() => setBookingsModal(false)}
        onFindCompanion={() => setBookingsModal(false)}
        userName={userName}
      />

      {/* 2. TRANSACTIONS MODAL */}
      <TransactionsModal
        isOpen={transactionsModal}
        onClose={() => setTransactionsModal(false)}
        onBuyServices={onOpenBuyServices}
        availableCredits={availableCredits}
        userName={userName}
      />

      {/* 3. 3-MONTH MEMBERSHIP PASS MODAL */}
      <ThreeMonthPassModal
        isOpen={threeMonthPassModal}
        onClose={() => setThreeMonthPassModal(false)}
        onFindCompanion={() => setThreeMonthPassModal(false)}
        userName={userName}
      />

      {/* 4. LEGAL & PRIVACY POLICY MODAL (IT Act, 2000 & IT Rules 2011) */}
      <LegalPolicyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />

      {/* 5. UPCOMING EVENTS MODAL */}
      <UpcomingEventsModal
        isOpen={eventsModalOpen}
        onClose={() => setEventsModalOpen(false)}
        userName={userName}
        userPhone={userPhone}
        onBookEventPartner={(evt: EventItem) => {
          setEventsModalOpen(false);
          setFilterService(evt.category === 'Concert & Music' ? 'Hangout' : 'All Services');
        }}
      />

      {/* SERVICE RESTRICTION / MISMATCH MODAL */}
      {serviceMismatchAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-pink-200 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-pink-100 text-[#FF2D55] flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-[#111827]">
                Service Credit Restriction
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your purchased recharge is for <strong className="text-[#FF2D55]">{serviceMismatchAlert.requiredService}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 text-left space-y-1.5">
              <p>
                <strong>{serviceMismatchAlert.compName}</strong> does not offer this specific service.
              </p>
              <p className="text-stone-500 text-[11px]">
                Under Click Karo Date Karo policy, you can only redeem your credit with verified companions who officially provide <strong>{serviceMismatchAlert.requiredService}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setServiceMismatchAlert(null)}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition cursor-pointer"
              >
                Choose Another
              </button>
              <button
                type="button"
                onClick={() => {
                  setServiceMismatchAlert(null);
                  if (onOpenBuyServices) onOpenBuyServices();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#E11D48] text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
              >
                Buy Service Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DELETE ACCOUNT CONFIRMATION MODAL */}
      {deleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-rose-200 shadow-apple-float space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-rose-950">
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-stone-600">
                In compliance with <strong>Section 7 of our IT Act Data Retention policy</strong> for Click Karo Date Karo (A unit of AMBER VENTURES (OPC) PVT LTD), your profile and bookings will be scheduled for permanent erasure within 90 days.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              ⚠️ All active service credits and verified badges will be immediately revoked.
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAccountModal(false)}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const phone = localStorage.getItem('ck_user_phone');
                  const email = localStorage.getItem('ck_user_email');
                  const firebaseUid = localStorage.getItem('ck_firebase_uid');
                  try {
                    await deleteClientAccountFromSupabase({ phone, email, firebase_uid: firebaseUid });
                  } catch (e) {
                    console.warn('[DeleteAccount] Supabase wipe notice:', e);
                  }
                  localStorage.clear();
                  setDeleteAccountModal(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default SeekerDashboard;
