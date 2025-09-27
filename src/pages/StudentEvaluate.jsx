import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import Footer from '../components/Footer';

export default function StudentEvaluate() {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Filter state
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [modules, setModules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [filter, setFilter] = useState({ student: '', class_room: '', module: '', lesson: '' });
    const [showAllMap, setShowAllMap] = useState({});
    const [modalEvaluation, setModalEvaluation] = useState(null);

    // Load filter options
    useEffect(() => {
        ApiServices.getAllStudents()
            .then(studentsData => {
                setStudents(studentsData);
                // Tự động chọn học viên đầu tiên nếu có
                if (studentsData && studentsData.length > 0) {
                    setFilter(prev => ({ ...prev, student: studentsData[0].id }));
                }
            })
            .catch(() => setStudents([]));

        ApiServices.getAllClasses()
            .then(res => {
                const classesData = res.data || [];
                setClasses(classesData);
                // Tự động chọn lớp đầu tiên nếu có
                if (classesData && classesData.length > 0) {
                    setFilter(prev => ({ ...prev, class_room: classesData[0].id }));
                }
            })
            .catch(() => setClasses([]));

        ApiServices.getCourses().then(res => setModules(res.data || [])).catch(() => setModules([]));
        ApiServices.getCourseModules && ApiServices.getCourseModules().then(res => setLessons(res.data || [])).catch(() => setLessons([]));
    }, []);

    // Load evaluations
    useEffect(() => {
        setLoading(true);
        setError(null);
        ApiServices.getLessonEvaluations({
            student: filter.student || undefined,
            class_room: filter.class_room || undefined,
            module: filter.module || undefined,
            lesson: filter.lesson || undefined,
        })
            .then(res => {
                setEvaluations(res.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải đánh giá học viên');
                setLoading(false);
            });
    }, [filter]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-pink-50 pt-8">
            <div className="flex-1 flex flex-col items-center">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-8 drop-shadow">Đánh giá học viên</h1>
                {/* Filter */}
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            
                        
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                                value={filter.student}
                                onChange={e => setFilter(f => ({ ...f, student: e.target.value }))}
                                aria-label="Học viên"
                            >
                                <option value="" className="text-gray-500 font-medium text-base">🎯 Tất cả học viên</option>
                                {students.map(stu => (
                                    <option key={stu.id} value={stu.id} className="text-gray-700 font-medium py-1 text-base">
                                        {stu.first_name} {stu.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                        
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                                value={filter.class_room}
                                onChange={e => setFilter(f => ({ ...f, class_room: e.target.value }))}
                                aria-label="Lớp học"
                            >
                                <option value="" className="text-gray-500 font-medium text-base">🎓 Tất cả lớp học</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id} className="text-gray-700 font-medium py-1 text-base">
                                        {cls.teacher?.name ? ` ${cls.teacher.name}` : `${cls.name}`}
                                    </option>
                                ))}
                            </select>
                        </div>


                        
                    </div>
                </div>
                {/* Danh sách đánh giá */}
                <div className="w-full max-w-4xl">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Đang tải đánh giá...</span>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : evaluations.length === 0 ? (
                        <div className="text-gray-500 italic text-center py-8">Chưa có đánh giá nào</div>
                    ) : (
                        <div className="space-y-6">
                            {evaluations.map(ev => {
                                const scoreEntries = ev.semantic_scores ? Object.entries(ev.semantic_scores) : [];
                                const mainScores = scoreEntries.slice(0, 3);
                                const extraScores = scoreEntries.slice(3);
                                return (
                                    <div key={ev.id} className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
                                        <div className="flex flex-wrap gap-4 items-center mb-2">
                                            <div className="font-bold text-blue-700 text-lg flex-1">
                                                {ev.lesson ? `Bài ${ev.lesson.sequence_number} - ${ev.lesson.name}` : 'Buổi học ?'}
                                            </div>
                                            <div className="text-sm text-gray-500">Lớp: {ev.class_room_name}</div>
                                            <div className="text-sm text-gray-500">Học phần: {ev.module_name}</div>
                                        </div>
                                        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2`}>
                                            {mainScores.map(([key, score]) => (
                                                <div key={key} className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                                                    <span className="font-semibold text-blue-800">{score.name}</span>
                                                    <span className="text-sm text-blue-700 text-center mt-1">{score.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {extraScores.length > 0 && (
                                            <div className="flex justify-center mt-3">
                                                <button
                                                    className="px-4 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 text-sm font-semibold"
                                                    onClick={() => setModalEvaluation(ev)}
                                                >Xem chi tiết</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {modalEvaluation && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
                                    <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full flex flex-col items-center relative animate-slide-up border border-blue-200">
                                        {/* Close button, always visible, larger and more prominent */}
                                        <button
                                            className="absolute top-2 right-2 text-3xl text-blue-600 hover:text-red-500 font-bold transition z-10 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            onClick={() => setModalEvaluation(null)}
                                            aria-label="Đóng"
                                            tabIndex={0}
                                        >×</button>
                                        {/* Modal content with scroll if overflow */}
                                        <div className="w-full flex flex-col items-center px-6 pt-6 pb-4 max-h-[70vh] overflow-y-auto">
                                            <div className="font-bold text-blue-700 text-lg mb-2 text-center">
                                                {modalEvaluation.lesson ? `Bài ${modalEvaluation.lesson.sequence_number} - ${modalEvaluation.lesson.name}` : 'Buổi học ?'}
                                            </div>
                                            <div className="text-sm text-gray-500 mb-4 text-center">Lớp: {modalEvaluation.class_room_name} | Học phần: {modalEvaluation.module_name}</div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                                {modalEvaluation.semantic_scores && Object.entries(modalEvaluation.semantic_scores).map(([key, score]) => (
                                                    <div key={key} className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                                                        <span className="font-semibold text-blue-800">{score.name}</span>
                                                        <span className="text-sm text-blue-700 text-center mt-1">{score.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <style>{`
                                        .animate-fade-in { animation: fadeIn 0.2s; }
                                        .animate-slide-up { animation: slideUp 0.3s; }
                                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                                        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                                    `}</style>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

