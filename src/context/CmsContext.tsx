import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  CmsSiteContent, 
  CmsNavbarContent,
  CmsHeroContent, 
  CmsStatsBarContent,
  CmsServicesContent, 
  CmsPricingContent,
  CmsWhyChooseContent, 
  CmsLaunchCitiesContent, 
  CmsHowItWorksContent, 
  CmsSuccessStoriesContent,
  CmsUpcomingEventsContent,
  CmsBuyServicesContent,
  CmsRandomMatchContent,
  CmsCheckoutContent,
  CmsFaqContent, 
  CmsCtaBannerContent, 
  CmsFooterContent,
  CmsLegalContent 
} from '../types/cms';
import { DEFAULT_CMS_CONTENT } from '../data/defaultCmsContent';
import { getCmsContent, saveCmsContent, resetCmsToDefault } from '../services/cmsService';

interface CmsContextType {
  content: CmsSiteContent;
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  updateNavbar: (navbar: Partial<CmsNavbarContent>) => Promise<void>;
  updateHero: (hero: Partial<CmsHeroContent>) => Promise<void>;
  updateStatsBar: (stats: Partial<CmsStatsBarContent>) => Promise<void>;
  updateServices: (services: Partial<CmsServicesContent>) => Promise<void>;
  updatePricing: (pricing: Partial<CmsPricingContent>) => Promise<void>;
  updateWhyChoose: (whyChoose: Partial<CmsWhyChooseContent>) => Promise<void>;
  updateLaunchCities: (launchCities: Partial<CmsLaunchCitiesContent>) => Promise<void>;
  updateHowItWorks: (howItWorks: Partial<CmsHowItWorksContent>) => Promise<void>;
  updateSuccessStories: (stories: Partial<CmsSuccessStoriesContent>) => Promise<void>;
  updateUpcomingEvents: (events: Partial<CmsUpcomingEventsContent>) => Promise<void>;
  updateBuyServices: (buyServices: Partial<CmsBuyServicesContent>) => Promise<void>;
  updateRandomMatch: (randomMatch: Partial<CmsRandomMatchContent>) => Promise<void>;
  updateCheckout: (checkout: Partial<CmsCheckoutContent>) => Promise<void>;
  updateFaq: (faq: Partial<CmsFaqContent>) => Promise<void>;
  updateCtaBanner: (cta: Partial<CmsCtaBannerContent>) => Promise<void>;
  updateFooter: (footer: Partial<CmsFooterContent>) => Promise<void>;
  updateLegal: (legal: Partial<CmsLegalContent>) => Promise<void>;
  updateFullContent: (newContent: CmsSiteContent) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  resetSection: (sectionKey: keyof CmsSiteContent) => Promise<void>;
  isCmsModalOpen: boolean;
  setIsCmsModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const CmsContext = createContext<CmsContextType | null>(null);

const ADMIN_SESSION_KEY = 'ck_admin_auth_session';

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CmsSiteContent>(DEFAULT_CMS_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 1. Initial Load of CMS Content & Admin Session
  useEffect(() => {
    let isMounted = true;

    // Check stored admin session
    try {
      const session = localStorage.getItem(ADMIN_SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.email && parsed.expiresAt > Date.now()) {
          setIsAdminLoggedIn(true);
          setAdminEmail(parsed.email);
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      }
    } catch {}

    // Load CMS content from database / cache
    getCmsContent()
      .then(loaded => {
        if (isMounted) {
          setContent(loaded);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.warn('[CmsProvider] Initial load fallback:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // 2. Admin Authentication
  const loginAdmin = useCallback((email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Master admin credentials check
    const isValid = (
      (cleanEmail === 'admin@clickkarodatekaro.com' || cleanEmail === 'admin' || cleanEmail === 'vaibhav@clickkarodatekaro.com' || cleanEmail === 'admin@amberventures.in') &&
      (pass === 'Admin@ClickKaro2025!' || pass === 'Admin@123' || pass === 'clickkaro2025')
    );

    if (isValid) {
      setIsAdminLoggedIn(true);
      setAdminEmail(cleanEmail);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        email: cleanEmail,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }));
      setIsLoginModalOpen(false);
      setIsCmsModalOpen(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    setIsCmsModalOpen(false);
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
  }, []);

  // 3. Section Updaters
  const persistChanges = async (updated: CmsSiteContent) => {
    setContent(updated);
    await saveCmsContent(updated, adminEmail || 'admin');
  };

  const updateNavbar = async (navbar: Partial<CmsNavbarContent>) => {
    await persistChanges({ ...content, navbar: { ...content.navbar, ...navbar } });
  };

  const updateHero = async (hero: Partial<CmsHeroContent>) => {
    await persistChanges({ ...content, hero: { ...content.hero, ...hero } });
  };

  const updateStatsBar = async (stats: Partial<CmsStatsBarContent>) => {
    await persistChanges({ ...content, statsBar: { ...content.statsBar, ...stats } });
  };

  const updateServices = async (services: Partial<CmsServicesContent>) => {
    await persistChanges({ ...content, services: { ...content.services, ...services } });
  };

  const updatePricing = async (pricing: Partial<CmsPricingContent>) => {
    await persistChanges({ ...content, pricing: { ...content.pricing, ...pricing } });
  };

  const updateWhyChoose = async (whyChoose: Partial<CmsWhyChooseContent>) => {
    await persistChanges({ ...content, whyChoose: { ...content.whyChoose, ...whyChoose } });
  };

  const updateLaunchCities = async (launchCities: Partial<CmsLaunchCitiesContent>) => {
    await persistChanges({ ...content, launchCities: { ...content.launchCities, ...launchCities } });
  };

  const updateHowItWorks = async (howItWorks: Partial<CmsHowItWorksContent>) => {
    await persistChanges({ ...content, howItWorks: { ...content.howItWorks, ...howItWorks } });
  };

  const updateSuccessStories = async (stories: Partial<CmsSuccessStoriesContent>) => {
    await persistChanges({ ...content, successStories: { ...content.successStories, ...stories } });
  };

  const updateUpcomingEvents = async (events: Partial<CmsUpcomingEventsContent>) => {
    await persistChanges({ ...content, upcomingEvents: { ...content.upcomingEvents, ...events } });
  };

  const updateBuyServices = async (buyServices: Partial<CmsBuyServicesContent>) => {
    await persistChanges({ ...content, buyServices: { ...content.buyServices, ...buyServices } });
  };

  const updateRandomMatch = async (randomMatch: Partial<CmsRandomMatchContent>) => {
    await persistChanges({ ...content, randomMatch: { ...content.randomMatch, ...randomMatch } });
  };

  const updateCheckout = async (checkout: Partial<CmsCheckoutContent>) => {
    await persistChanges({ ...content, checkout: { ...content.checkout, ...checkout } });
  };

  const updateFaq = async (faq: Partial<CmsFaqContent>) => {
    await persistChanges({ ...content, faq: { ...content.faq, ...faq } });
  };

  const updateCtaBanner = async (cta: Partial<CmsCtaBannerContent>) => {
    await persistChanges({ ...content, ctaBanner: { ...content.ctaBanner, ...cta } });
  };

  const updateFooter = async (footer: Partial<CmsFooterContent>) => {
    await persistChanges({ ...content, footer: { ...content.footer, ...footer } });
  };

  const updateLegal = async (legal: Partial<CmsLegalContent>) => {
    await persistChanges({ ...content, legal: { ...content.legal, ...legal } });
  };

  const updateFullContent = async (newContent: CmsSiteContent) => {
    await persistChanges(newContent);
  };

  const resetToDefaults = async () => {
    const cleanDefault = await resetCmsToDefault();
    setContent(cleanDefault);
  };

  const resetSection = async (sectionKey: keyof CmsSiteContent) => {
    const updated = {
      ...content,
      [sectionKey]: DEFAULT_CMS_CONTENT[sectionKey],
    };
    await persistChanges(updated);
  };

  return (
    <CmsContext.Provider
      value={{
        content,
        isLoading,
        isAdminLoggedIn,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        updateNavbar,
        updateHero,
        updateStatsBar,
        updateServices,
        updatePricing,
        updateWhyChoose,
        updateLaunchCities,
        updateHowItWorks,
        updateSuccessStories,
        updateUpcomingEvents,
        updateBuyServices,
        updateRandomMatch,
        updateCheckout,
        updateFaq,
        updateCtaBanner,
        updateFooter,
        updateLegal,
        updateFullContent,
        resetToDefaults,
        resetSection,
        isCmsModalOpen,
        setIsCmsModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
