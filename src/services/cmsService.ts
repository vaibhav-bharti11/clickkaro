import { supabase } from './supabase';
import { CmsSiteContent } from '../types/cms';
import { DEFAULT_CMS_CONTENT } from '../data/defaultCmsContent';

const CMS_STORAGE_KEY = 'ck_live_cms_content';
const CMS_BACKUP_KEY = 'ck_cms_backups';

const mergeWithDefaults = (source: Partial<CmsSiteContent>): CmsSiteContent => {
  return {
    ...DEFAULT_CMS_CONTENT,
    ...source,
    navbar: { ...DEFAULT_CMS_CONTENT.navbar, ...(source.navbar || {}) },
    hero: { 
      ...DEFAULT_CMS_CONTENT.hero, 
      ...(source.hero || {}),
      mainHeadline: (source.hero?.mainHeadline || DEFAULT_CMS_CONTENT.hero.mainHeadline).replace(/MEETUP/gi, 'MEET'),
      highlightWords: (source.hero?.highlightWords || DEFAULT_CMS_CONTENT.hero.highlightWords).map((w: string) => w.replace(/MEETUP/gi, 'MEET')),
    },
    statsBar: { ...DEFAULT_CMS_CONTENT.statsBar, ...(source.statsBar || {}) },
    services: { ...DEFAULT_CMS_CONTENT.services, ...(source.services || {}) },
    pricing: { ...DEFAULT_CMS_CONTENT.pricing, ...(source.pricing || {}) },
    whyChoose: { ...DEFAULT_CMS_CONTENT.whyChoose, ...(source.whyChoose || {}) },
    launchCities: { ...DEFAULT_CMS_CONTENT.launchCities, ...(source.launchCities || {}) },
    howItWorks: { ...DEFAULT_CMS_CONTENT.howItWorks, ...(source.howItWorks || {}) },
    successStories: { ...DEFAULT_CMS_CONTENT.successStories, ...(source.successStories || {}) },
    upcomingEvents: { ...DEFAULT_CMS_CONTENT.upcomingEvents, ...(source.upcomingEvents || {}) },
    buyServices: { ...DEFAULT_CMS_CONTENT.buyServices, ...(source.buyServices || {}) },
    randomMatch: { ...DEFAULT_CMS_CONTENT.randomMatch, ...(source.randomMatch || {}) },
    checkout: { ...DEFAULT_CMS_CONTENT.checkout, ...(source.checkout || {}) },
    faq: { ...DEFAULT_CMS_CONTENT.faq, ...(source.faq || {}) },
    ctaBanner: { ...DEFAULT_CMS_CONTENT.ctaBanner, ...(source.ctaBanner || {}) },
    footer: { ...DEFAULT_CMS_CONTENT.footer, ...(source.footer || {}) },
    legal: { ...DEFAULT_CMS_CONTENT.legal, ...(source.legal || {}) },
  };
};

export const getCmsContent = async (): Promise<CmsSiteContent> => {
  // 1. Try fetching from Supabase if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data && data.content) {
        const merged = mergeWithDefaults(data.content);
        try {
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
        } catch {}
        return merged;
      }
    } catch (err) {
      console.warn('[CMS Service] Supabase fetch fallback to local:', err);
    }
  }

  // 2. Try loading from local storage cache
  try {
    const cached = localStorage.getItem(CMS_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return mergeWithDefaults(parsed);
    }
  } catch (err) {
    console.warn('[CMS Service] Local cache parse error:', err);
  }

  // 3. Fallback to production default
  return DEFAULT_CMS_CONTENT;
};

export const saveCmsContent = async (
  newContent: CmsSiteContent, 
  adminEmail: string = 'admin'
): Promise<{ success: boolean; data?: CmsSiteContent; error?: any }> => {
  const updatedPayload: CmsSiteContent = {
    ...newContent,
    lastUpdated: new Date().toISOString(),
    updatedBy: adminEmail,
    version: (newContent.version || 1) + 1,
  };

  // 1. Cache immediately in localStorage for instant live UI re-renders
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedPayload));
    
    // Save history backup
    const backups = JSON.parse(localStorage.getItem(CMS_BACKUP_KEY) || '[]');
    backups.unshift({
      timestamp: updatedPayload.lastUpdated,
      version: updatedPayload.version,
      updatedBy: adminEmail,
      content: updatedPayload,
    });
    localStorage.setItem(CMS_BACKUP_KEY, JSON.stringify(backups.slice(0, 10)));
  } catch (e) {
    console.warn('[CMS Service] Cache write warning:', e);
  }

  // 2. Persist to Supabase if available
  if (supabase) {
    try {
      const { error } = await supabase
        .from('cms_content')
        .upsert(
          {
            id: 1,
            content: updatedPayload,
            version: updatedPayload.version,
            updated_by: adminEmail,
            updated_at: updatedPayload.lastUpdated,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) {
        console.warn('[CMS Service] Supabase upsert error:', error.message);
        return { success: true, data: updatedPayload, error };
      }
    } catch (e) {
      console.warn('[CMS Service] Supabase save error:', e);
    }
  }

  return { success: true, data: updatedPayload };
};

export const resetCmsToDefault = async (): Promise<CmsSiteContent> => {
  try {
    localStorage.removeItem(CMS_STORAGE_KEY);
  } catch {}
  
  if (supabase) {
    try {
      await supabase.from('cms_content').delete().eq('id', 1);
    } catch {}
  }
  
  return DEFAULT_CMS_CONTENT;
};
