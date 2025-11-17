# 🎵 Spotify Integration Setup

Your app now has full Spotify integration! Here's how to set it up:

## 🚀 Quick Setup (5 minutes)

### 1. Create Spotify App

1. Go to: https://developer.spotify.com/dashboard
2. Click "Create app"
3. Fill in the details:
   - **App name**: Mittai's Music
   - **App description**: Personal music streaming app
   - **Redirect URI**: `http://localhost:3000/api/spotify/callback`
   - **APIs used**: Web API
4. Click "Save"

> ⚠️ **Note:** You'll see a warning "This redirect URI is not secure" - this is **normal for development**. 
> The warning appears because we're using `http://` instead of `https://`. 
> This is perfectly safe for local development on localhost. 
> For production, you'll use `https://` and the warning will disappear.

### 2. Get Your Credentials

1. Click on your new app
2. Click "Settings"
3. Copy your **Client ID** and **Client Secret**

### 3. Update Environment Variables

Open `apps/web/.env.local` and update:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

### 4. Restart Dev Server

```bash
cd apps/web
npm run dev
```

### 5. Connect Your Spotify Account

1. Visit: http://localhost:3000/spotify-library
2. Click "Connect with Spotify"
3. Log in and authorize the app
4. You'll be redirected back with access to your library!

## ✨ Features

### 📋 Playlists
- View all your Spotify playlists
- See track counts and creators
- Beautiful grid layout

### ❤️ Saved Tracks
- All your liked songs in one place
- List view with album info
- Quick play functionality

### ⭐ Top Tracks
- Your most played songs
- Ranked by popularity
- Time range: Last 6 months

### 🕐 Recently Played
- Your listening history
- Last 50 tracks
- Quick replay

## 🎨 UI Features

- **Beautiful Design**: Modern card-based layout
- **Smooth Animations**: Hover effects and transitions
- **Responsive**: Works on all devices
- **User Profile**: Shows your Spotify avatar and name
- **Tab Navigation**: Easy switching between sections

## 🔒 Security

- Tokens stored in HTTP-only cookies
- Automatic token refresh
- Secure OAuth 2.0 flow
- No passwords stored

## 📊 API Scopes

The app requests these permissions:
- `user-read-private` - Read your profile
- `user-read-email` - Read your email
- `user-library-read` - Read your saved tracks
- `user-top-read` - Read your top tracks
- `playlist-read-private` - Read your playlists
- `user-read-recently-played` - Read listening history

## 🎵 How to Use

1. **Browse Playlists**: Click on any playlist to see details
2. **Play Songs**: Click on any track to play it
3. **Switch Tabs**: Use the tab bar to navigate
4. **Logout**: Clear cookies to disconnect

## 🔧 Troubleshooting

### "This redirect URI is not secure" warning
- **This is normal!** It's just a warning for development
- Spotify shows this because we use `http://` instead of `https://`
- It's perfectly safe for localhost development
- You can safely ignore this warning
- For production, use `https://` and the warning disappears

### "Not authenticated" error
- Make sure you've set up the Spotify app correctly
- Check that your credentials are in `.env.local`
- Restart the dev server after adding credentials

### "Invalid redirect URI" error
- Make sure the redirect URI in Spotify Dashboard matches exactly:
  `http://localhost:3000/api/spotify/callback`
- Copy and paste it to avoid typos
- Don't add trailing slashes

### No data showing
- Make sure you've authorized the app
- Check browser console for errors
- Verify your Spotify account has data (playlists, saved songs, etc.)
- Try refreshing the page

## 🌐 Production Deployment

When deploying to production:

1. Update redirect URI in Spotify Dashboard:
   ```
   https://yourdomain.com/api/spotify/callback
   ```

2. Update environment variable:
   ```env
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/spotify/callback
   ```

3. Add your production domain to Spotify app settings

## 📚 API Documentation

Full Spotify Web API docs: https://developer.spotify.com/documentation/web-api

---

**Enjoy your Spotify integration!** 🎶
