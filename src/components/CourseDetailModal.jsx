import React from 'react';
import Footer from './Footer';
import { formatPriceVND } from '../utils/formatPrice';
import { formatDuration } from '../utils/formatTime';
import { getImageUrl } from '../utils/imageUtils';

export default function CourseDetailModal({ course, onClose }) {
    if (!course) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-[420px] mx-4 relative border-t-8 border-blue-400 animate-slide-up flex flex-col max-h-[85vh] mb-20">
                <button
                    className="absolute top-4 right-4 text-3xl text-blue-500 hover:text-red-500 font-bold transition-colors duration-200 z-10"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    ×
                </button>
                
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <h3 className="text-3xl font-bold mb-4 text-gray-800 font-sans flex items-center gap-2">
                        <span role="img" aria-label="book">📘</span> {course.name}
                    </h3>
                    {course.thumbnail_url && (
                        <img
                            src={getImageUrl(course.thumbnail_url)}
                            alt={course.name}
                            className="w-full h-48 object-cover rounded-lg mb-5 border border-blue-100 shadow"
                        />
                    )}
                    <div className="mb-4 text-gray-700 text-lg">
                        <span className="font-bold text-gray-800 font-sans">Mô tả:</span> {course.description || <span className="italic text-gray-400">Chưa có mô tả</span>}
                    </div>
                    <div className="flex flex-col gap-2 mb-3 text-xl">
                        <div><span className="font-bold text-blue-500">⏱ Thời lượng:</span> {formatDuration(course.duration)}</div>
                        <div><span className="font-bold text-green-600">💸 Giá:</span> {formatPriceVND(course.price)}</div>
                        <div><span className="font-bold text-purple-500">📅 Trạng thái:</span> {course.is_active ? 'Đang mở' : 'Đã đóng'}</div>
                    </div>
                </div>

                {/* Fixed footer */}
                <div className="flex-shrink-0 border-t border-gray-200">
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