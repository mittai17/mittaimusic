# 🔧 Fix Render Build - Update Commands

## The Problem

Render is using `npm` but your project needs `pnpm` for the monorepo.

## ✅ Solution: Update Build Commands in Render

### Go to Your Service Settings

1. Open Render dashboard: https://dashboard.render.com
2. Click on your service: **mittaimusic**
3. Click **"Settings"** tab (left sidebar)

### Update Build & Start Commands

Scroll to **"Build & Deploy"** section:

#### Build Command
Change from:
```
npm install && npm run build
```

To:
```
npm install -g pnpm && pnpm install && pnpm run build
```

#### Start Command
Change from:
```
npm start
```

To:
```
pnpm start
```

### Save and Redeploy

1. Click **"Save Changes"** at the bottom
2. Go to **"Manual Deploy"** (top right)
3. Click **"Deploy latest commit"**

---

## 📋 Exact Settings

Copy these exact values:

```
Root Directory: apps/web

Build Command:
npm install -g pnpm && pnpm install && pnpm run build

Start Command:
pnpm start

Node Version: 18.17.0
```

---

## 🎯 What This Does

1. **Installs pnpm globally**: `npm install -g pnpm`
2. **Installs dependencies**: `pnpm install`
3. **Builds the app**: `pnpm run build`
4. **Starts the app**: `pnpm start`

---

## ✅ After Update

The build should succeed! Watch the logs in Render dashboard.

Once deployed:
1. Visit: `https://mittaimusic.onrender.com`
2. Test all pages
3. Update Spotify redirect URI

---

**Update the commands in Render dashboard now!** 🚀
