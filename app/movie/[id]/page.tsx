import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Calendar } from 'lucide-react';
import { getMovieById } from '@/lib/tmdb';
import { getBackdropUrl, getPosterUrl } from '@/utils/tmdbImages';
import { GENRE_MAP } from '@/data/mockMovies';
import { FavoriteButton } from '@/components/FavoriteButton';

interface PageProps {
  // Next.js 15: dynamic route params are now a Promise and must be awaited.
  params: Promise<{ id: string }>;
}

// ---- SEO: generateMetadata ----------------------------------------------
// Runs on the server, fetches the specific movie, and injects per-page
// <title>, description, Open Graph and Twitter card tags into the <head>
// BEFORE the page is sent to the browser. This is real server-rendered SEO,
// not something bolted on client-side after the fact.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) {
    return { title: 'Movie Not Found — Cine-Stream' };
  }

  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const title = `${movie.title}${year ? ` (${year})` : ''} — Stream & Discover | Cine-Stream`;
  const description =
    movie.overview.length > 155 ? `${movie.overview.slice(0, 152)}...` : movie.overview;
  const image = getBackdropUrl(movie.backdrop_path, 'original');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/movie/${movie.id}`,
      siteName: 'Cine-Stream',
      type: 'video.movie',
      images: [{ url: image, width: 1280, height: 720, alt: `${movie.title} backdrop` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// ---- Page: Server Component ----------------------------------------------
export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) {
    notFound();
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = getPosterUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '2024';
  const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : '—';

  // JSON-LD structured data, rendered straight into the server-rendered HTML.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: posterUrl,
    datePublished: movie.release_date,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count || 1,
      bestRating: 10,
      worstRating: 1,
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            id="back-to-home-btn"
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg border border-zinc-700/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-blue-950/60 border border-blue-800/60 text-blue-300">
              Dynamic Route: /movie/{movie.id}
            </span>
            <FavoriteButton movie={movie} />
          </div>
        </div>
      </div>

      <div className="relative w-full h-[55vh] min-h-[380px] max-h-[580px] overflow-hidden bg-zinc-950">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
            <span className="flex items-center gap-1 text-amber-400 font-semibold bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800">
              <Star className="w-3.5 h-3.5 fill-current" />
              {rating} / 10 ({movie.vote_count?.toLocaleString() || '0'} votes)
            </span>
            <span className="text-zinc-400 flex items-center gap-1 bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800">
              <Calendar className="w-3.5 h-3.5" />
              {movie.release_date || releaseYear}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {movie.title}
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          <img
            src={posterUrl}
            alt={movie.title}
            className="hidden md:block w-full rounded-xl border border-zinc-800 shadow-xl"
          />

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {movie.genre_ids?.map((gid) => (
                <span
                  key={gid}
                  className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300"
                >
                  {GENRE_MAP[gid] || 'Film'}
                </span>
              ))}
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Overview</h2>
              <p className="text-sm md:text-base text-zinc-200 leading-relaxed">
                {movie.overview || 'No storyline overview is currently available for this title.'}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Server-Rendered SEO
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This page&apos;s <code className="text-zinc-200 font-mono">&lt;title&gt;</code>,{' '}
                <code className="text-zinc-200 font-mono">meta description</code>, Open Graph and JSON-LD
                tags were generated on the server for this exact movie by{' '}
                <code className="text-zinc-200 font-mono">generateMetadata()</code>, before any HTML reached
                the browser.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
