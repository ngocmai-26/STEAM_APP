import { useState, useEffect } from 'react';
import { initToken, getToken } from '../services/tokenService';
import { ApiServices } from '../services/ApiServices';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔐 [useAuth] Hook initialized, starting authentication...');
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 [useAuth] Setting loading state...');
        setIsLoading(true);
        setError(null);

        console.log('🔄 [useAuth] Step 1: Initializing token...');
        // Khởi tạo token
        await initToken();
        const token = getToken();
        console.log('🔑 [useAuth] Token after initialization:', token);

        if (token) {
          console.log('🔄 [useAuth] Step 2: Token available, calling session API...');
          // Gọi API session
          const session = await ApiServices.callSessionAPI();
          console.log('✅ [useAuth] Session API successful:', session);
          setSessionData(session);
          setIsAuthenticated(true);
          console.log('✅ [useAuth] Authentication successful!');
        } else {
          console.log('❌ [useAuth] No token available, authentication failed');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('💥 [useAuth] Authentication initialization failed:', err);
        console.error('💥 [useAuth] Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        setError(err.message);
        setIsAuthenticated(false);
      } finally {
        console.log('🏁 [useAuth] Setting loading to false');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshSession = async () => {
    console.log('🔄 [useAuth] Refreshing session...');
    try {
      setError(null);
      const session = await ApiServices.callSessionAPI();
      console.log('✅ [useAuth] Session refresh successful:', session);
      setSessionData(session);
      setIsAuthenticated(true);
      return session;
    } catch (err) {
      console.error('💥 [useAuth] Session refresh failed:', err);
      setError(err.message);
      setIsAuthenticated(false);
      throw err;
    }
  };

  console.log('📊 [useAuth] Current state:', {
    isAuthenticated,
    isLoading,
    hasSessionData: !!sessionData,
    hasError: !!error
  });

  return {
    isAuthenticated,
    isLoading,
    sessionData,
    error,
    refreshSession,
  };
}; 