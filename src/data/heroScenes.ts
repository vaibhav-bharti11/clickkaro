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
    image: '/assets/hangout_light_bg.jpg',
    tagline: '₹7,999 (4 Hours) — Relaxed city strolls, parks & outdoor quality time',
    accentGradient: 'from-[#FF2D55] via-[#FF5E3A] to-[#FF9500]',
    glowColor: 'rgba(255, 45, 85, 0.25)',
    serviceId: 'hangout',
    rate: '₹7,999 (4 Hours)',
  },
  {
    id: 'movie-partner',
    title: 'Movie Partner',
    shortLabel: 'Movie Partner',
    category: 'Entertainment',
    image: '/assets/cinema_light_bg.jpg',
    tagline: '₹4,999 (4 Hours) — Blockbuster screenings, IMAX & post-film discussions',
    accentGradient: 'from-[#EC4899] via-[#8B5CF6] to-[#3B82F6]',
    glowColor: 'rgba(236, 72, 153, 0.25)',
    serviceId: 'movie-partner',
    rate: '₹4,999 (4 Hours)',
  },
  {
    id: 'lunch-dinner',
    title: 'Lunch/Dinner',
    shortLabel: 'Lunch/Dinner',
    category: 'Dining & Food',
    image: '/assets/dining_light_bg.jpg',
    tagline: '₹2,999 (2 Hours) — Delicious meals, chef-curated brunches & gourmet dining',
    accentGradient: 'from-[#F59E0B] via-[#EF4444] to-[#EC4899]',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    serviceId: 'lunch-dinner',
    rate: '₹2,999 (2 Hours)',
  },
  {
    id: 'coffee-partner',
    title: 'Coffee Partner',
    shortLabel: 'Coffee Partner',
    category: 'Social Dialogue',
    image: '/assets/cafe_light_bg.jpg',
    tagline: '₹1,999 / Hour — Warm artisan coffees, deep conversations & cozy vibes',
    accentGradient: 'from-[#EC4899] via-[#F43F5E] to-[#FB923C]',
    glowColor: 'rgba(236, 72, 153, 0.25)',
    serviceId: 'coffee-partner',
    rate: '₹1,999 (1 Hour)',
  },
];
