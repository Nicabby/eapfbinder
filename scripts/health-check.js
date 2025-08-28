#!/usr/bin/env node

import http from 'http';
import https from 'https';
import { parse as parseUrl } from 'url';

const testUrls = [
  'http://localhost:3000',
  'http://localhost:3000/sections/orientation',
  'http://localhost:3000/sections/leadership',
  'http://localhost:3000/sections/communication',
  'http://localhost:3000/data/course.json',
  'http://localhost:3000/manifest.json'
];

async function testUrl(testUrl) {
  return new Promise((resolve) => {
    const urlObj = parseUrl(testUrl);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.path,
      method: 'HEAD',
      timeout: 5000
    }, (res) => {
      resolve({
        url: testUrl,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url: testUrl,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: testUrl,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

async function runHealthCheck() {
  console.log('🔍 EAP Facilitator Binder - Health Check');
  console.log('==========================================');
  
  const results = [];
  
  for (const testUrl of testUrls) {
    const result = await testUrl(testUrl);
    results.push(result);
    
    const statusIcon = result.success ? '✅' : '❌';
    console.log(`${statusIcon} ${result.url} - ${result.status}${result.error ? ` (${result.error})` : ''}`);
  }
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All health checks passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some health checks failed.');
    process.exit(1);
  }
}

runHealthCheck().catch(console.error);