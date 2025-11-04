#!/usr/bin/env node

/**
 * Generate self-signed certificates for HTTPS development
 * Run: node generate-certs.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const certPath = path.join(__dirname, 'cert.crt');
const keyPath = path.join(__dirname, 'cert.key');

try {
  console.log('🔐 Generating self-signed certificates...');

  // Use OpenSSL to generate a proper self-signed certificate
  // Valid for 365 days, with localhost and IP addresses as SANs
  const command = `openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=State/L=City/O=StudyBuddi/CN=localhost" -addext "subjectAltName=DNS:localhost,DNS:127.0.0.1,IP:127.0.0.1,IP:10.21.145.177"`;

  execSync(command, { stdio: 'pipe' });

  console.log('✅ Certificates generated successfully!');
  console.log(`📄 Certificate: ${certPath}`);
  console.log(`🔑 Private Key: ${keyPath}`);
  console.log('\n📝 To use HTTPS, run:');
  console.log('   npm run dev:https:win  (Windows)');
  console.log('   npm run dev:https      (macOS/Linux)');
  console.log('\n⚠️  You may see a browser warning about untrusted certificate.');
  console.log('    Click "Advanced" and "Proceed anyway" to continue.');

} catch (err) {
  console.error('❌ Error generating certificates:', err.message);
  console.error('\nMake sure OpenSSL is installed:');
  console.error('  Windows: Install from https://slproweb.com/products/Win32OpenSSL.html');
  console.error('  macOS: brew install openssl');
  console.error('  Linux: sudo apt-get install openssl');
  process.exit(1);
}
