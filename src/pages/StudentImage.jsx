import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import Footer from '../components/Footer';

function ImageModal({ images, currentIdx, onClose }) {
    const [idx, setIdx] = useState(currentIdx || 0);
    useEffect(() => { setIdx(currentIdx || 0); }, [currentIdx]);
    if (!images || images.length === 0) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-2 md:p-6 max-w-lg w-full flex flex-col items-center relative animate-slide-up">
                <button className="absolute top-3 right-3 bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center text-xl text-gray-500 hover:text-red-500 shadow transition" onClick={onClose} aria-label="Đóng">×</button>
                <div className="flex items-center justify-center w-full">
                    <button
                        className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-2xl text-blue-600 shadow hover:bg-blue-100 transition disabled:opacity-40 mr-2"
                        onClick={() => setIdx(i => Math.max(0, i - 1))}
                        disabled={idx === 0}
                        aria-label="Trước"
                    >&#8592;</button>
                    <img
                        src={images[idx]}
                        alt="Hình học viên phóng to"
                        className="w-full max-w-[400px] max-h-[60vh] object-contain rounded-2xl border-4 border-white shadow-xl bg-white"
                    />
                    <button
                        className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-2xl text-blue-600 shadow hover:bg-blue-100 transition disabled:opacity-40 ml-2"
                        onClick={() => setIdx(i => Math.min(images.length - 1, i + 1))}
                        disabled={idx === images.length - 1}
                        aria-label="Sau"
                    >&#8594;</button>
                </div>
                <div className="text-xs text-gray-600 mt-2 mb-1">Ảnh {idx + 1}/{images.length}</div>
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

export default function StudentImage() {
    const [galleries, setGalleries] = useState([]);
    const [lessonMap, setLessonMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false, images: [], idx: 0 });
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [filter, setFilter] = useState({ student: '', class_room: '' });

    // Fetch students and classes for filter
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

    // Fetch galleries with filter
    useEffect(() => {
        setLoading(true);
        setError(null);
        const params = {};
        if (filter.student) params.student = filter.student;
        if (filter.class_room) params.class_room = filter.class_room;

        ApiServices.getLessonGalleries(params)
            .then(async data => {
                const galleries = data.data || [];
                setGalleries(galleries);
                const lessonIds = Array.from(new Set(galleries.map(g => g.lesson).filter(Boolean)));
                const lessonMap = {};
                await Promise.all(lessonIds.map(async (id) => {
                    try {
                        const res = await ApiServices.getLessonById(id);
                        if (res.data && res.data.length > 0) {
                            lessonMap[id] = res.data[0];
                        }
                    } catch { }
                }));
                setLessonMap(lessonMap);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải hình ảnh học viên');
                setLoading(false);
            });
    }, [filter]);

    return (
        <div className="min-h-screen flex flex-col pt-8">
            <div className="flex-1 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 font-sans">
                    Hình ảnh học viên
                </h1>

                {/* Bộ lọc student và class_room */}
                <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 mb-8 bg-white rounded-lg shadow-md p-4">
                    <div className="flex-1">
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
                    <div className="flex-1">
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
                {/* Danh sách ảnh */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4"></div>
                        <span className="text-lg text-gray-600 font-semibold">Đang tải hình ảnh...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-4xl mb-2">⚠️</span>
                        <div className="text-red-500 text-lg font-bold">{error}</div>
                    </div>
                ) : galleries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-5xl mb-2">🖼️</span>
                        <div className="text-gray-500 italic text-lg">Chưa có hình ảnh nào</div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-start gap-8 px-2 md:px-0 mb-5">
                        {galleries.map((gallery, idx) => {
                            const lesson = lessonMap[gallery.lesson];
                            const images = gallery.image_urls || [];
                            if (images.length === 0) return null;
                            return (
                                <div key={gallery.id || idx} className="w-full max-w-3xl mx-auto">
                                    {/* Header bài học với background đẹp */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl p-4 border-l-4 border-blue-500 mb-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">📚</span>
                                                <h3 className="font-bold text-blue-700 text-lg">{lesson ? `${lesson.name}` : 'Không rõ buổi học'}</h3>
                                            </div>
                                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {images.length} ảnh
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid ảnh với style đẹp */}
                                    <div className="flex gap-6">
                                        {images.slice(0, 3).map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={lesson ? lesson.name : 'Hình học viên'}
                                                className="w-32 h-32 object-cover rounded-xl bg-gray-200 shadow hover:scale-105 transition cursor-pointer border border-gray-200"
                                                onClick={() => setModal({ open: true, images, idx: i })}
                                            />
                                        ))}
                                    </div>

                                    {/* Button xem tất cả ảnh */}
                                    {images.length > 3 && (
                                        <div className="text-center mb-6">
                                            <button
                                                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium shadow-lg border border-gray-200"
                                                onClick={() => setModal({ open: true, images, idx: 0 })}
                                            >
                                                👁️ Xem tất cả {images.length} ảnh
                                            </button>
                                        </div>
                                    )}

                                    {/* Ngăn cách giữa các bài học */}
                                    {idx < galleries.length - 1 && (
                                        <div className="w-full border-t-2 border-gray-200 my-8"></div>
                                    )}
                                </div>
                            );
                        })}
                        {modal.open && (
                            <ImageModal
                                images={modal.images}
                                currentIdx={modal.idx}
                                onClose={() => setModal({ open: false, images: [], idx: 0 })}
                            />
                        )}
                    </div>

                )}
            </div>
            <Footer />
        </div>
    );
}
