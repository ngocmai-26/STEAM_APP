import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import CourseDetailModal from './CourseDetailModal';
import { formatPriceVND } from '../utils/formatPrice';
import { formatDuration } from '../utils/formatTime';

export default function CourseList() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        ApiServices.getCourses()
            .then(data => {
                setCourses(data.data); // Sửa ở đây để lấy đúng mảng khóa học
                setLoading(false);
            })
            .catch(err => {
                setError('Không thể tải danh sách khóa học');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Đang tải danh sách khóa học...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="px-4 max-w-4xl mx-auto pb-20">
            <h2 className="text-center text-2xl font-bold my-4">Các khóa học</h2>
            <div>
                {courses.map((course, idx) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedCourse(course)}
                    >
                        {course.thumbnail_url && (
                            <img src={course.thumbnail_url} alt={course.name} className="w-20 h-20 object-cover rounded mr-4" />
                        )}
                        <div className="flex-1">
                            <div className="font-bold text-lg">{course.name}</div>
                            <div className="text-sm text-gray-700 line-clamp-2">
                                {course.description && course.description.length > 100
                                    ? `${course.description.substring(0, 100)}...`
                                    : course.description}
                                {course.description && course.description.length > 100 && (
                                    <span className="text-blue-500 ml-2 cursor-pointer hover:underline">
                                        xem chi tiết
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Thời lượng: {formatDuration(course.duration)}</div>
                            <div className="text-xs text-gray-500">Giá: {formatPriceVND(course.price)}</div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedCourse && (
                <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
            )}
        </div>
    );
} 