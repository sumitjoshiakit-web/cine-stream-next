import { getPopularMovies } from '@/lib/tmdb';
import { AppShell } from '@/components/AppShell';

// SERVER COMPONENT — this whole function runs on the server, never in the browser.
// The initial "Popular Movies" data is fetched here, directly, with a plain `await`.
// There is NO useEffect involved in producing this first paint: the HTML that
// reaches the browser already contains the movie data (real SSR hydration).
export default async function HomePage() {
  const initialData = await getPopularMovies(1);

  return (
    <AppShell
      initialMovies={initialData.results}
      initialPage={initialData.page}
      initialTotalPages={initialData.total_pages}
      initialSource={initialData.source ?? 'demo'}
    />
  );
}
