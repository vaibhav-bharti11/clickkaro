export interface CmsNavbarContent {
  brandName: string;
  brandHighlight: string;
  tagline: string;
  panIndiaBadge: string;
  navLinks: Array<{
    id: string;
    label: string;
    href: string;
    badge?: string;
  }>;
  loginButtonText: string;
  exploreButtonText: string;
  companionButtonText: string;
}

export interface CmsHeroContent {
  badgeText: string;
  badgeSubtext: string;
  mainHeadline: string;
  highlightWords: string[];
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  trustPill1: string;
  trustPill2: string;
  trustPill3: string;
  floatingCardBadge: string;
  floatingCardService: string;
  floatingCardConnectText: string;
  backgroundScenes: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
    shortLabel?: string;
    rate?: string;
  }>;
}

export interface CmsStatsItem {
  id: string;
  value: string;
  label: string;
  subtext: string;
  iconName: string;
}

export interface CmsStatsBarContent {
  title?: string;
  stats: CmsStatsItem[];
}

export interface CmsServiceItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  hours: number;
  price: number;
  originalPrice?: number;
  priceFormatted?: string;
  badge?: string;
  description: string;
  imageUrl?: string;
  popular?: boolean;
  rating?: number;
  reviewsCount?: number;
  category: 'social' | 'lifestyle' | 'support' | 'events';
  icon: string;
  emoji: string;
  pricePerHour: number;
}

export interface CmsServicesContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  categories: Array<{ id: string; label: string; count?: number }>;
  services: CmsServiceItem[];
}

export interface CmsPricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

export interface CmsPricingContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  calculatorTitle: string;
  calculatorSubtitle: string;
  hourlyRate: number;
  passPrice: number;
  tiers: CmsPricingTier[];
}

export interface CmsWhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
}

export interface CmsWhyChooseContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  features: CmsWhyChooseItem[];
}

export interface CmsCityItem {
  id: string;
  name: string;
  state: string;
  status: 'Live Now' | 'Active';
  activeCompanions: number;
  featuredSpots: string[];
  popularServices: string[];
  popularPinCodes: string[];
  imageUrl?: string;
}

export interface CmsLaunchCitiesContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  cities: CmsCityItem[];
}

export interface CmsHowItWorksStep {
  step: number;
  title: string;
  description: string;
  timeEstimate: string;
  iconName: string;
}

export interface CmsHowItWorksContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  steps: CmsHowItWorksStep[];
}

export interface CmsReviewItem {
  id: string;
  clientName: string;
  city: string;
  rating: number;
  service: string;
  review: string;
  verified: boolean;
  avatarUrl: string;
  date: string;
}

export interface CmsSuccessStoriesContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  reviews: CmsReviewItem[];
}

export interface CmsEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  category: string;
  badge: string;
  description: string;
  attendeesCount: number;
  maxSlots: number;
  price: number;
  imageUrl: string;
  rsvpText: string;
}

export interface CmsUpcomingEventsContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  events: CmsEventItem[];
}

export interface CmsBuyServicesContent {
  modalTitle: string;
  modalSubtitle: string;
  guaranteeText: string;
  supportHelpText: string;
  instructionsText: string;
  paymentNotice: string;
  refundNotice: string;
}

export interface CmsRandomMatchContent {
  modalTitle: string;
  modalSubtitle: string;
  scanningText: string;
  matchedText: string;
  hourlyRateText: string;
  connectButtonText: string;
  safetyDisclaimer: string;
}

export interface CmsCheckoutContent {
  checkoutTitle: string;
  checkoutSubtitle: string;
  upiPaymentInstructions: string;
  safetyProtocolNotice: string;
  satisfactionGuarantee: string;
  cancelPolicySummary: string;
}

export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CmsFaqContent {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  categories: string[];
  faqs: CmsFaqItem[];
}

export interface CmsCtaBannerContent {
  badge: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  bgImageUrl?: string;
  trustLine: string;
}

export interface CmsFooterContent {
  brandName: string;
  parentCompany: string;
  tagline: string;
  supportEmail: string;
  dpoEmail: string;
  grievanceEmail: string;
  copyrightText: string;
  legalDisclaimer: string;
  complianceNotice: string;
  helplinePhone: string;
}

export interface CmsLegalContent {
  termsTitle: string;
  termsContent: string;
  privacyTitle: string;
  privacyContent: string;
  refundTitle: string;
  refundContent: string;
  safetyTitle: string;
  safetyContent: string;
}

export interface CmsSiteContent {
  navbar: CmsNavbarContent;
  hero: CmsHeroContent;
  statsBar: CmsStatsBarContent;
  services: CmsServicesContent;
  pricing: CmsPricingContent;
  whyChoose: CmsWhyChooseContent;
  launchCities: CmsLaunchCitiesContent;
  howItWorks: CmsHowItWorksContent;
  successStories: CmsSuccessStoriesContent;
  upcomingEvents: CmsUpcomingEventsContent;
  buyServices: CmsBuyServicesContent;
  randomMatch: CmsRandomMatchContent;
  checkout: CmsCheckoutContent;
  faq: CmsFaqContent;
  ctaBanner: CmsCtaBannerContent;
  footer: CmsFooterContent;
  legal: CmsLegalContent;
  lastUpdated: string;
  updatedBy?: string;
  version: number;
}
