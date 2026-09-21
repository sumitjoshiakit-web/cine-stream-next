import type { Metadata } from 'next';
import './globals.css';

// Default site-wide metadata (overridden per-route by generateMetadata, e.g. in /movie/[id]).
export const metadata: Metadata = {
  title: 'Cine-Stream — Discover & Stream Popular Movies',
  description:
    'Browse popular movies, search the TMDB catalog, and explore detailed movie pages — built with Next.js 15 App Router, Server Components and dynamic SEO metadata.',
  metadataBase: new URL('https://cinestream.example.com'),
  openGraph: {
    title: 'Cine-Stream — Discover & Stream Popular Movies',
    description: 'Browse popular movies and explore detailed movie pages.',
    siteName: 'Cine-Stream',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cine-Stream',
    description: 'Browse popular movies and explore detailed movie pages.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">{children}</body>
    </html>
  );
}
