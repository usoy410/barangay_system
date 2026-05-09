'use client';

import React, { useState, useEffect } from 'react';
import { DecorativeLeaves } from '@/components/ui/DecorativeLeaves';
import { ChatModal } from '@/components/ui/ChatModal';

interface BotHeaderProps {
  title?: string;
  message: React.ReactNode;
  animationType?: 'standby' | 'wave' | 'thinking';
}

export function BotHeader({ title = "Magandang Araw!", message, animationType = 'wave' }: BotHeaderProps) {
  const [currentAnim, setCurrentAnim] = useState(animationType);
  const [frame, setFrame] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setCurrentAnim(animationType);
  }, [animationType]);

  // Frame cycling (all animations have 4 frames: 0 to 3)
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 400); // 400ms per frame
    return () => clearInterval(interval);
  }, []);

  // State machine for shifting animations over time
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (currentAnim === 'wave') {
      // Wave for 3.2 seconds (8 frames), then standby
      timeoutId = setTimeout(() => setCurrentAnim('standby'), 3200);
    } else if (currentAnim === 'thinking') {
      // Think for 4.8 seconds (12 frames), then standby
      timeoutId = setTimeout(() => setCurrentAnim('standby'), 4800);
    } else if (currentAnim === 'standby') {
      // Standby for 6-10 seconds, then randomly think or wave
      const delay = 6000 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        setCurrentAnim(Math.random() > 0.6 ? 'wave' : 'thinking');
      }, delay);
    }

    // Reset frame to 0 when starting a new animation
    setFrame(0);

    return () => clearTimeout(timeoutId);
  }, [currentAnim]);

  const folderName = currentAnim === 'standby' ? 'standby' : `${currentAnim}_frames`;
  const imageSrc = `/bot_frames/${folderName}/${currentAnim}_${frame}.png`;

  return (
    <header className="bg-slate-900 text-white pt-5 md:pt-20 px-4 md:px-8 rounded-b-4xl shadow-md relative overflow-hidden flex items-end gap-3 md:gap-6">
      <DecorativeLeaves variant="dark" />

      {/* Bot Avatar on the Left (Touches the bottom) */}
      <div 
        className="relative z-10 w-52 h-52 md:w-58 md:h-58 shrink-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] md:ml-1 translate-y-1 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] active:scale-[0.97]"
        onClick={() => setIsChatOpen(true)}
      >
        {/* Using standard img for rapid frame swapping to avoid next/image re-optimization delays on each tick */}
        <img
          src={imageSrc}
          alt="AI Assistant Bot"
          className="w-full h-full object-contain object-bottom pointer-events-none"
        />
      </div>

      {/* Chat Bubble on the Right */}
      <div className="relative z-10 flex-1 max-w-2xl bg-white p-5 md:p-7 rounded-4xl rounded-bl-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 mb-8 md:mb-12 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-shadow duration-300">
        <h1 className="text-xl md:text-3xl font-black mb-1.5 text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-600 text-sm md:text-lg font-medium leading-relaxed">{message}</p>
      </div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </header>
  );
}
