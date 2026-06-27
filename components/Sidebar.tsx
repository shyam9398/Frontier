'use client';

import React, { useState, useEffect } from 'react';

import { 
  Flame, Clock, Star, Cpu, Brain, Database, Code, Monitor, Globe, Bot,
  GitCommit, Activity, Sliders, Heart, CheckSquare, Network, FileText, Image,
  Film, Volume2, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  currentView: string;
  onViewChange: (viewId: string) => void;
  isDrawer?: boolean;
}

export default function Sidebar({ currentView, onViewChange, isDrawer = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasManuallyToggled, setHasManuallyToggled] = useState(false);

  useEffect(() => {
    if (isDrawer) {
      setIsCollapsed(false);
      return;
    }

    const handleResize = () => {
      if (hasManuallyToggled) return;
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasManuallyToggled, isDrawer]);

  const groups = [
    {
      title: 'DISCOVER',
      items: [
        { id: 'trending-papers', name: 'Trending Papers', icon: Flame },
        { id: 'latest-papers', name: 'Latest Papers', icon: Clock },
        { id: 'github-stars', name: 'Most GitHub Stars', icon: Star }
      ]
    },
    {
      title: 'TASKS',
      items: [
        { id: 'area-agents', name: 'Agents', icon: Cpu },
        { id: 'area-reasoning', name: 'Reasoning', icon: Brain },
        { id: 'area-language', name: 'Language Modeling', icon: Database },
        { id: 'area-coding', name: 'Coding Agents', icon: Code },
        { id: 'area-computer', name: 'Computer Use', icon: Monitor },
        { id: 'area-world', name: 'World Models', icon: Globe },
        { id: 'area-robotics', name: 'Robotics', icon: Bot }
      ]
    },
    {
      title: 'METHODS',
      items: [
        { id: 'method-transformers', name: 'Transformer', icon: Sliders },
        { id: 'method-cot', name: 'Chain of Thought', icon: GitCommit },
        { id: 'method-react', name: 'ReAct', icon: Activity },
        { id: 'method-lora', name: 'LoRA', icon: Sliders },
        { id: 'method-rlhf', name: 'RLHF', icon: Heart },
        { id: 'method-dpo', name: 'DPO', icon: CheckSquare },
        { id: 'method-mcp', name: 'MCP', icon: Network }
      ]
    },
    {
      title: 'GENERATION',
      items: [
        { id: 'gen-text', name: 'Text Generation', icon: FileText },
        { id: 'gen-image', name: 'Image Generation', icon: Image },
        { id: 'gen-video', name: 'Video Generation', icon: Film },
        { id: 'gen-audio', name: 'Audio Generation', icon: Volume2 }
      ]
    }
  ];

  const collapsedIcons = [
    { id: 'trending-papers', name: 'Trending Papers', icon: Flame },
    { id: 'latest-papers', name: 'Latest Papers', icon: Clock },
    { id: 'github-stars', name: 'Most GitHub Stars', icon: Star },
    { id: 'area-agents', name: 'Agents', icon: Cpu },
    { id: 'method-transformers', name: 'Transformer', icon: Sliders },
    { id: 'gen-text', name: 'Text Generation', icon: FileText }
  ];

  return (
    <aside
      className={`h-full flex flex-col bg-white border-r border-[#ECECEC] overflow-hidden shrink-0 select-none text-left transition-all duration-200 ${
        isCollapsed ? 'w-[70px]' : 'w-[240px]'
      }`}
    >
      {/* Sidebar Header Collapse Control button */}
      {!isDrawer && (
        <div className="px-4 py-3 flex items-center justify-end shrink-0 border-b border-[#ECECEC]">
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              setHasManuallyToggled(true);
            }}
            className="p-1.5 rounded hover:bg-gray-100 text-[#666666] hover:text-[#FF4D73] transition-colors cursor-pointer focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      )}

      {/* Nav List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        
        {/* Full Expanded Sidebar List */}
        {!isCollapsed && (
          <div className="space-y-5">
             {groups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {group.title && (
                  <h4 className="px-3 text-[10px] font-bold tracking-wider text-[#888888] uppercase">
                    {group.title}
                  </h4>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = currentView === item.id || 
                      (item.id.startsWith('area-') && currentView === item.id.replace('area-', '')) ||
                      (item.id.startsWith('method-') && currentView === item.id.replace('method-', '')) ||
                      (item.id.startsWith('gen-') && currentView === item.id.replace('gen-', '')) ||
                      (item.id.startsWith('lib-') && (currentView === item.id || currentView === item.id.replace('lib-', ''))) ||
                      (item.id === 'lib-bookmarks' && currentView === 'bookmarks');
                    
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.id}
                        href={`/${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onViewChange(item.id);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2 w-full rounded-md text-left text-xs transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-[#FFF0F3] text-[#FF4D73] font-semibold'
                            : 'text-[#666666] hover:bg-[#FFF5F7] hover:text-[#FF4D73]'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-[#FF4D73]' : 'text-[#666666]'} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collapsed Icon-Only List */}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-2">
            {collapsedIcons.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                (item.id.startsWith('area-') && currentView === item.id.replace('area-', '')) ||
                (item.id.startsWith('method-') && currentView === item.id.replace('method-', '')) ||
                (item.id.startsWith('gen-') && currentView === item.id.replace('gen-', '')) ||
                (item.id.startsWith('lib-') && (currentView === item.id || currentView === item.id.replace('lib-', '')));
              
              return (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange(item.id);
                  }}
                  className={`relative p-2.5 rounded-md transition-all duration-150 flex items-center justify-center group cursor-pointer ${
                    isActive 
                      ? 'bg-[#FFF0F3] text-[#FF4D73]' 
                      : 'text-[#666666] hover:bg-[#FFF5F7] hover:text-[#FF4D73]'
                  }`}
                >
                  <Icon size={16} />
                  
                  {/* Tooltip Overlay */}
                  <div className="absolute left-14 bg-[#111111] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap shadow-md">
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>

    </aside>
  );
}
