import React from 'react';

export default function StudentDetailModal({ student, onClose }) {
    if (!student) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] mx-4 relative animate-slide-up">
                <button
                    className="absolute top-4 right-4 text-3xl text-blue-500 hover:text-red-500 font-bold transition-colors duration-200"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    ×
                </button>
                <h3 className="text-xl font-extrabold mb-4 text-blue-600 flex items-center gap-2">
                    <span role="img" aria-label="student"></span> Thông tin chi tiết học viên
                </h3>
                <div className="flex flex-col items-center mb-4">
                    <img
                        src={student.avatar_url || '/img/default-avatar.png'}
                        alt={student.first_name + ' ' + student.last_name}
                        className="w-24 h-24 rounded-full border mb-2"
                    />
                    <div className="font-bold text-lg">{student.first_name} {student.last_name}</div>
                </div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Mã học viên:</span> {student.identification_number}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Ngày sinh:</span> {student.date_of_birth}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Giới tính:</span> {student.gender}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Email:</span> {student.email}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Địa chỉ:</span> {student.address}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Phụ huynh:</span> {student.parent_name}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Email phụ huynh:</span> {student.parent_email}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">SĐT phụ huynh:</span> {student.parent_phone}</div>
                <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Trạng thái:</span> {student.is_active ? 'Đang học' : 'Ngừng học'}</div>
                {student.note && (
                    <div className="mb-2 text-gray-700 text-base"><span className="font-semibold">Ghi chú:</span> {student.note}</div>
                )}
            </div>
            <style>{`
        .animate-fade-in { animation: fadeIn 0.2s; }
        .animate-slide-up { animation: slideUp 0.3s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
} 