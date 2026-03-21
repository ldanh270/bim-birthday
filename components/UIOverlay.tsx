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
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      
      {/* Header */}
      <header className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full px-4">
        <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ADD8E6] via-[#E0F2FE] to-[#ADD8E6] font-serif drop-shadow-lg tracking-wider text-center animate-fade-in">
          Happy Birthday Bim
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#ADD8E6] to-transparent mt-2"></div>
      </header>

      {/* Action buttons removed as requested */}
    </div>
  );
};
