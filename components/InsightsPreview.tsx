'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface InsightAlert {
  id: string;
  category: string;
  title: string;
  description: string;
  entities: string[];
  type: 'trend' | 'breakthrough' | 'scaling';
}

export default function InsightsPreview() {
  const insights: InsightAlert[] = [
    {
      id: 'i1',
      category: 'Robotics Control',
      title: 'Shift towards end-to-end vision-to-action control models',
      description: 'Physical trials of GROOT N1 prove that treating robot kinematics as token streams outperforms traditional simulation models.',
      entities: ['GROOT N1', 'OpenAI', 'Figure'],
      type: 'breakthrough'
    },
    {
      id: 'i2',
      category: 'LLM Scaling',
      title: 'Empirical compute frontiers show data bounds rather than parameters',
      description: 'Recent scaling revisions show optimal training pipelines now target 20T+ tokens for models under 10B parameters, shifting standard dataset allocations.',
      entities: ['Scaling Laws', 'DeepMind'],
      type: 'scaling'
    },
    {
      id: 'i3',
      category: 'Reasoning Models',
      title: 'Chain of Thought techniques entering test-time scaling phase',
      description: 'RLHF methodologies are being updated to incentivize longer test-time computation traces, improving math benchmark yields by +18% on GSM8k.',
      entities: ['Qwen3', 'RLHF', 'DPO'],
      type: 'trend'
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm border border-border-warm bg-card w-full flex-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary fill-primary/10" size={18} />
          <h2 className="font-extrabold text-base text-text-primary tracking-tight">AI Insights & Briefings</h2>
        </div>
        <a href="#insights" className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors">
          Open AI Insights <span className="text-sm">→</span>
        </a>
      </div>

      {/* List */}
      <div className="space-y-4">
        {insights.map((insight) => {
          return (
            <div
              key={insight.id}
              className="p-4 rounded-2xl border border-border-warm bg-accent/5 hover:bg-accent/10 transition-all duration-200 text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                    {insight.category}
                  </span>
                  <span className="text-[10px] text-text-secondary font-bold">1d ago</span>
                </div>
                
                <h4 className="font-extrabold text-xs text-text-primary leading-snug mb-1.5 hover:text-primary transition-colors cursor-pointer">
                  {insight.title}
                </h4>
                
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {insight.description}
                </p>
              </div>

              {/* Connected entities tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-border-warm/50">
                <span className="text-[9px] font-bold text-text-secondary mr-1">Grounds:</span>
                {insight.entities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[9px] font-bold bg-card border border-border-warm text-text-primary hover:border-primary/30 transition-all cursor-pointer"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
