import { getToken } from './tokenService';

export const API_BASE_URL = 'https://stem.bdu.edu.vn/steam/apis';

export const ApiServices = {
  async getCourses() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/courses`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async getStudentRegistrations() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/student-registrations`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch student registrations');
    return response.json();
  },

  async createStudentRegistration(data) {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/student-registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create student registration');
    return response.json();
  },

  async getClassesByStudent(studentId) {
    const token = getToken();
    const response = await fetch(
      `${API_BASE_URL}/app/classes?student=${studentId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  },

  async getAllClasses() {
    const token = getToken();
    const response = await fetch(
      `${API_BASE_URL}/app/classes`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  },
  // Gọi API session để xác thực
  async callSessionAPI() {
    console.log('🌐 [ApiServices] Starting session API call...');
    try {
      const token = getToken();
      console.log('🔑 [ApiServices] Token for session API:', token);

      if (!token) {
        console.error('❌ [ApiServices] No access token available');
        throw new Error('No access token available');
      }

      const url = `${API_BASE_URL}/app/auth/session`;
      const body = JSON.stringify({ token });

      console.log('📡 [ApiServices] Calling session API:', url);
      console.log('📋 [ApiServices] Request body:', body);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      console.log('📊 [ApiServices] Response status:', response.status);

      if (!response.ok) {
        console.error('❌ [ApiServices] HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [ApiServices] Session API response data:', data);
      return data;
    } catch (error) {
      console.error('💥 [ApiServices] Error calling session API:', error);
      throw error;
    }
  },

  // Gọi API với token tự động
  async callAPI(endpoint, options = {}) {
    console.log('🌐 [ApiServices] Starting API call to:', endpoint);
    try {
      const token = getToken();
      console.log('🔑 [ApiServices] Token for API call:', token);
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };

      console.log('📋 [ApiServices] Request headers:', defaultHeaders);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: defaultHeaders,
      });

      console.log('📊 [ApiServices] Response status:', response.status);

      if (!response.ok) {
        console.error('❌ [ApiServices] HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [ApiServices] API response data:', data);
      return data;
    } catch (error) {
      console.error('💥 [ApiServices] Error calling API:', error);
      throw error;
    }
  },

  async getAllStudents() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/student-registrations`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    const data = await response.json();
    // Trả về mảng student
    return (data.data || []).map(item => item.student);
  },

  async getCourseModules({ student, class_room } = {}) {
    const token = getToken();
    let url = `${API_BASE_URL}/app/course-modules`;
    const params = [];
    if (student) params.push(`student=${student}`);
    if (class_room) params.push(`class_room=${class_room}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch course modules');
    return response.json();
  },

  async getLessons({ student, class_room, module } = {}) {
    const token = getToken();
    let url = `${API_BASE_URL}/app/lessons`;
    const params = [];
    if (student) params.push(`student=${student}`);
    if (class_room) params.push(`class_room=${class_room}`);
    if (module) params.push(`module=${module}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch lessons');
    return response.json();
  },

  async getLessonGalleries({ student, class_room, module, lesson } = {}) {
    const token = getToken();
    let url = `${API_BASE_URL}/app/lesson-galleries`;
    const params = [];
    if (student) params.push(`student=${student}`);
    if (class_room) params.push(`class_room=${class_room}`);
    if (module) params.push(`module=${module}`);
    if (lesson) params.push(`lesson=${lesson}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch lesson galleries');
    return response.json();
  },

  async getLessonById(id) {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/lessons?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch lesson');
    return response.json();
  },

  async getLessonEvaluations({ student, class_room, module, lesson } = {}) {
    const token = getToken();
    let url = `${API_BASE_URL}/app/lesson-evaluations`;
    const params = [];
    if (student) params.push(`student=${student}`);
    if (class_room) params.push(`class_room=${class_room}`);
    if (module) params.push(`module=${module}`);
    if (lesson) params.push(`lesson=${lesson}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch lesson evaluations');
    return response.json();
  },

  async getAttendances() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/attendances`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch attendances');
    return response.json();
  },

  async getTimeTables({ student, class_room } = {}) {
    const token = getToken();
    let url = `${API_BASE_URL}/app/time-tables`;
    const params = [];
    if (student) params.push(`student=${student}`);
    if (class_room) params.push(`class_room=${class_room}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch time tables');
    return response.json();
  },

  async getFacilities() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/facilities`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch facilities');
    return response.json();
  },

  async getNews() {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/app/news`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },
};
