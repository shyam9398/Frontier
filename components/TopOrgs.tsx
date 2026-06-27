'use client';

import React from 'react';
import { Landmark, GraduationCap, Building2 } from 'lucide-react';

interface OrgProfile {
  id: string;
  name: string;
  type: 'lab' | 'university';
  papersCount: string;
  citations: string;
  primaryFocus: string;
  logoBg: string;
}

export default function TopOrgs() {
  const orgs: OrgProfile[] = [
    {
      id: 'org1',
      name: 'OpenAI',
      type: 'lab',
      papersCount: '2,341',
      citations: '125K',
      primaryFocus: 'AGI, Multimodal, Reasoning',
      logoBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'org2',
      name: 'Google DeepMind',
      type: 'lab',
      papersCount: '2,102',
      citations: '96K',
      primaryFocus: 'AlphaFold, RL, Scaling Laws',
      logoBg: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'org3',
      name: 'Stanford University',
      type: 'university',
      papersCount: '1,450',
      citations: '64K',
      primaryFocus: 'HELM Benchmarks, Vision',
      logoBg: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 'org4',
      name: 'Meta AI (FAIR)',
      type: 'lab',
      papersCount: '1,876',
      citations: '87K',
      primaryFocus: 'Llama, Open-Source, PyTorch',
      logoBg: 'bg-sky-100 text-sky-800 border-sky-200'
    },
    {
      id: 'org5',
      name: 'Massachusetts Institute of Technology (MIT)',
      type: 'university',
      papersCount: '1,234',
      citations: '56K',
      primaryFocus: 'Robotics, Material Science',
      logoBg: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm border border-border-warm bg-card w-full flex-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <Landmark className="text-primary" size={18} />
          <h2 className="font-extrabold text-base text-text-primary tracking-tight">Top Organizations</h2>
        </div>
        <a href="#organizations" className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors">
          View all profiles <span className="text-sm">→</span>
        </a>
      </div>

      {/* List */}
      <div className="space-y-4">
        {orgs.map((org) => {
          const initials = org.name
            .split(' ')
            .filter((w) => w[0] === w[0].toUpperCase())
            .map((w) => w[0])
            .join('')
            .substring(0, 2);

          const OrgIcon = org.type === 'university' ? GraduationCap : Building2;

          return (
            <div
              key={org.id}
              className="flex items-center justify-between gap-4 p-2 -mx-2 hover:bg-accent/10 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Logo Initials */}
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${org.logoBg}`}>
                  {initials}
                </div>

                {/* Org Details */}
                <div className="min-w-0 text-left">
                  <h4 className="font-extrabold text-xs text-text-primary leading-tight hover:text-primary transition-colors cursor-pointer truncate">
                    {org.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-text-secondary">
                    <span className="flex items-center gap-0.5">
                      <OrgIcon size={10} />
                      {org.type === 'university' ? 'University' : 'Lab'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border-warm" />
                    <span className="truncate">{org.primaryFocus}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 shrink-0 text-right">
                <div>
                  <p className="text-xs font-extrabold text-text-primary leading-none">{org.papersCount}</p>
                  <span className="text-[9px] font-bold text-text-secondary uppercase mt-0.5 block leading-none">Papers</span>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-text-primary leading-none">{org.citations}</p>
                  <span className="text-[9px] font-bold text-text-secondary uppercase mt-0.5 block leading-none">Citations</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
