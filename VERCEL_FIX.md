# 🔧 Fix Vercel Deployment - Monorepo Configuration

## ✅ What I Fixed

Updated `vercel.json` to use `pnpm` instead of `npm` for the monorepo.

## 🚀 Deploy Again

### Option 1: Automatic (Recommended)

Vercel should auto-deploy the new commit. Check your Vercel dashboard:
```
https://vercel.com/mittai17/mittaimusic
```

### Option 2: Manual Configuration in Vercel Dashboard

If it still fails, configure these settings in Vercel:

1. **Go to Project Settings:**
   - https://vercel.com/mittai17/mittaimusic/settings

2. **General Settings:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

3. **Save and Redeploy**

### Option 3: Use Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to project
vercel link

# Deploy
vercel --prod
```

---

## 🔧 Alternative: Deploy Only Web App

If the monorepo is causing issues, you can deploy just the web app:

### Step 1: Create a Separate Repo for Web App

```bash
# Create new directory
mkdir mittaimusic-web
cd mittaimusic-web

# Copy web app files
cp -r ../music-react/apps/web/* .
cp ../music-react/apps/web/.env.local .env.local

# Initialize git
git init
git add .
git commit -m "Web app only"

# Create new GitHub repo and push
git remote add origin https://github.com/mittai17/mittaimusic-web.git
git push -u origin main
```

### Step 2: Deploy to Vercel

This will be much simpler as it's not a monorepo!

---

## 📋 Vercel Dashboard Settings

### Build & Development Settings

```
Framework Preset: Next.js
Root Directory: apps/web
Node.js Version: 18.x

Build Command: pnpm run build
Output Directory: .next
Install Command: pnpm install
Development Command: pnpm run dev
```

### Environment Variables

Add these in Settings → Environment Variables:

```
NEXT_PUBLIC_YT_API_KEY=AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=40a831c8dc574f879ba48ef3f8311ca8
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=aadde63c12614309b8aff240a5b590e8
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://YOUR-APP.vercel.app/api/spotify/callback
```

**Important**: Replace `YOUR-APP` with your actual Vercel URL!

---

## 🐛 Common Issues

### Issue: "Unsupported URL Type workspace:"
**Solution**: Use `pnpm` instead of `npm` (already fixed in vercel.json)

### Issue: "Cannot find module @youtify/services"
**Solution**: Set Root Directory to `apps/web` in Vercel dashboard

### Issue: Build succeeds but app doesn't work
**Solution**: Add environment variables in Vercel dashboard

---

## ✅ Verify Deployment

Once deployed, test these URLs:

```
https://your-app.vercel.app/
https://your-app.vercel.app/tamil-music
https://your-app.vercel.app/search
https://your-app.vercel.app/spotify-library
```

---

## 🎉 Success Checklist

- [ ] Vercel build completes successfully
- [ ] Home page loads
- [ ] Tamil music page works
- [ ] Search page works
- [ ] Environment variables added
- [ ] Spotify redirect URI updated
- [ ] All pages accessible

---

**Need help?** Check Vercel logs in the dashboard for specific errors.
