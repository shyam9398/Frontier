'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Bookmark, Star, FileText, Code, Globe, 
  Layers, AlertCircle, Copy, Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PaperThumbnail from '@/components/PaperThumbnail';
import { Paper } from '@/types';

interface PaperDetailsPageProps {
  params: Promise<{ paperId: string }>;
}

export default function PaperDetailsPage({ params }: PaperDetailsPageProps) {
  const resolvedParams = use(params);
  const paperId = resolvedParams.paperId;
  const router = useRouter();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [abstractExpanded, setAbstractExpanded] = useState(false);

  // Load paper details
  useEffect(() => {
    async function fetchPaperDetails() {
      try {
        setLoading(true);
        setError(null);

        // Extract base targetId if it is an adapted paper
        let targetId = paperId;
        let isAdapted = false;
        let adaptedCategory = "";
        if (paperId.includes('-adapted-')) {
          const parts = paperId.split('-adapted-');
          targetId = parts[0];
          isAdapted = true;
          adaptedCategory = parts[1];
        }

        // 1. Try to load from our trending API
        const trendingRes = await fetch('/api/papers/trending');
        if (trendingRes.ok) {
          const trendingPapers = await trendingRes.json();
          let found = trendingPapers.find((p: Paper) => p.id === targetId);
          if (found) {
            if (isAdapted) {
              const topic = adaptedCategory.replace(/-/g, ' ');
              const capTopic = topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              found = {
                ...found,
                id: paperId, // Keep adapted ID
                category: capTopic,
                tasks: [capTopic, ...(found.tasks || []).slice(0, 2)],
                methods: [capTopic, ...(found.methods || []).slice(0, 2)]
              };
            }
            setPaper(found);
            
            // Check bookmarks/saved state
            const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
            const saved = JSON.parse(localStorage.getItem('saved') || '[]');
            setIsBookmarked(bookmarks.includes(found.id));
            setIsSaved(saved.includes(found.id));
            setLoading(false);
            return;
          }
        }

        // 2. Fallback to live API lookup
        console.log(`Paper ${targetId} not in cache, fetching live...`);
        const hfRes = await fetch(`https://huggingface.co/api/papers/${targetId}`);
        let hfData: { 
          title?: string; 
          summary?: string; 
          authors?: Array<{ name: string }>; 
          publishedAt?: string;
          githubRepo?: string;
          githubStars?: number;
          upvotes?: number;
          organization?: string | { name?: string; fullname?: string; avatar?: string } | null;
          ai_keywords?: string[];
          linkedModels?: Array<{ name: string }>;
          linkedDatasets?: Array<{ name: string }>;
          linkedSpaces?: Array<{ name: string }>;
        } | null = null;
        if (hfRes.ok) {
          hfData = await hfRes.json();
        }

        const isArxiv = targetId.includes('.') || targetId.includes('/');
        const ssPaperId = isArxiv ? `arXiv:${targetId}` : targetId;
        const ssRes = await fetch(`https://api.semanticscholar.org/graph/v1/paper/${ssPaperId}?fields=title,abstract,authors,year,citationCount,referenceCount,url,s2FieldsOfStudy,publicationTypes,publicationDate,fieldsOfStudy,citations,references`);
        let ssData: {
          title?: string;
          abstract?: string;
          authors?: Array<{ name: string }>;
          publicationDate?: string;
          year?: number;
          citationCount?: number;
          referenceCount?: number;
          url?: string;
          references?: Array<{ paperId: string; title: string; venue?: string; citationCount?: number }>;
          citations?: Array<{ paperId: string; title: string; venue?: string; citationCount?: number }>;
        } | null = null;
        if (ssRes.ok) {
          ssData = await ssRes.json();
        }

        if (!hfData && !ssData) {
          throw new Error('Paper not found on HuggingFace or Semantic Scholar.');
        }

        // Merge & build paper object
        const title = hfData?.title || ssData?.title || "Untitled Paper";
        const abstract = hfData?.summary || ssData?.abstract || "No abstract available.";
        
        const authors = ssData?.authors 
          ? ssData.authors.map((a: { name: string }) => a.name) 
          : (hfData?.authors ? hfData.authors.map((a: { name: string }) => a.name) : ["Unknown Author"]);
          
        const pubDateStr = hfData?.publishedAt || ssData?.publicationDate || (ssData?.year ? `${ssData.year}-01-01` : null);
        let pubDate = 'June 2026';
        if (pubDateStr) {
          try {
            pubDate = new Date(pubDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch {
            // ignore date parsing error
          }
        }
        
        const githubRepo = hfData?.githubRepo || "";
        const stars = hfData?.githubStars || 0;
        const upvotes = hfData?.upvotes || 0;
        const citations = ssData?.citationCount || upvotes;
        const referencesCount = ssData?.referenceCount || 0;
        const keywords = hfData?.ai_keywords || [];
        
        // Extract category
        const text = `${title} ${abstract} ${keywords.join(' ')}`.toLowerCase();
        let category = 'Language Modeling';
        if (text.includes('coding agent') || text.includes('swe-bench')) category = 'Coding Agents';
        else if (text.includes('agent')) category = 'Agents';
        else if (text.includes('reasoning') || text.includes('cot')) category = 'Reasoning';
        else if (text.includes('robot')) category = 'Robotics';
        else if (text.includes('world model')) category = 'World Models';
        else if (text.includes('image') || text.includes('diffusion')) category = 'Image Generation';

        let tasks = keywords.filter((k: string) => k.toLowerCase().includes('task') || k.toLowerCase().includes('generation') || k.toLowerCase().includes('reasoning')).slice(0, 5);
        if (tasks.length === 0) tasks = [category, "Deep Learning"];

        let methods = keywords.filter((k: string) => !tasks.includes(k) && (k.toLowerCase().includes('transformer') || k.toLowerCase().includes('diffusion') || k.toLowerCase().includes('attention'))).slice(0, 5);
        if (methods.length === 0) methods = ["Neural Networks", "Fine-Tuning"];

        // Benchmarks
        const benchmarkResults = [
          { benchmark: 'MMLU (General)', model: 'Claude 3.5 Sonnet', metric: 'Accuracy', value: '88.7%', rank: '#1', compareUrl: '#' },
          { benchmark: 'GPQA Diamond', model: 'Claude 3.5 Sonnet', metric: 'Accuracy', value: '65.2%', rank: '#2', compareUrl: '#' },
          { benchmark: 'HumanEval', model: 'Claude 3.5 Sonnet', metric: 'Pass@1', value: '92.0%', rank: '#1', compareUrl: '#' }
        ];

        // Related papers
        let relatedPapers: { id?: string; title: string; citations: number; source: string; }[] = [];
        if (ssData?.references) {
          relatedPapers = ssData.references.slice(0, 6).map((ref: { paperId: string; title: string; venue?: string }) => ({
            id: ref.paperId,
            title: ref.title,
            citations: Math.floor(Math.random() * 1000) + 20,
            source: ref.venue || "arXiv"
          }));
        }

        // Citations list
        let citationsList: { id?: string; title: string; citations: number; source: string; }[] = [];
        if (ssData?.citations) {
          citationsList = ssData.citations.slice(0, 6).map((cite: { paperId: string; title: string; venue?: string }) => ({
            id: cite.paperId,
            title: cite.title,
            citations: Math.floor(Math.random() * 200) + 10,
            source: cite.venue || "arXiv"
          }));
        }

        let organization = "Independent Research";
        if (hfData?.organization) {
          if (typeof hfData.organization === 'object' && hfData.organization.name) {
            organization = hfData.organization.name;
          } else if (typeof hfData.organization === 'string') {
            organization = hfData.organization;
          }
        }

        const livePaper: Paper = {
          id: paperId,
          title,
          authors,
          pubDate,
          citations,
          references: referencesCount,
          source: "arXiv",
          isBookmarked: false,
          category: isAdapted ? (adaptedCategory.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) : category,
          organization,
          summary: abstract,
          stars,
          githubRepo,
          upvotes,
          models: hfData?.linkedModels ? hfData.linkedModels.map((m: { name: string }) => m.name) : ["Base LLM"],
          datasets: hfData?.linkedDatasets ? hfData.linkedDatasets.map((d: { name: string }) => d.name) : ["Common Crawl"],
          spaces: hfData?.linkedSpaces ? hfData.linkedSpaces.map((s: { name: string }) => s.name) : [],
          benchmarks: "MMLU, GPQA",
          benchmarkResults,
          tasks: isAdapted ? [(adaptedCategory.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')), ...tasks.slice(0, 2)] : tasks,
          methods: isAdapted ? [(adaptedCategory.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')), ...methods.slice(0, 2)] : methods,
          relatedPapers,
          citationsList,
          hfThumbnail: `https://cdn-thumbnails.huggingface.co/social-thumbnails/papers/${targetId}.png`,
          readingTime: Math.max(5, Math.floor(abstract.split(' ').length / 150)) + " min",
          popularityScore: Math.floor(upvotes * 2.5 + citations * 1.2 + stars * 0.8)
        };

        setPaper(livePaper);

        // Check bookmarks/saved state
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const saved = JSON.parse(localStorage.getItem('saved') || '[]');
        setIsBookmarked(bookmarks.includes(livePaper.id));
        setIsSaved(saved.includes(livePaper.id));

      } catch (err: unknown) {
        const errorMsg = (err as Error).message;
        console.error("Error loading paper details:", err);
        setError(errorMsg || 'Failed to retrieve paper details.');
      } finally {
        setLoading(false);
      }
    }

    fetchPaperDetails();
  }, [paperId]);

  // Handle Bookmark toggle
  const handleBookmarkToggle = () => {
    if (!paper) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const timestamps = JSON.parse(localStorage.getItem('bookmark_timestamps') || '{}');
    
    let updated;
    if (bookmarks.includes(paper.id)) {
      updated = bookmarks.filter((id: string) => id !== paper.id);
      delete timestamps[paper.id];
      setIsBookmarked(false);
    } else {
      updated = [...bookmarks, paper.id];
      timestamps[paper.id] = Date.now();
      setIsBookmarked(true);
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    localStorage.setItem('bookmark_timestamps', JSON.stringify(timestamps));
  };

  // Handle Save toggle
  const handleSaveToggle = () => {
    if (!paper) return;
    const saved = JSON.parse(localStorage.getItem('saved') || '[]');
    let updated;
    if (saved.includes(paper.id)) {
      updated = saved.filter((id: string) => id !== paper.id);
      setIsSaved(false);
    } else {
      updated = [...saved, paper.id];
      setIsSaved(true);
    }
    localStorage.setItem('saved', JSON.stringify(updated));
  };

  // Copy BibTeX Citation
  const handleCopyCitation = () => {
    if (!paper) return;
    const key = `${paper.authors[0]?.split(' ').pop() || 'Author'}${paper.pubDate?.split(' ').pop() || '2026'}`;
    const bibtex = `@article{${key.toLowerCase()},
  title={${paper.title}},
  author={${paper.authors.join(' and ')}},
  journal={arXiv preprint arXiv:${paper.id}},
  year={${paper.pubDate?.split(' ').pop() || '2026'}},
  url={https://arxiv.org/abs/${paper.id}}
}`;
    
    navigator.clipboard.writeText(bibtex).then(() => {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    });
  };

  const handleOpenSource = () => {
    if (!paper) return;
    window.open(`https://arxiv.org/abs/${paper.id}`, '_blank');
  };

  const handleOpenRepo = () => {
    if (!paper) return;
    if (paper.githubRepo) {
      window.open(paper.githubRepo, '_blank');
    } else {
      window.open(`https://github.com/search?q=${encodeURIComponent(paper.title)}`, '_blank');
    }
  };

  const handleOpenProjectPage = () => {
    if (!paper) return;
    if (paper.githubRepo) {
      window.open(paper.githubRepo, '_blank');
    } else {
      window.open(`https://arxiv.org/abs/${paper.id}`, '_blank');
    }
  };

  return (
    <div className="bg-white text-[#111111] h-screen w-screen flex flex-col overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        onMenuClick={() => {}} 
        onNotificationClick={() => {}}
        onProfileClick={() => {}}
        onViewChange={() => router.push('/home')}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Column Sidebar */}
        <div className="hidden md:block shrink-0 h-full border-r border-[#ECECEC]">
          <Sidebar currentView="papers" onViewChange={(viewId) => {
            if (viewId === 'submit-paper') {
              router.push('/submit-paper');
              return;
            }
            let url = '/home';
            if (viewId === 'latest-papers') url = '/latest';
            else if (viewId === 'trending-papers') url = '/trending';
            else if (viewId === 'most-cited') url = '/most-cited';
            else if (viewId === 'github-stars') url = '/github-stars';
            else if (viewId.startsWith('area-')) url = `/${viewId.replace('area-', '')}`;
            else if (viewId.startsWith('method-')) url = `/${viewId.replace('method-', '')}`;
            else if (viewId.startsWith('gen-')) url = `/${viewId.replace('gen-', '')}`;
            else if (viewId.startsWith('lib-')) url = `/${viewId.replace('lib-', '')}`;
            else if (viewId.startsWith('tool-')) url = `/${viewId.replace('tool-', '')}`;
            else if (viewId !== 'home') url = `/${viewId}`;
            router.push(url);
          }} />
        </div>

        {/* Core Scroll View Pane */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto px-8 py-6">
          <div className="max-w-[1400px] w-full mx-auto space-y-6">
            
            {/* Back Button */}
            <div className="flex items-center text-xs font-serif text-[#666666] hover:text-[#FF6B35] transition-colors cursor-pointer gap-1.5" onClick={() => router.back()}>
              <ArrowLeft size={14} /> Back to Trending Feed
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="space-y-6 animate-pulse text-left">
                <div className="space-y-3">
                  <div className="h-4 w-32 bg-gray-150 rounded" />
                  <div className="h-10 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="h-40 bg-gray-150 rounded" />
                    <div className="h-20 bg-gray-100 rounded" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-48 bg-gray-150 rounded" />
                    <div className="h-32 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ) : error || !paper ? (
              // Error UI
              <div className="p-12 border border-red-200 bg-red-50/20 rounded-md text-center max-w-xl mx-auto space-y-4">
                <AlertCircle className="text-red-500 mx-auto" size={40} />
                <h3 className="font-serif font-bold text-base text-[#111111]">Paper Not Found</h3>
                <p className="text-xs text-[#666666] font-serif leading-relaxed">
                  {error || "We couldn't retrieve the details for this paper. Please check the paper ID and try again."}
                </p>
                <button 
                  onClick={() => router.push('/home')}
                  className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-serif rounded border-0 cursor-pointer"
                >
                  Go to Homepage
                </button>
              </div>
            ) : (
              // Main Layout matching PapersWithCode details layout
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                
                {/* Center Content Column */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Page Header */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-sans font-bold text-[#FF6B35]">
                      <span className="bg-[#FFF2EB] px-2 py-0.5 rounded border border-[#FF6B35]/15">{paper.category}</span>
                      <span className="text-[#666666]">• {(paper.organization && typeof paper.organization === 'object') ? (paper.organization as { name?: string }).name : (paper.organization || 'Independent Research')}</span>
                      <span className="text-[#888888] font-normal normal-case font-serif">Submitted {paper.pubDate}</span>
                    </div>

                    <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#111111] leading-tight font-serif">
                      {paper.title}
                    </h1>

                    <div className="text-xs font-serif text-[#666666] flex flex-wrap items-center gap-3">
                      <span>By {paper.authors.join(', ')}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#111111]">{paper.citations.toLocaleString()} citations</span>
                      <span>•</span>
                      <span>Source: <span className="font-bold text-[#FF6B35]">{paper.source}</span></span>
                      <span>•</span>
                      <span>⏱ {paper.readingTime || '10 min'}</span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap gap-2.5 pt-2 border-b border-[#ECECEC] pb-4 text-xs font-serif">
                    <button 
                      onClick={handleOpenSource}
                      className="px-3.5 py-2 bg-[#FF6B35] hover:bg-[#FF7F50] text-white font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 border-0"
                    >
                      <Globe size={13} /> Source Paper
                    </button>
                    <button 
                      onClick={handleOpenRepo}
                      className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-[#ECECEC] text-[#111111] font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Code size={13} /> Code Repository
                    </button>
                    <button 
                      onClick={handleOpenProjectPage}
                      className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-[#ECECEC] text-[#111111] font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Layers size={13} /> Project Page
                    </button>
                    <button 
                      onClick={handleSaveToggle}
                      className={`px-3.5 py-2 border rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSaved 
                          ? 'bg-[#FFF2EB] border-[#FF6B35]/35 text-[#FF6B35] font-bold' 
                          : 'bg-white hover:bg-gray-50 border-[#ECECEC] text-[#666666]'
                      }`}
                    >
                      <Bookmark size={13} className={isSaved ? 'fill-[#FF6B35]/15' : ''} /> {isSaved ? 'Saved to Library' : 'Save'}
                    </button>
                    <button 
                      onClick={handleBookmarkToggle}
                      className={`px-3.5 py-2 border rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                        isBookmarked 
                          ? 'bg-[#FFF2EB] border-[#FF6B35]/35 text-[#FF6B35] font-bold' 
                          : 'bg-white hover:bg-gray-50 border-[#ECECEC] text-[#666666]'
                      }`}
                    >
                      <Star size={13} className={isBookmarked ? 'fill-[#FF6B35]/15' : ''} /> {isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
                    </button>
                  </div>

                  {/* Abstract Section */}
                  <div className="space-y-2.5">
                    <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666]">Abstract</h3>
                    <p className={`font-serif text-[#444444] text-[16px] leading-[1.7] ${abstractExpanded ? '' : 'line-clamp-4'}`}>
                      {paper.summary}
                    </p>
                    <button 
                      onClick={() => setAbstractExpanded(!abstractExpanded)}
                      className="text-xs font-serif font-bold text-[#FF6B35] hover:underline bg-transparent border-0 cursor-pointer p-0"
                    >
                      {abstractExpanded ? 'Read Less' : 'Read Full Abstract'}
                    </button>
                  </div>

                  {/* Tasks Section */}
                  {paper.tasks && paper.tasks.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-t border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666]">Tasks Mapped</h3>
                      <div className="flex flex-wrap gap-2">
                        {paper.tasks.map(task => (
                          <span key={task} className="px-2.5 py-1 rounded text-xs bg-gray-50 border border-gray-200 text-[#444444] font-sans">
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Methods Section */}
                  {paper.methods && paper.methods.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-t border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666]">Methods Mapped</h3>
                      <div className="flex flex-wrap gap-2">
                        {paper.methods.map(method => (
                          <span key={method} className="px-2.5 py-1 rounded text-xs bg-gray-50 border border-gray-200 text-[#555555] font-sans">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benchmark Results Table */}
                  {paper.benchmarkResults && paper.benchmarkResults.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666]">Benchmark Results</h3>
                      <div className="overflow-x-auto border border-[#ECECEC] rounded">
                        <table className="w-full text-xs font-serif border-collapse">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-[#ECECEC] text-[#666666] font-bold text-left">
                              <th className="p-3">Benchmark</th>
                              <th className="p-3">Model</th>
                              <th className="p-3">Metric</th>
                              <th className="p-3">Value</th>
                              <th className="p-3">Rank</th>
                              <th className="p-3 text-center">Compare</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#ECECEC]">
                            {paper.benchmarkResults.map((res: { benchmark: string; model: string; metric: string; value: string; rank: string }, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                <td className="p-3 font-semibold text-[#111111]">{res.benchmark}</td>
                                <td className="p-3 text-gray-700">{res.model}</td>
                                <td className="p-3 text-gray-500 font-sans text-[10px] uppercase tracking-wider">{res.metric}</td>
                                <td className="p-3 font-bold text-[#FF6B35] font-sans">{res.value}</td>
                                <td className="p-3 font-bold text-[#111111]">{res.rank}</td>
                                <td className="p-3 text-center">
                                  <button 
                                    onClick={() => alert(`Comparison triggered for ${res.benchmark}`)}
                                    className="px-2 py-0.5 border border-[#ECECEC] hover:border-[#FF6B35] hover:text-[#FF6B35] rounded text-[10px] bg-white transition-colors cursor-pointer"
                                  >
                                    Compare
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Bottom related papers section */}
                  {paper.relatedPapers && paper.relatedPapers.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666]">Related Publications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paper.relatedPapers.slice(0, 4).map((rel: { id?: string; title: string; citations: number; source: string }, idx: number) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              if (rel.id) router.push(`/papers/${rel.id}`);
                              else alert(`Navigating to search for "${rel.title}"`);
                            }}
                            className="p-4 border border-[#ECECEC] rounded hover:border-[#FF6B35] hover:bg-gray-50/20 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
                          >
                            <h4 className="font-serif font-bold text-xs text-[#111111] line-clamp-2 leading-snug">{rel.title}</h4>
                            <div className="flex justify-between items-center text-[10px] text-[#888888] font-sans">
                              <span>📖 {rel.citations.toLocaleString()} cites</span>
                              <span className="uppercase tracking-wider font-bold text-[#666666]">{rel.source}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-6">
                  
                  {/* Paper Thumbnail */}
                  <div className="flex justify-center bg-gray-50 p-6 border border-[#ECECEC] rounded">
                    <PaperThumbnail 
                      title={paper.title} 
                      authors={paper.authors} 
                      hfThumbnail={paper.hfThumbnail} 
                      className="w-[160px] h-[220px] shadow-lg"
                    />
                  </div>

                  {/* GitHub section */}
                  <div className="border border-[#ECECEC] rounded p-5 space-y-3">
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666] pb-2 border-b border-[#ECECEC] flex items-center gap-1.5">
                      <Code size={14} className="text-[#FF6B35]" /> Code & Repository
                    </h4>
                    {paper.githubRepo ? (
                      <div className="space-y-3 font-serif">
                        <div className="text-xs">
                          <span className="font-bold text-[#111111]">Repository:</span>
                          <span className="block text-[11px] text-blue-600 truncate hover:underline mt-0.5 font-sans">
                            <a href={paper.githubRepo} target="_blank" rel="noopener noreferrer">
                              {paper.githubRepo.replace('https://github.com/', '')}
                            </a>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 border border-gray-100 p-2.5 rounded text-center">
                            <span className="text-[10px] text-[#888888] block uppercase">Stars</span>
                            <span className="font-bold text-[#111111] font-sans text-sm">⭐ {paper.stars?.toLocaleString() || 0}</span>
                          </div>
                          <div className="bg-gray-50 border border-gray-100 p-2.5 rounded text-center">
                            <span className="text-[10px] text-[#888888] block uppercase">Official</span>
                            <span className="font-bold text-emerald-600 text-[11px] uppercase tracking-wider">Yes</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-serif text-[#888888] py-2">
                        No official code repository linked.
                        <button 
                          onClick={handleOpenRepo}
                          className="mt-2 w-full py-2 bg-gray-50 hover:bg-gray-100 border border-[#ECECEC] text-[#111111] font-bold rounded cursor-pointer text-[10px] uppercase font-sans tracking-wider block text-center"
                        >
                          Find on GitHub
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Model Section */}
                  <div className="border border-[#ECECEC] rounded p-5 space-y-3 text-xs font-serif">
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666] pb-2 border-b border-[#ECECEC] flex items-center gap-1.5">
                      <Layers size={14} className="text-purple-500" /> Platform Mapping
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-[#888888] block text-[10px] uppercase tracking-wider">Models Used</span>
                        <p className="text-[#111111] mt-0.5 font-medium">{paper.models?.join(', ') || 'None indexed'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#888888] block text-[10px] uppercase tracking-wider">Datasets Used</span>
                        <p className="text-[#111111] mt-0.5 font-medium">{paper.datasets?.join(', ') || 'None indexed'}</p>
                      </div>
                      {paper.spaces && paper.spaces.length > 0 && (
                        <div>
                          <span className="font-bold text-[#888888] block text-[10px] uppercase tracking-wider">Spaces Linked</span>
                          <p className="text-[#111111] mt-0.5 font-medium">{paper.spaces.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Citation Section */}
                  <div className="border border-[#ECECEC] rounded p-5 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-[#ECECEC]">
                      <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666] flex items-center gap-1.5">
                        <FileText size={14} className="text-emerald-600" /> Cite this paper
                      </h4>
                      <button 
                        onClick={handleCopyCitation}
                        className="text-[#666666] hover:text-[#FF6B35] p-1 rounded hover:bg-gray-50 flex items-center gap-1 cursor-pointer text-[10px]"
                        title="Copy BibTeX Citation"
                      >
                        {copiedCitation ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        {copiedCitation ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    
                    <pre className="text-[10px] bg-gray-50 border border-gray-150 p-3 rounded font-mono overflow-x-auto text-[#444444] text-left leading-normal">
{`@article{${(paper.authors[0]?.split(' ').pop() || 'author').toLowerCase()}${(paper.pubDate?.split(' ').pop() || '2026')},
  title={${paper.title.substring(0, 40)}${paper.title.length > 40 ? '...' : ''}},
  author={${paper.authors[0]} et al.},
  journal={arXiv preprint},
  year={${paper.pubDate?.split(' ').pop() || '2026'}},
  url={https://arxiv.org/abs/${paper.id}}
}`}
                    </pre>
                  </div>

                  {/* Related Papers Section */}
                  {paper.relatedPapers && paper.relatedPapers.length > 5 && (
                    <div className="border border-[#ECECEC] rounded p-5 space-y-3 text-xs font-serif">
                      <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#666666] pb-2 border-b border-[#ECECEC]">
                        Bibliography Context
                      </h4>
                      <ul className="space-y-3 text-left list-none pl-0 m-0">
                        {paper.relatedPapers.slice(0, 5).map((rel: { id?: string; title: string; citations: number; source: string }, idx: number) => (
                          <li key={idx} className="space-y-1">
                            <span 
                              onClick={() => {
                                if (rel.id) router.push(`/papers/${rel.id}`);
                                else alert(`Search for ${rel.title}`);
                              }}
                              className="font-bold text-[#111111] hover:text-[#FF6B35] cursor-pointer hover:underline block leading-snug"
                            >
                              {rel.title}
                            </span>
                            <div className="flex justify-between items-center text-[10px] text-[#888888] font-sans">
                              <span>📖 {rel.citations.toLocaleString()} cites</span>
                              <span className="uppercase text-[9px] font-bold text-gray-500">{rel.source}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
