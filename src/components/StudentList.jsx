import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import StudentDetailModal from './StudentDetailModal';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ first_name: '', last_name: '', date_of_birth: '', identification_number: '' });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedStudent, setSelectedStudent] = React.useState(null);

    const fetchStudents = () => {
        setLoading(true);
        ApiServices.getStudentRegistrations()
            .then(data => {
                setStudents(data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải danh sách học viên');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await ApiServices.createStudentRegistration({
                first_name: form.first_name,
                last_name: form.last_name,
                date_of_birth: form.date_of_birth,
                identification_number: form.identification_number,
            });
            setForm({ first_name: '', last_name: '', date_of_birth: '', identification_number: '' });
            setShowForm(false);
            fetchStudents();
        } catch (err) {
            setError('Đăng ký thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto pt-8 px-4 pb-20">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 font-sans">Thông tin học viên</h1>
                <div className="flex justify-end">
                    <button
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-blue-500/25 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <span className="flex items-center gap-2">
                            <span>➕</span>
                            Đăng ký học viên
                        </span>
                    </button>
                </div>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : students.length === 0 ? (
                <div className="text-center text-gray-500 italic mb-4">Chưa có học viên</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((item, idx) => {
                        const student = item.student;
                        return (
                            <div key={student.id || idx} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                                <div className="flex items-center">
                                    <img
                                        src={student.avatar_url || '/img/default-avatar.png'}
                                        alt={student.first_name + ' ' + student.last_name}
                                        className="w-16 h-16 rounded-full mr-4 border"
                                    />
                                    <div>
                                        <div className="font-semibold text-lg">{student.first_name} {student.last_name}</div>
                                        <div className="text-sm text-gray-600">Mã học viên: {student.identification_number}</div>
                                        <div className="text-sm text-gray-600">Ngày sinh: {student.date_of_birth}</div>
                                        <div className="text-sm text-gray-600">Email: {student.email}</div>
                                        <div className="text-sm text-gray-600">Trạng thái: {student.is_active ? 'Đang học' : 'Ngừng học'}</div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button
                                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-green-500/25 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <span className="flex items-center gap-1">
                                            <span>👁️</span>
                                            Xem chi tiết
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {/* Form thêm học viên */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[500px] mx-4 relative animate-slide-up">
                        {/* Nút tắt */}
                        <button
                            className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-red-500 font-bold transition-colors duration-200"
                            onClick={() => setShowForm(false)}
                            aria-label="Đóng"
                        >
                            ×
                        </button>

                        <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">Thêm học viên mới</h3>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                                <input
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="Nhập họ"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                                <input
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="Nhập tên"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={form.date_of_birth}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã học viên</label>
                                <input
                                    name="identification_number"
                                    value={form.identification_number}
                                    onChange={handleChange}
                                    placeholder="Nhập mã học viên"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold text-lg transition-colors duration-200 mt-4"
                                disabled={submitting}
                            >
                                {submitting ? '⏳ Đang đăng ký...' : 'Đăng ký'}
                            </button>
                        </form>
                    </div>

                    {/* Hiệu ứng fade-in và slide-up */}
                    <style>{`
                        .animate-fade-in { animation: fadeIn 0.2s; }
                        .animate-slide-up { animation: slideUp 0.3s; }
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    `}</style>
                </div>
            )}
            <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        </div>
    );
} 