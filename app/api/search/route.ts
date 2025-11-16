/**
 * Search API Route
 * Handles video search requests and aggregates results from multiple sources
 * Now with automatic source availability detection
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchVideos } from '@/lib/api/client';
import { getEnabledSources, getSourceById } from '@/lib/api/video-sources';
import { checkMultipleSources, filterByAvailableSources } from '@/lib/utils/source-checker';
import type { SearchRequest, SearchResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();
    const { query, sources: sourceIds, page = 1 } = body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing query parameter' },
        { status: 400 }
      );
    }

    if (!sourceIds || !Array.isArray(sourceIds) || sourceIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one source must be specified' },
        { status: 400 }
      );
    }

    // Get source configurations
    const sources = sourceIds
      .map((id: string) => getSourceById(id))
      .filter((source): source is NonNullable<typeof source> => source !== undefined);

    if (sources.length === 0) {
      return NextResponse.json(
        { error: 'No valid sources found' },
        { status: 400 }
      );
    }

    // Perform parallel search across sources
    const searchResults = await searchVideos(query.trim(), sources, page);

    // Get source name mapping
    const getSourceName = (sourceId: string): string => {
      const sourceNames: Record<string, string> = {
        'custom_0': '电影天堂',
        'custom_1': '如意',
        'custom_2': '暴风',
        'custom_3': '天涯',
        'custom_4': '非凡影视',
        'custom_5': '360',
        'custom_6': '卧龙',
        'custom_7': '极速',
        'custom_8': '魔爪',
        'custom_9': '魔都',
        'custom_10': '海外看',
        'custom_11': '新浪',
        'custom_12': '光速',
        'custom_13': '红牛',
        'custom_14': '樱花',
        'custom_15': '飞速',
      };
      return sourceNames[sourceId] || sourceId;
    };

    // Check source availability by testing sample videos
    console.log(`🔍 Checking availability of ${searchResults.length} sources...`);
    const sourcesWithVideos = searchResults
      .filter(result => result.results.length > 0)
      .map(result => ({
        sourceId: result.source,
        sourceName: getSourceName(result.source),
        videos: result.results.slice(0, 3), // Use first 3 videos as samples
      }));

    const availabilityResults = await checkMultipleSources(sourcesWithVideos);
    
    const availableCount = availabilityResults.filter(r => r.isAvailable).length;
    console.log(`✅ ${availableCount} out of ${availabilityResults.length} sources are available`);

    // Filter results to only include videos from available sources
    const allVideos = searchResults.flatMap(r => r.results);
    const availableVideos = filterByAvailableSources(allVideos, availabilityResults);

    // Group available videos back by source
    const availableSources = availabilityResults
      .filter(r => r.isAvailable)
      .map(r => {
        const sourceVideos = availableVideos.filter(v => v.source === r.sourceId);
        return {
          source: r.sourceId,
          results: sourceVideos,
          responseTime: searchResults.find(sr => sr.source === r.sourceId)?.responseTime,
        };
      });

    // Format response
    const response: SearchResult[] = availableSources.map(result => ({
      results: result.results,
      source: result.source,
      responseTime: result.responseTime,
    }));

    return NextResponse.json({
      success: true,
      query: query.trim(),
      page,
      sources: response,
      totalResults: availableVideos.length,
      availableSources: availableCount,
      totalSources: availabilityResults.length,
      sourceAvailability: availabilityResults,
    });
  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Support GET method for simple queries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || searchParams.get('query');
    const sourcesParam = searchParams.get('sources');
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      );
    }

    // Use all enabled sources if not specified
    const sourceIds = sourcesParam
      ? sourcesParam.split(',')
      : getEnabledSources().map(s => s.id);

    // Get source configurations
    const sources = sourceIds
      .map((id: string) => getSourceById(id))
      .filter((source): source is NonNullable<typeof source> => source !== undefined);

    if (sources.length === 0) {
      return NextResponse.json(
        { error: 'No valid sources found' },
        { status: 400 }
      );
    }

    // Perform search
    const searchResults = await searchVideos(query.trim(), sources, page);

    // Get source name mapping
    const getSourceName = (sourceId: string): string => {
      const sourceNames: Record<string, string> = {
        'custom_0': '电影天堂',
        'custom_1': '如意',
        'custom_2': '暴风',
        'custom_3': '天涯',
        'custom_4': '非凡影视',
        'custom_5': '360',
        'custom_6': '卧龙',
        'custom_7': '极速',
        'custom_8': '魔爪',
        'custom_9': '魔都',
        'custom_10': '海外看',
        'custom_11': '新浪',
        'custom_12': '光速',
        'custom_13': '红牛',
        'custom_14': '樱花',
        'custom_15': '飞速',
      };
      return sourceNames[sourceId] || sourceId;
    };

    // Check source availability by testing sample videos
    console.log(`🔍 [GET] Checking availability of ${searchResults.length} sources...`);
    const sourcesWithVideos = searchResults
      .filter(result => result.results.length > 0)
      .map(result => ({
        sourceId: result.source,
        sourceName: getSourceName(result.source),
        videos: result.results.slice(0, 3), // Use first 3 videos as samples
      }));

    const availabilityResults = await checkMultipleSources(sourcesWithVideos);
    
    const availableCount = availabilityResults.filter(r => r.isAvailable).length;
    console.log(`✅ [GET] ${availableCount} out of ${availabilityResults.length} sources are available`);

    // Filter results to only include videos from available sources
    const allVideos = searchResults.flatMap(r => r.results);
    const availableVideos = filterByAvailableSources(allVideos, availabilityResults);

    // Group available videos back by source
    const availableSources = availabilityResults
      .filter(r => r.isAvailable)
      .map(r => {
        const sourceVideos = availableVideos.filter(v => v.source === r.sourceId);
        return {
          source: r.sourceId,
          results: sourceVideos,
          responseTime: searchResults.find(sr => sr.source === r.sourceId)?.responseTime,
        };
      });

    // Format response
    const response: SearchResult[] = availableSources.map(result => ({
      results: result.results,
      source: result.source,
      responseTime: result.responseTime,
    }));

    return NextResponse.json({
      success: true,
      query: query.trim(),
      page,
      sources: response,
      totalResults: availableVideos.length,
      availableSources: availableCount,
      totalSources: availabilityResults.length,
      sourceAvailability: availabilityResults,
    });
  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
