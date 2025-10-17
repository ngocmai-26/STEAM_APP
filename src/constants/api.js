// API Constants
import { getAccessToken } from "zmp-sdk";

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
    const accessToken = await new Promise((resolve, reject) => {
      getAccessToken({
        success: (token) => {
          resolve(token)
        },
        fail: (error) => reject(error),
      });
    });

    return accessToken;  

  } catch (error) {
 
    return null; 
  }
};


// tokenService.js
let accessToken = null;

export const initToken = async () => {
  try {
    console.log('🔄 [initToken] Starting token initialization...');
    
    // Check if we're in development environment
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    console.log('🛠️ [initToken] Environment:', isDevelopment ? 'Development' : 'Production');
    
    if (isDevelopment) {
      console.log('🛠️ [initToken] Development environment, using mock token');
      accessToken = "xNjXNrwTqr7iVsrPNf_VKEXqR5jHYAHHk0eI3dIzprEp8nqwS9QlCDqePbOqZTSYWJ1WJ5cmjK6E5WKRVwFRKOqc6LzydgyulNndTapeqG2BO146OT_V3uWyR5DStue2cqz13IwlyLBxDKC85QxoHDqZ91CEm-vasbGuAXN1qdcXU1SBK-JVRv5b4Y92_S0fYMK0LLc1orcHPWOmHeFYEQiZDp1HjELlvZTKPogYdHV40Lrj1xtgOjHVBsaS_CKuttiNJYtFsW6VKMnTRVUkLzbSOIGeoQTvdduH3t3-er2qQsy9KikkGxTI4KbdyFueqKeZMWZy-rtEH2a63Ft4OE1aCna6zTuVjHPjIqsBg3Yb4tP5I8-PAhaCLqPyZuy9fX1_0KohdWQe5bDQNfJj2Ear8bjTbUiIRas0qeS-MOVKKW"
      console.log('✅ [initToken] Mock token set');
    } else {
      console.log('🚀 [initToken] Production environment, using real Zalo SDK');
      accessToken = await new Promise((resolve, reject) => {
        getAccessToken({
          success: (token) => {
            console.log('✅ [initToken] Real token received');
            resolve(token);
          },
          fail: (error) => {
            console.log('⚠️ [initToken] Real token failed, using fallback');
            resolve("xNjXNrwTqr7iVsrPNf_VKEXqR5jHYAHHk0eI3dIzprEp8nqwS9QlCDqePbOqZTSYWJ1WJ5cmjK6E5WKRVwFRKOqc6LzydgyulNndTapeqG2BO146OT_V3uWyR5DStue2cqz13IwlyLBxDKC85QxoHDqZ91CEm-vasbGuAXN1qdcXU1SBK-JVRv5b4Y92_S0fYMK0LLc1orcHPWOmHeFYEQiZDp1HjELlvZTKPogYdHV40Lrj1xtgOjHVBsaS_CKuttiNJYtFsW6VKMnTRVUkLzbSOIGeoQTvdduH3t3-er2qQsy9KikkGxTI4KbdyFueqKeZMWZy-rtEH2a63Ft4OE1aCna6zTuVjHPjIqsBg3Yb4tP5I8-PAhaCLqPyZuy9fX1_0KohdWQe5bDQNfJj2Ear8bjTbUiIRas0qeS-MOVKKW");
          }
        });
      });
    }
    
    console.log('🎉 [initToken] Token initialized:', accessToken ? 'Success' : 'Failed');
    return accessToken;
  } catch (error) {
    console.error('💥 [initToken] Failed to initialize access token:', error);
    // Fallback token for development
    accessToken = "xNjXNrwTqr7iVsrPNf_VKEXqR5jHYAHHk0eI3dIzprEp8nqwS9QlCDqePbOqZTSYWJ1WJ5cmjK6E5WKRVwFRKOqc6LzydgyulNndTapeqG2BO146OT_V3uWyR5DStue2cqz13IwlyLBxDKC85QxoHDqZ91CEm-vasbGuAXN1qdcXU1SBK-JVRv5b4Y92_S0fYMK0LLc1orcHPWOmHeFYEQiZDp1HjELlvZTKPogYdHV40Lrj1xtgOjHVBsaS_CKuttiNJYtFsW6VKMnTRVUkLzbSOIGeoQTvdduH3t3-er2qQsy9KikkGxTI4KbdyFueqKeZMWZy-rtEH2a63Ft4OE1aCna6zTuVjHPjIqsBg3Yb4tP5I8-PAhaCLqPyZuy9fX1_0KohdWQe5bDQNfJj2Ear8bjTbUiIRas0qeS-MOVKKW"
    console.log('🔄 [initToken] Using fallback token');
    return accessToken;
  }
};

export const getToken = () => {
  console.log('🔍 [getToken] Current token:', accessToken ? 'Available' : 'Missing');
  return accessToken;
};

