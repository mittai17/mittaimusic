# 🚀 Quick Start - Test Spotify Integration

## Option 1: Quick Test with Bearer Token (5 seconds)

Perfect for immediate testing with the token you already have!

### Steps:

1. **Start the app:**
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Visit:** http://localhost:3000/spotify-test

3. **Paste your token:**
   ```
   BQA2aoiO5XM5szSroAWMQneVq1Ion4oO2YZzhtZSE8hCiI6rRO6mfuGsBwc6zuC1nmyeCU_vOQMNsDIqEs29GG89nIXiI8lh5pkxKbP_s59yXtfD1SrCiZu_C3mrKVk-gDgaCdzn_Nu5QTVNeBi9rhGv1Wj41boPay3890vJtBJcaygEHK3AwNufTNLWVCVyJqBDnpW1RxaAdHkzImF53Uub_mp9MrP_lCnZEQ3yfNcOWDMLVacV5ozqubtAMr2_-4DPuQ-UGadYXn7YCe8je1HwW8etzwKW8DIvgTYGpDvt5J3nBffLC_Dhk3lg_3E1PrV2
   ```

4. **Click "Test Token"**

5. **See your top tracks and play them!**

### What You'll See:
- ✅ Your Spotify profile (name, email, country)
- ✅ Your top 10 tracks
- ✅ Play button for each track
- ✅ Beautiful UI

### ⚠️ Important:
- **Tokens expire in ~1 hour**
- Get a new token from: https://developer.spotify.com/console/get-current-user-top-artists-and-tracks/
- For permanent access, use Option 2 below

---

## Option 2: Full OAuth Integration (5 minutes)

For permanent, production-ready Spotify integration.

### Steps:

1. **Create Spotify App:**
   - Visit: https://developer.spotify.com/dashboard
   - Click "Create app"
   - Name: "Mittai's Music"
   - Redirect URI: `http://localhost:3000/api/spotify/callback`
   - Click "Save"

2. **Get Credentials:**
   - Click "Settings"
   - Copy **Client ID** and **Client Secret**

3. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
   ```

4. **Restart server:**
   ```bash
   npm run dev
   ```

5. **Visit:** http://localhost:3000/spotify-library

6. **Click "Connect with Spotify"**

### What You'll Get:
- ✅ All your playlists
- ✅ Saved/liked songs
- ✅ Top tracks (ranked)
- ✅ Recently played
- ✅ Never expires (auto-refresh)

---

## Comparison

| Feature | Bearer Token | OAuth |
|---------|-------------|-------|
| Setup Time | 5 seconds | 5 minutes |
| Expires | 1 hour | Never (auto-refresh) |
| Features | Top tracks only | Full library access |
| Best For | Quick testing | Production use |

---

## 🎵 What You Can Do

### With Bearer Token:
- View your top 10 tracks
- Play any track
- See your profile

### With OAuth:
- Everything above, plus:
- Browse all playlists
- Access saved songs
- See recently played
- View listening history
- Never expires

---

## 🔧 Troubleshooting

### Token expired?
Get a new one from: https://developer.spotify.com/console/get-current-user-top-artists-and-tracks/

### OAuth not working?
1. Check Client ID and Secret in `.env.local`
2. Verify redirect URI matches exactly
3. Restart dev server

---

## 📚 More Info

- **Full Setup Guide:** `SPOTIFY_SETUP.md`
- **All Features:** `FEATURES_SUMMARY.md`
- **API Documentation:** https://developer.spotify.com/documentation/web-api

---

**Start with the Bearer token for instant testing, then set up OAuth for permanent access!** 🎶
