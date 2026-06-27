'use client';

import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  variant?: 'navbar' | 'hero';
  value?: string;
  onChange?: (val: string) => void;
}

export default function SearchBar({ 
  placeholder = "Search papers, methods, tasks, organizations...", 
  value = '',
  onChange
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <div className={`relative flex items-center w-full transition-all duration-200`}>
      <div className="absolute left-3.5 text-text-secondary">
        <Search size={16} className="text-text-secondary/70 group-focus-within:text-primary transition-colors" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-11 pr-16 rounded-full md:rounded-md border border-[#ECECEC] bg-white text-[#111111] text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#FF4D73] focus:border-[#FF4D73] h-12 md:h-auto md:py-2.5"
      />
      <div className="absolute right-3 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#ECECEC] bg-gray-50 text-[9px] font-semibold text-[#888888] pointer-events-none select-none">
        <span>⌘</span>
        <span>K</span>
      </div>
    </div>
  );
}
