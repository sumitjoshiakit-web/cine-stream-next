// lib/tmdb.ts - Server-side TMDB API Data Access Layer
import { Movie, TMDBResponse } from '../types';
import { MOCK_MOVIES } from '../data/mockMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getAuthHeaders(): Record<string, string> {
  const apiKey = process.env.TMDB_API_KEY?.trim();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (apiKey && (apiKey.startsWith('ey') || apiKey.length > 50)) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  return headers;
}

/**
 * Server Component Data Fetch: Popular Movies
 * Cached with Next.js fetch revalidation
 */
export async function getPopularMovies(page: number = 1): Promise<TMDBResponse> {
  const apiKey = process.env.TMDB_API_KEY?.trim();

  if (apiKey && apiKey !== 'MY_TMDB_API_KEY') {
    try {
      const url = new URL(`${TMDB_BASE_URL}/movie/popular`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('language', 'en-US');
      if (!apiKey.startsWith('ey') && apiKey.length <= 50) {
        url.searchParams.set('api_key', apiKey);
      }

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
        // Next.js 15 fetch revalidation (e.g. revalidate every hour)
        next: { revalidate: 3600 },
      } as RequestInit);

      if (res.ok) {
        const data = await res.json();
        return { ...data, source: 'tmdb' };
      }
    } catch (err) {
      console.warn('TMDB popular fetch error on server:', err);
    }
  }

  // Curated Fallback
  const PAGE_SIZE = 12;
  const startIndex = (page - 1) * PAGE_SIZE;
  const results = MOCK_MOVIES.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    page,
    results,
    total_pages: Math.ceil(MOCK_MOVIES.length / PAGE_SIZE),
    total_results: MOCK_MOVIES.length,
    source: 'demo',
  };
}

/**
 * Server Component Data Fetch: Movie Details for Dynamic Route /movie/[id]
 */
export async function getMovieById(id: string | number): Promise<Movie | null> {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const apiKey = process.env.TMDB_API_KEY?.trim();

  if (apiKey && apiKey !== 'MY_TMDB_API_KEY') {
    try {
      const url = new URL(`${TMDB_BASE_URL}/movie/${numericId}`);
      url.searchParams.set('append_to_response', 'credits,videos,similar');
      url.searchParams.set('language', 'en-US');
      if (!apiKey.startsWith('ey') && apiKey.length <= 50) {
        url.searchParams.set('api_key', apiKey);
      }

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
        next: { revalidate: 3600 },
      } as RequestInit);

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn(`TMDB fetch error for movie ${id}:`, err);
    }
  }

  const found = MOCK_MOVIES.find((m) => m.id === numericId);
  return found || null;
}

/**
 * Search Movies — called from a Route Handler (app/api/movies/search/route.ts)
 * which the client Search component (a Client Component) hits after debouncing input.
 */
export async function searchMoviesServer(query: string, page: number = 1): Promise<TMDBResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return getPopularMovies(1);
  }

  const apiKey = process.env.TMDB_API_KEY?.trim();

  if (apiKey && apiKey !== 'MY_TMDB_API_KEY') {
    try {
      const url = new URL(`${TMDB_BASE_URL}/search/movie`);
      url.searchParams.set('query', trimmed);
      url.searchParams.set('page', String(page));
      url.searchParams.set('include_adult', 'false');
      url.searchParams.set('language', 'en-US');
      if (!apiKey.startsWith('ey') && apiKey.length <= 50) {
        url.searchParams.set('api_key', apiKey);
      }

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
        cache: 'no-store', // search results should never be statically cached
      });

      if (res.ok) {
        const data = await res.json();
        return { ...data, source: 'tmdb' };
      }
    } catch (err) {
      console.warn('TMDB search fetch error on server:', err);
    }
  }

  // Curated fallback search
  const lower = trimmed.toLowerCase();
  const matched = MOCK_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(lower) ||
      m.overview.toLowerCase().includes(lower) ||
      (m.original_title && m.original_title.toLowerCase().includes(lower))
  );

  const PAGE_SIZE = 12;
  const total_pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const results = matched.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    page,
    results,
    total_pages,
    total_results: matched.length,
    source: 'demo',
  };
}
