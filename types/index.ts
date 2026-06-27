export interface Paper {
  id: string;
  title: string;
  authors: string[];
  pubDate: string;
  citations: number;
  references: number;
  source: string;
  isBookmarked: boolean;
  category: string;
  organization?: string;
  summary?: string;
  stars?: number;
  models?: string[];
  datasets?: string[];
  benchmarks?: string;
  impact?: string;
  velocity?: string;
  thumbnailBg?: string;
  upvotes?: number;
  isSaved?: boolean;
  readingTime?: string;
  popularityScore?: number;
  benchmarkResults?: any[];
  tasks?: string[];
  methods?: string[];
  relatedPapers?: any[];
  citationsList?: any[];
  hfThumbnail?: string;
  arxivThumbnail?: string;
  pwcThumbnail?: string;
  spaces?: string[];
  githubRepo?: string;
}

export interface Model {
  id: string;
  name: string;
  creator: string;
  date: string;
  popularity: number; // e.g., 98.5 (could be score out of 100 or rating)
  downloads: string;    // e.g., "5.2M"
  researchMentions: number;
  logoColor: string;
}

export interface Entity {
  name: string;
  count: string;
  iconName: string;
  trendData: number[];
  colorScheme: string; // e.g., 'orange', 'purple', 'blue'
  path: string;
}

export interface Signal {
  id: string;
  title: string;
  value: number | string;
  changePct: number;
  trend: 'up' | 'down';
}

export interface Topic {
  rank: number;
  name: string;
  paperCount: string;
  changePct: number;
  trendData: number[];
}

export interface Lab {
  rank: number;
  name: string;
  papersCount: string;
  citationsCount: string;
  logoBg: string;
}

export interface FollowUpdate {
  id: string;
  researcherName: string;
  avatarUrl?: string;
  actionText: string;
  targetName: string;
  timeAgo: string;
  type: 'paper' | 'model' | 'repository' | 'follow';
}

export interface DatasetItem {
  id: string;
  name: string;
  size: string;
  domain: string;
  impact: string;
  desc: string;
  logoBg: string;
}

export interface BenchmarkLeaderboardItem {
  id: string;
  name: string;
  leader: string;
  score: string;
  metric: string;
  totalModels: number;
}

export interface ModelRanking {
  rank: number;
  name: string;
  creator: string;
  downloads: string;
  popularity: string;
  growth: string;
  logoColor: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'paper' | 'model' | 'benchmark' | 'alert';
  title: string;
  description: string;
  timeAgo: string;
  user: string;
}
