/**
 * MovieCard - Individual movie card component
 * Displays movie poster, title, and rating
 */

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Icons } from '@/components/ui/Icon';

interface DoubanMovie {
  id: string;
  title: string;
  cover: string;
  rate: string;
  url: string;
}

interface MovieCardProps {
  movie: DoubanMovie;
  onMovieClick: (movie: DoubanMovie) => void;
}

export function MovieCard({ movie, onMovieClick }: MovieCardProps) {
  return (
    <Link
      href={`/?q=${encodeURIComponent(movie.title)}`}
      onClick={(e) => {
        e.preventDefault();
        onMovieClick(movie);
      }}
      className="group cursor-pointer"
    >
      <Card hover className="overflow-hidden p-0 h-full">
        <div className="relative aspect-[2/3] overflow-hidden bg-[var(--glass-bg)]" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <Image
            src={movie.cover}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ borderRadius: 'var(--radius-2xl)' }}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          {movie.rate && parseFloat(movie.rate) > 0 && (
            <div 
              className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 flex items-center gap-1.5"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <Icons.Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">
                {movie.rate}
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-[var(--text-color)] line-clamp-2 group-hover:text-[var(--accent-color)] transition-colors">
            {movie.title}
          </h3>
        </div>
      </Card>
    </Link>
  );
}
