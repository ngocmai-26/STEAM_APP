const path = require('path');
const fs = require('fs');

// Đọc asset-manifest.json để lấy tên file thực tế
function getBuildAssets() {
  const manifestPath = path.resolve(__dirname, 'build/asset-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.warn('⚠️  asset-manifest.json not found. Make sure you have run "npm run build" first.');
    return {
      css: [],
      js: []
    };
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entrypoints = manifest.entrypoints || [];
  
  const css = entrypoints.filter(file => file.endsWith('.css'));
  const js = entrypoints.filter(file => file.endsWith('.js'));
  
  return { css, js };
}

const assets = getBuildAssets();

module.exports = {
  app: {
    name: 'steam_ai_app',
    version: '1.0.0',
    description: 'STEAM AI App - React App for Zalo Mini App',
  },
  
  // Đường dẫn đến thư mục build của React
  publicDir: path.resolve(__dirname, 'build'),
  
  // Cấu hình assets - sử dụng file thực tế từ build
  assets: {
    listCSS: assets.css,
    listSyncJS: assets.js,
    listAsyncJS: []
  },
  
  // LƯU Ý: Zalo Mini App không dùng HTML files
  // app.js sẽ tự tạo DOM structure
  // Không cần cấu hình pages vì ZMP sẽ tự động load app.js từ listSyncJS
};

