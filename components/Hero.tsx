'use client';

import React, { useState } from 'react';
import SearchBar from './SearchBar';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export default function Hero({ searchQuery, onSearchChange }: HeroProps) {
  const [activeFilter, setActiveFilter] = useState('All Time');
  const periods = ['Today', 'This Week', 'This Month', 'All Time'];

  return (
    <section className="bg-white py-6 flex flex-col gap-6 border-b border-[#ECECEC] pb-8 mb-4">
      {/* Title & Subtitle */}
      <div className="space-y-1.5 text-left w-full max-w-3xl">
        <h1 className="text-4xl font-bold font-serif text-[#111111] leading-tight">
          Discover Frontier AI Research
        </h1>
        <p className="text-sm font-serif text-[#666666] leading-relaxed">
          Explore the latest papers, methods and breakthroughs from the world&apos;s AI research community.
        </p>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between w-full">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <SearchBar 
            value={searchQuery} 
            onChange={onSearchChange} 
            placeholder="Search papers, methods, tasks, organizations..." 
          />
        </div>

        {/* Timeframe Filters */}
        <div className="flex items-center gap-0.5 border border-[#ECECEC] rounded-md p-0.5 bg-gray-50 shrink-0 self-start md:self-auto">
          {periods.map((period) => {
            const isActive = activeFilter === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => setActiveFilter(period)}
                className={`px-3 py-1.5 text-xs font-serif transition-all duration-150 cursor-pointer rounded border-0 ${
                  isActive 
                    ? 'bg-[#FF4D73] text-white font-semibold' 
                    : 'text-[#666666] hover:text-[#FF4D73] bg-transparent'
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
