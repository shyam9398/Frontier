'use client';

import React from 'react';
import { Paper } from '@/types';
import PaperCard from './PaperCard';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface TrendingPapersProps {
  papers: Paper[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onBookmarkToggle: (paper: Paper) => void;
  onCompareSelect: (paper: Paper) => void;
  onOpenGraph: (paper: Paper) => void;
  onSavePaper: (paper: Paper) => void;
  compareList?: Paper[];
}

export default function TrendingPapers({ 
  papers, 
  isLoading = false,
  error = null,
  onRetry,
  onBookmarkToggle, 
  onCompareSelect, 
  onOpenGraph, 
  onSavePaper,
  compareList = []
}: TrendingPapersProps) {

  // Loading skeleton card
  const renderSkeletonCard = (index: number) => (
    <div 
      key={`skeleton-${index}`}
      className="p-5 bg-white border border-[#ECECEC] rounded-[20px] flex flex-col md:flex-row gap-5 animate-pulse text-left min-h-[220px]"
    >
      {/* Left Thumbnail Skeleton */}
      <div className="w-[130px] h-[175px] bg-gray-150 rounded shrink-0 self-center md:self-start" />
      
      {/* Center Skeleton */}
      <div className="flex-1 space-y-4 py-1">
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-gray-150 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
        <div className="h-7 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-150 rounded" />
          <div className="h-4 w-full bg-gray-150 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Right Column Skeleton */}
      <div className="w-full md:w-36 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 pl-0 md:pl-5 flex flex-row md:flex-col gap-4 justify-around md:justify-start items-center">
        <div className="h-10 w-20 bg-gray-100 rounded" />
        <div className="h-10 w-20 bg-gray-100 rounded" />
        <div className="h-10 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  );

  // Error fallback UI
  if (error) {
    return (
      <div className="p-8 border border-red-200 bg-red-50/30 rounded text-center space-y-4 max-w-lg mx-auto">
        <div className="flex justify-center text-red-500">
          <AlertCircle size={40} />
        </div>
        <h3 className="font-serif font-bold text-base text-[#111111]">Failed to load trending papers</h3>
        <p className="text-xs text-[#666666] font-serif leading-relaxed">
          {error || "An unexpected error occurred while fetching the latest trending papers from PapersWithCode."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF4D73] hover:bg-[#FF335E] text-white text-xs font-serif rounded transition-all cursor-pointer border-0"
          >
            <RotateCcw size={12} /> Retry Fetching
          </button>
        )}
      </div>
    );
  }

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4 text-left w-full">
        {Array.from({ length: 5 }).map((_, i) => renderSkeletonCard(i))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="p-12 border border-[#ECECEC] rounded text-center space-y-2">
        <h3 className="font-serif font-bold text-sm text-[#111111]">No papers found</h3>
        <p className="text-xs text-[#666666] font-serif">
          No papers are indexed or match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left w-full">
      <div className="flex flex-col gap-4">
        {papers.map((paper) => {
          const isBookmarked = !!paper.isBookmarked;
          const isSaved = !!paper.isSaved;
          const isInCompareList = !!compareList.find(p => p.id === paper.id);
          
          return (
            <PaperCard
              key={paper.id}
              paper={paper}
              isBookmarked={isBookmarked}
              isSaved={isSaved}
              isInCompareList={isInCompareList}
              onBookmarkToggle={() => onBookmarkToggle(paper)}
              onSaveToggle={() => onSavePaper(paper)}
              onCompareSelect={() => onCompareSelect(paper)}
              onOpenGraph={() => onOpenGraph(paper)}
            />
          );
        })}
      </div>
    </div>
  );
}
