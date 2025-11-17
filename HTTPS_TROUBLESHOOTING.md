# 🔧 HTTPS Troubleshooting Guide

## Error: ERR_SSL_PROTOCOL_ERROR

### Quick Fix

1. **Make sure the HTTPS server is running:**
   ```bash
   cd apps/web
   npm run dev:https
   ```

2. **Wait for "HTTPS server ready!" message**

3. **Then visit:** `https://localhost:3000`

### Common Causes

#### 1. Server Not Running
**Symptom**: Browser shows ERR_SSL_PROTOCOL_ERROR immediately

**Solution**: Start the HTTPS server
```bash
cd apps/web
npm run dev:https
```

#### 2. Wrong Port
**Symptom**: Connection refused or protocol error

**Solution**: Make sure you're using port 3000
```
https://localhost:3000
```

#### 3. Using HTTP Instead of HTTPS
**Symptom**: Protocol error or redirect loop

**Solution**: Use HTTPS URL
```
❌ http://localhost:3000
✅ https://localhost:3000
```

#### 4. Certificates Not Generated
**Symptom**: Server fails to start with "SSL certificates not found"

**Solution**: Generate certificates
```bash
cd apps/web
npm run generate-cert
npm run dev:https
```

#### 5. Regular Dev Server Running
**Symptom**: HTTP works but HTTPS doesn't

**Solution**: Stop regular dev server first
```bash
# Stop npm run dev (Ctrl+C)
# Then start HTTPS
npm run dev:https
```

---

## Step-by-Step Debugging

### Step 1: Check Certificates Exist
```bash
cd apps/web
dir .cert
```

You should see:
- `localhost-key.pem`
- `localhost.pem`

If not, run:
```bash
npm run generate-cert
```

### Step 2: Start HTTPS Server
```bash
npm run dev:https
```

Wait for this message:
```
✅ HTTPS server ready!
   🔗 Local:    https://localhost:3000
```

### Step 3: Visit in Browser
```
https://localhost:3000
```

### Step 4: Accept Certificate Warning
- Click **"Advanced"**
- Click **"Proceed to localhost (unsafe)"**

---

## Browser-Specific Issues

### Chrome/Edge
**Error**: "Your connection is not private"

**Solution**:
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

**Alternative**: Type `thisisunsafe` on the error page (no input box needed)

### Firefox
**Error**: "Warning: Potential Security Risk Ahead"

**Solution**:
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

### Safari
**Error**: "This Connection Is Not Private"

**Solution**:
1. Click "Show Details"
2. Click "visit this website"
3. Click "Visit Website"

---

## Port Already in Use

### Error Message
```
Error: listen EADDRINUSE: address already in use :::3000
```

### Solution 1: Stop Other Server
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Solution 2: Use Different Port
```bash
# Set PORT environment variable
$env:PORT=3001
npm run dev:https
```

Then visit: `https://localhost:3001`

---

## Certificate Issues

### Regenerate Certificates
```bash
cd apps/web

# Delete old certificates
Remove-Item -Recurse -Force .cert

# Generate new ones
npm run generate-cert

# Start server
npm run dev:https
```

### Check Certificate Validity
```bash
# View certificate details
Get-Content .cert\localhost.pem
```

Should start with:
```
-----BEGIN CERTIFICATE-----
```

---

## Still Not Working?

### Try HTTP Instead
If HTTPS is causing issues, use regular HTTP:

```bash
npm run dev
```

Visit: `http://localhost:3000`

**Note**: Spotify OAuth will still work with HTTP for localhost!

### Check Console Logs
Look for errors in the terminal where you ran `npm run dev:https`

Common errors:
- "Cannot find module" → Run `pnpm install`
- "Port in use" → Stop other servers
- "Certificate not found" → Run `npm run generate-cert`

---

## Quick Commands Reference

```bash
# Generate certificates
npm run generate-cert

# Start HTTPS server
npm run dev:https

# Start HTTP server (fallback)
npm run dev

# Check if certificates exist
dir .cert

# Regenerate certificates
Remove-Item -Recurse -Force .cert
npm run generate-cert
```

---

## When to Use HTTP vs HTTPS

### Use HTTP (npm run dev)
- ✅ Regular development
- ✅ Quick testing
- ✅ Simpler (no certificate warnings)
- ✅ Spotify OAuth works fine

### Use HTTPS (npm run dev:https)
- ✅ Testing service workers
- ✅ Testing PWA features
- ✅ Testing secure cookies
- ✅ Matching production environment

**For most development, HTTP is fine!**

---

## Need More Help?

1. Check `HTTPS_QUICK_START.md` for basic setup
2. Check `HTTPS_LOCAL_SETUP.md` for detailed guide
3. Try using HTTP instead: `npm run dev`

---

**Remember**: The certificate warning is normal for self-signed certificates. Just click "Advanced" and proceed! 🔐
