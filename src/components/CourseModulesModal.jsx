import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import Footer from './Footer';

export default function CourseModulesModal({ classData, onClose }) {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!classData) return;
        setLoading(true);
        setError(null);

        // Gọi API với student và class_room theo API documentation
        const params = {};
        if (classData.students && classData.students.length > 0) {
            params.student = classData.students[0].id; // Lấy học viên đầu tiên
        }
        if (classData.id) {
            params.class_room = classData.id;
        }

        console.log('Course modules API params:', params);

        // Gọi API với đúng parameters
        ApiServices.getCourseModules(params)
            .then(response => {
                console.log('Course modules API response:', response);
                setModules(response.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Course modules API error:', err);
                setError('Không thể tải danh sách khóa học');
                setLoading(false);
            });
    }, [classData]);

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
                
                {/* Header */}
                <div className="flex-shrink-0 p-6 border-b border-gray-200">
                    <h3 className="text-3xl font-bold text-gray-800 font-sans flex items-center gap-2">
                        <span role="img" aria-label="book">📚</span> 
                        {classData?.name || 'Khóa học'}
                    </h3>
                    <p className="text-gray-600 mt-2">Các học phần trong lớp học</p>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Đang tải khóa học...</span>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">
                            <div className="text-4xl mb-2">❌</div>
                            <p>{error}</p>
                        </div>
                    ) : modules.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <div className="text-4xl mb-2">📚</div>
                            <p>Chưa có học phần nào trong lớp này</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {modules.map((module, index) => (
                                <div key={module.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
                                    {/* Module Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-blue-800 mb-1 flex items-center gap-2">
                                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                                    {module.sequence_number || index + 1}
                                                </span>
                                                {module.name}
                                            </h4>
                                            {module.description && (
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {module.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Module Details */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center text-gray-600 bg-white rounded-lg p-2">
                                            <span className="text-blue-500 mr-2">📖</span>
                                            <span className="font-medium">Số bài học:</span>
                                            <span className="ml-1 font-bold text-blue-600">{module.total_lessons || 0}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-gray-600 bg-white rounded-lg p-2">
                                            <span className="text-green-500 mr-2">🏷️</span>
                                            <span className="font-medium">ID:</span>
                                            <span className="ml-1 font-bold text-green-600">#{module.id}</span>
                                        </div>
                                    </div>

                                    {/* Timestamps */}
                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <div>
                                                <span className="font-medium">Tạo:</span> {module.created_at ? new Date(module.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Cập nhật:</span> {module.updated_at ? new Date(module.updated_at).toLocaleDateString('vi-VN') : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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