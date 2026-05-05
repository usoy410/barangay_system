'use client';

import React from 'react';

interface DecorativeLeavesProps {
  variant?: 'light' | 'dark';
}

/**
 * DecorativeLeaves Component
 * Adds premium golden palm leaf assets to the background of a page.
 * Optimized for mobile view with absolute positioning.
 */
export const DecorativeLeaves: React.FC<DecorativeLeavesProps> = ({ variant = 'light' }) => {
  // Use multiply for light backgrounds to hide white edges
  // Use screen for dark backgrounds to create a glowing effect
  const blendClass = 'mix-blend-screen opacity-30';

  return (
    <>
      {/* Top Right Corner Leaf */}
      <div className="absolute -top-12 -right-12 w-64 h-64 opacity-20 pointer-events-none select-none z-0 rotate-12">
        <img
          src="/images/palm-leaf-top-right.webp"
          alt=""
          className={`w-full h-full object-contain ${blendClass}`}
          loading="lazy"
        />
      </div>

      {/* Bottom Left Corner Leaf */}
      <div className="absolute -bottom-16 -left-16 w-80 h-80 opacity-15 pointer-events-none select-none z-0 -rotate-12">
        <img
          src="/images/palm-leaf-bottom-left.webp"
          alt=""
          className={`w-full h-full object-contain ${blendClass}`}
          loading="lazy"
        />
      </div>

      {/* Side Cluster (Visible on larger mobile/desktop) */}
      <div className="absolute top-1/2 -left-20 w-48 h-48 opacity-10 pointer-events-none select-none z-0 -translate-y-1/2 rotate-45 hidden sm:block">
        <img
          src="/images/palm-leaf-cluster.webp"
          alt=""
          className={`w-full h-full object-contain ${blendClass}`}
          loading="lazy"
        />
      </div>
    </>
  );
};
