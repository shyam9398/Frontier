'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PaperThumbnailProps {
  title: string;
  authors: string[];
  hfThumbnail?: string;
  className?: string;
}

export default function PaperThumbnail({ title, authors, hfThumbnail, className = "" }: PaperThumbnailProps) {
  const [imgError, setImgError] = useState(false);

  // Check if we have a valid thumbnail URL and no error occurred
  const hasThumbnail = hfThumbnail && hfThumbnail.trim() !== "" && !imgError;

  return (
    <div className={`relative ${className} select-none overflow-hidden rounded-md border border-[#ECECEC] bg-white shadow-[1px_2px_6px_rgba(0,0,0,0.06)] hover:shadow-md transition-all`}>
      {hasThumbnail ? (
        <Image
          src={hfThumbnail}
          alt={`Thumbnail of ${title}`}
          fill
          unoptimized={true}
          sizes="(max-width: 768px) 120px, 150px"
          className="object-contain transition-opacity duration-300"
          onError={() => setImgError(true)}
          priority={false}
        />
      ) : (
        // Beautiful generated paper cover fallback
        <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] text-left">
          {/* Header */}
          <div className="border-b border-[#E0E0E0] pb-1 flex justify-between items-center">
            <span className="text-[6px] uppercase tracking-wider font-sans font-bold text-[#FF4D73]">
              AI Hub Research
            </span>
            <span className="text-[5px] text-[#888888] font-sans">
              arXiv.org
            </span>
          </div>

          {/* Title */}
          <div className="flex-1 flex flex-col justify-center my-2">
            <h4 className="text-[10px] leading-snug font-serif font-bold text-[#111111] line-clamp-4">
              {title}
            </h4>
            <p className="text-[6px] font-serif text-[#666666] mt-1.5 line-clamp-1">
              {authors && authors.length > 0 ? authors.slice(0, 2).join(', ') : 'Unknown'}
              {authors && authors.length > 2 ? ' et al.' : ''}
            </p>
          </div>

          {/* Page body lines simulation */}
          <div className="space-y-1 opacity-40">
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-300 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-300 rounded" />
          </div>

          {/* Footer */}
          <div className="border-t border-[#E0E0E0] pt-1 flex justify-between items-center text-[5px] font-sans text-[#888888]">
            <span>Vol. 2026</span>
            <span>Page 1</span>
          </div>
        </div>
      )}
    </div>
  );
}
