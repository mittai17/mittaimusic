import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpotifyAccessToken } from '../../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`/?error=${error}`);
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const tokenData = await getSpotifyAccessToken(code);

    // Store tokens in cookies or session
    res.setHeader('Set-Cookie', [
      `spotify_access_token=${tokenData.access_token}; Path=/; HttpOnly; Max-Age=${tokenData.expires_in}`,
      `spotify_refresh_token=${tokenData.refresh_token}; Path=/; HttpOnly; Max-Age=2592000`, // 30 days
    ]);

    // Redirect to library page
    res.redirect('/spotify-library');
  } catch (error) {
    console.error('Spotify callback error:', error);
    res.redirect('/?error=auth_failed');
  }
}
