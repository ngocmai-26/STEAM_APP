import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store';
import App from './App';
import './index.css';
import { initToken } from './services/tokenService';
import { ApiServices } from './services/ApiServices';

// Gọi initToken và callSessionAPI ngay khi app khởi động


// Ensure you're using React 18's createRoot
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
