import { NextRequest, NextResponse } from 'next/server';
import { getPopularMovies } from '@/lib/tmdb';

// Used only for pagination ("load more") after the first paint — the FIRST
// page of popular movies is fetched directly inside the Server Component
// (see app/page.tsx), never through this route.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const data = await getPopularMovies(page);
  return NextResponse.json(data);
}
