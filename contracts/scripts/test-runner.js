#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting contract tests...\n');

try {
  // Run Hardhat tests
  console.log('📋 Running Hardhat tests...');
  execSync('npx hardhat test', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\n✅ All tests completed successfully!');
} catch (error) {
  console.error('\n❌ Tests failed with error:', error.message);
  process.exit(1);
}
