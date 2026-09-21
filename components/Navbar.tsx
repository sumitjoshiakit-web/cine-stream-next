'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Search, Heart, X, Activity } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  isDebouncing: boolean;
  favoritesCount: number;
  activeView: 'discover' | 'favorites';
  onViewChange: (view: 'discover' | 'favorites') => void;
  isDemoMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  isDebouncing,
  favoritesCount,
  activeView,
  onViewChange,
  isDemoMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link
              id="brand-logo-btn"
              href="/"
              onClick={() => {
                onClearSearch();
                onViewChange('discover');
              }}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-950/60 group-hover:bg-red-500 transition-colors">
                <Film className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base sm:text-lg font-black tracking-wider text-white leading-tight">
                  CINE<span className="text-red-500">STREAM</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-400 font-semibold tracking-wide">
                  Next.js 15 App Router
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                id="nav-discover-btn"
                type="button"
                onClick={() => onViewChange('discover')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'discover'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Popular (SSR)
              </button>

              <button
                id="nav-favorites-btn"
                type="button"
                onClick={() => onViewChange('favorites')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'favorites'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                <span>Favorites</span>
                {favoritesCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-600 text-white">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="movie-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search movies (500ms debounced)..."
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/80 transition-all"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  type="button"
                  onClick={onClearSearch}
                  aria-label="Clear search query"
                  className="absolute inset-y-0 right-2.5 flex items-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isDebouncing && (
              <div className="absolute top-full mt-1 right-0 px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 flex items-center gap-1 animate-pulse z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Throttling 500ms...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              title="Data source status"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isDemoMode ? 'Curated Demo' : 'TMDB Live'}</span>
            </div>

            <button
              id="mobile-favorites-btn"
              type="button"
              onClick={() => onViewChange(activeView === 'favorites' ? 'discover' : 'favorites')}
              className={`md:hidden relative p-2 rounded-lg border cursor-pointer ${
                activeView === 'favorites'
                  ? 'bg-zinc-800 border-zinc-700 text-red-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-current text-red-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
