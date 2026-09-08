import React from 'react';
import { Edit3, Lock } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export const CmsFloatingTrigger: React.FC = () => {
  const { isAdminLoggedIn, setIsCmsModalOpen, setIsLoginModalOpen } = useCms();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isAdminLoggedIn ? (
        <button
          onClick={() => setIsCmsModalOpen(true)}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111827]/90 hover:bg-[#FF2D55] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-sans"
          title="Open Homepage CMS Editor"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Edit3 className="w-4 h-4 text-[#FF2D55] group-hover:text-white transition" />
          <span className="text-xs font-bold tracking-tight">Edit Homepage CMS</span>
        </button>
      ) : (
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="opacity-40 hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm backdrop-blur-md border border-stone-200 text-[11px] font-bold transition-all duration-300 cursor-pointer"
          title="Admin CMS Login"
        >
          <Lock className="w-3 h-3 text-stone-500" />
          <span>Admin CMS</span>
        </button>
      )}
    </div>
  );
};
