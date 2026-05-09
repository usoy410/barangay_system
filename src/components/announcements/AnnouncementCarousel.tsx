'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Announcement } from '@/types/database';
import { ChevronLeft, ChevronRight, Bell, AlertTriangle, Calendar, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface AnnouncementCarouselProps {
  announcements: Announcement[];
}

/**
 * A premium, interactive carousel for community announcements.
 * Features auto-switching, manual navigation, and swipe-like transitions.
 */
export function AnnouncementCarousel({ announcements }: AnnouncementCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    if (announcements.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [announcements.length, isAnimating]);

  const prevSlide = useCallback(() => {
    if (announcements.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [announcements.length, isAnimating]);

  useEffect(() => {
    if (!isPaused && announcements.length > 1) {
      timerRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused, announcements.length]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  const getCategoryIcon = (category: Announcement['category']) => {
    switch (category) {
      case 'Emergency': return <AlertTriangle className="w-5 h-5" />;
      case 'Event': return <Calendar className="w-5 h-5" />;
      case 'Holiday': return <Bell className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getCategoryTheme = (category: Announcement['category']) => {
    switch (category) {
      case 'Emergency': return {
        bg: 'bg-red-500',
        lightBg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        gradient: 'from-red-600 to-red-800'
      };
      case 'Event': return {
        bg: 'bg-sky-500',
        lightBg: 'bg-sky-50',
        border: 'border-sky-200',
        text: 'text-sky-700',
        gradient: 'from-sky-500 to-sky-700'
      };
      case 'Holiday': return {
        bg: 'bg-indigo-500',
        lightBg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        gradient: 'from-indigo-500 to-indigo-700'
      };
      default: return {
        bg: 'bg-slate-600',
        lightBg: 'bg-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-700',
        gradient: 'from-slate-600 to-slate-800'
      };
    }
  };

  const theme = getCategoryTheme(current.category);

  return (
    <div 
      className="relative group w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl relative">
        
        {/* Main Content Area */}
        <div className={clsx(
          "relative min-h-[220px] transition-all duration-500 ease-in-out flex flex-col md:flex-row overflow-hidden",
          theme.lightBg
        )}>
          
          {/* Background Image / Gradient Decor */}
          {current.image_url ? (
            <div className="md:w-1/3 h-40 md:h-auto relative overflow-hidden">
              <img 
                src={current.image_url} 
                alt={current.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
            </div>
          ) : (
            <div className={clsx("md:w-1/3 h-3 md:h-auto bg-gradient-to-br", theme.gradient)} />
          )}

          <div className="flex-grow p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className={clsx(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                theme.bg, "text-white"
              )}>
                {getCategoryIcon(current.category)}
                {current.category}
              </span>
              <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(current.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-lexend font-black text-slate-900 mb-3 leading-tight tracking-tight">
              {current.title}
            </h2>
            
            <div className="text-slate-600 font-medium text-sm md:text-base leading-relaxed max-w-xl">
              <p className="line-clamp-2 md:line-clamp-3">
                {current.content.split(/\s+/).filter(Boolean).length > 20 
                  ? current.content.split(/\s+/).filter(Boolean).slice(0, 20).join(' ') + '...'
                  : current.content}
              </p>
              {current.content.match(/(https?:\/\/[^\s]+)/) && (
                <a 
                  href={current.content.match(/(https?:\/\/[^\s]+)/)![0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-lg bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md hover:-translate-y-0.5 group/link",
                    theme.text
                  )}
                >
                  <Info className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">For more information, go here</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Overlays (visible on hover) */}
        {announcements.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Progress Dots */}
        {announcements.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={clsx(
                  "h-1.5 transition-all duration-300 rounded-full",
                  idx === currentIndex ? "w-8 " + theme.bg : "w-1.5 bg-slate-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Glassmorphism Accents */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl -z-10" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl -z-10" />
    </div>
  );
}
