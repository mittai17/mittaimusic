# 🚀 Deploy to Render NOW - 3 Easy Steps

## ✅ Why Render is Better for Your App

- ✅ **Much simpler** than Vercel for monorepos
- ✅ **No complex configuration** needed
- ✅ **Free tier** - 750 hours/month
- ✅ **Works immediately** - no debugging needed

---

## 🎯 Deploy in 3 Steps (5 Minutes)

### Step 1: Sign Up

1. Go to: https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest option)

### Step 2: Create Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Find and select: `mittai17/mittaimusic`
4. Click **"Connect"**

### Step 3: Configure & Deploy

Fill in these exact values:

```
Name: mittaimusic
Region: Oregon (US West)
Branch: main
Root Directory: apps/web

Build Command: npm install -g pnpm && pnpm install && pnpm run build
Start Command: pnpm start
```

Click **"Advanced"** and add these environment variables:

```
NEXT_PUBLIC_YT_API_KEY
AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc

NEXT_PUBLIC_SPOTIFY_CLIENT_ID
40a831c8dc574f879ba48ef3f8311ca8

NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
aadde63c12614309b8aff240a5b590e8

NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
https://mittaimusic.onrender.com/api/spotify/callback
```

Click **"Create Web Service"**

**Done!** Wait 5-10 minutes for deployment.

---

## 🎉 After Deployment

### Your App URL

```
https://mittaimusic.onrender.com
```

### Update Spotify

Go to: https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings

Add:
```
https://mittaimusic.onrender.com/api/spotify/callback
```

### Test Your App

Visit:
- https://mittaimusic.onrender.com/
- https://mittaimusic.onrender.com/tamil-music
- https://mittaimusic.onrender.com/search
- https://mittaimusic.onrender.com/spotify-library

---

## 💡 Important Notes

### Free Tier Behavior

- ⚠️ App sleeps after 15 minutes of inactivity
- ⚠️ First load after sleep takes ~30 seconds (cold start)
- ✅ After that, it's fast!

### Keep App Awake (Optional)

Use UptimeRobot to ping your app every 5 minutes:
1. Go to https://uptimerobot.com
2. Add monitor for: `https://mittaimusic.onrender.com`
3. Set interval: 5 minutes

### Upgrade to Paid ($7/month)

- No sleep/cold starts
- Instant loading
- Better performance

---

## 🔄 Auto-Deploy

Every time you push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```

Render automatically deploys! 🎯

---

## 📋 Quick Reference

**Render Dashboard**: https://dashboard.render.com
**Your Service**: https://dashboard.render.com/web/mittaimusic
**Logs**: Click "Logs" tab in your service

---

## ✅ Success Checklist

- [ ] Signed up on Render
- [ ] Connected GitHub repo
- [ ] Configured service settings
- [ ] Added environment variables
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment
- [ ] App loads successfully
- [ ] Updated Spotify redirect URI
- [ ] Tested all pages

---

**That's it!** Much simpler than Vercel. 🚀

**Need detailed help?** Check `RENDER_DEPLOYMENT.md`
