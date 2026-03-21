import React, { useRef, useState } from 'react';
import { SceneMode } from '../types';

interface UIOverlayProps {
  mode: SceneMode;
  onToggle: () => void;
  onPhotosUpload: (photos: string[]) => void;
  hasPhotos: boolean;
  uploadedPhotos: string[];
  isSharedView: boolean;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ mode, onToggle, onPhotosUpload, hasPhotos, uploadedPhotos, isSharedView }) => {
  const isChaos = mode === SceneMode.CHAOS;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-between py-12">
      
      {/* Header */}
      <header className="flex flex-col items-center w-full px-4 animate-fade-in">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl opacity-40">✨</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FF8E9E] via-[#FFB6C1] to-[#FF8E9E] drop-shadow-[0_2px_15px_rgba(255,142,158,0.3)] tracking-tight text-center italic">
            Happy Birthday Bim
          </h1>
          <span className="text-2xl opacity-40">✨</span>
        </div>
        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFB6C1] to-transparent"></div>
      </header>

      {/* Interaction Guide */}
      <footer className="flex flex-col items-center gap-4 animate-fade-in opacity-80">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-6 pointer-events-auto transition-all hover:bg-white/30">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${!isChaos ? 'bg-[#FF8E9E] animate-pulse' : 'bg-white/40'}`}></div>
            <span className="text-white font-serif text-sm tracking-wide">Close Hand to Form</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isChaos ? 'bg-[#FF8E9E] animate-pulse' : 'bg-white/40'}`}></div>
            <span className="text-white font-serif text-sm tracking-wide">Open Hand to Bloom</span>
          </div>
        </div>
        <p className="text-white/60 font-serif text-[10px] uppercase tracking-[0.3em]">
          Move your hand to rotate the memories
        </p>
      </footer>

    </div>
  );
};
