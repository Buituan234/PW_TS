/**
 * Demo: In các biến môi trường từ file .env và GitHub Secrets/Vars
 * Sử dụng EnvManager có sẵn
 *
 * Chạy local: npx tsx tests/lessons/print-env.ts
 * Chạy CI: Workflow sẽ truyền secrets/vars vào env
 */

import { EnvManager } from '../utils/EnvManager.js';

console.log('==========================================');
console.log('🔐 CÁC BIẾN MÔI TRƯỜNG');
console.log('==========================================');
console.log('');

// Biến từ GitHub Secrets/Variables (CI)
console.log('🔒 TỪ GITHUB SECRETS:');
console.log('   MY_PASSWORD:', EnvManager.get('MY_PASSWORD', '(chưa set - chỉ có trên CI)'));
console.log('');

console.log('🌐 TỪ GITHUB VARIABLES:');
console.log('   MY_WEBSITE:', EnvManager.get('MY_WEBSITE', '(chưa set - chỉ có trên CI)'));
console.log('');