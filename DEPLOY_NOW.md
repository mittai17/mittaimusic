# 🚀 Deploy to Vercel NOW - 3 Easy Steps

## Option A: Via Vercel Dashboard (Easiest - 5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Add Tamil music library and prepare for deployment"
git branch -M main
```

Create a new repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your repo
4. Configure:
   - **Root Directory**: Leave empty (monorepo auto-detected)
   - **Framework**: Next.js
   - Click **"Deploy"**

### Step 3: Add Environment Variables
After deployment, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_YT_API_KEY
Value: AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc

NEXT_PUBLIC_SPOTIFY_CLIENT_ID
Value: 40a831c8dc574f879ba48ef3f8311ca8

NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
Value: aadde63c12614309b8aff240a5b590e8

NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
Value: https://YOUR-APP-NAME.vercel.app/api/spotify/callback
```

**Important**: Replace `YOUR-APP-NAME` with your actual Vercel URL!

Then click **"Redeploy"** to apply the variables.

---

## Option B: Via CLI (Fast - 3 minutes)

### Step 1: Install & Login
```bash
npm install -g vercel
vercel login
```

### Step 2: Deploy
```bash
vercel
```

Answer the prompts:
- Set up and deploy? **Yes**
- Which scope? **(select your account)**
- Link to existing project? **No**
- Project name? **mittais-music** (or your choice)
- Directory? **./apps/web**
- Override settings? **No**

### Step 3: Add Environment Variables & Deploy to Production
```bash
# Add variables (paste when prompted)
vercel env add NEXT_PUBLIC_YT_API_KEY production
# Paste: AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc

vercel env add NEXT_PUBLIC_SPOTIFY_CLIENT_ID production
# Paste: 40a831c8dc574f879ba48ef3f8311ca8

vercel env add NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET production
# Paste: aadde63c12614309b8aff240a5b590e8

vercel env add NEXT_PUBLIC_SPOTIFY_REDIRECT_URI production
# Paste: https://YOUR-APP.vercel.app/api/spotify/callback

# Deploy to production
vercel --prod
```

---

## 🔧 After Deployment

### 1. Get Your URL
Vercel will give you a URL like:
```
https://mittais-music-abc123.vercel.app
```

### 2. Update Spotify Redirect URI
Go to: https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings

Add your production URL:
```
https://your-actual-url.vercel.app/api/spotify/callback
```

Keep localhost for development:
```
http://localhost:3000/api/spotify/callback
```

### 3. Test Your App
Visit your Vercel URL and test:
- ✅ Home page
- ✅ Tamil Music: `/tamil-music`
- ✅ Search: `/search`
- ✅ Spotify: `/spotify-library`
- ✅ Player: `/player-enhanced`

---

## 🎉 That's It!

Your app is now live on Vercel with:
- ✅ Tamil music library (15 songs)
- ✅ Spotify integration
- ✅ YouTube search
- ✅ Beautiful UI
- ✅ Automatic HTTPS
- ✅ Global CDN

**Share your app**: `https://your-app.vercel.app` 🎵

---

## 💡 Quick Tips

### Redeploy After Changes
```bash
git add .
git commit -m "Update"
git push
```
Vercel auto-deploys on push!

### View Logs
```bash
vercel logs
```

### Custom Domain
In Vercel dashboard: **Settings** → **Domains** → Add your domain

---

**Need detailed help?** Check `VERCEL_DEPLOYMENT.md`

**Ready to deploy?** Pick Option A or B above and go! 🚀
