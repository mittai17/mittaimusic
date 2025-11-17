# 🔧 Fix Spotify OAuth - 2 Minutes

## The Problem

Spotify is rejecting the redirect URI because it's not configured in your Spotify Dashboard.

## ✅ Quick Fix (2 Steps)

### Step 1: Go to Spotify Dashboard

Click this link:
```
https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings
```

Or:
1. Go to https://developer.spotify.com/dashboard
2. Click on your app
3. Click **"Settings"** or **"Edit Settings"**

### Step 2: Add Redirect URI

Scroll to **"Redirect URIs"** section

Add this **exact** URI:
```
http://localhost:3000/api/spotify/callback
```

**Important**: 
- No trailing slash `/`
- Must be exactly `http://` (not `https://`)
- Must be exactly `localhost:3000` (not 127.0.0.1)

Click **"Add"** then click **"Save"** at the bottom.

---

## ✅ That's It!

Now try connecting Spotify again:
```
http://localhost:3000/spotify-library
```

Click **"Connect with Spotify"**

---

## 🔐 For HTTPS (Optional)

If you're using HTTPS (`npm run dev:https`), also add:
```
https://localhost:3000/api/spotify/callback
```

You can have both HTTP and HTTPS redirect URIs!

---

## 📋 Your Spotify Dashboard Should Look Like:

```
Redirect URIs
┌─────────────────────────────────────────────────┐
│ http://localhost:3000/api/spotify/callback      │ [Remove]
└─────────────────────────────────────────────────┘
[Add URI]

[Save]
```

---

## ⚠️ Common Mistakes

❌ `http://localhost:3000/api/spotify/callback/` (trailing slash)
❌ `https://localhost:3000/api/spotify/callback` (https when using http)
❌ `http://127.0.0.1:3000/api/spotify/callback` (IP instead of localhost)
❌ Extra spaces before or after

✅ `http://localhost:3000/api/spotify/callback` (correct!)

---

## 🎯 Quick Links

**Your Spotify App Settings:**
https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings

**Your App:**
http://localhost:3000/spotify-library

**Client ID:** `40a831c8dc574f879ba48ef3f8311ca8`

---

## 🐛 Still Not Working?

### Check Your .env.local

Make sure `apps/web/.env.local` has:
```
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

### Restart Dev Server

After changing .env.local:
```bash
# Stop server (Ctrl+C)
# Start again
cd apps/web
npm run dev
```

---

**Go to Spotify Dashboard now and add the redirect URI!** 🚀

It takes 30 seconds and fixes the issue immediately.
