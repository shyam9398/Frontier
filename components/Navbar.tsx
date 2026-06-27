'use client';

import React from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';

interface NavbarProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onViewChange?: (viewId: string) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Navbar({ 
  onMenuClick, 
  onProfileClick,
  onViewChange,
  searchQuery = '',
  onSearchChange
}: NavbarProps) {
  
  const handleLogoClick = () => {
    if (onViewChange) onViewChange('home');
  };

  const handleSubmitClick = () => {
    if (onViewChange) onViewChange('submit-paper');
  };

  return (
    <header className="bg-white border-b border-[#ECECEC] py-3.5 px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-y-3 gap-x-6 shrink-0 sticky top-0 z-50">
      
      {/* Left Area: Logo & Mobile Hamburger Menu & actions inline on mobile */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-xl text-[#666666] hover:bg-[#FFF0F3] hover:text-[#FF4D73] transition-all shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Frontier Atlas Branding Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-1 cursor-pointer select-none group"
          >
            {/* Stylized Red/Pink Outline Logo */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#FF4D73]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3L3 20h18L12 3z" />
                <path d="M12 9l-4 7h8l-4-7z" />
              </svg>
            </div>
            <span className="font-sans font-black text-[#111111] text-xl tracking-tight group-hover:text-[#FF4D73] transition-colors">
              Frontier Atlas
            </span>
          </div>
        </div>

        {/* Right Area: Submit Button & Profile Avatar Dropdown (Mobile-only inline top row) */}
        <div className="flex md:hidden items-center gap-3 shrink-0">
          <button
            onClick={handleSubmitClick}
            className="px-4 py-2 bg-[#FF4D73] hover:bg-[#FF335E] text-white text-xs font-sans font-bold rounded-lg shadow-sm transition-all cursor-pointer border-0 active:scale-[0.98]"
          >
            Submit
          </button>

          <button
            onClick={onProfileClick}
            className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-50 transition-all cursor-pointer border-0"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-[#ECECEC] flex items-center justify-center overflow-hidden">
              <svg className="w-4.5 h-4.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Center: Large Integrated Search Bar */}
      <div className="w-full md:flex-1 md:max-w-2xl md:mx-6">
        <SearchBar variant="navbar" value={searchQuery} onChange={onSearchChange} placeholder="Search papers, authors, topics..." />
      </div>

      {/* Right Area: Submit Button & Profile Avatar Dropdown (Desktop-only) */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        
        {/* Submit Paper Action */}
        <button
          onClick={handleSubmitClick}
          className="px-5 py-2 bg-[#FF4D73] hover:bg-[#FF335E] text-white text-xs font-sans font-bold rounded-lg shadow-sm transition-all cursor-pointer border-0 active:scale-[0.98]"
        >
          Submit
        </button>

        {/* Profile Avatar / Dropdown Trigger */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-50 transition-all cursor-pointer border-0"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-[#ECECEC] flex items-center justify-center overflow-hidden">
            {/* User Profile silhouette SVG */}
            <svg className="w-4.5 h-4.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

      </div>

    </header>
  );
}
