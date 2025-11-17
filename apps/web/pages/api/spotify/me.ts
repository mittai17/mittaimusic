import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpotifyUser } from '../../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = req.cookies.spotify_access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = await getSpotifyUser(accessToken);
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to get user:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
}
