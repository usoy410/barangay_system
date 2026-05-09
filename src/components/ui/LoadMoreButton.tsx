'use client';

import React from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label?: string;
  className?: string;
  variant?: 'cyan' | 'amber' | 'slate';
}

/**
 * A reusable "Load More" button component used for pagination.
 */
export function LoadMoreButton({ 
  onClick, 
  isLoading, 
  label = 'Load More', 
  className = '',
  variant = 'cyan'
}: LoadMoreButtonProps) {
  
  const variantStyles = {
    cyan: 'hover:text-cyan-600 hover:border-cyan-100',
    amber: 'hover:text-amber-600 hover:border-amber-100',
    slate: 'hover:text-slate-900 hover:border-slate-300'
  };

  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 transition-all disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
}
