'use client';

// This is the interactivity boundary. Everything above it (app/page.tsx) is a
// Server Component that already resolved the initial data. Everything inside
// here needs browser state (search input, favorites, infinite scroll) so — and
// only so — it is marked "use client".

import React, { useCallback, useMemo, useState } from 'react';
import { Navbar } from './Navbar';
import { HeroBanner } from './HeroBanner';
import { MovieGrid } from './MovieGrid';
import { useDebounce } from '../utils/debounce';
import { useFavorites } from '../hooks/useFavorites';
import { Movie } from '../types';

interface AppShellProps {
  initialMovies: Movie[];
  initialPage: number;
  initialTotalPages: number;
  initialSource: 'tmdb' | 'demo';
}

export function AppShell({ initialMovies, initialPage, initialTotalPages, initialSource }: AppShellProps) {
  const [activeView, setActiveView] = useState<'discover' | 'favorites'>('discover');

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const isDebouncing = searchQuery !== debouncedQuery;

  // Seeded straight from the Server Component's fetch — zero useEffect on first paint.
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [source, setSource] = useState<'tmdb' | 'demo'>(initialSource);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const activeQuery = debouncedQuery.trim();

  // Runs a fresh query (page 1) against the appropriate Route Handler whenever
  // the debounced search term changes. This is a *response to user input*,
  // which is exactly the kind of thing Client Components are for — it is not
  // part of the initial SSR hydration handled in the Server Component.
  const runQuery = useCallback(async (query: string) => {
    setIsLoadingMore(true);
    try {
      const endpoint = query
        ? `/api/movies/search?query=${encodeURIComponent(query)}&page=1`
        : `/api/movies/popular?page=1`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setMovies(data.results ?? []);
      setPage(data.page ?? 1);
      setTotalPages(data.total_pages ?? 1);
      setSource(data.source ?? 'demo');
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  const hasSearchedRef = React.useRef(false);
  React.useEffect(() => {
    // Skip the very first render: initial data already came from the server.
    if (!hasSearchedRef.current) {
      hasSearchedRef.current = true;
      return;
    }
    runQuery(activeQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || page >= totalPages) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const endpoint = activeQuery
        ? `/api/movies/search?query=${encodeURIComponent(activeQuery)}&page=${nextPage}`
        : `/api/movies/popular?page=${nextPage}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setMovies((prev) => [...prev, ...(data.results ?? [])]);
      setPage(data.page ?? nextPage);
      setTotalPages(data.total_pages ?? totalPages);
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeQuery, isLoadingMore, page, totalPages]);

  const visibleMovies = activeView === 'favorites' ? favorites : movies;
  const heroMovie = useMemo(() => (activeView === 'discover' ? movies[0] ?? null : null), [activeView, movies]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        isDebouncing={isDebouncing}
        favoritesCount={favorites.length}
        activeView={activeView}
        onViewChange={setActiveView}
        isDemoMode={source === 'demo'}
      />

      {activeView === 'discover' && !activeQuery && heroMovie && (
        <HeroBanner movie={heroMovie} isFavorite={isFavorite(heroMovie.id)} onToggleFavorite={toggleFavorite} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">
            {activeView === 'favorites'
              ? 'Your Favorites'
              : activeQuery
              ? `Results for "${activeQuery}"`
              : 'Popular Movies'}
          </h2>
        </div>

        <MovieGrid
          movies={visibleMovies}
          isLoading={false}
          isLoadingMore={activeView === 'discover' && isLoadingMore}
          hasMore={activeView === 'discover' && page < totalPages}
          onLoadMore={loadMore}
          isFavorite={(id) => isFavorite(id)}
          onToggleFavorite={toggleFavorite}
          emptyMessage={
            activeView === 'favorites'
              ? "You haven't added any favorites yet."
              : "We couldn't find any movies matching your search."
          }
          onResetSearch={activeView === 'discover' && activeQuery ? () => setSearchQuery('') : undefined}
        />
      </main>
    </div>
  );
}
