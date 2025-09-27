import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import CourseModulesModal from './CourseModulesModal';

export default function StudentClasses({ studentId, onClose }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showCourseModules, setShowCourseModules] = useState(false);

    useEffect(() => {
        if (!studentId) return;
        setLoading(true);
        ApiServices.getClassesByStudent(studentId)
            .then(data => {
                setClasses(data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải danh sách lớp học');
                setLoading(false);
            });
    }, [studentId]);

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setShowCourseModules(true);
    };

    const handleCloseCourseModules = () => {
        setShowCourseModules(false);
        setSelectedClass(null);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] mx-4 relative animate-slide-up">
                    <button
                        className="absolute top-3 right-3 text-2xl text-blue-500 hover:text-red-500 font-bold transition-colors duration-200"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                    <h3 className="text-2xl font-extrabold mb-4 text-blue-600">Danh sách lớp học</h3>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Đang tải...</span>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : classes.length === 0 ? (
                        <div className="text-gray-500 italic text-center py-8">Chưa có lớp học</div>
                    ) : (
                        <ul className="space-y-3">
                            {classes.map(cls => (
                                <li 
                                    key={cls.id} 
                                    className="bg-blue-50 rounded-lg p-3 shadow flex flex-col cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                    onClick={() => handleClassClick(cls)}
                                >
                                    <span className="font-semibold text-lg text-blue-700">
                                        <span role="img" aria-label="class">🎓</span> Lớp #{cls.id}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        <span role="img" aria-label="teacher">👩‍🏫</span> Giáo viên: {cls.teacher?.name}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        <span role="img" aria-label="email">📧</span> Email: {cls.teacher?.email}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        <span role="img" aria-label="phone">📞</span> SĐT: {cls.teacher?.phone}
                                    </span>
                                    <div className="mt-2 text-xs text-blue-600 font-medium">
                                        <span role="img" aria-label="click">👆</span> Click để xem khóa học
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <style>{`
                        .animate-fade-in { animation: fadeIn 0.2s; }
                        .animate-slide-up { animation: slideUp 0.3s; }
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    `}</style>
                </div>
            </div>
            
            {showCourseModules && selectedClass && (
                <CourseModulesModal
                    classId={selectedClass.id}
                    className={`#${selectedClass.id}`}
                    onClose={handleCloseCourseModules}
                />
            )}
        </>
    );
} 