import type { NextApiRequest, NextApiResponse } from 'next';

const YT_API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY || 'AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = req.query.q || 'music';
    const url = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query as string)}&key=${YT_API_KEY}&part=snippet&type=video&maxResults=5`;
    
    console.log('Testing YouTube API...');
    console.log('API Key present:', !!YT_API_KEY);
    console.log('API Key length:', YT_API_KEY.length);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: true,
        message: data.error?.message || 'API request failed',
        details: data.error,
        status: response.status
      });
    }
    
    return res.status(200).json({
      success: true,
      itemCount: data.items?.length || 0,
      items: data.items || [],
      pageInfo: data.pageInfo
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
