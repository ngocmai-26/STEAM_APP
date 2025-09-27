import React from 'react';
import Footer from './Footer';
import { formatPriceVND } from '../utils/formatPrice';
import { formatDuration } from '../utils/formatTime';

export default function CourseDetailModal({ course, onClose }) {
    if (!course) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 px-8 w-[420px] mx-4 relative border-t-8 border-blue-400 animate-slide-up flex flex-col">
                <button
                    className="absolute top-4 right-4 text-3xl text-blue-500 hover:text-red-500 font-bold transition-colors duration-200"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    ×
                </button>
                <h3 className="text-3xl font-extrabold mb-4 text-blue-600 flex items-center gap-2">
                    <span role="img" aria-label="book">📘</span> {course.name}
                </h3>
                {course.thumbnail_url && (
                    <img
                        src={course.thumbnail_url}
                        alt={course.name}
                        className="w-full h-48 object-cover rounded-lg mb-5 border border-blue-100 shadow"
                    />
                )}
                <div className="mb-4 text-gray-700 text-lg">
                    <span className="font-semibold">Mô tả:</span> {course.description || <span className="italic text-gray-400">Chưa có mô tả</span>}
                </div>
                <div className="flex flex-col gap-2 mb-3 text-xl">
                    <div><span className="font-semibold text-blue-500">⏱ Thời lượng:</span> {formatDuration(course.duration)}</div>
                    <div><span className="font-semibold text-green-600">💸 Giá:</span> {formatPriceVND(course.price)}</div>
                    <div><span className="font-semibold text-purple-500">📅 Trạng thái:</span> {course.is_active ? 'Đang mở' : 'Đã đóng'}</div>
                </div>

                <div className="mt-auto">
                    <Footer />
                </div>
            </div>
            {/* Hiệu ứng fade-in và slide-up */}
            <style>{`
        .animate-fade-in { animation: fadeIn 0.2s; }
        .animate-slide-up { animation: slideUp 0.3s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
} 