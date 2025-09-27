import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-cyan-100 border-t flex justify-around items-center h-14 z-50">
      <Link to="/" className="flex flex-col items-center text-cyan-900 focus:outline-none">
        <span className="text-2xl">🏠</span>
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/schedule" className="flex flex-col items-center text-cyan-900 focus:outline-none">
        <span className="text-2xl">🔔</span>
        <span className="text-xs">Lịch học</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-cyan-900 focus:outline-none">
        <span className="text-2xl">👤</span>
        <span className="text-xs">Tài khoản</span>
      </Link>
    </footer>
  );
};

export default Footer; 