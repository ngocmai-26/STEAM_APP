import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import Footer from '../components/Footer';

export default function AttendancePage() {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [filter, setFilter] = useState({ student: '', class_room: '' });

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
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        // Gọi API với filter
        let url = '/attendances';
        const params = [];
        if (filter.student) params.push(`student=${filter.student}`);
        if (filter.class_room) params.push(`class_room=${filter.class_room}`);
        if (params.length > 0) url += `?${params.join('&')}`;
        ApiServices.callAPI(url)
            .then(res => {
                console.log('🔍 [AttendancePage] API Response:', res);
                console.log('🔍 [AttendancePage] Attendances data:', res.data);
                setAttendances(res.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải dữ liệu điểm danh');
                setLoading(false);
            });
    }, [filter]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-pink-50 pt-8 pb-24">
            <div className="flex-1 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 font-sans">Điểm danh</h1>
                {/* Bộ lọc */}
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : attendances.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-8">Chưa có dữ liệu điểm danh</div>
                ) : (
                    <div className="w-full max-w-3xl space-y-6">
                        {attendances.map((item, idx) => {
                            console.log('🔍 [AttendancePage] Item:', item);
                            console.log('🔍 [AttendancePage] Item.class_room:', item.class_room);
                            console.log('🔍 [AttendancePage] Item.module:', item.module);
                            console.log('🔍 [AttendancePage] Item.lesson:', item.lesson);
                            return (
                            <div key={item.id || idx} className="bg-white rounded-2xl shadow p-5">
                                <div className="font-bold text-lg text-blue-800 mb-2">
                                    {item.lesson ? `Bài ${item.lesson.sequence_number} - ${item.lesson.name}` : `Bài ${item.sequence_number || 'N/A'} - ${item.name || 'N/A'}`}
                                </div>
                                <div className="text-sm text-gray-700 mb-1">
                                    Lớp: {(() => {
                                        // Thử nhiều cách để lấy tên lớp
                                        if (item.class_room_name) return item.class_room_name;
                                        if (item.class_room?.name) return item.class_room.name;
                                        if (item.class_room?.teacher?.name) return `${item.class_room.name} - ${item.class_room.teacher.name}`;
                                        if (item.lesson?.class_room?.name) return item.lesson.class_room.name;
                                        if (item.lesson?.class_room?.teacher?.name) return `${item.lesson.class_room.name} - ${item.lesson.class_room.teacher.name}`;
                                        // Thử lấy từ filter nếu có
                                        if (filter.class_room && classes.length > 0) {
                                            const selectedClass = classes.find(c => c.id == filter.class_room);
                                            if (selectedClass) return selectedClass.name;
                                        }
                                        if (item.class_room_id) return `Lớp ID: ${item.class_room_id}`;
                                        return 'N/A';
                                    })()}
                                </div>
                                <div className="text-sm text-gray-700 mb-1">
                                    Module: {(() => {
                                        // Thử nhiều cách để lấy tên module
                                        if (item.module_name) return item.module_name;
                                        if (item.module?.name) return item.module.name;
                                        if (item.lesson?.module?.name) return item.lesson.module.name;
                                        if (item.module_id) return `${item.module_id}`;
                                        if (item.lesson?.module) return `${item.lesson.module}`;
                                        return 'N/A';
                                    })()}
                                </div>
                                <div className="text-sm text-gray-700 mb-1">
                                    Ngày tạo: {item.lesson?.created_at ? new Date(item.lesson.created_at).toLocaleString() : item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                                </div>
                                <div className="text-sm mb-1">
                                    <span className="text-gray-700">Trạng thái: </span>
                                    <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                                        (() => {
                                            switch(item.status) {
                                                case 'present': return 'bg-green-100 text-green-800';
                                                case 'absent': return 'bg-red-100 text-red-800';
                                                case 'late': return 'bg-yellow-100 text-yellow-800';
                                                case 'excused': return 'bg-blue-100 text-blue-800';
                                                default: return 'bg-gray-100 text-gray-800';
                                            }
                                        })()
                                    }`}>
                                        {(() => {
                                            switch(item.status) {
                                                case 'present': return 'Có mặt';
                                                case 'absent': return 'Vắng mặt';
                                                case 'late': return 'Đi trễ';
                                                case 'excused': return 'Vắng có phép';
                                                default: return item.status || 'N/A';
                                            }
                                        })()}
                                    </span>
                                </div>
                                {/* Hiển thị thêm các trường khác nếu cần */}
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
} 