import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    // Test the token by fetching user profile
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error.message });
    }

    const user = await response.json();

    // Fetch top tracks
    const topTracksResponse = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const topTracksData = await topTracksResponse.json();

    res.status(200).json({
      success: true,
      user,
      topTracks: topTracksData.items,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to test token' });
  }
}
