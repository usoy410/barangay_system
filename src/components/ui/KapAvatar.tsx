'use client';

import React, { useState, useEffect } from 'react';

interface KapAvatarProps {
  className?: string;
  animationType?: 'standby' | 'wave' | 'thinking';
}

/**
 * KapAvatar component that displays the animated bot frames.
 * Synchronized with the design used in the BotHeader.
 */
export function KapAvatar({ className, animationType = 'standby' }: KapAvatarProps) {
  const [frame, setFrame] = useState(0);

  // Frame cycling (4 frames: 0 to 3)
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 400); // 400ms per frame to match BotHeader
    return () => clearInterval(interval);
  }, []);

  const folderName = animationType === 'standby' ? 'standby' : `${animationType}_frames`;
  const imageSrc = `/bot_frames/${folderName}/${animationType}_${frame}.png`;

  return (
    <div className={className}>
      {/* Using standard img for rapid frame swapping to avoid next/image re-optimization delays */}
      <img
        src={imageSrc}
        alt="Kap"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
