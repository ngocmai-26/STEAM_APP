// tokenService.js
import { getAccessToken } from 'zmp-sdk';

// Mock getAccessToken nếu chưa có (phát triển local ngoài Zalo Mini App)
if (typeof window !== 'undefined' && typeof window.getAccessToken === 'undefined') {
  window.getAccessToken = ({ success, fail }) => {
    // Chuỗi token giả lập hợp lệ
    setTimeout(() => success('mocked-access-token-demo-1234567890'), 200);
  };
}

let accessToken = null;

export const initToken = async () => {
  console.log('🚀 [tokenService] Starting token initialization...');
  try {
    accessToken = await new Promise((resolve, reject) => {
      console.log('📞 [tokenService] Calling getAccessToken...');
      getAccessToken({
        success: (token) => {
          console.log('✅ [tokenService] Token received successfully:', token);
          resolve(token);
        },
        fail: (error) => {
          console.error('❌ [tokenService] Failed to get access token:', error);
          reject(error);
        }
      });
    });
    console.log('🎉 [tokenService] Token initialization completed. Token:', accessToken);
  } catch (error) {
    console.error('💥 [tokenService] Failed to initialize access token:', error);
  }
};

export const getToken = () => {
  console.log('🔍 [tokenService] Getting token:', accessToken);
  return "h3N-6kuOPLojCV8SxXffNQawynxX3MyFfIUNBfvEMogD29HfdbXsIwOobqdWR7vEy0MpNRH_B47y3D9judiTUgCZmK2eS2XUY2NDPBjRA66E9lSkcNfWFfuiWIQjVNOQxGQoMFbLKKI-TSng-HybBF5PqZB73aKBWqYl7h0NQmQdLAG-cIX86hbceoQdBrapfqQVAQyhUJYAU9nyp5HTKymEWbVsNsX7w33mLTSQ2sdGHyvespKkCzDKnNVE3WbYyqB2MkmfMaVwGRfuw01PREj6jNte9qWxpbIW8_S2Up6oMkHmZ7e7KPvGwcwLEovGhH7FLxrGJ6QXVOvrgZ9PEhD4n0MwA0r1cNZxUB0NPsUYRuThXaHpVg07WcAZK7HLkNtY48KCAnIXGEi0iJes4vCNq5AeEXHfQN4PhdRf0c9V";
};

export const setToken = (token) => {
  console.log('🔧 [tokenService] Setting token:', token);
  accessToken = token;
};

export const clearToken = () => {
  console.log('🧹 [tokenService] Clearing token');
  accessToken = null;
}; 