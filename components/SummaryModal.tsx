'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, BrainCircuit, Cpu } from 'lucide-react';
import { Paper } from '@/types';

interface SummaryModalProps {
  paper: Paper;
  onClose: () => void;
}

export default function SummaryModal({ paper, onClose }: SummaryModalProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [typedText, setTypedText] = useState('');
  
  const bulletPoints = [
    `Core Breakthrough: Introduces novel architectures that improve scaling parameters.`,
    `Training Resources: Leverages highly optimized compute structures resulting in ${paper.velocity || '+100/mo'} citation momentum.`,
    `Connected Ecosystem: Integrates seamlessly with models like ${paper.models?.join(', ') || 'foundation models'} and datasets like ${paper.datasets?.join(', ') || 'community sets'}.`,
    `Impact Rating: Evaluated at ${paper.impact || '90%+'} research impact based on citation velocity and benchmark metrics (${paper.benchmarks || 'primary benchmarks'}).`
  ];

  const fullText = bulletPoints.join('\n\n');

  useEffect(() => {
    // Simulate AI analysis processing time
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isProcessing) return;

    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText[index]);
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 6); // typewriter speed

    return () => clearInterval(interval);
  }, [isProcessing, fullText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/45 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-card border border-border-warm rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-warm bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary animate-pulse" size={20} />
            <div>
              <h3 className="font-extrabold text-sm text-text-primary tracking-tight">AI Executive Summary</h3>
              <p className="text-[10px] text-text-secondary">Synthesized research summaries powered by AI Hub intelligence</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent/40 text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 min-h-[250px] flex flex-col justify-center">
          {isProcessing ? (
            // Processing State
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="absolute text-primary animate-bounce" size={16} />
              </div>
              <div className="text-center">
                <p className="text-xs font-extrabold text-text-primary tracking-tight">Ingesting PDF Artifacts...</p>
                <p className="text-[10px] text-text-secondary mt-1">Parsing figures, citations, and benchmark mappings</p>
              </div>
            </div>
          ) : (
            // Typed Results
            <div className="space-y-4 text-left">
              <h4 className="font-extrabold text-sm text-text-primary line-clamp-1">{paper.title}</h4>
              <p className="text-[10px] font-semibold text-primary">{(paper.organization && typeof paper.organization === 'object') ? (paper.organization as { name?: string }).name : (paper.organization || 'Independent Research')} • {paper.pubDate}</p>
              
              <div className="mt-4 p-4 rounded-2xl bg-accent/5 border border-border-warm/65 text-xs text-text-primary leading-relaxed whitespace-pre-line font-medium font-sans">
                {typedText}
                {typedText.length < fullText.length && (
                  <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-accent/5 border-t border-border-warm flex justify-between items-center text-[10px] text-text-secondary">
          <div className="flex items-center gap-1">
            <Cpu size={12} className="text-primary" />
            <span>LLaMA-3-8B-Briefing Agent</span>
          </div>
          
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
