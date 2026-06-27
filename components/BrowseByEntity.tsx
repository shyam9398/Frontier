'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { browseEntities } from '@/data/mockData';

// Map icon string names to actual Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Users: Icons.Users,
  FlaskConical: Icons.FlaskConical,
  GraduationCap: Icons.GraduationCap,
  Cpu: Icons.Cpu,
  Database: Icons.Database,
  BarChart3: Icons.BarChart3,
  Briefcase: Icons.Briefcase,
  Code2: Icons.Code2,
  Calendar: Icons.Calendar,
};

// Colors mapping for trendlines and icon highlights
const colorClasses: Record<string, { text: string; bg: string; stroke: string }> = {
  orange: { text: 'text-pink-500', bg: 'bg-pink-50', stroke: '#FF4D73' },
  pink: { text: 'text-pink-500', bg: 'bg-pink-50', stroke: '#EC4899' },
  indigo: { text: 'text-indigo-500', bg: 'bg-indigo-50', stroke: '#6366F1' },
  blue: { text: 'text-blue-500', bg: 'bg-blue-50', stroke: '#3B82F6' },
  emerald: { text: 'text-emerald-500', bg: 'bg-emerald-50', stroke: '#10B981' },
  green: { text: 'text-green-500', bg: 'bg-green-50', stroke: '#22C55E' },
  amber: { text: 'text-amber-500', bg: 'bg-amber-50', stroke: '#F59E0B' },
  cyan: { text: 'text-cyan-500', bg: 'bg-cyan-50', stroke: '#06B6D4' },
  rose: { text: 'text-rose-500', bg: 'bg-rose-50', stroke: '#F43F5E' },
};

function Sparkline({ data, strokeColor }: { data: number[]; strokeColor: string }) {
  if (!data || data.length === 0) return null;
  
  const width = 80;
  const height = 24;
  const padding = 2;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function BrowseByEntity() {
  return (
    <div className="w-full mb-8">
      {/* Title */}
      <h2 className="font-extrabold text-base text-text-primary mb-4 tracking-tight">Browse by Entity</h2>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
        {browseEntities.map((entity, idx) => {
          const Icon = iconMap[entity.iconName] || Icons.HelpCircle;
          const colors = colorClasses[entity.colorScheme] || colorClasses.orange;

          return (
            <div
              key={idx}
              className="flex flex-col p-3 bg-card border border-border-warm rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {/* Category Info */}
              <div className="text-left mb-1.5">
                <span className="text-[11px] font-semibold text-text-secondary block leading-none">
                  {entity.name}
                </span>
                <span className="text-sm font-extrabold text-text-primary block mt-1 leading-none">
                  {entity.count}
                </span>
              </div>

              {/* Sparkline Graph */}
              <div className="h-7 my-1 flex items-center justify-start">
                <Sparkline data={entity.trendData} strokeColor={colors.stroke} />
              </div>

              {/* Icon Indicator at bottom */}
              <div className="mt-1 flex items-center justify-between">
                <div className={`p-1.5 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner`}>
                  <Icon size={12} />
                </div>
                <span className="text-[8px] font-bold text-text-secondary uppercase tracking-wider">Metrics</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
