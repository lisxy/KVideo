/**
 * PopularFeatures - Main component for popular movies section
 * Displays Douban movie recommendations with tag filtering and infinite scroll
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { TagManager } from './TagManager';
import { MovieGrid } from './MovieGrid';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';

interface DoubanMovie {
  id: string;
  title: string;
  cover: string;
  rate: string;
  url: string;
}

interface PopularFeaturesProps {
  onSearch?: (query: string) => void;
}

const DEFAULT_TAGS = [
  { id: 'popular', label: '热门', value: '热门' },
  { id: 'latest', label: '最新', value: '最新' },
  { id: 'classic', label: '经典', value: '经典' },
  { id: 'highscore', label: '豆瓣高分', value: '豆瓣高分' },
  { id: 'underrated', label: '冷门佳片', value: '冷门佳片' },
  { id: 'chinese', label: '华语', value: '华语' },
  { id: 'western', label: '欧美', value: '欧美' },
  { id: 'korean', label: '韩国', value: '韩国' },
  { id: 'japanese', label: '日本', value: '日本' },
  { id: 'action', label: '动作', value: '动作' },
  { id: 'comedy', label: '喜剧', value: '喜剧' },
  { id: 'variety', label: '综艺', value: '综艺' },
  { id: 'romance', label: '爱情', value: '爱情' },
  { id: 'scifi', label: '科幻', value: '科幻' },
  { id: 'thriller', label: '悬疑', value: '悬疑' },
  { id: 'horror', label: '恐怖', value: '恐怖' },
  { id: 'healing', label: '治愈', value: '治愈' },
];

const STORAGE_KEY = 'kvideo_custom_tags';
const PAGE_LIMIT = 20;

export function PopularFeatures({ onSearch }: PopularFeaturesProps) {
  const [selectedTag, setSelectedTag] = useState('popular');
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [movies, setMovies] = useState<DoubanMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagManager, setShowTagManager] = useState(false);

  // Load custom tags from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTags(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved tags', e);
      }
    }
  }, []);

  const saveTags = (newTags: typeof DEFAULT_TAGS) => {
    setTags(newTags);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTags));
  };

  const loadMovies = useCallback(async (tag: string, pageStart: number, append = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const tagValue = tags.find(t => t.id === tag)?.value || '热门';
      const response = await fetch(
        `/api/douban/recommend?tag=${encodeURIComponent(tagValue)}&page_limit=${PAGE_LIMIT}&page_start=${pageStart}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const newMovies = data.subjects || [];
      
      setMovies(prev => append ? [...prev, ...newMovies] : newMovies);
      setHasMore(newMovies.length === PAGE_LIMIT);
    } catch (error) {
      console.error('Failed to load movies:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, tags]);

  useEffect(() => {
    setPage(0);
    setMovies([]);
    setHasMore(true);
    loadMovies(selectedTag, 0, false);
  }, [selectedTag]);

  const { prefetchRef, loadMoreRef } = useInfiniteScroll({
    hasMore,
    loading,
    page,
    onLoadMore: (nextPage) => {
      setPage(nextPage);
      loadMovies(selectedTag, nextPage * PAGE_LIMIT, true);
    },
  });

  const handleMovieClick = (movie: DoubanMovie) => {
    if (onSearch) {
      onSearch(movie.title);
    }
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const newTag = {
      id: `custom_${Date.now()}`,
      label: newTagInput.trim(),
      value: newTagInput.trim(),
    };
    saveTags([...tags, newTag]);
    setNewTagInput('');
  };

  const handleDeleteTag = (tagId: string) => {
    saveTags(tags.filter(t => t.id !== tagId));
    if (selectedTag === tagId) {
      setSelectedTag('popular');
    }
  };

  const handleRestoreDefaults = () => {
    saveTags(DEFAULT_TAGS);
    setSelectedTag('popular');
    setShowTagManager(false);
  };

  return (
    <div className="animate-fade-in">
      <TagManager
        tags={tags}
        selectedTag={selectedTag}
        showTagManager={showTagManager}
        newTagInput={newTagInput}
        onTagSelect={setSelectedTag}
        onTagDelete={handleDeleteTag}
        onToggleManager={() => setShowTagManager(!showTagManager)}
        onRestoreDefaults={handleRestoreDefaults}
        onNewTagInputChange={setNewTagInput}
        onAddTag={handleAddTag}
      />

      <MovieGrid
        movies={movies}
        loading={loading}
        hasMore={hasMore}
        onMovieClick={handleMovieClick}
        prefetchRef={prefetchRef}
        loadMoreRef={loadMoreRef}
      />
    </div>
  );
}
