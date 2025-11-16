/**
 * Detail API Route
 * Fetches video details including episodes and M3U8 URLs with automatic source validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideoDetail, getVideoDetailCustom } from '@/lib/api/client';
import { getSourceById } from '@/lib/api/video-sources';
import { filterValidEpisodes } from '@/lib/utils/url-validator';
import type { DetailRequest } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const source = searchParams.get('source');
    const customApi = searchParams.get('customApi');

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Missing video ID parameter' },
        { status: 400 }
      );
    }

    // Handle custom API case
    if (customApi) {
      try {
        const videoDetail = await getVideoDetailCustom(id, customApi);
        
        return NextResponse.json({
          success: true,
          data: videoDetail,
        });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch video detail',
          },
          { status: 500 }
        );
      }
    }

    // Validate source
    if (!source) {
      return NextResponse.json(
        { error: 'Missing source parameter' },
        { status: 400 }
      );
    }

    const sourceConfig = getSourceById(source);
    
    if (!sourceConfig) {
      return NextResponse.json(
        { error: 'Invalid source ID' },
        { status: 400 }
      );
    }

    // Fetch video detail with automatic episode validation
    try {
      const videoDetail = await getVideoDetail(id, sourceConfig);
      
      // Validate episodes to filter out broken sources
      if (videoDetail.episodes && videoDetail.episodes.length > 0) {
        console.log(`[GET] Validating ${videoDetail.episodes.length} episodes for video ${id}...`);
        const validatedEpisodes = await filterValidEpisodes(videoDetail.episodes);
        const workingEpisodes = validatedEpisodes.filter(ep => ep.isValid);
        
        console.log(`[GET] Found ${workingEpisodes.length} working episodes out of ${videoDetail.episodes.length}`);
        
        if (workingEpisodes.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'No playable episodes found from this source. Please try another source.',
            },
            { status: 404 }
          );
        }
        
        videoDetail.episodes = workingEpisodes;
      }
      
      return NextResponse.json({
        success: true,
        data: videoDetail,
      });
    } catch (error) {
      console.error('Detail API error:', error);
      
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch video detail',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Detail API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Support POST method for complex requests
export async function POST(request: NextRequest) {
  try {
    const body: DetailRequest = await request.json();
    const { id, source, customApi } = body;

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Missing video ID parameter' },
        { status: 400 }
      );
    }

    // Handle custom API case
    if (customApi) {
      try {
        const videoDetail = await getVideoDetailCustom(id, customApi);
        
        return NextResponse.json({
          success: true,
          data: videoDetail,
        });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch video detail',
          },
          { status: 500 }
        );
      }
    }

    // Validate source
    if (!source) {
      return NextResponse.json(
        { error: 'Missing source parameter' },
        { status: 400 }
      );
    }

    const sourceConfig = getSourceById(source);
    
    if (!sourceConfig) {
      return NextResponse.json(
        { error: 'Invalid source ID' },
        { status: 400 }
      );
    }

    // Fetch video detail with automatic episode validation
    try {
      const videoDetail = await getVideoDetail(id, sourceConfig);
      
      // Validate episodes to filter out broken sources
      if (videoDetail.episodes && videoDetail.episodes.length > 0) {
        console.log(`[POST] Validating ${videoDetail.episodes.length} episodes for video ${id}...`);
        const validatedEpisodes = await filterValidEpisodes(videoDetail.episodes);
        const workingEpisodes = validatedEpisodes.filter(ep => ep.isValid);
        
        console.log(`[POST] Found ${workingEpisodes.length} working episodes out of ${videoDetail.episodes.length}`);
        
        if (workingEpisodes.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'No playable episodes found from this source. Please try another source.',
            },
            { status: 404 }
          );
        }
        
        videoDetail.episodes = workingEpisodes;
      }
      
      return NextResponse.json({
        success: true,
        data: videoDetail,
      });
    } catch (error) {
      console.error('Detail API error:', error);
      
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch video detail',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Detail API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
