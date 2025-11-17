# 🔐 HTTPS Local Development - Quick Start

## 3 Steps to HTTPS

### Step 1: Generate Certificates
```bash
cd apps/web
npm run generate-cert
```

### Step 2: Run HTTPS Server
```bash
npm run dev:https
```

### Step 3: Visit Your App
```
https://localhost:3000
```

Click "Advanced" → "Proceed to localhost" when you see the security warning.

---

## 🎯 For Spotify OAuth

### Update Spotify Dashboard

Add this redirect URI:
```
https://localhost:3000/api/spotify/callback
```

Go to: https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings

### Update .env.local

Change this line:
```bash
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://localhost:3000/api/spotify/callback
```

---

## 📋 Commands

```bash
# HTTP (default)
npm run dev
→ http://localhost:3000

# HTTPS (secure)
npm run dev:https
→ https://localhost:3000

# Generate certificates
npm run generate-cert
```

---

## ⚠️ Browser Warning

The security warning is **normal** for self-signed certificates.

**Chrome/Edge**: Advanced → Proceed to localhost
**Firefox**: Advanced → Accept the Risk
**Safari**: Show Details → Visit Website

---

## 🔄 Switch Between HTTP/HTTPS

### Use HTTP
```bash
npm run dev
# .env.local: http://localhost:3000/api/spotify/callback
```

### Use HTTPS
```bash
npm run dev:https
# .env.local: https://localhost:3000/api/spotify/callback
```

---

## 🐛 Troubleshooting

**"OpenSSL not found"**
- Windows: Install from https://slproweb.com/products/Win32OpenSSL.html
- Mac: `brew install openssl`
- Linux: `sudo apt-get install openssl`

**"Port already in use"**
- Stop the other dev server first

**"Spotify OAuth fails"**
- Check redirect URI in Spotify Dashboard
- Check .env.local matches (http vs https)
- Restart dev server

---

**Need detailed help?** Check `HTTPS_LOCAL_SETUP.md`

**Ready to start?** Run `npm run generate-cert` now! 🚀
