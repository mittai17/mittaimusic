const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, '..', '.cert');

// Create .cert directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

const keyPath = path.join(certDir, 'localhost-key.pem');
const certPath = path.join(certDir, 'localhost.pem');

// Check if certificates already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ SSL certificates already exist!');
  console.log(`   Key: ${keyPath}`);
  console.log(`   Cert: ${certPath}`);
  process.exit(0);
}

console.log('🔐 Generating SSL certificates for localhost...\n');

try {
  // Generate self-signed certificate using OpenSSL
  const command = `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost" -keyout "${keyPath}" -out "${certPath}" -days 365`;
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ SSL certificates generated successfully!');
  console.log(`   Key: ${keyPath}`);
  console.log(`   Cert: ${certPath}`);
  console.log('\n⚠️  Note: You may see browser warnings about self-signed certificates.');
  console.log('   This is normal for local development. Click "Advanced" and "Proceed".\n');
} catch (error) {
  console.error('\n❌ Error generating certificates.');
  console.error('   Make sure OpenSSL is installed on your system.\n');
  console.error('Windows: Download from https://slproweb.com/products/Win32OpenSSL.html');
  console.error('Mac: Already installed or use: brew install openssl');
  console.error('Linux: sudo apt-get install openssl\n');
  process.exit(1);
}
