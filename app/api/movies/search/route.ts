import { NextRequest, NextResponse } from 'next/server';
import { searchMoviesServer } from '@/lib/tmdb';

// Hit by the Client Component search box (Navbar) after its 500ms debounce.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const data = await searchMoviesServer(query, page);
  return NextResponse.json(data);
}
