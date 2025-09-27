import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiServices } from '../services/ApiServices';
import Footer from '../components/Footer';
import { formatDuration } from '../utils/formatTime';

export default function ClassDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classInfo, setClassInfo] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingModules, setLoadingModules] = useState(true);
    const [errorModules, setErrorModules] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        ApiServices.getAllClasses()
            .then(data => {
                const found = (data.data || []).find(cls => String(cls.id) === String(id));
                setClassInfo(found || null);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải thông tin lớp học');
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        setLoadingModules(true);
        setErrorModules(null);
        ApiServices.getCourseModules(id)
            .then(data => {
                setModules(data.data || []);
                setLoadingModules(false);
            })
            .catch(() => {
                setErrorModules('Không thể tải danh sách học phần');
                setLoadingModules(false);
            });
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col pt-6">
            <div className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <button
                        className="mb-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded shadow transition"
                        onClick={() => navigate('/class')}
                    >
                        ← Quay lại
                    </button>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Đang tải thông tin lớp...</span>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8">{error}</div>
                    ) : !classInfo ? (
                        <div className="text-gray-500 italic text-center py-8">Không tìm thấy lớp học</div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-extrabold text-blue-700 mb-2">Lớp #{classInfo.id}</h1>
                            <div className="mb-2 text-gray-700 font-medium">Giáo viên: {classInfo.teacher?.name}</div>
                            <div className="mb-2 text-gray-700">Email: {classInfo.teacher?.email}</div>
                            <div className="mb-2 text-gray-700">SĐT: {classInfo.teacher?.phone}</div>
                        </>
                    )}
                </div>
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-bold text-indigo-700 mb-4">Học phần của lớp #{id}</h2>
                    {loadingModules ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            <span className="ml-3 text-gray-600">Đang tải học phần...</span>
                        </div>
                    ) : errorModules ? (
                        <div className="text-red-500 text-center py-8">{errorModules}</div>
                    ) : modules.length === 0 ? (
                        <div className="text-gray-500 italic text-center py-8">Lớp này chưa có học phần nào</div>
                    ) : (
                        <div className="space-y-4">
                            {modules.map(module => (
                                <div key={module.id} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 shadow border border-blue-100">
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
                </div>
            </div>
            <Footer />
        </div>
    );
} 