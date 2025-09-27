import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ApiServices } from '../services/ApiServices';
import StudentClasses from '../components/StudentClasses';
import { openWebview } from 'zmp-sdk';

const features = [
  { icon: "📄", label: "Tổng quan khóa học", path: "/courses" },
  { icon: "👨‍🎓", label: "Thông tin học viên", path: "/student-info" },
  { icon: "📅", label: "Thời khóa biểu học viên", path: "/schedule" },
  { icon: "🖼️", label: "Hình ảnh học viên", path: "/student-images" },
  { icon: "⭐", label: "Đánh giá học viên", path: "/student-evaluation" },
  { icon: "🏫", label: "Cơ sở vật chất", path: "/facilities" },
  { icon: "🧸", label: "Khóa học của bé", path: "/kid-courses" },
  { icon: "📝", label: "Điểm danh", path: "/attendance" },
  { icon: "🎓", label: "Tổng quan lớp học", path: "/class" },
  { icon: "📰", label: "Tin tức", path: "/news" },
];

export default function HomePage() {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch student registrations
        const studentsData = await ApiServices.getStudentRegistrations();
        setStudents(studentsData.data || []);

        // Fetch news for activities
        const newsData = await ApiServices.getNews();
        const news = newsData.data || [];

        // Transform news data for activities display (take first 4 items)
        const activitiesFromNews = news.slice(0, 4).map(item => ({
          img: item.image || "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
          title: item.title,
          date: new Date(item.created_at || item.date).toLocaleDateString('vi-VN'),
          id: item.id
        }));

        setActivities(activitiesFromNews);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to sample data if API fails
        setActivities([
          {
            img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
            title: "Học viên đang học lập trình Game tynker",
            date: "02/06/2025",
          },
          {
            img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
            title: "Học viên đang học lập trình Game tynker",
            date: "02/06/2025",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openUrlInWebview = async (url) => {
    try {
      await openWebview({
        url: url, // Nhận URL từ tham số truyền vào
        config: {
          style: "bottomSheet",
          leftButton: "back",
        },
      });
    } catch (error) {
      // Xử lý khi gọi API thất bại
      console.log(error);
    }
  };

  const handleOpenClassModal = () => {
    setShowClassModal(true);
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    setShowClassModal(false);
  };

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-cyan-200 to-white rounded-b-3xl shadow-md p-2">
        <div className="flex flex-col items-center">
          <img src="/logo192.png" alt="logo" className="w-12 h-12 mt-2" />
          <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 mt-1">STEAM <span className="text-yellow-400">AI</span></h1>
          <div className="text-base font-semibold text-cyan-700 mt-1">FUN <span className="text-orange-400">-</span> LEARN <span className="text-orange-400">-</span> CREATE</div>
        </div>
      </div>
      {/* Features grid */}
      <div className="grid grid-cols-4 gap-3 px-3 py-4">
        {features.map((f, idx) => (
          <Link
            key={idx}
            to={f.path}
            className="flex flex-col items-center bg-white rounded-xl shadow p-2 hover:bg-cyan-50 transition-colors duration-200"
          >
            <span className="text-3xl mb-1">{f.icon}</span>
            <span className="text-xs text-center font-medium text-gray-700 leading-tight">{f.label}</span>
          </Link>
        ))}
      </div>
      {/* Activities */}
      <div className="px-4 mt-2">
        <h2 className="text-lg font-bold mb-2 text-gray-800">Hoạt động học viên</h2>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {activities.map((a, idx) => (
              <div key={idx} className="min-w-[180px] bg-white rounded-xl shadow-md p-2 flex-shrink-0" onClick={() => {
                openUrlInWebview(a.link);
              }}>
                <img src={a.img} alt="activity" className="w-full h-24 object-cover rounded-lg mb-2" />
                <div className="text-xs font-semibold text-gray-700 mb-1">{a.title}</div>
                <div className="text-[10px] text-gray-400 text-right">{a.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Removed the "Xem lớp học" card */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[350px] mx-4 relative animate-slide-up">
            <button
              className="absolute top-3 right-3 text-2xl text-blue-500 hover:text-red-500 font-bold transition-colors duration-200"
              onClick={() => setShowClassModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-600">Chọn học viên</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {students.length === 0 ? (
                <li className="text-gray-500 italic">Chưa có học viên</li>
              ) : students.map(student => (
                <li
                  key={student.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSelectStudent(student.id)}
                >
                  <img
                    src={student.app_user?.avatar_url || '/img/default-avatar.png'}
                    alt={student.app_user?.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  <span className="font-medium">{student.app_user?.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <style>{`
            .animate-fade-in { animation: fadeIn 0.2s; }
            .animate-slide-up { animation: slideUp 0.3s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          `}</style>
        </div>
      )}
      {selectedStudentId && (
        <StudentClasses studentId={selectedStudentId} onClose={() => setSelectedStudentId(null)} />
      )}
      <Footer />
    </div>
  );
}
