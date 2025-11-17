# 🚀 Deploy to Render - Complete Guide

## Why Render?

- ✅ **Simpler** than Vercel for monorepos
- ✅ **Free tier** with 750 hours/month
- ✅ **No credit card** required
- ✅ **Auto-deploy** from GitHub
- ✅ **Easy configuration**

---

## 🎯 Quick Deploy (5 Minutes)

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (easiest)

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `mittai17/mittaimusic`
3. Click **"Connect"**

### Step 3: Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `mittaimusic` |
| **Region** | Oregon (US West) or closest to you |
| **Branch** | `main` |
| **Root Directory** | `apps/web` |
| **Runtime** | Node |
| **Build Command** | `npm install -g pnpm && pnpm install && pnpm run build` |
| **Start Command** | `pnpm start` |
| **Plan** | Free |

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

```
Key: NEXT_PUBLIC_YT_API_KEY
Value: AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc

Key: NEXT_PUBLIC_SPOTIFY_CLIENT_ID
Value: 40a831c8dc574f879ba48ef3f8311ca8

Key: NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
Value: aadde63c12614309b8aff240a5b590e8

Key: NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
Value: https://mittaimusic.onrender.com/api/spotify/callback
```

**Note**: Your Render URL will be `https://YOUR-SERVICE-NAME.onrender.com`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for first deployment
3. Your app will be live!

---

## 📋 Detailed Configuration

### Build Settings

```yaml
Name: mittaimusic
Region: Oregon (US West)
Branch: main
Root Directory: apps/web

Runtime: Node
Build Command: npm install -g pnpm && pnpm install && pnpm run build
Start Command: pnpm start

Auto-Deploy: Yes
```

### Environment Variables

```
NODE_VERSION=18.17.0
NEXT_PUBLIC_YT_API_KEY=AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=40a831c8dc574f879ba48ef3f8311ca8
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=aadde63c12614309b8aff240a5b590e8
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://mittaimusic.onrender.com/api/spotify/callback
```

---

## 🔧 After Deployment

### 1. Get Your URL

Your app will be at:
```
https://mittaimusic.onrender.com
```

Or whatever name you chose.

### 2. Update Spotify Redirect URI

Go to: https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings

Add your Render URL:
```
https://mittaimusic.onrender.com/api/spotify/callback
```

Keep localhost for development:
```
http://localhost:3000/api/spotify/callback
```

### 3. Test Your App

Visit these URLs:
```
https://mittaimusic.onrender.com/
https://mittaimusic.onrender.com/tamil-music
https://mittaimusic.onrender.com/search
https://mittaimusic.onrender.com/spotify-library
```

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain

1. Go to your service → **Settings** → **Custom Domain**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `music.yourdomain.com`)
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

### Update Spotify After Custom Domain

Update redirect URI to:
```
https://music.yourdomain.com/api/spotify/callback
```

---

## 🔄 Automatic Deployments

Once connected to GitHub:
- ✅ Push to `main` → Auto-deploys
- ✅ See build logs in Render dashboard
- ✅ Rollback to previous versions if needed

### Manual Deploy

In Render dashboard:
1. Go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Render Free Tier

### What You Get (Free)

- ✅ 750 hours/month (enough for 1 app running 24/7)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Auto-deploy from GitHub
- ✅ Build minutes included

### Limitations

- ⚠️ App sleeps after 15 minutes of inactivity
- ⚠️ Cold start takes ~30 seconds
- ⚠️ 512 MB RAM

### Upgrade to Paid ($7/month)

- No sleep/cold starts
- More RAM and CPU
- Better performance

---

## 🐛 Troubleshooting

### Build Fails: "Cannot find module"

**Solution**: Make sure Root Directory is set to `apps/web`

### Build Fails: "workspace: not supported"

**Solution**: Use `npm install` instead of `pnpm install` in build command

### App Shows 404

**Solution**: Check Start Command is `npm start`

### Environment Variables Not Working

**Solution**: 
1. Check variable names start with `NEXT_PUBLIC_`
2. Redeploy after adding variables

### App is Slow to Load

**Solution**: This is normal on free tier (cold start). Upgrade to paid plan for instant loading.

---

## 📊 Monitoring

### View Logs

1. Go to your service in Render
2. Click **"Logs"** tab
3. See real-time logs

### View Metrics

1. Click **"Metrics"** tab
2. See CPU, memory, bandwidth usage

---

## 🔐 Security

### Environment Variables

- Stored securely by Render
- Not visible in logs
- Can be updated anytime

### HTTPS

- Automatic SSL certificate
- Free with custom domains
- Auto-renewal

---

## ⚡ Performance Tips

### 1. Use Paid Plan

Eliminates cold starts and sleep mode.

### 2. Keep App Awake (Free Tier)

Use a service like UptimeRobot to ping your app every 5 minutes:
```
https://uptimerobot.com
```

Add monitor:
- URL: `https://mittaimusic.onrender.com`
- Interval: 5 minutes

### 3. Optimize Build

Already optimized with Next.js production build!

---

## 🎯 Comparison: Render vs Vercel

| Feature | Render | Vercel |
|---------|--------|--------|
| **Monorepo Support** | ✅ Easy | ⚠️ Complex |
| **Free Tier** | 750 hrs/month | Unlimited |
| **Cold Starts** | Yes (free tier) | No |
| **Setup** | Simple | Complex for monorepos |
| **Custom Domains** | ✅ Free | ✅ Free |
| **Auto-Deploy** | ✅ Yes | ✅ Yes |

**Recommendation**: Use Render for simpler setup!

---

## ✅ Deployment Checklist

Before deploying:
- [ ] GitHub repo is public or Render has access
- [ ] Root Directory set to `apps/web`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] All 4 environment variables added
- [ ] Node version set to 18.x

After deploying:
- [ ] Build succeeded
- [ ] App loads at Render URL
- [ ] Tamil music page works
- [ ] Search page works
- [ ] Spotify redirect URI updated
- [ ] Spotify OAuth works

---

## 🎉 You're Ready!

Render is much simpler than Vercel for monorepos. Just:

1. **Sign up** at https://render.com
2. **Connect** your GitHub repo
3. **Configure** settings (5 minutes)
4. **Deploy** and you're live!

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status**: https://status.render.com

---

**Ready to deploy?** Go to https://render.com and follow Step 1! 🚀
