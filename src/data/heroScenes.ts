export interface HeroScene {
  id: string;
  title: string;
  shortLabel: string;
  category: string;
  image: string;
  tagline: string;
  accentGradient: string;
  glowColor: string;
  serviceId: string;
  rate: string;
}

export const HERO_SCENES: HeroScene[] = [
  {
    id: 'hangout',
    title: 'Hangout',
    shortLabel: 'Hangout',
    category: 'Casual Outings',
    image: '/assets/hangout_bg.jpg',
    tagline: '₹7,999 (4 Hours) — Relaxed city strolls, parks & outdoor quality time',
    accentGradient: 'from-[#FF5E3A] via-[#FF2A68] to-[#FF9500]',
    glowColor: 'rgba(255, 94, 58, 0.4)',
    serviceId: 'hangout',
    rate: '₹7,999 (4 Hours)',
  },
  {
    id: 'movie-partner',
    title: 'Movie Partner',
    shortLabel: 'Movie Partner',
    category: 'Entertainment',
    image: '/assets/cinema_nights_bg.jpg',
    tagline: '₹4,999 (4 Hours) — Blockbuster screenings, IMAX & post-film discussions',
    accentGradient: 'from-[#8B5CF6] via-[#EC4899] to-[#3B82F6]',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    serviceId: 'movie-partner',
    rate: '₹4,999 (4 Hours)',
  },
  {
    id: 'clubbing',
    title: 'Clubbing',
    shortLabel: 'Clubbing',
    category: 'Nightlife & Events',
    image: '/assets/weekend_parties_bg.jpg',
    tagline: '₹9,999 (6 Hours) — Chic rooftop lounges, weekend clubs & nightlife wing-partner',
    accentGradient: 'from-[#FF2D55] via-[#A855F7] to-[#6366F1]',
    glowColor: 'rgba(255, 45, 85, 0.4)',
    serviceId: 'clubbing',
    rate: '₹9,999 (6 Hours)',
  },
  {
    id: 'lunch-dinner',
    title: 'Lunch/Dinner',
    shortLabel: 'Lunch/Dinner',
    category: 'Dining & Food',
    image: '/assets/lunch_dinner_bg.jpg',
    tagline: '₹2,999 (2 Hours) — Delicious meals, chef-curated brunches & gourmet dining',
    accentGradient: 'from-[#F59E0B] via-[#EF4444] to-[#EC4899]',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    serviceId: 'lunch-dinner',
    rate: '₹2,999 (2 Hours)',
  },
  {
    id: 'travel-partner',
    title: 'Travel Partner',
    shortLabel: 'Travel Partner',
    category: 'Travel & Tours',
    image: '/assets/city_roadtrips_bg.jpg',
    tagline: '₹14,999 (12 Hours) — Full day road trips, weekend getaways & scenic highways',
    accentGradient: 'from-[#06B6D4] via-[#3B82F6] to-[#6366F1]',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    serviceId: 'travel-partner',
    rate: '₹14,999 (12 Hours)',
  },
  {
    id: 'coffee-partner',
    title: 'Coffee Partner',
    shortLabel: 'Coffee Partner',
    category: 'Social Dialogue',
    image: '/assets/cafe_outings_bg.jpg',
    tagline: '₹1,999 / Hour — Warm artisan coffees, deep conversations & cozy vibes',
    accentGradient: 'from-[#EC4899] via-[#F43F5E] to-[#FB923C]',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    serviceId: 'coffee-partner',
    rate: '₹1,999 (1 Hour)',
  },
];
