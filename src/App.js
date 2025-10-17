import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/route";
import { initToken, getToken } from "./constants/api";
import { ApiServices } from "./services/ApiServices";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Khởi tạo token trước
        await initToken();
        
        // Kiểm tra token có sẵn không
        const token = getToken();
        
        if (token) {
          await ApiServices.callSessionAPI();
        } else {
          console.warn('No token available, skipping session API');
        }
      } catch (error) {
        console.error('App initialization failed:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang khởi tạo ứng dụng...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
    </>
  );
}

