import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  Building2, 
  Globe, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Upload, 
  LogOut, 
  Download, 
  Calendar,
  CreditCard,
  MessageSquareQuote,
  DollarSign,
  Activity,
  Sliders
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { CmsSiteContent, CmsFaqItem } from '../types/cms';
import confetti from 'canvas-confetti';

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 
  | 'navbar' 
  | 'hero' 
  | 'statsBar'
  | 'services' 
  | 'pricing'
  | 'whyChoose' 
  | 'cities' 
  | 'howItWorks' 
  | 'events'
  | 'modals' 
  | 'reviews' 
  | 'faq' 
  | 'ctaBanner' 
  | 'footer' 
  | 'legal'
  | 'backup';

export const AdminCmsModal: React.FC<AdminCmsModalProps> = ({ isOpen, onClose }) => {
  const { 
    content, 
    updateFullContent, 
    resetToDefaults, 
    resetSection, 
    adminEmail, 
    logoutAdmin 
  } = useCms();

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [draftContent, setDraftContent] = useState<CmsSiteContent>(content);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync draft whenever content updates or modal opens
  useEffect(() => {
    if (isOpen) {
      setDraftContent(JSON.parse(JSON.stringify(content)));
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateFullContent(draftContent);
      setSaveSuccess(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error('[CMS] Save error:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSection = async (sectionKey: keyof CmsSiteContent) => {
    if (window.confirm(`Are you sure you want to reset the "${String(sectionKey)}" section to original defaults?`)) {
      await resetSection(sectionKey);
      setDraftContent(prev => ({
        ...prev,
        [sectionKey]: content[sectionKey],
      }));
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('Are you sure you want to reset ALL CMS content back to factory production defaults?')) {
      await resetToDefaults();
      onClose();
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draftContent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `clickkaro_cms_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setDraftContent(parsed);
        await updateFullContent(parsed);
        alert('CMS content successfully imported and activated!');
      } catch (err) {
        alert('Invalid JSON file. Please check structure.');
      }
    };
    reader.readAsText(file);
  };

  const tabs: Array<{ id: TabType; label: string; icon: any; count?: number }> = [
    { id: 'navbar', label: 'Navbar & Brand', icon: Globe },
    { id: 'hero', label: 'Hero & Scenes', icon: Sparkles },
    { id: 'statsBar', label: 'Stats Bar', icon: Activity },
    { id: 'services', label: 'Services & Rates', icon: Layers, count: draftContent.services?.services?.length },
    { id: 'pricing', label: 'Pricing & Calc', icon: DollarSign },
    { id: 'whyChoose', label: 'Safety & Trust', icon: ShieldCheck, count: draftContent.whyChoose?.features?.length },
    { id: 'cities', label: 'Launch Cities', icon: Building2, count: draftContent.launchCities?.cities?.length },
    { id: 'howItWorks', label: 'How It Works', icon: Sliders, count: draftContent.howItWorks?.steps?.length },
    { id: 'events', label: 'Upcoming Events', icon: Calendar, count: draftContent.upcomingEvents?.events?.length },
    { id: 'modals', label: 'Checkout & Modals', icon: CreditCard },
    { id: 'reviews', label: 'Reviews & Stories', icon: MessageSquareQuote, count: draftContent.successStories?.reviews?.length },
    { id: 'faq', label: 'FAQ Section', icon: HelpCircle, count: draftContent.faq?.faqs?.length },
    { id: 'ctaBanner', label: 'CTA Banner', icon: Sparkles },
    { id: 'footer', label: 'Footer & Compliance', icon: FileText },
    { id: 'legal', label: 'Legal Policies', icon: ShieldCheck },
    { id: 'backup', label: 'Backup & Reset', icon: Download },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="bg-white w-full max-w-6xl h-[92vh] max-h-[920px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cms-panel-title"
      >
        {/* TOP BAR */}
        <header className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="cms-panel-title" className="text-base sm:text-lg font-bold tracking-tight">
                  Click Karo Date Karo &bull; Live CMS Management
                </h1>
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Editing
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Logged in as <strong className="text-stone-200">{adminEmail || 'admin'}</strong> &bull; Version {draftContent.version || 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white active:scale-95'
              }`}
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Changes Published!' : isSaving ? 'Saving...' : 'Save & Publish Live'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              title="Logout from CMS"
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* MAIN BODY: SIDEBAR + CONTENT EDITOR */}
        <div className="flex-1 flex overflow-hidden">
          {/* SIDEBAR NAVIGATION TABS */}
          <aside className="w-56 sm:w-64 bg-stone-50 border-r border-stone-200 p-3 overflow-y-auto shrink-0 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-3 py-1.5 block">
                Website Sections &amp; Modals
              </span>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive 
                        ? 'bg-white text-pink-700 shadow-sm border border-stone-200/80 font-bold' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-pink-600' : 'text-stone-400'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {typeof tab.count === 'number' && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-pink-100 text-pink-700' : 'bg-stone-200/60 text-stone-500'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-100 text-[11px] text-pink-900 leading-snug">
                💡 <strong>Instant Live Sync</strong>: Edits update across the homepage and modals in real-time.
              </div>
            </div>
          </aside>

          {/* EDITING FORM CANVAS */}
          <main className="flex-1 p-6 overflow-y-auto bg-stone-50/40">
            {/* 1. NAVBAR TAB */}
            {activeTab === 'navbar' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Navbar &amp; Branding</h2>
                    <p className="text-xs text-stone-500">Edit top bar brand names, navigation items, and button labels.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('navbar')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name Prefix</label>
                    <input
                      type="text"
                      value={draftContent.navbar?.brandName || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, brandName: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Brand Highlight Word</label>
                    <input
                      type="text"
                      value={draftContent.navbar?.brandHighlight || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, brandHighlight: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={draftContent.navbar?.tagline || ''}
                    onChange={(e) => setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, tagline: e.target.value } })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pan-India Badge</label>
                    <input
                      type="text"
                      value={draftContent.navbar?.panIndiaBadge || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, panIndiaBadge: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Login Button Label</label>
                    <input
                      type="text"
                      value={draftContent.navbar?.loginButtonText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, loginButtonText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Partner CTA Button</label>
                    <input
                      type="text"
                      value={draftContent.navbar?.companionButtonText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, companionButtonText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-stone-700 mb-2">Navigation Links</h3>
                  <div className="space-y-2">
                    {draftContent.navbar?.navLinks?.map((link, idx) => (
                      <div key={link.id || idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const copy = [...draftContent.navbar.navLinks];
                            copy[idx].label = e.target.value;
                            setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, navLinks: copy } });
                          }}
                          className="w-44 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-800"
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const copy = [...draftContent.navbar.navLinks];
                            copy[idx].href = e.target.value;
                            setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, navLinks: copy } });
                          }}
                          className="w-32 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600"
                        />
                        <input
                          type="text"
                          value={link.badge || ''}
                          placeholder="Badge (optional)"
                          onChange={(e) => {
                            const copy = [...draftContent.navbar.navLinks];
                            copy[idx].badge = e.target.value;
                            setDraftContent({ ...draftContent, navbar: { ...draftContent.navbar, navLinks: copy } });
                          }}
                          className="w-32 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs text-pink-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. HERO TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Hero Section &amp; Backgrounds</h2>
                    <p className="text-xs text-stone-500">Edit headline, sub-headline, trust pills, floating card labels, and 8K light tone background scenes.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('hero')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={draftContent.hero?.badgeText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, badgeText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Badge Subtext (Features Bar)</label>
                    <input
                      type="text"
                      value={draftContent.hero?.badgeSubtext || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, badgeSubtext: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={draftContent.hero?.mainHeadline || ''}
                    onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, mainHeadline: e.target.value } })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Subheadline Description</label>
                  <textarea
                    rows={3}
                    value={draftContent.hero?.subheadline || ''}
                    onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, subheadline: e.target.value } })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Primary CTA Button</label>
                    <input
                      type="text"
                      value={draftContent.hero?.primaryCtaText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, primaryCtaText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Secondary CTA Button</label>
                    <input
                      type="text"
                      value={draftContent.hero?.secondaryCtaText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, secondaryCtaText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Trust Pill 1</label>
                    <input
                      type="text"
                      value={draftContent.hero?.trustPill1 || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, trustPill1: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Trust Pill 2</label>
                    <input
                      type="text"
                      value={draftContent.hero?.trustPill2 || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, trustPill2: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Trust Pill 3</label>
                    <input
                      type="text"
                      value={draftContent.hero?.trustPill3 || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, trustPill3: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Floating Profile Card Settings */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-bold text-stone-800">Floating Companion Profile Card Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Verified Badge Tag</label>
                      <input
                        type="text"
                        value={draftContent.hero?.floatingCardBadge || 'Face Verified'}
                        onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, floatingCardBadge: e.target.value } })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Companion Service Label</label>
                      <input
                        type="text"
                        value={draftContent.hero?.floatingCardService || 'Movie & Cafe Companion'}
                        onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, floatingCardService: e.target.value } })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Connect Button Label</label>
                      <input
                        type="text"
                        value={draftContent.hero?.floatingCardConnectText || 'CONNECT'}
                        onChange={(e) => setDraftContent({ ...draftContent, hero: { ...draftContent.hero, floatingCardConnectText: e.target.value } })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic 8K Background Scenes */}
                <div>
                  <h3 className="text-xs font-bold text-stone-800 mb-3">Hero 8K Background Slideshow Scenes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {draftContent.hero?.backgroundScenes?.map((scene, idx) => (
                      <div key={scene.id || idx} className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={scene.imageUrl} 
                            alt={scene.title} 
                            className="w-16 h-12 rounded-lg object-cover border border-stone-200 shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={scene.title}
                              onChange={(e) => {
                                const copy = [...draftContent.hero.backgroundScenes];
                                copy[idx].title = e.target.value;
                                setDraftContent({ ...draftContent, hero: { ...draftContent.hero, backgroundScenes: copy } });
                              }}
                              className="w-full font-bold text-xs text-stone-900 border-b border-stone-200 outline-none pb-0.5"
                            />
                            <input
                              type="text"
                              value={scene.description || ''}
                              placeholder="Scene tagline"
                              onChange={(e) => {
                                const copy = [...draftContent.hero.backgroundScenes];
                                copy[idx].description = e.target.value;
                                setDraftContent({ ...draftContent, hero: { ...draftContent.hero, backgroundScenes: copy } });
                              }}
                              className="w-full text-[11px] text-stone-500 border-b border-stone-200 outline-none mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Image URL</label>
                          <input
                            type="text"
                            value={scene.imageUrl}
                            onChange={(e) => {
                              const copy = [...draftContent.hero.backgroundScenes];
                              copy[idx].imageUrl = e.target.value;
                              setDraftContent({ ...draftContent, hero: { ...draftContent.hero, backgroundScenes: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] text-stone-700 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. STATS BAR TAB */}
            {activeTab === 'statsBar' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Stats Bar &amp; Metrics</h2>
                    <p className="text-xs text-stone-500">Edit key statistics, numbers, counters, and guarantee tags.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('statsBar')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draftContent.statsBar?.stats?.map((stat, idx) => (
                    <div key={stat.id || idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Stat #{idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Counter Number</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const copy = [...draftContent.statsBar.stats];
                              copy[idx].value = e.target.value;
                              setDraftContent({ ...draftContent, statsBar: { ...draftContent.statsBar, stats: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Title Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const copy = [...draftContent.statsBar.stats];
                              copy[idx].label = e.target.value;
                              setDraftContent({ ...draftContent, statsBar: { ...draftContent.statsBar, stats: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-stone-800"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Subtext</label>
                        <input
                          type="text"
                          value={stat.subtext}
                          onChange={(e) => {
                            const copy = [...draftContent.statsBar.stats];
                            copy[idx].subtext = e.target.value;
                            setDraftContent({ ...draftContent, statsBar: { ...draftContent.statsBar, stats: copy } });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Curated Services &amp; Packages</h2>
                    <p className="text-xs text-stone-500">Edit package names, descriptions, hours, pricing, badges, and image links.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('services')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Section Badge</label>
                    <input
                      type="text"
                      value={draftContent.services?.sectionBadge || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, services: { ...draftContent.services, sectionBadge: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={draftContent.services?.sectionTitle || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, services: { ...draftContent.services, sectionTitle: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Section Subtitle</label>
                    <input
                      type="text"
                      value={draftContent.services?.sectionSubtitle || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, services: { ...draftContent.services, sectionSubtitle: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {draftContent.services?.services?.map((svc, idx) => (
                    <div key={svc.id || idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{svc.emoji || '✨'}</span>
                          <input
                            type="text"
                            value={svc.title}
                            onChange={(e) => {
                              const copy = [...draftContent.services.services];
                              copy[idx].title = e.target.value;
                              setDraftContent({ ...draftContent, services: { ...draftContent.services, services: copy } });
                            }}
                            className="font-bold text-sm text-stone-900 border-b border-stone-200 outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          value={svc.badge || ''}
                          placeholder="Badge"
                          onChange={(e) => {
                            const copy = [...draftContent.services.services];
                            copy[idx].badge = e.target.value;
                            setDraftContent({ ...draftContent, services: { ...draftContent.services, services: copy } });
                          }}
                          className="w-24 px-2 py-0.5 text-xs font-bold text-pink-600 bg-pink-50 rounded-lg text-center"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Subtitle</label>
                          <input
                            type="text"
                            value={svc.subtitle}
                            onChange={(e) => {
                              const copy = [...draftContent.services.services];
                              copy[idx].subtitle = e.target.value;
                              setDraftContent({ ...draftContent, services: { ...draftContent.services, services: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Package Price (₹)</label>
                          <input
                            type="number"
                            value={svc.price}
                            onChange={(e) => {
                              const copy = [...draftContent.services.services];
                              copy[idx].price = Number(e.target.value);
                              copy[idx].priceFormatted = `₹${e.target.value}`;
                              setDraftContent({ ...draftContent, services: { ...draftContent.services, services: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Duration</label>
                          <input
                            type="text"
                            value={svc.duration}
                            onChange={(e) => {
                              const copy = [...draftContent.services.services];
                              copy[idx].duration = e.target.value;
                              setDraftContent({ ...draftContent, services: { ...draftContent.services, services: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Hourly Rate (₹/hr)</label>
                          <input
                            type="number"
                            value={svc.pricePerHour}
                            onChange={(e) => {
                              const copy = [...draftContent.services.services];
                              copy[idx].pricePerHour = Number(e.target.value);
                              setDraftContent({ ...draftContent, services: { ...draftContent.services, services: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Description</label>
                        <textarea
                          rows={2}
                          value={svc.description}
                          onChange={(e) => {
                            const copy = [...draftContent.services.services];
                            copy[idx].description = e.target.value;
                            setDraftContent({ ...draftContent, services: { ...draftContent.services, services: copy } });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PRICING & EARNINGS TAB */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Pricing &amp; Calculator Settings</h2>
                    <p className="text-xs text-stone-500">Edit base companion hourly rates, 3-Month Pass pricing, and calculator copy.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('pricing')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Standard Hourly Rate (₹)</label>
                    <input
                      type="number"
                      value={draftContent.pricing?.hourlyRate || 1499}
                      onChange={(e) => setDraftContent({ ...draftContent, pricing: { ...draftContent.pricing, hourlyRate: Number(e.target.value) } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">3-Month VIP All-Access Pass Price (₹)</label>
                    <input
                      type="number"
                      value={draftContent.pricing?.passPrice || 4999}
                      onChange={(e) => setDraftContent({ ...draftContent, pricing: { ...draftContent.pricing, passPrice: Number(e.target.value) } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Calculator Title</label>
                    <input
                      type="text"
                      value={draftContent.pricing?.calculatorTitle || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, pricing: { ...draftContent.pricing, calculatorTitle: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Calculator Subtitle</label>
                    <input
                      type="text"
                      value={draftContent.pricing?.calculatorSubtitle || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, pricing: { ...draftContent.pricing, calculatorSubtitle: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. WHY CHOOSE US TAB */}
            {activeTab === 'whyChoose' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Safety &amp; Trust Pillars</h2>
                    <p className="text-xs text-stone-500">Edit the 6 core pillars of security, verification, and privacy.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('whyChoose')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draftContent.whyChoose?.features?.map((feat, idx) => (
                    <div key={feat.id || idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-pink-600 uppercase">Pillar #{idx + 1}</span>
                        <input
                          type="text"
                          value={feat.tag}
                          onChange={(e) => {
                            const copy = [...draftContent.whyChoose.features];
                            copy[idx].tag = e.target.value;
                            setDraftContent({ ...draftContent, whyChoose: { ...draftContent.whyChoose, features: copy } });
                          }}
                          className="w-24 px-2 py-0.5 text-[10px] font-bold text-pink-600 bg-pink-50 rounded-lg text-center"
                        />
                      </div>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const copy = [...draftContent.whyChoose.features];
                          copy[idx].title = e.target.value;
                          setDraftContent({ ...draftContent, whyChoose: { ...draftContent.whyChoose, features: copy } });
                        }}
                        className="w-full font-bold text-xs text-stone-900 border-b border-stone-200 pb-0.5"
                      />
                      <textarea
                        rows={3}
                        value={feat.description}
                        onChange={(e) => {
                          const copy = [...draftContent.whyChoose.features];
                          copy[idx].description = e.target.value;
                          setDraftContent({ ...draftContent, whyChoose: { ...draftContent.whyChoose, features: copy } });
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. LAUNCH CITIES TAB */}
            {activeTab === 'cities' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Launch Cities &amp; Availability</h2>
                    <p className="text-xs text-stone-500">Edit all 8 live launch cities, active companion counts, and photography.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('launchCities')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draftContent.launchCities?.cities?.map((city, idx) => (
                    <div key={city.id || idx} className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={city.imageUrl} 
                          alt={city.name} 
                          className="w-16 h-12 rounded-lg object-cover border border-stone-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={city.name}
                            onChange={(e) => {
                              const copy = [...draftContent.launchCities.cities];
                              copy[idx].name = e.target.value;
                              setDraftContent({ ...draftContent, launchCities: { ...draftContent.launchCities, cities: copy } });
                            }}
                            className="w-full font-bold text-xs text-stone-900 border-b border-stone-200 outline-none pb-0.5"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-stone-500">Active Partners:</span>
                            <input
                              type="number"
                              value={city.activeCompanions || 0}
                              onChange={(e) => {
                                const copy = [...draftContent.launchCities.cities];
                                copy[idx].activeCompanions = Number(e.target.value);
                                setDraftContent({ ...draftContent, launchCities: { ...draftContent.launchCities, cities: copy } });
                              }}
                              className="w-16 px-1.5 py-0.5 text-xs font-bold text-pink-700 bg-pink-50 rounded-lg border border-pink-100"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Image URL</label>
                        <input
                          type="text"
                          value={city.imageUrl || ''}
                          onChange={(e) => {
                            const copy = [...draftContent.launchCities.cities];
                            copy[idx].imageUrl = e.target.value;
                            setDraftContent({ ...draftContent, launchCities: { ...draftContent.launchCities, cities: copy } });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-[11px] text-stone-700 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. UPCOMING EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Upcoming Social Events</h2>
                    <p className="text-xs text-stone-500">Add, edit, or manage social mixers, weekend tours, and RSVP buttons.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('upcomingEvents')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="space-y-4">
                  {draftContent.upcomingEvents?.events?.map((ev, idx) => (
                    <div key={ev.id || idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => {
                            const copy = [...draftContent.upcomingEvents.events];
                            copy[idx].title = e.target.value;
                            setDraftContent({ ...draftContent, upcomingEvents: { ...draftContent.upcomingEvents, events: copy } });
                          }}
                          className="w-2/3 font-bold text-sm text-stone-900 border-b border-stone-200"
                        />
                        <input
                          type="text"
                          value={ev.badge}
                          onChange={(e) => {
                            const copy = [...draftContent.upcomingEvents.events];
                            copy[idx].badge = e.target.value;
                            setDraftContent({ ...draftContent, upcomingEvents: { ...draftContent.upcomingEvents, events: copy } });
                          }}
                          className="w-24 px-2 py-0.5 text-xs font-bold text-pink-600 bg-pink-50 rounded-lg text-center"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Date &amp; Time</label>
                          <input
                            type="text"
                            value={ev.date}
                            onChange={(e) => {
                              const copy = [...draftContent.upcomingEvents.events];
                              copy[idx].date = e.target.value;
                              setDraftContent({ ...draftContent, upcomingEvents: { ...draftContent.upcomingEvents, events: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Venue</label>
                          <input
                            type="text"
                            value={ev.venue}
                            onChange={(e) => {
                              const copy = [...draftContent.upcomingEvents.events];
                              copy[idx].venue = e.target.value;
                              setDraftContent({ ...draftContent, upcomingEvents: { ...draftContent.upcomingEvents, events: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Ticket Price (₹)</label>
                          <input
                            type="number"
                            value={ev.price}
                            onChange={(e) => {
                              const copy = [...draftContent.upcomingEvents.events];
                              copy[idx].price = Number(e.target.value);
                              copy[idx].rsvpText = `Reserve My Spot (₹${e.target.value})`;
                              setDraftContent({ ...draftContent, upcomingEvents: { ...draftContent.upcomingEvents, events: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Event Description</label>
                        <textarea
                          rows={2}
                          value={ev.description}
                          onChange={(e) => {
                            const copy = [...draftContent.upcomingEvents.events];
                            copy[idx].description = e.target.value;
                            setDraftContent({ ...draftContent, upcomingEvents: { ...draftContent.upcomingEvents, events: copy } });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. CHECKOUT & MODALS TAB */}
            {activeTab === 'modals' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Checkout &amp; Modals Copy</h2>
                    <p className="text-xs text-stone-500">Edit every prompt and instruction in Buy Services, Random Match, and Payment Confirmation screens.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetSection('buyServices');
                      handleResetSection('randomMatch');
                      handleResetSection('checkout');
                    }}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-bold text-stone-900">Buy Services Modal</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Modal Title</label>
                      <input
                        type="text"
                        value={draftContent.buyServices?.modalTitle || ''}
                        onChange={(e) => setDraftContent({ ...draftContent, buyServices: { ...draftContent.buyServices, modalTitle: e.target.value } })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Guarantee Badge Text</label>
                      <input
                        type="text"
                        value={draftContent.buyServices?.guaranteeText || ''}
                        onChange={(e) => setDraftContent({ ...draftContent, buyServices: { ...draftContent.buyServices, guaranteeText: e.target.value } })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Modal Subtitle / Notice</label>
                    <textarea
                      rows={2}
                      value={draftContent.buyServices?.modalSubtitle || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, buyServices: { ...draftContent.buyServices, modalSubtitle: e.target.value } })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-bold text-stone-900">Checkout &amp; UPI Instructions</h3>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">UPI Payment Guide</label>
                    <input
                      type="text"
                      value={draftContent.checkout?.upiPaymentInstructions || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, checkout: { ...draftContent.checkout, upiPaymentInstructions: e.target.value } })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Safety Notice</label>
                    <textarea
                      rows={2}
                      value={draftContent.checkout?.safetyProtocolNotice || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, checkout: { ...draftContent.checkout, safetyProtocolNotice: e.target.value } })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 10. REVIEWS & TESTIMONIALS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Success Stories &amp; Testimonials</h2>
                    <p className="text-xs text-stone-500">Edit real client reviews and ratings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('successStories')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="space-y-4">
                  {draftContent.successStories?.reviews?.map((rev, idx) => (
                    <div key={rev.id || idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Client Name</label>
                          <input
                            type="text"
                            value={rev.clientName}
                            onChange={(e) => {
                              const copy = [...draftContent.successStories.reviews];
                              copy[idx].clientName = e.target.value;
                              setDraftContent({ ...draftContent, successStories: { ...draftContent.successStories, reviews: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">City</label>
                          <input
                            type="text"
                            value={rev.city}
                            onChange={(e) => {
                              const copy = [...draftContent.successStories.reviews];
                              copy[idx].city = e.target.value;
                              setDraftContent({ ...draftContent, successStories: { ...draftContent.successStories, reviews: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Service Tag</label>
                          <input
                            type="text"
                            value={rev.service}
                            onChange={(e) => {
                              const copy = [...draftContent.successStories.reviews];
                              copy[idx].service = e.target.value;
                              setDraftContent({ ...draftContent, successStories: { ...draftContent.successStories, reviews: copy } });
                            }}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Review Text</label>
                        <textarea
                          rows={2}
                          value={rev.review}
                          onChange={(e) => {
                            const copy = [...draftContent.successStories.reviews];
                            copy[idx].review = e.target.value;
                            setDraftContent({ ...draftContent, successStories: { ...draftContent.successStories, reviews: copy } });
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. FAQ TAB */}
            {activeTab === 'faq' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">FAQ Section Management</h2>
                    <p className="text-xs text-stone-500">Edit, add, or delete frequently asked questions across all categories.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newFaq: CmsFaqItem = {
                        id: `faq-${Date.now()}`,
                        question: 'New Question',
                        answer: 'Provide a detailed answer here.',
                        category: 'General',
                      };
                      setDraftContent({
                        ...draftContent,
                        faq: {
                          ...draftContent.faq,
                          faqs: [newFaq, ...draftContent.faq.faqs],
                        },
                      });
                    }}
                    className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4" /> Add FAQ Item
                  </button>
                </div>

                <div className="space-y-4">
                  {draftContent.faq?.faqs?.map((faq, idx) => (
                    <div key={faq.id || idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const copy = [...draftContent.faq.faqs];
                            copy[idx].question = e.target.value;
                            setDraftContent({ ...draftContent, faq: { ...draftContent.faq, faqs: copy } });
                          }}
                          className="flex-1 font-bold text-sm text-stone-900 border-b border-stone-200 outline-none pb-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = draftContent.faq.faqs.filter((_, i) => i !== idx);
                            setDraftContent({ ...draftContent, faq: { ...draftContent.faq, faqs: copy } });
                          }}
                          className="text-stone-400 hover:text-rose-600 p-1 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => {
                          const copy = [...draftContent.faq.faqs];
                          copy[idx].answer = e.target.value;
                          setDraftContent({ ...draftContent, faq: { ...draftContent.faq, faqs: copy } });
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. FOOTER & COMPLIANCE TAB */}
            {activeTab === 'footer' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Footer, Parent Company &amp; Legal Disclosures</h2>
                    <p className="text-xs text-stone-500">Edit legal entity disclosures, contact emails, DPO, and Grievance Officer details.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('footer')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Parent Company Legal Line</label>
                    <input
                      type="text"
                      value={draftContent.footer?.parentCompany || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, footer: { ...draftContent.footer, parentCompany: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-pink-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Copyright Text</label>
                    <input
                      type="text"
                      value={draftContent.footer?.copyrightText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, footer: { ...draftContent.footer, copyrightText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={draftContent.footer?.supportEmail || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, footer: { ...draftContent.footer, supportEmail: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Data Protection (DPO) Email</label>
                    <input
                      type="email"
                      value={draftContent.footer?.dpoEmail || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, footer: { ...draftContent.footer, dpoEmail: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Grievance Officer Email</label>
                    <input
                      type="email"
                      value={draftContent.footer?.grievanceEmail || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, footer: { ...draftContent.footer, grievanceEmail: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Strict Legal Disclaimer</label>
                  <textarea
                    rows={3}
                    value={draftContent.footer?.legalDisclaimer || ''}
                    onChange={(e) => setDraftContent({ ...draftContent, footer: { ...draftContent.footer, legalDisclaimer: e.target.value } })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                  />
                </div>
              </div>
            )}

            {/* 13. LEGAL POLICIES TAB */}
            {activeTab === 'legal' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Legal Policy Modals &amp; Terms</h2>
                    <p className="text-xs text-stone-500">Edit Terms of Service, Privacy Policy, Refund Policy, and Safety Standards.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('legal')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-800">Terms of Service</label>
                    <textarea
                      rows={4}
                      value={draftContent.legal?.termsContent || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, legal: { ...draftContent.legal, termsContent: e.target.value } })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                    />
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-800">Privacy &amp; Data Protection</label>
                    <textarea
                      rows={4}
                      value={draftContent.legal?.privacyContent || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, legal: { ...draftContent.legal, privacyContent: e.target.value } })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                    />
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-800">Cancellation &amp; Refund Policy</label>
                    <textarea
                      rows={4}
                      value={draftContent.legal?.refundContent || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, legal: { ...draftContent.legal, refundContent: e.target.value } })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 14. CTA BANNER TAB */}
            {activeTab === 'ctaBanner' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Bottom CTA Banner</h2>
                    <p className="text-xs text-stone-500">Edit bottom conversion banner text, CTA buttons, and background image.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetSection('ctaBanner')}
                    className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Badge</label>
                    <input
                      type="text"
                      value={draftContent.ctaBanner?.badge || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, ctaBanner: { ...draftContent.ctaBanner, badge: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Headline</label>
                    <input
                      type="text"
                      value={draftContent.ctaBanner?.title || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, ctaBanner: { ...draftContent.ctaBanner, title: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle</label>
                  <textarea
                    rows={2}
                    value={draftContent.ctaBanner?.subtitle || ''}
                    onChange={(e) => setDraftContent({ ...draftContent, ctaBanner: { ...draftContent.ctaBanner, subtitle: e.target.value } })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Primary Button</label>
                    <input
                      type="text"
                      value={draftContent.ctaBanner?.primaryButtonText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, ctaBanner: { ...draftContent.ctaBanner, primaryButtonText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Secondary Button</label>
                    <input
                      type="text"
                      value={draftContent.ctaBanner?.secondaryButtonText || ''}
                      onChange={(e) => setDraftContent({ ...draftContent, ctaBanner: { ...draftContent.ctaBanner, secondaryButtonText: e.target.value } })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 15. BACKUP & FACTORY RESET TAB */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-4xl">
                <div className="border-b border-stone-200 pb-3">
                  <h2 className="text-lg font-bold text-stone-900">Backup &amp; Emergency Reset</h2>
                  <p className="text-xs text-stone-500">Export website configuration, import JSON files, or reset to original factory code.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Download className="w-4 h-4 text-pink-600" /> Export CMS Backup JSON
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Download an exact JSON snapshot of all current website copy, pricing, services, and image links.
                    </p>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Download Backup (.json)
                    </button>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-pink-600" /> Import CMS Backup JSON
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Restore website configuration from a previously downloaded JSON backup file.
                    </p>
                    <label className="inline-block px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
                      Upload Backup File
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJson}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-600" /> Factory Reset Entire Website
                  </h3>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    This will erase all custom CMS modifications and restore every word, image, and price across all sections back to original code defaults.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Reset Everything to Factory Defaults
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
