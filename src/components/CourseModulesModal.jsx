import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import { formatDuration } from '../utils/formatTime';

export default function CourseModulesModal({ classData, onClose }) {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!classData) return;
        setLoading(true);

        // Gọi API với student và class_room theo API documentation
        const params = {};
        if (classData.students && classData.students.length > 0) {
            params.student = classData.students[0].id; // Lấy học viên đầu tiên
        }
        if (classData.id) {
            params.class_room = classData.id;
        }

        // Gọi API với đúng parameters
        ApiServices.getCourseModules(params)
            .then(data => {
                setModules(data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải danh sách khóa học');
                setLoading(false);
            });
    }, [classData]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[500px] mx-4 relative animate-slide-up max-h-[80vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-2xl text-blue-500 hover:text-red-500 font-bold transition-colors duration-200"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    ×
                </button>
                <h5 className="text-md font-extrabold mb-4 text-blue-600">
                   {classData?.name || 'N/A'}
                </h5>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Đang tải khóa học...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : modules.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">
                        Chưa có khóa học nào trong lớp này
                    </div>
                ) : (
                    <div className="space-y-4">
                        <label>Học phần đăng ký</label>
                        {modules.map(module => (
                            <div key={module.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 shadow-md border border-blue-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-blue-800 mb-2">
                                            <span role="img" aria-label="book">📚</span> {module.name}
                                        </h4>
                                        {module.description && (
                                            <p className="text-gray-700 text-sm mb-3">
                                                {module.description}
                                            </p>
                                        )}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {module.duration && (
                                                <div className="flex items-center text-gray-600">
                                                    <span role="img" aria-label="clock">⏱️</span>
                                                    <span className="ml-1">Thời lượng: {formatDuration(module.duration)}</span>
                                                </div>
                                            )}
                                            {module.level && (
                                                <div className="flex items-center text-gray-600">
                                                    <span role="img" aria-label="level">📊</span>
                                                    <span className="ml-1">Cấp độ: {module.level}</span>
                                                </div>
                                            )}
                                            {module.instructor && (
                                                <div className="flex items-center text-gray-600">
                                                    <span role="img" aria-label="teacher">👨‍🏫</span>
                                                    <span className="ml-1">Giảng viên: {module.instructor}</span>
                                                </div>
                                            )}
                                            {module.status && (
                                                <div className="flex items-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${module.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {module.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <style>{`
                    .animate-fade-in { animation: fadeIn 0.2s; }
                    .animate-slide-up { animation: slideUp 0.3s; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                `}</style>
            </div>
        </div>
    );
} 