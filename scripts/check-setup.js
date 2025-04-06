const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Try to get chalk, but if it's not installed, create a simple replacement
let log;
try {
  log = {
    info: (text) => console.log(chalk.blue(text)),
    success: (text) => console.log(chalk.green(text)),
    warning: (text) => console.log(chalk.yellow(text)),
    error: (text) => console.log(chalk.red(text)),
  };
} catch (e) {
  // Fallback without chalk
  log = {
    info: (text) => console.log(`INFO: ${text}`),
    success: (text) => console.log(`SUCCESS: ${text}`),
    warning: (text) => console.log(`WARNING: ${text}`),
    error: (text) => console.log(`ERROR: ${text}`),
  };
}

// Check if .env file exists
function checkEnvFile() {
  log.info('Checking for .env file...');
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    log.error('.env file not found! Please create one in the root directory.');
    log.info('Example .env file:');
    log.info('GEMINI_API_KEY=your_api_key_here');
    log.info('HIGH_PULSE_THRESHOLD=120');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('GEMINI_API_KEY=')) {
    log.error('GEMINI_API_KEY not found in .env file!');
    return false;
  }
  
  log.success('.env file found with API key!');
  return true;
}

// Check if required packages are installed
function checkPackages() {
  log.info('Checking required packages...');
  const requiredPackages = [
    'react-native',
    'react-native-config', 
    'react-native-geolocation-service',
    '@react-navigation/native',
    '@react-navigation/stack',
    '@google/generative-ai',
    'react-native-root-toast'
  ];
  
  let allInstalled = true;
  
  requiredPackages.forEach(pkg => {
    try {
      require.resolve(pkg);
      log.success(`✓ ${pkg} is installed`);
    } catch (e) {
      log.error(`✗ ${pkg} is not installed. Run: npm install ${pkg}`);
      allInstalled = false;
    }
  });
  
  return allInstalled;
}

// Main function
function checkSetup() {
  log.info('Checking Women\'s Safety App setup...');
  console.log('='.repeat(50));
  
  const envOk = checkEnvFile();
  const packagesOk = checkPackages();
  
  console.log('='.repeat(50));
  
  if (envOk && packagesOk) {
    log.success('Setup looks good! You should be able to run the app.');
    log.info('To start the app, run:');
    log.info('  npm start');
    log.info('Then in another terminal:');
    log.info('  npm run android');
    log.info('  or');
    log.info('  npm run ios');
    return true;
  } else {
    log.error('Setup has issues. Please fix them before running the app.');
    return false;
  }
}

// Run the check
const setupOk = checkSetup();
process.exit(setupOk ? 0 : 1); 