'use client';

import React from 'react';
import { Star, Download } from 'lucide-react';
import { topModels } from '@/data/mockData';

export default function TopModels() {
  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm border border-border-warm bg-card w-full flex-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <span className="text-lg">⭐</span>
          <h2 className="font-extrabold text-base text-text-primary tracking-tight">Top Models</h2>
        </div>
        <a href="#models" className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors">
          View all models <span className="text-sm">→</span>
        </a>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {topModels.map((model, idx) => {
          return (
            <div
              key={model.id}
              className={`group flex items-center justify-between gap-4 py-4 ${
                idx !== topModels.length - 1 ? 'border-b border-border-warm/65' : ''
              } hover:bg-accent/10 px-2 -mx-2 rounded-xl transition-all duration-200`}
            >
              {/* Rank and Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="w-5 text-center font-extrabold text-sm text-text-secondary/70 group-hover:text-primary transition-colors">
                  {idx + 1}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-sm ${model.logoColor}`}>
                  {model.name.substring(0, 2)}
                </div>
              </div>

              {/* Model Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-text-primary leading-snug group-hover:text-primary transition-colors cursor-pointer truncate">
                  {model.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-text-secondary">
                  <span className="font-semibold text-text-primary/75">{model.creator}</span>
                  <span className="w-1 h-1 rounded-full bg-border-warm" />
                  <span>{model.date}</span>
                </div>
              </div>

              {/* Stats - Rating/Trend and Downloads */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Popularity/Rating Score */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-primary">
                    <Star size={13} className="fill-current text-primary" />
                    <span className="text-xs font-extrabold text-text-primary">{model.popularity}K</span>
                  </div>
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Rating</span>
                </div>

                {/* Downloads */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-text-primary">
                    <Download size={13} className="text-text-secondary/80" />
                    <span className="text-xs font-extrabold text-text-primary">{model.downloads}</span>
                  </div>
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Downloads</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
