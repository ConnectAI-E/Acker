const fs = require('fs');
const os = require('os');

// 设置前端默认值
const frontEnv = {
  VITE_DEFAULT_PLACEHOLDER: 'Send a message to AI',
  VITE_DEFAULT_BOTTOM_TIPS: '""',
  VITE_API_HOST: 'https://api.aios.chat/v1/chat/completions',
  VITE_CACHE_TIMES: 100,
  VITE_BASE_URL: '/',
  VITE_LOGO_URL:'""',
  VITE_SUPABASE_URL: 'https://sp-key.aios.chat',
  VITE_SUPABASE_KEY: '""'
};

function getEnvString(obj) {
  let envString = '';

  for (const key in obj) {
    if (process.env[key]) {
      obj[key] = process.env[key];
    }
    envString += `${key}=${obj[key]}${os.EOL}`;
  }

  return envString;
}

const frontEnvString = getEnvString(frontEnv);

if (!fs.existsSync('.env.development')) {
  fs.writeFileSync('.env.development', frontEnvString);
}