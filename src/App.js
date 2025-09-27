import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/route";
import { initToken } from "./services/tokenService";
import { ApiServices } from "./services/ApiServices";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await initToken();
      await ApiServices.callSessionAPI(); // Gọi API session để truyền token
      setIsLoading(false);
    };
    initializeApp();
  }, []);

  if (isLoading) {
    return <div>Đang khởi tạo ứng dụng...</div>;
  }

  return (
    <>
      <AppRoutes />
    </>
  );
}

