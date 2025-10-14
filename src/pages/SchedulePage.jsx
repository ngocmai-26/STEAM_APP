import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { ApiServices } from '../services/ApiServices';

const mockSchedule = [
  {
    id: 1,
    subject: "Tân binh lập game",
    description: "Giáo viên: Luyện Xuân Minh Đức",
    room: "Phòng D5.Lab",
    time: "18h00-20h00"
  }
];

// Hàm chuyển đổi ngày thành thứ trong tuần
const getDayOfWeek = (date) => {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[date.getDay()];
};

// Hàm format ngày thành dd-mm
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}-${month}`;
};

// Hàm tạo mảng ngày trong tuần từ ngày bắt đầu
const getWeekDays = (startDate) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push({
      id: getDayOfWeek(date),
      label: getDayOfWeek(date),
      date: formatDate(date),
      fullDate: date
    });
  }
  return days;
};

const SchedulePage = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekDays, setWeekDays] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [visibleDays, setVisibleDays] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const daysToShow = 5; // Số ngày hiển thị mỗi lần

  // Load học viên khi component mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const response = await ApiServices.getStudentRegistrations();
        const studentList = response.data || [];
        setStudents(studentList);

        // Set học viên đầu tiên làm mặc định
        if (studentList.length > 0) {
          setSelectedStudent(studentList[0].student.id);
        }

        // Set ngày hôm nay làm mặc định
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        setStartDate(todayString);
        setEndDate(todayString);

      } catch (err) {
        setError('Không thể tải danh sách học viên');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Cập nhật weekDays khi startDate thay đổi
  useEffect(() => {
    if (startDate) {
      const date = new Date(startDate);
      const days = getWeekDays(date);
      setWeekDays(days);
      setSelectedDay(days[0].id);
      updateVisibleDays(days, 0);
    }
  }, [startDate]);

  // Load lớp học khi chọn học viên
  useEffect(() => {
    const loadClasses = async () => {
      if (!selectedStudent) return;

      try {
        const response = await ApiServices.getClassesByStudent(selectedStudent);
        const classList = response.data || [];
        setClasses(classList);

        // Set lớp học đầu tiên làm mặc định
        if (classList.length > 0) {
          setSelectedClass(classList[0].id);
        }
      } catch (err) {
        setError('Không thể tải danh sách lớp học');
        setClasses([]);
      }
    };

    loadClasses();
  }, [selectedStudent]);

  // Load lịch học khi có thay đổi
  useEffect(() => {
    const loadSchedule = async () => {
      if (!selectedStudent || !selectedClass) return;

      try {
        setLoading(true);
        const params = {
          student: selectedStudent,
          class_room: selectedClass
        };
        
        // Thêm filter theo ngày nếu có
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        
        // Debug log để kiểm tra API call
        console.log('API call params:', params);
        
        const response = await ApiServices.getTimeTables(params);
        
        // Debug log để kiểm tra response
        console.log('API response:', response);
        console.log('Schedule data:', response.data);
        
        setSchedule(response.data || []);
      } catch (err) {
        console.error('API error:', err);
        setError('Không thể tải lịch học');
        setSchedule(mockSchedule); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [selectedStudent, selectedClass, startDate, endDate]);

  // Cập nhật visible days khi weekOffset thay đổi
  const updateVisibleDays = (days, offset) => {
    const start = offset;
    const end = Math.min(start + daysToShow, days.length);
    setVisibleDays(days.slice(start, end));
  };

  // Xử lý khi click nút next/prev
  const handleNavigateWeek = (direction) => {
    const newOffset = direction === 'next'
      ? Math.min(weekOffset + 1, weekDays.length - daysToShow)
      : Math.max(weekOffset - 1, 0);
    setWeekOffset(newOffset);
    updateVisibleDays(weekDays, newOffset);
  };

  // Lấy trạng thái lịch học
  const getScheduleStatus = (item) => {
    const now = new Date();
    const startTime = new Date(item.start_datetime || item.schedule?.start_datetime);
    const endTime = new Date(item.end_datetime || item.schedule?.end_datetime);
    
    if (now < startTime) {
      return { status: 'upcoming', text: 'Sắp tới', color: 'text-blue-600' };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'ongoing', text: 'Đang diễn ra', color: 'text-green-600' };
    } else {
      return { status: 'past', text: 'Đã qua', color: 'text-gray-500' };
    }
  };

  // Filter schedule theo ngày được chọn và thời gian hiện tại
  const getFilteredSchedule = () => {
    if (!selectedDay || !schedule.length) {
      console.log('No schedule data or no selected day:', { selectedDay, scheduleLength: schedule.length });
      return schedule;
    }
    
    // Debug log để kiểm tra tất cả dữ liệu schedule
    console.log('All schedule data:', schedule.map(item => ({
      name: item.name,
      date: item.schedule?.start_date || item.date,
      fullItem: item
    })));
    
    const filtered = schedule.filter(item => {
      const itemDate = item.schedule?.start_date || item.date;
      if (!itemDate) return false;
      
      // Chuyển đổi ngày để so sánh
      const selectedDateStr = weekDays.find(day => day.id === selectedDay)?.date;
      
      // Chuyển đổi itemDate từ "14/10/2025" thành "14-10" để so sánh
      let itemDateFormatted = itemDate;
      if (itemDate.includes('/')) {
        // Nếu có định dạng dd/mm/yyyy, chuyển thành dd-mm
        const parts = itemDate.split('/');
        if (parts.length >= 2) {
          itemDateFormatted = `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
      }
      
      // Debug log để kiểm tra
      console.log('Debug filter:', {
        selectedDay,
        selectedDateStr,
        itemDate,
        itemDateFormatted,
        itemName: item.name,
        match: itemDateFormatted === selectedDateStr
      });
      
      // Kiểm tra ngày khớp với ngày được chọn
      if (itemDateFormatted !== selectedDateStr) return false;
      
      // Chỉ filter theo ngày được chọn, không filter theo thời gian hiện tại
      // vì người dùng có thể muốn xem lịch học trong tương lai
      return true;
    });
    
    console.log('Filtered schedule result:', filtered);
    return filtered;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 mx-4 rounded-lg mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4 font-sans">
          Lịch học
        </h1>

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn học viên
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn học viên</option>
              {students.map((item) => (
                <option key={item.student.id} value={item.student.id}>
                  {item.student.first_name} {item.student.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn lớp học
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedStudent}
            >
              <option value="">Chọn lớp học</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  Lớp #{classItem.id} - {classItem.name || 'Lớp học'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Week Days */}
      {weekDays.length > 0 && (
        <div className="relative bg-white mt-2 mx-4 rounded-lg">
          <div className="flex justify-between items-center px-4 py-3">
            {weekOffset > 0 && (
              <button
                onClick={() => handleNavigateWeek('prev')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
              >
                <span className="text-blue-600">←</span>
              </button>
            )}

            <div className="flex justify-between w-full px-8">
              {visibleDays.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`flex flex-col items-center ${selectedDay === day.id
                    ? 'text-blue-600'
                    : 'text-gray-500'
                    }`}
                >
                  <span className="text-sm font-medium">{day.label}</span>
                  <span className="text-xs">{day.date}</span>
                  {selectedDay === day.id && (
                    <div className="w-5 h-1 bg-blue-600 rounded-full mt-1" />
                  )}
                </button>
              ))}
            </div>

            {weekOffset < weekDays.length - daysToShow && (
              <button
                onClick={() => handleNavigateWeek('next')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
              >
                <span className="text-blue-600">→</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="p-4 mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch học</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Đang tải lịch học...</span>
          </div>
        ) : getFilteredSchedule().length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📅</div>
            <p>Không có lịch học nào trong ngày này</p>
          </div>
        ) : (
          getFilteredSchedule().map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-blue-600">
                  {item.subject || item.course_name || item.name || 'Khóa học'}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getScheduleStatus(item).color} bg-gray-100`}>
                  {getScheduleStatus(item).text}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {item.description || item.teacher_name || item.instructor || 'Thông tin giáo viên chưa có'}
              </p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>{item.room || item.location || 'Phòng học chưa xác định'}</span>
                <span>{item.time || (item.schedule?.start_time && item.schedule?.end_time ? `${item.schedule.start_time}-${item.schedule.end_time}` : 'Thời gian chưa xác định')}</span>
              </div>
              {(item.date || item.schedule?.start_date) && (
                <div className="mt-1 text-xs text-gray-400">
                  Ngày: {item.schedule?.start_date || new Date(item.date).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SchedulePage;
