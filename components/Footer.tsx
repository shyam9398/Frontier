'use client';

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      // Simulate database submission by returning true or triggering local alert
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { name: 'Latest Papers', href: '/latest' },
        { name: 'Trending Papers', href: '/trending' },
        { name: 'Benchmarks Leaderboard', href: '/benchmarks' },
        { name: 'Datasets Registry', href: '/datasets' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Research Forums', href: '#forums' },
        { name: 'Twitter / X', href: 'https://twitter.com' },
        { name: 'Discord Chat', href: 'https://discord.com' },
        { name: 'Slack Workspace', href: 'https://slack.com' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'API Documentation', href: '#api' },
        { name: 'Model Weights Sync', href: '#weights' },
        { name: 'Citation Guidelines', href: '#citations' },
        { name: 'Terms & Licensing', href: '/terms' },
      ],
    },
    {
      title: 'About',
      links: [
        { name: 'Research Team', href: '#team' },
        { name: 'Academic Partners', href: '#partners' },
        { name: 'Careers / Fellowship', href: '#careers' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-footer text-gray-300 w-full mt-12 py-12 px-6 sm:px-8 border-t border-gray-800 text-center md:text-left font-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-gray-800">
        
        {/* Left Branding Area */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm font-display tracking-tight">
              AH
            </span>
            <span className="font-extrabold font-display text-white text-base tracking-tight">
              AI Hub OS
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-medium text-center md:text-left">
            Building the connected graph of all artificial intelligence research. Tracking models, benchmarks, and publications in real-time.
          </p>
        </div>

        {/* Link Columns (2 cols per section, total 4 sections = 8 cols) */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {footerLinks.map((group) => (
            <div key={group.title} className="flex flex-col items-center md:items-start space-y-3.5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white/95">
                {group.title}
              </h4>
              <ul className="flex flex-col items-center md:items-start space-y-2 text-xs font-medium">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-primary transition-colors duration-150"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Area: Copyright & Newsletter Form */}
      <div className="max-w-[1400px] mx-auto pt-8 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6">
        
        {/* Copyright details */}
        <div className="flex flex-col sm:flex-row sm:items-center items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center lg:text-left">
          <span>© {currentYear} AI Hub Operating System.</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1 font-bold text-gray-400">
            <Sparkles size={11} className="text-primary fill-primary/10" />
            Grounding AI Research and Evaluations
          </span>
        </div>

        {/* Newsletter Subscription input */}
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2 w-full max-w-md shrink-0 relative group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Subscribe to updates (e.g. user@domain.com)"
            required
            className="flex-1 py-2 px-3 bg-gray-900 border border-gray-800 text-white rounded-xl text-xs placeholder-gray-500 focus:outline-none focus:border-primary font-medium"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-primary/10 h-[44px] md:h-auto"
          >
            <Send size={11} />
            <span>Subscribe</span>
          </button>
          
          {subscribed && (
            <span className="absolute -bottom-5 left-0 text-[10px] font-extrabold text-emerald-500 animate-pulse">
              Subscribed successfully! Thank you.
            </span>
          )}
        </form>

      </div>
    </footer>
  );
}
