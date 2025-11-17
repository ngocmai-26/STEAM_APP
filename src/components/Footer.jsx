import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Toast from "./Toast";

const Footer = () => {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  const navItems = [
    { path: "/", icon: "🏠", label: "Home", color: "from-blue-500 to-blue-600" },
    { path: "/notifications", icon: "🔔", label: "Thông báo", color: "from-green-500 to-green-600", isDeveloping: true },
    { path: "/profile", icon: "👤", label: "Tài khoản", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg flex items-center h-20 z-50 pb-safe">
      <div className="flex w-full justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const handleClick = (e) => {
            if (item.isDeveloping) {
              e.preventDefault();
              setShowToast(true);
            }
          };
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center flex-1 mx-1 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 relative ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              } ${item.isDeveloping ? "opacity-75" : ""}`}
            >
              <span className={`text-xl mb-1 transition-all duration-300 ${
                isActive ? "animate-bounce" : "hover:animate-pulse"
              }`}>
                {item.icon}
              </span>
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? "text-white font-bold" : "text-gray-600"
              }`}>
                {item.label}
              </span>
              {item.isDeveloping && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] px-1 rounded-full">
                  Sắp ra mắt
                </span>
              )}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              )}
            </Link>
          );
        })}
      </div>
      {showToast && (
        <Toast
          message="Tính năng này đang được phát triển. Vui lòng quay lại sau!"
          type="warning"
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </footer>
  );
};

export default Footer; 