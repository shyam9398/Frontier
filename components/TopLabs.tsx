'use client';

import React from 'react';
import { topLabs } from '@/data/mockData';

export default function TopLabs() {
  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm border border-border-warm bg-card w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧪</span>
          <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Top Labs</h3>
        </div>
        <a href="#labs" className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center transition-colors">
          View all <span className="text-xs ml-0.5">→</span>
        </a>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {topLabs.map((lab) => {
          // Initials for avatar fallback
          const initials = lab.name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .substring(0, 2);

          return (
            <div
              key={lab.rank}
              className="flex items-center justify-between gap-3 p-1.5 hover:bg-accent/10 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank */}
                <span className="font-extrabold text-xs text-text-secondary/70 w-4 text-center shrink-0">
                  {lab.rank}
                </span>

                {/* Logo Initials Box */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${lab.logoBg}`}>
                  {initials}
                </div>

                {/* Lab Info */}
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-text-primary leading-tight hover:text-primary transition-colors cursor-pointer truncate">
                    {lab.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-text-secondary">
                    <span>{lab.papersCount}</span>
                    <span className="w-1 h-1 rounded-full bg-border-warm" />
                    <span>{lab.citationsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
