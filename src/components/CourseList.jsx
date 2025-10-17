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
        console.log('CourseList: Starting to fetch courses...');
        ApiServices.getCourses()
            .then(response => {
                console.log('CourseList: API response:', response);
                console.log('CourseList: Courses data:', response.data);
                setCourses(response.data || []); // Sửa ở đây để lấy đúng mảng khóa học
                setLoading(false);
            })
            .catch(err => {
                console.error('CourseList: API error:', err);
                setError('Không thể tải danh sách khóa học');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="px-4 max-w-4xl mx-auto pb-20 pt-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-sans">Các khóa học</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Đang tải danh sách khóa học...</span>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="px-4 max-w-4xl mx-auto pb-20 pt-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-sans">Các khóa học</h2>
                <div className="text-center text-red-500 py-8">
                    <div className="text-4xl mb-2">❌</div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 max-w-4xl mx-auto pb-20 pt-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-sans">Các khóa học</h2>
            {courses.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📚</div>
                    <p>Chưa có khóa học nào</p>
                </div>
            ) : (
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
            )}
            {selectedCourse && (
                <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
            )}
        </div>
    );
} 