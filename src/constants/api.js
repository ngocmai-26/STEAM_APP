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
      accessToken = "skr1AytERdpRwKqjpSnYVT_YJ2_2smKTgVrNI_JQEXsv-L8Kzui2AeMb80h6_0eZeOv14l3u3IMVWrbmxwOxKFBSG5cae1HVzDuvSQUh5cJXn3LMl99YIEtmAdYuba8frz0kVAJgV6lMjYqwdlOF1Cks8IpUbt4RcFHV7zwB7KonwsPOqfSwT9NI4cVqhq99lliTSUlUG2-ff1uwsSfrBQg57YlhvZq6gBbj9lJc9I_flWzn-F15OEIU7NEFrcudcfO1BOhiImETbXuKxyiyExgDO0_FtIuzdezO0jJzC3EafruUnVuHCAYDSIJAt3ibrgL2D87VQYBrXGGKeDjf0UUX2LIY_sH0zQfFThxr1s7Fi2vgk9z0NQZnQ57rqmPiXuDwG9AiEH7W_1eHbeLH1u3b2135Yq07jzqR9oGN6cVAr6b_"

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
            resolve("skr1AytERdpRwKqjpSnYVT_YJ2_2smKTgVrNI_JQEXsv-L8Kzui2AeMb80h6_0eZeOv14l3u3IMVWrbmxwOxKFBSG5cae1HVzDuvSQUh5cJXn3LMl99YIEtmAdYuba8frz0kVAJgV6lMjYqwdlOF1Cks8IpUbt4RcFHV7zwB7KonwsPOqfSwT9NI4cVqhq99lliTSUlUG2-ff1uwsSfrBQg57YlhvZq6gBbj9lJc9I_flWzn-F15OEIU7NEFrcudcfO1BOhiImETbXuKxyiyExgDO0_FtIuzdezO0jJzC3EafruUnVuHCAYDSIJAt3ibrgL2D87VQYBrXGGKeDjf0UUX2LIY_sH0zQfFThxr1s7Fi2vgk9z0NQZnQ57rqmPiXuDwG9AiEH7W_1eHbeLH1u3b2135Yq07jzqR9oGN6cVAr6b_"
);
          }
        });
      });
    }
    
    console.log('🎉 [initToken] Token initialized:', accessToken ? 'Success' : 'Failed');
    return accessToken;
  } catch (error) {
    console.error('💥 [initToken] Failed to initialize access token:', error);
    // Fallback token for development
    accessToken = "skr1AytERdpRwKqjpSnYVT_YJ2_2smKTgVrNI_JQEXsv-L8Kzui2AeMb80h6_0eZeOv14l3u3IMVWrbmxwOxKFBSG5cae1HVzDuvSQUh5cJXn3LMl99YIEtmAdYuba8frz0kVAJgV6lMjYqwdlOF1Cks8IpUbt4RcFHV7zwB7KonwsPOqfSwT9NI4cVqhq99lliTSUlUG2-ff1uwsSfrBQg57YlhvZq6gBbj9lJc9I_flWzn-F15OEIU7NEFrcudcfO1BOhiImETbXuKxyiyExgDO0_FtIuzdezO0jJzC3EafruUnVuHCAYDSIJAt3ibrgL2D87VQYBrXGGKeDjf0UUX2LIY_sH0zQfFThxr1s7Fi2vgk9z0NQZnQ57rqmPiXuDwG9AiEH7W_1eHbeLH1u3b2135Yq07jzqR9oGN6cVAr6b_"

    console.log('🔄 [initToken] Using fallback token');
    return accessToken;
  }
};

export const getToken = () => {
  console.log('🔍 [getToken] Current token:', accessToken ? 'Available' : 'Missing');
  return accessToken;
};

