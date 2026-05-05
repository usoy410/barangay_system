'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

/**
 * A premium success modal that plays a 'shake hands' video.
 * Uses mix-blend-screen to remove the black background from the video.
 */
export const SuccessVideoModal: React.FC<SuccessVideoModalProps> = ({
  isOpen,
  onClose,
  title = "Request Successful",
  message = "Your request has been successfully submitted to the Barangay Hall."
}) => {
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setVideoEnded(false);
      // Auto-play the video when modal opens
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(err => console.error("Video play failed", err));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Backdrop: Appears after video ends */}
      <div 
        className={`absolute inset-0 bg-slate-950/80 backdrop-blur-2xl transition-all duration-1000 pointer-events-auto ${videoEnded ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={onClose}
      />

      {/* Video Container - Full Screen with Solid Background #f0f0f0 */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-[#f0f0f0] transition-opacity duration-700 ${videoEnded ? 'opacity-0' : 'opacity-100'}`}
      >
        <video
          ref={videoRef}
          src="/shakeHands.mp4"
          className="w-full h-full object-contain"
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
        />
      </div>

      {/* Success Card: Shown only after video finishes */}
      {videoEnded && (
        <div className="relative w-full max-w-lg mx-4 p-10 text-center bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 pointer-events-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-emerald-500 p-5 rounded-full shadow-lg shadow-emerald-200">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
            {title}
          </h2>
          
          <p className="text-slate-600 font-semibold mb-10 leading-relaxed text-lg">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer text-xl"
          >
            Konektado Kita!
          </button>
          
          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Barangay Konektado
          </p>

          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
