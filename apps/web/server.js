const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = true; // Always dev mode for local HTTPS
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Path to SSL certificates
const certDir = path.join(__dirname, '.cert');
const keyPath = path.join(certDir, 'localhost-key.pem');
const certPath = path.join(certDir, 'localhost.pem');

// Check if certificates exist
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('❌ SSL certificates not found!');
  console.error('   Run: npm run generate-cert');
  process.exit(1);
}

console.log('🔐 Starting HTTPS server...\n');

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl).catch((err) => {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    });
  })
    .once('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`✅ HTTPS server ready!\n`);
      console.log(`   🔗 Local:    https://${hostname}:${port}`);
      console.log(`   🌐 Network:  https://your-ip:${port}\n`);
      console.log(`⚠️  Browser warning is normal for self-signed certificates.`);
      console.log(`   Click "Advanced" → "Proceed to localhost (unsafe)"\n`);
    });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
