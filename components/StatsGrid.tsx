'use client';

import React from 'react';
import { FileText, Users, FlaskConical, Cpu, Database, BarChart3, Code2, Calendar } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  bg: string;
}

export default function StatsGrid() {
  const stats: StatItem[] = [
    { label: 'Papers', value: '2.4M+', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Authors', value: '1.1M+', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Labs', value: '12K+', icon: FlaskConical, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Models', value: '8.6K+', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Datasets', value: '15K+', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Benchmarks', value: '2.3K+', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Repositories', value: '1.7M+', icon: Code2, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { label: 'Conferences', value: '98+', icon: Calendar, color: 'text-violet-500', bg: 'bg-violet-50' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8 w-full">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border-warm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} mb-2 flex items-center justify-center`}>
            <stat.icon size={20} />
          </div>
          <span className="text-sm font-extrabold text-text-primary leading-tight">{stat.value}</span>
          <span className="text-[10px] font-semibold text-text-secondary uppercase mt-0.5 tracking-wider">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
