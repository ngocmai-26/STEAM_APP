import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import Footer from '../components/Footer';
import CourseModulesModal from '../components/CourseModulesModal';

export default function ClassOverviewPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        ApiServices.getAllStudents()
            .then(studentsData => {
                setStudents(studentsData);
                // Tự động chọn học viên đầu tiên nếu có
                if (studentsData && studentsData.length > 0) {
                    setSelectedStudent(studentsData[0].id);
                }
            })
            .catch(() => setStudents([]));
    }, []);

    useEffect(() => {
        if (!selectedStudent) return;

        setLoading(true);
        setError(null);

        // Lấy các lớp học của học viên được chọn
        ApiServices.getClassesByStudent(selectedStudent)
            .then(res => {
                setClasses(res.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải danh sách lớp học của học viên');
                setLoading(false);
            });
    }, [selectedStudent]);

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedClass(null);
    };

    return (
        <div className="flex flex-col items-center min-h-screen pt-8 pb-24">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 font-sans">Tổng quan lớp học</h1>
            <div className="w-full max-w-2xl px-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 gap-4">
                        <div>

                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                                value={selectedStudent}
                                onChange={e => setSelectedStudent(e.target.value)}
                            >
                                <option value="" className="text-gray-500 font-medium text-base">🎯 Chọn học viên</option>
                                {students.map(stu => (
                                    <option key={stu.id} value={stu.id} className="text-gray-700 font-medium py-1 text-base">
                                        {stu.first_name} {stu.last_name} ({stu.identification_number})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Đang tải danh sách lớp học...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : classes.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">Chưa có lớp học nào</div>
                ) : (
                    <div className="space-y-6">
                        {classes.map(cls => (
                            <div
                                key={cls.id}
                                className="bg-white rounded-2xl shadow-lg p-6 transition transform hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-transparent hover:border-blue-400"
                                onClick={() => handleClassClick(cls)}
                            >
                                {/* Header với tên lớp */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">

                                        <div>
                                            <h5 className="font-bold  text-blue-800">{cls.name}</h5>
                                        </div>
                                    </div>

                                </div>

                                {/* Thông tin cơ bản */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-blue-700 text-sm uppercase tracking-wide">📚 Thông tin khóa học</h4>

                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Số học viên tối đa:</span> {cls.max_students || 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Ngày bắt đầu:</span> {cls.start_date ? new Date(cls.start_date).toLocaleDateString('vi-VN') : 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Ngày kết thúc:</span> {cls.end_date ? new Date(cls.end_date).toLocaleDateString('vi-VN') : 'N/A'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-700 text-sm uppercase tracking-wide">👨‍🏫 Giáo viên</h4>
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">Tên:</span> {cls.teacher?.name || 'N/A'}
                                        </div>

                                    </div>
                                </div>

                                {/* Lịch học */}
                                {cls.schedule && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-green-700 text-sm uppercase tracking-wide mb-2">📅 Lịch học</h4>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            {Object.entries(cls.schedule).map(([day, time]) => (
                                                <div key={day} className="text-sm text-gray-700">
                                                    <span className="font-medium capitalize">{day}:</span> {time}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CourseModulesModal */}
            {showModal && selectedClass && (
                <CourseModulesModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    classData={selectedClass}
                />
            )}

            <Footer />
        </div>
    );
} 