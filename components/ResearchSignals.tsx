'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { researchSignals } from '@/data/mockData';

export default function ResearchSignals() {
  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm border border-border-warm bg-card w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Research Signals (24h)</h3>
        </div>
        <a href="#signals" className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center transition-colors">
          View all <span className="text-xs ml-0.5">→</span>
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {researchSignals.map((signal) => (
          <div
            key={signal.id}
            className="flex flex-col p-3 rounded-2xl bg-accent/15 border border-border-warm/80 hover:border-primary/30 transition-all duration-200"
          >
            <span className="text-[11px] font-semibold text-text-secondary leading-none">
              {signal.title}
            </span>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-text-primary leading-none">
                {signal.value}
              </span>
              
              <div className="flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-100">
                <ArrowUpRight size={10} className="stroke-[3px]" />
                <span>{signal.changePct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
