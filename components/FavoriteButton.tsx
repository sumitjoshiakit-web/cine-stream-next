'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { Movie } from '../types';

// The only interactive piece of the /movie/[id] page. Everything else on that
// route (app/movie/[id]/page.tsx) stays a Server Component.
export function FavoriteButton({ movie }: { movie: Movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie.id);

  return (
    <button
      id="detail-fav-btn"
      type="button"
      onClick={() => toggleFavorite(movie)}
      className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
        active
          ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:text-white'
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${active ? 'fill-current' : ''}`} />
      <span>{active ? 'Saved' : 'Favorite'}</span>
    </button>
  );
}
