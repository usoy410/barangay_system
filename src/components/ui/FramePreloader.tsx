'use client';

import React, { useEffect } from 'react';

const FRAME_PATHS = [
  '/bot_frames/standby/standby_0.png',
  '/bot_frames/standby/standby_1.png',
  '/bot_frames/standby/standby_2.png',
  '/bot_frames/standby/standby_3.png',
  '/bot_frames/thinking_frames/thinking_0.png',
  '/bot_frames/thinking_frames/thinking_1.png',
  '/bot_frames/thinking_frames/thinking_2.png',
  '/bot_frames/thinking_frames/thinking_3.png',
  '/bot_frames/wave_frames/wave_0.png',
  '/bot_frames/wave_frames/wave_1.png',
  '/bot_frames/wave_frames/wave_2.png',
  '/bot_frames/wave_frames/wave_3.png',
];

/**
 * FramePreloader component
 * Preloads bot animation frames to ensure smooth transitions without flickering.
 */
export function FramePreloader() {
  useEffect(() => {
    // Preload frames by creating Image objects
    FRAME_PATHS.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);

  return null; // This component doesn't render anything
}
