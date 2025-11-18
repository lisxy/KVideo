/**
 * useInfiniteScroll - Custom hook for infinite scroll functionality
 * Manages intersection observer for prefetching and loading more content
 */

'use client';

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  page: number;
  onLoadMore: (nextPage: number) => void;
}

export function useInfiniteScroll({ 
  hasMore, 
  loading, 
  page, 
  onLoadMore 
}: UseInfiniteScrollProps) {
  const prefetchRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!prefetchRef.current) return;

    const prefetchObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          onLoadMore(nextPage);
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    prefetchObserver.observe(prefetchRef.current);

    return () => {
      prefetchObserver.disconnect();
    };
  }, [hasMore, loading, page, onLoadMore]);

  return { prefetchRef, loadMoreRef };
}
