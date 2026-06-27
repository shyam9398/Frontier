'use client';

import React from 'react';
import Link from 'next/link';
import { Paper } from '@/types';
import PaperThumbnail from './PaperThumbnail';

// Helper to format citation numbers nicely
const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getTagStyle = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes('coding agent')) {
    return 'bg-[#FDF2F8] border-transparent text-[#DB2777] font-semibold';
  }
  if (t.includes('agent')) {
    return 'bg-[#EEF2FF] border-transparent text-[#4F46E5] font-semibold';
  }
  if (t.includes('language') || t.includes('nlp')) {
    return 'bg-[#ECFDF5] border-transparent text-[#059669] font-semibold';
  }
  if (t.includes('reasoning') || t.includes('math') || t.includes('logic')) {
    return 'bg-[#FFF0F3] border-transparent text-[#FF4D73] font-semibold';
  }
  if (t.includes('robot')) {
    return 'bg-[#EFF6FF] border-transparent text-[#2563EB] font-semibold';
  }
  if (t.includes('world') || t.includes('predictive')) {
    return 'bg-[#FAF5FF] border-transparent text-[#7C3AED] font-semibold';
  }
  if (t.includes('computer') || t.includes('gui')) {
    return 'bg-[#F0FDFA] border-transparent text-[#0D9488] font-semibold';
  }
  // Default benchmark or dataset tags
  return 'bg-gray-100 border-transparent text-gray-700 font-semibold';
};

interface PaperCardProps {
  paper: Paper;
  isBookmarked: boolean;
  isSaved: boolean;
  isInCompareList: boolean;
  onBookmarkToggle: () => void;
  onSaveToggle: () => void;
  onCompareSelect: () => void;
  onOpenGraph: () => void;
}

export default function PaperCard({
  paper,
  isBookmarked,
  isSaved,
  isInCompareList,
  onBookmarkToggle,
  onSaveToggle,
  onCompareSelect,
  onOpenGraph
}: PaperCardProps) {

  // Helper to resolve github repository URL or fallback to search query for title
  const handleOpenRepo = () => {
    if (paper.githubRepo && paper.githubRepo.trim() !== '') {
      window.open(paper.githubRepo, '_blank');
    } else {
      window.open(`https://github.com/search?q=${encodeURIComponent(paper.title)}`, '_blank');
    }
  };

  const getSotaLine = () => {
    if (!paper.benchmarks) return null;
    // Format benchmarks nicely to show SOTA ranking
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#FF4D73] font-sans font-semibold">
        <span>🏆</span>
        <span>
          SOTA on <span className="font-bold">{paper.benchmarks}</span> · #1 ranking today
        </span>
      </div>
    );
  };

  return (
    <div 
      className="p-5 bg-white border border-[#ECECEC] rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:border-[#FF4D73]/15 transition-all duration-300 flex flex-col md:flex-row gap-5 items-stretch justify-between text-left min-h-[220px] group w-full"
      data-testid="paper-card"
    >
      {/* Left Column: Real Paper Thumbnail */}
      <div className="shrink-0 flex items-start justify-center w-full md:w-auto">
        <Link href={`/papers/${paper.id}`} className="block">
          <PaperThumbnail
            title={paper.title}
            authors={paper.authors}
            hfThumbnail={paper.hfThumbnail}
            className="w-[140px] h-[180px] cursor-pointer rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#ECECEC]/80 group-hover:scale-[1.01] transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Center Content Column */}
      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* Title - modern Premium sans-serif */}
          <h2 className="font-sans font-extrabold text-[#111111] hover:text-[#FF4D73] transition-colors leading-snug break-words text-lg sm:text-xl md:text-[22px] tracking-tight line-clamp-2">
            <Link href={`/papers/${paper.id}`}>
              {paper.title}
            </Link>
          </h2>

          {/* Authors & Organization */}
          <p className="text-xs font-sans text-gray-500 font-medium">
            <span className="text-[#111111] font-semibold">{paper.authors.join(', ')}</span> 
            {paper.pubDate && ` · ${paper.pubDate}`}
          </p>

          {/* Abstract / Description - #444444, font-sans */}
          <p className="font-sans text-gray-600 text-xs md:text-[13px] leading-[1.6] line-clamp-3 max-w-none font-normal">
            {paper.summary}
          </p>

          {/* SOTA Line if available */}
          {getSotaLine()}
        </div>

        {/* Tags Row: Tasks, Methods, Datasets */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5 items-center">
            {/* Primary category pill */}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#FFF0F3] border border-[#FF4D73]/15 text-[#FF4D73]">
              {paper.category}
            </span>

            {/* Tasks Tags */}
            {paper.tasks && paper.tasks.slice(0, 4).map(task => (
              <span 
                key={task}
                className={`px-2.5 py-1 rounded-full text-[10px] font-sans tracking-tight transition-colors ${getTagStyle(task)}`}
              >
                {task}
              </span>
            ))}
            
            {/* Methods Tags (Secondary style: thin border) */}
            {paper.methods && paper.methods.slice(0, 4).map(method => (
              <span 
                key={method}
                className="px-2.5 py-1 rounded-full text-[10px] bg-white border border-[#ECECEC] text-gray-600 font-sans font-medium tracking-tight hover:bg-gray-50 transition-colors"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Action Row - modern action link buttons */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 text-[10.5px] font-sans text-gray-400 border-t border-[#ECECEC]/60">
            <Link href={`/papers/${paper.id}`} className="hover:text-[#FF4D73] font-semibold transition-colors py-2 px-1">
              View Paper
            </Link>
            <span className="text-gray-250 select-none text-[8px]">•</span>
            <button 
              onClick={handleOpenRepo}
              className="hover:text-[#FF4D73] transition-colors cursor-pointer flex items-center bg-transparent border-0 p-0 py-2 px-1 font-sans font-semibold text-[10.5px] text-gray-400"
            >
              Repository
            </button>
            <span className="text-gray-250 select-none text-[8px]">•</span>
            <button 
              onClick={onSaveToggle}
              className={`hover:text-[#FF4D73] transition-colors cursor-pointer bg-transparent border-0 p-0 py-2 px-1 font-sans font-semibold text-[10.5px] ${isSaved ? 'text-[#FF4D73] font-bold' : 'text-gray-400'}`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <span className="text-gray-250 select-none text-[8px]">•</span>
            <button 
              onClick={onBookmarkToggle}
              className={`hover:text-[#FF4D73] transition-colors cursor-pointer bg-transparent border-0 p-0 py-2 px-1 font-sans font-semibold text-[10.5px] ${isBookmarked ? 'text-[#FF4D73] font-bold' : 'text-gray-400'}`}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <span className="text-gray-250 select-none text-[8px]">•</span>
            <button 
              onClick={onCompareSelect}
              className={`hover:text-[#FF4D73] transition-colors cursor-pointer bg-transparent border-0 p-0 py-2 px-1 font-sans font-semibold text-[10.5px] ${isInCompareList ? 'text-[#FF4D73] font-bold' : 'text-gray-400'}`}
            >
              {isInCompareList ? 'Remove Compare' : 'Compare'}
            </button>
            <span className="text-gray-250 select-none text-[8px]">•</span>
            <button 
              onClick={onOpenGraph}
              className="hover:text-[#FF4D73] transition-colors cursor-pointer bg-transparent border-0 p-0 py-2 px-1 font-sans font-semibold text-[10.5px] text-gray-400"
            >
              Open Graph
            </button>
          </div>
        </div>

        {/* Mobile-only Metrics Row */}
        <div className="flex md:hidden flex-row items-center justify-between gap-4 pt-3 border-t border-[#ECECEC]/60 w-full">
          {/* Upvotes */}
          <div className="flex items-center gap-1.5 font-sans text-xs font-extrabold text-[#FF4D73]">
            <svg className="w-3.5 h-3.5 text-[#FF4D73]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span>{formatNumber(paper.upvotes || 0)}</span>
            <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-wider ml-1">Upvotes</span>
          </div>

          {/* Repo Stars */}
          <button 
            onClick={handleOpenRepo}
            className="flex items-center gap-1.5 font-sans text-xs font-extrabold text-[#111111] hover:text-[#FF4D73] transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            <svg className="w-3.5 h-3.5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{formatNumber(paper.stars || 0)}</span>
            <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-wider ml-1">Repo</span>
          </button>

          {/* Citations */}
          <div className="flex items-center gap-1.5 font-sans text-xs font-extrabold text-[#111111]">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>{paper.citations || 0}</span>
            <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-wider ml-1">Citations</span>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Right Column: Metrics Panel */}
      <div className="hidden md:flex flex-col items-end justify-start gap-4 border-l border-[#ECECEC]/85 pt-2 pl-5 shrink-0 w-[120px] text-right">
        
        {/* Upvotes */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5 font-sans text-base font-extrabold text-[#FF4D73]">
            <svg className="w-3.5 h-3.5 text-[#FF4D73]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span>{formatNumber(paper.upvotes || 0)}</span>
          </div>
          <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            Upvotes
          </span>
        </div>

        {/* Repo Stars */}
        <div className="flex flex-col items-end text-right">
          <button 
            onClick={handleOpenRepo}
            className="flex items-center gap-1.5 font-sans text-base font-extrabold text-[#111111] hover:text-[#FF4D73] transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            {/* Simple circular sync loop SVG */}
            <svg className="w-3.5 h-3.5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{formatNumber(paper.stars || 0)}</span>
          </button>
          <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            Repo
          </span>
        </div>

        {/* Citations */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5 font-sans text-base font-extrabold text-[#111111]">
            {/* Simple book page SVG */}
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>{paper.citations || 0}</span>
          </div>
          <span className="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            Citations
          </span>
        </div>

      </div>
    </div>
  );
}
