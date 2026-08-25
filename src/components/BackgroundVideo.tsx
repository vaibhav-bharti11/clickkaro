import React from 'react';

export const BackgroundVideo: React.FC = () => {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none"
    >
      {/* 1. Base High-Res Baby Pink Silk Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply transition-opacity duration-1000 scale-105 animate-pulse-subtle"
        style={{ backgroundImage: "url('/assets/baby_pink_bg.jpg')" }}
      />

      {/* 2. Layered Baby Pink Pastel Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F5]/90 via-[#FFE4E8]/80 to-[#FDF2F8]/95" />

      {/* 3. Cinematic Ambient Glowing Aurora Orbs (Simulating Video Fluidity) */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-[#FFD1DC]/60 to-[#FFF0F5]/20 blur-[120px] animate-float opacity-75" 
      />
      <div 
        className="absolute top-[30%] -right-[15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-bl from-[#FFE4E8]/70 via-[#FFF5F7]/30 to-transparent blur-[140px] animate-float-delayed opacity-80" 
      />
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-[#FFD6E0]/50 to-[#FFF0F5]/10 blur-[130px] animate-float opacity-70" 
      />

      {/* 4. Subtle Iridescent Shimmer Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.7)_0%,transparent_60%)]" />
    </div>
  );
};
