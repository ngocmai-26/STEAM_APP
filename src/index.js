import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store';
import App from './App';
import './index.css';

// Gọi initToken và callSessionAPI ngay khi app khởi động


// Ensure you're using React 18's createRoot
// Zalo Mini App sử dụng root element có id là "app" (theo tài liệu chính thức)
// Zalo đã tự tạo <div id="app"></div> trong DOM, không cần tạo thêm

function initReactApp() {
  console.log('🚀 [initReactApp] Starting React app initialization...');
  console.log('🔍 [initReactApp] Document readyState:', document.readyState);
  console.log('🔍 [initReactApp] Looking for #app or #root...');
  
  const container = document.getElementById('app') || document.getElementById('root');
  
  if (!container) {
    console.error('❌ Root container not found! Expected #app or #root');
    console.log('🔍 Available elements:', {
      app: document.getElementById('app'),
      root: document.getElementById('root'),
      body: document.body,
      html: document.documentElement
    });
    // Retry sau 100ms
    setTimeout(initReactApp, 100);
    return;
  }

  console.log('✅ [initReactApp] Container found:', container.id);
  console.log('🔍 [initReactApp] Container has children:', container.hasChildNodes());

  // Clear container trước khi mount (tránh conflict với Zalo's DOM)
  if (container.hasChildNodes()) {
    console.log('🧹 [initReactApp] Clearing container...');
    container.innerHTML = '';
  }

  console.log('🎨 [initReactApp] Creating React root...');
  const root = createRoot(container);

  // Lấy basename cho router (theo tài liệu Zalo: /zapps/[APP_ID])
  // Trong Zalo Mini App, pathname sẽ có dạng /zapps/[APP_ID]/...
  // Trong development, basename sẽ là "/"
  const getBasename = () => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      // Kiểm tra nếu đang chạy trong Zalo Mini App
      if (pathname.startsWith('/zapps/')) {
        const match = pathname.match(/^\/zapps\/[^/]+/);
        return match ? match[0] : '/';
      }
    }
    return '/';
  };

  const basename = getBasename();
  console.log('🌐 [initReactApp] Router basename:', basename);
  console.log('🌐 [initReactApp] Current pathname:', window.location.pathname);
  
  console.log('🎬 [initReactApp] Rendering React app...');
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
  
  console.log('✅ [initReactApp] React app rendered successfully!');
}

// Đợi DOM sẵn sàng trước khi mount React
// Zalo có thể cần thời gian để tạo DOM structure
console.log('⏳ [index.js] Waiting for DOM...');
console.log('⏳ [index.js] Document readyState:', document.readyState);

if (document.readyState === 'loading') {
  console.log('⏳ [index.js] DOM is loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ [index.js] DOMContentLoaded fired');
    setTimeout(initReactApp, 100); // Đợi thêm 100ms để Zalo hoàn tất
  });
} else {
  console.log('✅ [index.js] DOM already ready, initializing app...');
  // DOM đã sẵn sàng, nhưng đợi một chút để Zalo hoàn tất
  setTimeout(initReactApp, 200);
}
