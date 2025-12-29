import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ApiServices } from '../services/ApiServices';
import StudentClasses from '../components/StudentClasses';
import { openWebview } from 'zmp-sdk';
import { getImageUrl } from '../utils/imageUtils';
import steamAILogo from '../img/logo.png';

const features = [
  { icon: "📄", label: "Tổng quan khóa học", path: "/courses", gradient: "from-blue-400 to-blue-600", hoverGradient: "from-blue-500 to-blue-700" },
  { icon: "👨‍🎓", label: "Thông tin học viên", path: "/student-info", gradient: "from-green-400 to-green-600", hoverGradient: "from-green-500 to-green-700" },
  { icon: "📅", label: "Thời khóa biểu học viên", path: "/schedule", gradient: "from-purple-400 to-purple-600", hoverGradient: "from-purple-500 to-purple-700" },
  { icon: "🖼️", label: "Hình ảnh học viên", path: "/student-images", gradient: "from-pink-400 to-pink-600", hoverGradient: "from-pink-500 to-pink-700" },
  { icon: "⭐", label: "Đánh giá học viên", path: "/student-evaluation", gradient: "from-yellow-400 to-orange-500", hoverGradient: "from-yellow-500 to-orange-600" },
  { icon: "🏫", label: "Cơ sở vật chất", path: "/facilities", gradient: "from-indigo-400 to-indigo-600", hoverGradient: "from-indigo-500 to-indigo-700" },
  { icon: "📝", label: "Điểm danh", path: "/attendance", gradient: "from-red-400 to-red-600", hoverGradient: "from-red-500 to-red-700" },
  { icon: "🎓", label: "Tổng quan lớp học", path: "/class", gradient: "from-cyan-400 to-cyan-600", hoverGradient: "from-cyan-500 to-cyan-700" },
  { icon: "📰", label: "Tin tức", path: "/news", gradient: "from-emerald-400 to-emerald-600", hoverGradient: "from-emerald-500 to-emerald-700" },
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
        const activitiesFromNews = news.slice(0, 4).map(item => {
          // Thử convert URL, nhưng nếu không convert được thì dùng URL gốc như code web
          let imageUrl = item.image;
          if (item.image && item.image.includes('drive.google.com')) {
            const converted = getImageUrl(item.image, null);
            // Nếu convert thành công và khác URL gốc, dùng converted
            // Nếu convert trả về null hoặc giống URL gốc, dùng URL gốc
            if (converted && converted !== item.image) {
              imageUrl = converted;
            } else {
              // Dùng URL gốc như code web
              imageUrl = item.image;
            }
          }
          console.log('🖼️ [HomePage] Original image URL:', item.image);
          console.log('🖼️ [HomePage] Final image URL:', imageUrl);
          return {
            image: imageUrl,
            title: item.title,
            date: new Date(item.created_at || item.date).toLocaleDateString('vi-VN'),
            link: item.link,
            id: item.id
          };
        });

        setActivities(activitiesFromNews);
      } catch (error) {
        console.error('Error fetching data:', error);
        setActivities([]); // Không dùng mock data
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

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    setShowClassModal(false);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-400 rounded-b-3xl shadow-lg p-2 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300 rounded-full blur-3xl opacity-40"></div>
        
        <div className="flex flex-col items-center relative z-10">
          {/* STEAM AI Logo */}
          <div className="mt-2 mb-2">
            <img 
              src={steamAILogo} 
              alt="STEAM AI Logo" 
              className=" h-32 w-full object-contain drop-shadow-lg"
              onError={(e) => {
                // Fallback nếu không tìm thấy logo
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            {/* Fallback text nếu logo không load được */}
           
          </div>
          
          
        </div>
      </div>
      {/* Features grid */}
      <div className="grid grid-cols-3 gap-3 px-3 py-4">
        {features.map((f, idx) => (
          <Link
            key={idx}
            to={f.path}
            className={`group flex flex-col items-center bg-gradient-to-br ${f.gradient} rounded-2xl shadow-lg hover:shadow-xl p-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 relative overflow-hidden`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Icon with bounce effect */}
            <span className="text-3xl mb-2 group-hover:animate-bounce transition-all duration-300 relative z-10">{f.icon}</span>
            
            {/* Text with better styling */}
            <span className="text-xs text-center font-semibold text-white leading-tight relative z-10 drop-shadow-sm">
              {f.label}
            </span>
            
            {/* Subtle glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${f.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
          </Link>
        ))}
      </div>
      {/* Activities */}
      <div className="px-4 mt-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 font-sans flex items-center gap-2">
          <span className="text-xl">📰</span>
          Hoạt động học viên
        </h3>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-5 w-3 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {activities.map((a, idx) => (
              <div key={a.id || idx} className="max-w-full min-w-full h-72 bg-white rounded-xl shadow-md p-2 flex-shrink-0 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
                if (a.link) {
                  openUrlInWebview(a.link);
                }
              }}>
                {a.image ? (
                  <div className="w-full h-48 rounded-lg mb-2 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    <img 
                      src={a.image} 
                      alt={a.title || "activity"} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ [HomePage] Image failed to load:', e.target.src);
                        // Ẩn ảnh và hiển thị placeholder
                        e.target.style.display = 'none';
                        const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                      onLoad={(e) => {
                        console.log('✅ [HomePage] Image loaded successfully:', e.target.src);
                        const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                        if (placeholder) {
                          placeholder.style.display = 'none';
                        }
                      }}
                    />
                    <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400" style={{ display: 'none' }}>
                      <span className="text-4xl">🖼️</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg mb-2 bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">🖼️</span>
                  </div>
                )}
                <div className="text-xs font-semibold text-gray-700 mb-1 line-clamp-2 pt-2">{a.title}</div>
                <div className="text-[10px] text-gray-400 text-right pb-2">{a.date}</div>
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
                    src={getImageUrl(student.app_user?.avatar_url, '/img/default-avatar.png')}
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
