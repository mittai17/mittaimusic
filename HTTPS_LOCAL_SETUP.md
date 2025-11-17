# 🔐 HTTPS Local Development Setup

## Why HTTPS for Local Development?

- ✅ Test Spotify OAuth with secure redirect URIs
- ✅ Test service workers and PWA features
- ✅ Match production environment
- ✅ Test secure cookies and HTTPS-only features
- ✅ Avoid mixed content warnings

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install OpenSSL (if not installed)

#### Windows
1. Download from: https://slproweb.com/products/Win32OpenSSL.html
2. Install "Win64 OpenSSL v3.x.x Light"
3. Add to PATH: `C:\Program Files\OpenSSL-Win64\bin`

#### Mac
```bash
# Already installed, or use Homebrew
brew install openssl
```

#### Linux
```bash
sudo apt-get install openssl
```

### Step 2: Generate SSL Certificates

```bash
cd apps/web
npm run generate-cert
```

This creates:
- `.cert/localhost-key.pem` (private key)
- `.cert/localhost.pem` (certificate)

### Step 3: Run with HTTPS

```bash
npm run dev:https
```

Your app will be available at:
```
https://localhost:3000
```

---

## 🌐 Browser Setup

### First Time Access

When you visit `https://localhost:3000`, you'll see a security warning:

#### Chrome/Edge
1. Click **"Advanced"**
2. Click **"Proceed to localhost (unsafe)"**

#### Firefox
1. Click **"Advanced"**
2. Click **"Accept the Risk and Continue"**

#### Safari
1. Click **"Show Details"**
2. Click **"visit this website"**
3. Click **"Visit Website"**

**This is normal!** Self-signed certificates always show warnings.

---

## 🔧 Spotify Configuration for HTTPS

### Update Spotify Dashboard

1. Go to: https://developer.spotify.com/dashboard/40a831c8dc574f879ba48ef3f8311ca8/settings

2. Add HTTPS redirect URI:
   ```
   https://localhost:3000/api/spotify/callback
   ```

3. Keep HTTP for regular development:
   ```
   http://localhost:3000/api/spotify/callback
   ```

### Update .env.local

When using HTTPS, update your `.env.local`:

```bash
# Comment out HTTP
# NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback

# Uncomment HTTPS
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://localhost:3000/api/spotify/callback
```

**Or** just switch between them as needed!

---

## 📋 Commands Reference

```bash
# Generate SSL certificates (one time)
npm run generate-cert

# Run with HTTPS
npm run dev:https

# Run with HTTP (default)
npm run dev
```

---

## 🔄 Switching Between HTTP and HTTPS

### Use HTTP (Default)
```bash
# In apps/web
npm run dev

# .env.local
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

### Use HTTPS
```bash
# In apps/web
npm run dev:https

# .env.local
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://localhost:3000/api/spotify/callback
```

**Remember**: Update Spotify Dashboard to match!

---

## 🛠️ Troubleshooting

### Error: "OpenSSL not found"

**Windows:**
1. Install OpenSSL from https://slproweb.com/products/Win32OpenSSL.html
2. Add to PATH: `C:\Program Files\OpenSSL-Win64\bin`
3. Restart terminal

**Mac:**
```bash
brew install openssl
```

**Linux:**
```bash
sudo apt-get install openssl
```

### Error: "Certificate already exists"

Certificates are already generated! Just run:
```bash
npm run dev:https
```

### Error: "Port 3000 already in use"

Stop the regular dev server first:
```bash
# Stop npm run dev
# Then run
npm run dev:https
```

### Browser Still Shows Warning

This is normal for self-signed certificates. Click "Advanced" and proceed.

### Spotify OAuth Not Working

1. Check `.env.local` has HTTPS redirect URI
2. Check Spotify Dashboard has `https://localhost:3000/api/spotify/callback`
3. Restart dev server after changing .env.local

---

## 🔐 Certificate Details

### Location
```
apps/web/.cert/
├── localhost-key.pem  (private key)
└── localhost.pem      (certificate)
```

### Validity
- Valid for: 365 days
- Valid for: localhost only
- Self-signed (not trusted by default)

### Regenerate Certificates

If certificates expire or you need new ones:

```bash
# Delete old certificates
rm -rf apps/web/.cert

# Generate new ones
cd apps/web
npm run generate-cert
```

---

## 🌟 Advanced: Trust Certificate (Optional)

### Windows
1. Double-click `apps/web/.cert/localhost.pem`
2. Click "Install Certificate"
3. Select "Local Machine"
4. Select "Place all certificates in the following store"
5. Browse → "Trusted Root Certification Authorities"
6. Click "OK" and "Finish"

### Mac
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain apps/web/.cert/localhost.pem
```

### Linux (Ubuntu/Debian)
```bash
sudo cp apps/web/.cert/localhost.pem /usr/local/share/ca-certificates/localhost.crt
sudo update-ca-certificates
```

**After trusting**: No more browser warnings! 🎉

---

## 📊 HTTP vs HTTPS Comparison

| Feature | HTTP | HTTPS |
|---------|------|-------|
| **URL** | http://localhost:3000 | https://localhost:3000 |
| **Spotify OAuth** | ⚠️ Works but not secure | ✅ Secure |
| **Service Workers** | ❌ Limited | ✅ Full support |
| **Secure Cookies** | ❌ No | ✅ Yes |
| **Browser Warnings** | ✅ None | ⚠️ Self-signed warning |
| **Setup** | ✅ Easy | ⚠️ Requires certificates |

---

## 🎯 When to Use Each

### Use HTTP (npm run dev)
- ✅ Regular development
- ✅ Quick testing
- ✅ No Spotify OAuth needed
- ✅ Simpler setup

### Use HTTPS (npm run dev:https)
- ✅ Testing Spotify OAuth
- ✅ Testing service workers
- ✅ Testing PWA features
- ✅ Matching production environment
- ✅ Testing secure cookies

---

## 📝 Files Created

```
apps/web/
├── .cert/                    (gitignored)
│   ├── localhost-key.pem    (private key)
│   └── localhost.pem        (certificate)
├── scripts/
│   └── generate-cert.js     (certificate generator)
├── server.js                (HTTPS server)
└── package.json             (updated with scripts)
```

---

## ✅ Quick Start Checklist

- [ ] OpenSSL installed
- [ ] Certificates generated (`npm run generate-cert`)
- [ ] HTTPS server running (`npm run dev:https`)
- [ ] Browser warning bypassed
- [ ] `.env.local` updated with HTTPS redirect URI
- [ ] Spotify Dashboard updated with HTTPS redirect URI
- [ ] Spotify OAuth tested

---

## 🎉 You're Ready!

Your local development environment now supports HTTPS!

### Quick Commands

```bash
# Generate certificates (one time)
cd apps/web
npm run generate-cert

# Run with HTTPS
npm run dev:https

# Visit
https://localhost:3000
```

---

## 📞 Support

### Common Issues

**"OpenSSL not found"** → Install OpenSSL
**"Port in use"** → Stop other dev server
**"Certificate invalid"** → Regenerate certificates
**"Spotify OAuth fails"** → Check redirect URI matches

### Resources

- OpenSSL: https://www.openssl.org/
- Next.js HTTPS: https://nextjs.org/docs/api-reference/cli#development
- Spotify OAuth: https://developer.spotify.com/documentation/web-api/tutorials/code-flow

---

**Enjoy secure local development!** 🔐
