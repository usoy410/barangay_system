import React from 'react';

interface TagItemProps {
  /** The tag name (e.g., "{fullName}") */
  tag: string;
  /** A descriptive label for the tag */
  label: string;
  /** Whether the tag represents an image placeholder */
  isImage?: boolean;
}

/**
 * A small card representing a document template tag.
 */
export const TagItem: React.FC<TagItemProps> = ({ 
  tag, 
  label, 
  isImage = false 
}) => (
  <div className={`bg-slate-50 border p-3 rounded-xl transition-colors ${
    isImage ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200 hover:border-cyan-300'
  }`}>
    <code className={`text-xs font-black block mb-1 ${
      isImage ? 'text-purple-700' : 'text-cyan-700'
    }`}>
      {tag}
    </code>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
      {label}
    </span>
  </div>
);
