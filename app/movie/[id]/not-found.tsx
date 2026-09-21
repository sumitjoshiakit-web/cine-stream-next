import Link from 'next/link';
import { Film } from 'lucide-react';

export default function MovieNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 px-4 text-center">
      <Film className="w-12 h-12 text-zinc-600 mb-4" />
      <h1 className="text-xl font-bold mb-2">Movie not found</h1>
      <p className="text-sm text-zinc-400 mb-6">We couldn&apos;t find a movie with that ID.</p>
      <Link href="/" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-semibold text-white">
        Back to Discovery
      </Link>
    </div>
  );
}
