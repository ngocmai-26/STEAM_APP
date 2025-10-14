import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: "🏠", label: "Home", color: "from-blue-500 to-blue-600" },
    { path: "/schedule", icon: "🔔", label: "Lịch học", color: "from-green-500 to-green-600" },
    { path: "/profile", icon: "👤", label: "Tài khoản", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg flex items-center h-20 z-50 pb-safe">
      <div className="flex w-full justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 mx-1 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
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
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              )}
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer; 