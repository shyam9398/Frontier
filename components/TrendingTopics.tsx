'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { trendingTopics } from '@/data/mockData';

function TopicSparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;
  const width = 60;
  const height = 18;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-85">
      <polyline
        fill="none"
        stroke="#FF8A5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function TrendingTopics() {
  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm border border-border-warm bg-card w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Trending Topics</h3>
        </div>
        <a href="#topics" className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center transition-colors">
          View all <span className="text-xs ml-0.5">→</span>
        </a>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {trendingTopics.map((topic) => (
          <div
            key={topic.rank}
            className="flex items-center justify-between gap-3 p-1.5 hover:bg-accent/10 rounded-xl transition-all duration-200"
          >
            {/* Rank & Name */}
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="font-extrabold text-xs text-text-secondary/70 w-4 text-center mt-0.5">
                {topic.rank}
              </span>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-text-primary leading-tight hover:text-primary transition-colors cursor-pointer truncate">
                  {topic.name}
                </h4>
                
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-text-secondary">
                  <span>{topic.paperCount}</span>
                  <span className="text-[9px] font-extrabold text-emerald-600 flex items-center">
                    <ArrowUp size={8} className="stroke-[3px]" />
                    {topic.changePct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Sparkline Chart */}
            <div className="shrink-0 flex items-center pr-1">
              <TopicSparkline data={topic.trendData} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
