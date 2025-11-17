/**
 * Generate self-signed SSL certificates using Node.js (no OpenSSL required)
 * Uses the 'selfsigned' package
 */

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

// Generate certificate
try {
  const selfsigned = require('selfsigned');
  
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    keySize: 2048,
    days: 365,
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: true,
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        timeStamping: true,
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 2, // DNS
            value: 'localhost',
          },
          {
            type: 7, // IP
            ip: '127.0.0.1',
          },
        ],
      },
    ],
  });

  // Write files
  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);

  console.log('\n✅ SSL certificates generated successfully!');
  console.log(`   Key: ${keyPath}`);
  console.log(`   Cert: ${certPath}`);
  console.log('\n⚠️  Note: You may see browser warnings about self-signed certificates.');
  console.log('   This is normal for local development. Click "Advanced" and "Proceed".\n');
} catch (error) {
  console.error('\n❌ Error generating certificates:', error.message);
  process.exit(1);
}
