// API Constants
// Sử dụng getAccessToken từ zmp-sdk/apis (theo tài liệu chính thức)
import { getAccessToken } from "zmp-sdk/apis";

export const API_BASE_URL = 'https://stem.bdu.edu.vn/steam/apis/app';

export const API_ENDPOINTS = {
  SESSION: '/auth/session',
  // Thêm các endpoint khác ở đây khi cần
};

export const API_HEADERS = {
  'Content-Type': 'application/json',
};

export const API_KEY_NAME = "auth_token";
export const AUTH_KEY_NAME = "auth_info";

export const fetchAccessToken = async () => {
  try {
    // Theo tài liệu: getAccessToken() trả về Promise<string>
    const accessToken = await getAccessToken();
    return accessToken;
  } catch (error) {
    console.error('❌ [fetchAccessToken] Failed to get access token:', error);
    return null; 
  }
};


// tokenService.js
let accessToken = null;

export const initToken = async () => {
  try {
    console.log('🔄 [initToken] Starting token initialization...');
    
    // Theo tài liệu: getAccessToken() trả về Promise<string>
    // Từ SDK 2.35.0, mặc định có quyền truy xuất access tokens
    // Không cần mock data, chỉ dùng token thật từ Zalo SDK
    accessToken = await getAccessToken();
    console.log('✅ [initToken] Token received from Zalo SDK');
    
    console.log('🎉 [initToken] Token initialized:', accessToken ? 'Success' : 'Failed');
    return accessToken;
  } catch (error) {
    console.error('💥 [initToken] Failed to initialize access token:', error);
    accessToken = null;
    return null;
  }
};

export const getToken = () => {
  console.log('🔍 [getToken] Current token:', accessToken ? 'Available' : 'Missing');
  return accessToken;
};

