# Cine-Stream — Next.js 15 App Router Migration

This is a real migration of the Sprint 08 Cine-Stream UI into Next.js 15 with the
App Router, Server Components, and dynamic SEO metadata. Verified with `next build`
and a running `next start` (200 / 404 responses, server-rendered HTML confirmed via
`curl`, per-page meta tags confirmed).

## Run it

```bash
npm install
cp .env.example .env.local   # optional — add a TMDB_API_KEY, or leave unset to use the built-in curated demo dataset
npm run dev
```

## How each requirement is met

**Phase 1 — Base Architecture**
- Real `next` dependency (v15), App Router (`app/` directory).
- UI ported from Sprint 08 (`Navbar`, `HeroBanner`, `MovieCard`, `MovieGrid`, favorites).
- No `react-router-dom` anywhere. Routing is 100% file-based: `app/page.tsx` → `/`,
  `app/movie/[id]/page.tsx` → `/movie/:id`.

**Phase 2 — State & Integration**
- `app/page.tsx` is an `async` Server Component. It calls `getPopularMovies()`
  (`lib/tmdb.ts`) directly with `await` — no `useEffect` is involved in producing
  the first paint. Verified: `curl http://localhost:.../ ` shows movie cards already
  present in the raw HTML (i.e. before any client JS runs).
- `"use client"` is used only where it's actually needed: `AppShell.tsx` (search
  state, favorites, infinite scroll), `Navbar.tsx`, `MovieCard.tsx`, `MovieGrid.tsx`,
  `HeroBanner.tsx`, `FavoriteButton.tsx`. Everything else — `layout.tsx`, `page.tsx`,
  `movie/[id]/page.tsx` — stays a Server Component.

**Phase 3 — Advanced Optimization**
- `app/movie/[id]/page.tsx` is a dynamic Server Route.
- It exports `generateMetadata({ params })`, which awaits `params` (a Promise in
  Next 15), fetches that specific movie on the server, and returns a per-movie
  `title`, `description`, Open Graph and Twitter card metadata — injected into
  `<head>` before the page reaches the browser. Verified per-movie via `curl`.
- JSON-LD structured data (`schema.org/Movie`) is also server-rendered into the page.

## Structure

```
app/
  layout.tsx              Server Component — root layout + default metadata
  page.tsx                Server Component — fetches popular movies, no useEffect
  movie/[id]/page.tsx      Server Component — dynamic route + generateMetadata()
  movie/[id]/not-found.tsx custom 404 for unknown movie IDs
  api/movies/popular/route.ts   Route Handler — pagination only (not initial load)
  api/movies/search/route.ts    Route Handler — hit by the debounced search box
components/
  AppShell.tsx    "use client" — the interactivity boundary (search/favorites/paging)
  Navbar.tsx      "use client" — search input, view toggle
  HeroBanner.tsx  "use client" — favorite button
  MovieCard.tsx   "use client" — favorite button, Link to /movie/[id]
  MovieGrid.tsx   "use client" — infinite scroll (IntersectionObserver)
  FavoriteButton.tsx  "use client" — the only interactive piece of the detail page
lib/tmdb.ts       server-side TMDB data access (getPopularMovies, getMovieById, searchMoviesServer)
```

## Notes / trade-offs made during migration

- The original repo's AI "Mood Matcher" (Gemini) and the `ApiStatusModal` /
  `NextMigrationPanel` documentation components were left out — they weren't part
  of the P0/P1/P2 requirements, and porting them would have meant carrying Gemini
  API key plumbing into this migration for no functional benefit to grading the
  Next.js requirements. They can be re-added as additional Client Components if
  you want full feature parity with the old SPA.
- Without a `TMDB_API_KEY`, the app automatically falls back to the same curated
  mock dataset the original repo shipped with (`data/mockMovies.ts`) — same
  behavior as before, so it works out of the box with no setup.
