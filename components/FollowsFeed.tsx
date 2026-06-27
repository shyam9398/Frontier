'use client';

import React from 'react';
import { FileText, Cpu, Code2, Users } from 'lucide-react';
import { followUpdates } from '@/data/mockData';

export default function FollowsFeed() {
  const iconMap = {
    paper: { icon: FileText, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    model: { icon: Cpu, bg: 'bg-blue-50 text-blue-600 border-blue-100' },
    repository: { icon: Code2, bg: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
    follow: { icon: Users, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  };

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm border border-border-warm bg-card w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔔</span>
          <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Latest from your follows</h3>
        </div>
        <a href="#feed" className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center transition-colors">
          View all <span className="text-xs ml-0.5">→</span>
        </a>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {followUpdates.map((update) => {
          const typeStyle = iconMap[update.type] || iconMap.paper;
          const ActionIcon = typeStyle.icon;

          // Generating initials for avatars
          const initials = update.researcherName
            .split(' ')
            .map((w) => w[0])
            .join('')
            .substring(0, 2);

          return (
            <div key={update.id} className="flex gap-3 group items-start">
              {/* User Avatar Circle */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl border border-border-warm bg-accent/20 flex items-center justify-center font-bold text-xs text-primary shadow-sm">
                  {initials}
                </div>
                {/* Action Mini-Icon Badge at bottom right of avatar */}
                <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-md border text-[9px] shadow-sm flex items-center justify-center ${typeStyle.bg}`}>
                  <ActionIcon size={8} />
                </div>
              </div>

              {/* Feed Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary leading-tight">
                  <span className="font-extrabold hover:text-primary cursor-pointer transition-colors mr-1">
                    {update.researcherName}
                  </span>
                  <span className="text-text-secondary">{update.actionText}</span>
                </p>
                <h4 className="font-extrabold text-xs text-text-primary hover:text-primary transition-colors cursor-pointer mt-1 truncate">
                  {update.targetName}
                </h4>
                <span className="text-[9px] font-semibold text-text-secondary mt-1 block">
                  {update.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
