# 🔧 Vercel Manual Configuration - Step by Step

## The Problem

Vercel is using `npm` instead of `pnpm` and ignoring the `vercel.json` file. You need to configure it manually in the dashboard.

## 🚀 Solution: Configure in Vercel Dashboard

### Step 1: Go to Project Settings

1. Open your Vercel project: https://vercel.com/mittai17/mittaimusic
2. Click **"Settings"** tab at the top

### Step 2: Configure Build & Development Settings

Scroll to **"Build & Development Settings"** section:

#### Framework Preset
- Select: **Next.js**

#### Root Directory
- Click **"Edit"**
- Enter: `apps/web`
- Click **"Save"**

#### Build Command
- Click **"Override"** checkbox
- Enter: `pnpm run build`

#### Output Directory
- Click **"Override"** checkbox  
- Enter: `.next`

#### Install Command
- Click **"Override"** checkbox
- Enter: `pnpm install`

#### Node.js Version
- Select: **18.x** (or 20.x)

### Step 3: Save Settings

Click **"Save"** at the bottom of the page.

### Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Click the **three dots (...)** on the latest deployment
3. Click **"Redeploy"**
4. Confirm the redeploy

---

## 📋 Quick Reference - Settings to Configure

Copy these exact values:

```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: pnpm run build
Output Directory: .next
Install Command: pnpm install
Node.js Version: 18.x
```

---

## 🎯 After Successful Build

### 1. Add Environment Variables

Go to **Settings** → **Environment Variables** and add:

```
Name: NEXT_PUBLIC_YT_API_KEY
Value: AIzaSyDc0f5IT8O7NFNtezeuBxotBvbmXwWnHOc
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_SPOTIFY_CLIENT_ID
Value: 40a831c8dc574f879ba48ef3f8311ca8
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
Value: aadde63c12614309b8aff240a5b590e8
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
Value: https://YOUR-APP-NAME.vercel.app/api/spotify/callback
Environment: Production, Preview, Development
```

**Important**: Replace `YOUR-APP-NAME` with your actual Vercel URL!

### 2. Redeploy Again

After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment

### 3. Update Spotify Dashboard

Go to: https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings

Add your Vercel URL to Redirect URIs:
```
https://your-app-name.vercel.app/api/spotify/callback
```

Keep localhost for development:
```
http://localhost:3000/api/spotify/callback
```

---

## 🎉 Test Your Deployment

Once deployed, visit:

```
https://your-app-name.vercel.app/
https://your-app-name.vercel.app/tamil-music
https://your-app-name.vercel.app/search
https://your-app-name.vercel.app/spotify-library
```

---

## 🐛 Still Having Issues?

### Check Build Logs

1. Go to **Deployments** tab
2. Click on the failed deployment
3. Read the error message
4. Look for specific errors

### Common Errors

**Error: "Cannot find module @youtify/services"**
- Solution: Make sure Root Directory is set to `apps/web`

**Error: "Unsupported URL Type workspace:"**
- Solution: Make sure Install Command is `pnpm install` (not npm)

**Error: "Build succeeded but app shows 404"**
- Solution: Check Output Directory is `.next` (not `apps/web/.next`)

---

## 📸 Visual Guide

### Settings Page Should Look Like:

```
┌─────────────────────────────────────────┐
│ Build & Development Settings            │
├─────────────────────────────────────────┤
│ Framework Preset: Next.js               │
│                                         │
│ Root Directory: apps/web         [Edit] │
│                                         │
│ ☑ Override Build Command                │
│   pnpm run build                        │
│                                         │
│ ☑ Override Output Directory             │
│   .next                                 │
│                                         │
│ ☑ Override Install Command              │
│   pnpm install                          │
│                                         │
│ Node.js Version: 18.x            [Edit] │
│                                         │
│                          [Save]         │
└─────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Root Directory set to `apps/web`
- [ ] Build Command set to `pnpm run build`
- [ ] Install Command set to `pnpm install`
- [ ] Output Directory set to `.next`
- [ ] Settings saved
- [ ] Redeployed
- [ ] Build succeeded
- [ ] Environment variables added
- [ ] Redeployed again
- [ ] App loads successfully
- [ ] Spotify redirect URI updated

---

**Follow these steps exactly and your deployment will succeed!** 🚀
