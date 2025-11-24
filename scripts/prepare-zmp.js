const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');

// Đọc asset-manifest.json
const manifestPath = path.join(buildDir, 'asset-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ asset-manifest.json not found!');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entrypoints = manifest.entrypoints || [];

const cssFiles = entrypoints.filter(f => f.endsWith('.css'));
const jsFiles = entrypoints.filter(f => f.endsWith('.js'));

if (cssFiles.length === 0 || jsFiles.length === 0) {
  console.error('❌ No CSS or JS files found!');
  process.exit(1);
}

// Tạo app.js - Entry point cho Zalo Mini App
// Zalo Mini App KHÔNG dùng HTML files, chỉ dùng JavaScript
// app.js sẽ tạo HTML structure và load React app
const appJsContent = `// Zalo Mini App Entry Point
// ZMP sẽ load file này, sau đó nó sẽ tạo DOM và load React bundle

(function() {
  'use strict';
  
  // Đảm bảo document đã sẵn sàng
  function initApp() {
    // Đảm bảo root element tồn tại
    // Zalo Mini App sử dụng id="app" (theo tài liệu chính thức)
    // Zalo có thể đã tạo sẵn, nếu chưa thì tạo mới
    let appContainer = document.getElementById('app');
    if (!appContainer) {
      console.log('📦 [app.js] Creating #app container...');
      appContainer = document.createElement('div');
      appContainer.id = 'app';
      if (!document.body) {
        // Tạo body nếu chưa có
        const body = document.createElement('body');
        body.appendChild(appContainer);
        document.documentElement.appendChild(body);
      } else {
        document.body.appendChild(appContainer);
      }
      console.log('✅ [app.js] #app container created');
    } else {
      console.log('✅ [app.js] #app container already exists');
    }

    // Set viewport meta tag nếu chưa có
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    }

    // Set charset nếu chưa có
    if (!document.querySelector('meta[charset]')) {
      const charset = document.createElement('meta');
      charset.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charset, document.head.firstChild);
    }

    // Load Google Fonts (Montserrat)
    (function() {
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);
      
      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);
      
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    })();

    // Load CSS files trước
    ${cssFiles.map(css => `(function() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/${css}';
      document.head.appendChild(link);
    })();`).join('\n    ')}

    // Load JS files (React bundle) - load sync để đảm bảo thứ tự
    ${jsFiles.map(js => `(function() {
      const script = document.createElement('script');
      script.src = '/${js}';
      script.async = false;
      script.defer = false;
      document.body.appendChild(script);
    })();`).join('\n    ')}
  }

  // Chờ DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    // DOM đã sẵn sàng
    initApp();
  }
})();
`;

// Ghi app.js
fs.writeFileSync(path.join(buildDir, 'app.js'), appJsContent.trim());

// LƯU Ý: Không tạo pages/index.html vì ZMP CLI không upload file .html
// Zalo Mini App chỉ dùng JavaScript (app.js) để tạo DOM structure

// Cập nhật app-config.json với app.js
const configPath = path.join(buildDir, 'app-config.json');
const config = {
  app: {
    title: "STEAM AI App",
    headerTitle: "STEAM AI",
    headerColor: "#4285F4",
    textColor: "white",
    leftButton: "back",
    statusBar: "normal",
    actionBarHidden: false,
    hideAndroidBottomNavigationBar: false,
    hideIOSSafeAreaBottom: false
  },
  listCSS: cssFiles,
  // Load app.js trước để đảm bảo #app tồn tại (nếu Zalo chưa tạo)
  // Sau đó load React bundle
  listSyncJS: ['app.js', ...jsFiles],
  listAsyncJS: []
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// Cập nhật app.json
const appJsonPath = path.join(buildDir, 'app.json');
fs.writeFileSync(appJsonPath, JSON.stringify(config, null, 2));

console.log('✅ ZMP structure prepared successfully!');
console.log('📄 Created files:');
console.log('   - app.js (Entry point - tạo DOM và load React)');
console.log('   - Updated app-config.json');
console.log('   - Updated app.json');
console.log('');
console.log('⚠️  LƯU Ý: ZMP CLI không upload file .html');
console.log('   Zalo Mini App chỉ dùng JavaScript (app.js)');
console.log('');
console.log('📦 CSS files:', cssFiles);
console.log('📦 JS files:', jsFiles);
console.log('');
console.log('🚀 Ready to deploy: zmp deploy --dir=build');

