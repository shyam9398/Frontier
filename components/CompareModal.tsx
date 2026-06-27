'use client';

import React from 'react';
import { X, GitCommit, Database, Trophy, Award, Landmark } from 'lucide-react';
import { Paper } from '@/types';

interface CompareModalProps {
  papers: Paper[];
  onClose: () => void;
}

export default function CompareModal({ papers, onClose }: CompareModalProps) {
  const getGridColsClass = (count: number) => {
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  const getColSpanClass = (count: number) => {
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    return 'grid-cols-2 lg:grid-cols-4';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />

      {/* Modal Content */}
      <div className="relative w-full max-w-7xl bg-white border border-[#ECECEC] rounded-md shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#ECECEC] bg-gray-50/50">
          <div>
            <h3 className="font-serif font-bold text-base text-[#111111] tracking-tight">Compare Research Papers</h3>
            <p className="text-xs text-[#666666] font-serif">Side-by-side structural comparison of AI research breakthroughs ({papers.length} papers selected)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 text-[#666666] hover:text-[#FF4D73] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className={`grid gap-6 ${getGridColsClass(papers.length)}`}>
            
            {papers.map((paper, index) => (
              <div 
                key={paper.id} 
                className="p-5 rounded border border-[#ECECEC] bg-gray-50/30 flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-[#FFF0F3] text-[#FF4D73] border border-[#FF4D73]/15 uppercase tracking-wider mb-3">
                    Paper #{index + 1}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#111111] mb-2 line-clamp-2 leading-snug">
                    {paper.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-[#FF4D73] mb-1">{(paper.organization && typeof paper.organization === 'object') ? (paper.organization as { name?: string }).name : (paper.organization || 'Independent Research')}</p>
                  <p className="text-[10px] text-[#666666] mb-4 truncate font-serif">{paper.authors.join(', ')}</p>
                  <p className="text-xs text-[#444444] font-serif leading-relaxed italic bg-white p-3.5 rounded border border-[#ECECEC] line-clamp-4">
                    &ldquo;{paper.summary}&rdquo;
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-[#ECECEC] text-xs font-serif">
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Citations</span>
                    <p className="text-sm font-bold text-[#111111] mt-0.5">{paper.citations.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">GitHub Stars</span>
                    <p className="text-sm font-bold text-[#111111] mt-0.5">{(paper.stars || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Upvotes</span>
                    <p className="text-sm font-bold text-[#111111] mt-0.5">{(paper.upvotes || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Reading Time</span>
                    <p className="text-sm font-bold text-[#FF4D73] mt-0.5">{paper.readingTime || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Connected Entities Table */}
          <div className="p-5 border border-[#ECECEC] rounded bg-white space-y-4">
            <h5 className="font-serif font-bold text-xs text-[#111111] uppercase tracking-wider pb-2 border-b border-[#ECECEC]">
              Grounding & Reference Matrices
            </h5>
            
            <div className="space-y-4">
              {/* Tasks */}
              <div className="flex flex-col md:flex-row md:items-start justify-between pb-3 border-b border-[#ECECEC] text-xs font-serif">
                <span className="font-bold text-[#666666] flex items-center gap-1.5 shrink-0 py-1">
                  <Award size={14} className="text-[#FF4D73]" />
                  Tasks
                </span>
                <div className={`grid gap-4 w-full md:w-[80%] text-left md:text-right font-semibold text-[#111111] ${getColSpanClass(papers.length)}`}>
                  {papers.map(p => (
                    <div key={p.id} className="flex flex-wrap md:justify-end gap-1">
                      {p.tasks && p.tasks.slice(0, 3).map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-gray-100 border border-gray-200">{t}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Methods */}
              <div className="flex flex-col md:flex-row md:items-start justify-between pb-3 border-b border-[#ECECEC] text-xs font-serif">
                <span className="font-bold text-[#666666] flex items-center gap-1.5 shrink-0 py-1">
                  <GitCommit size={14} className="text-[#3B82F6]" />
                  Methods
                </span>
                <div className={`grid gap-4 w-full md:w-[80%] text-left md:text-right font-semibold text-[#111111] ${getColSpanClass(papers.length)}`}>
                  {papers.map(p => (
                    <div key={p.id} className="flex flex-wrap md:justify-end gap-1">
                      {p.methods && p.methods.slice(0, 3).map(m => (
                        <span key={m} className="px-1.5 py-0.5 rounded text-[9px] bg-gray-100 border border-gray-200">{m}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Models */}
              <div className="flex flex-col md:flex-row md:items-start justify-between pb-3 border-b border-[#ECECEC] text-xs font-serif">
                <span className="font-bold text-[#666666] flex items-center gap-1.5 shrink-0 py-1">
                  <Landmark size={14} className="text-purple-500" />
                  Models Used
                </span>
                <div className={`grid gap-4 w-full md:w-[80%] text-left md:text-right font-semibold text-[#111111] ${getColSpanClass(papers.length)}`}>
                  {papers.map(p => (
                    <span key={p.id} className="truncate">{p.models?.join(', ') || 'None'}</span>
                  ))}
                </div>
              </div>

              {/* Datasets */}
              <div className="flex flex-col md:flex-row md:items-start justify-between pb-3 border-b border-[#ECECEC] text-xs font-serif">
                <span className="font-bold text-[#666666] flex items-center gap-1.5 shrink-0 py-1">
                  <Database size={14} className="text-emerald-500" />
                  Datasets Used
                </span>
                <div className={`grid gap-4 w-full md:w-[80%] text-left md:text-right font-semibold text-[#111111] ${getColSpanClass(papers.length)}`}>
                  {papers.map(p => (
                    <span key={p.id} className="truncate">{p.datasets?.join(', ') || 'None'}</span>
                  ))}
                </div>
              </div>

              {/* Benchmarks */}
              <div className="flex flex-col md:flex-row md:items-start justify-between text-xs font-serif">
                <span className="font-bold text-[#666666] flex items-center gap-1.5 shrink-0 py-1">
                  <Trophy size={14} className="text-amber-500" />
                  Benchmarks
                </span>
                <div className={`grid gap-4 w-full md:w-[80%] text-left md:text-right font-semibold text-[#111111] ${getColSpanClass(papers.length)}`}>
                  {papers.map(p => (
                    <span key={p.id} className="truncate text-xs font-serif font-bold text-[#FF4D73]">
                    {p.benchmarks || 'N/A'}
                  </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-[#ECECEC] flex justify-end gap-3.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#ECECEC] bg-white rounded text-xs font-serif text-[#666666] hover:text-[#FF4D73] hover:bg-gray-50 transition-all cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
