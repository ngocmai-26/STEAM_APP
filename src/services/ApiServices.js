import { getToken, API_BASE_URL } from '../constants/api';

export const ApiServices = {
  async getCourses() {
    const token = getToken();
    console.log('🔑 [getCourses] Token:', token ? 'Available' : 'Missing');
    console.log('🔑 [getCoursessss  ] Token:', token);
    const response = await fetch(`${API_BASE_URL}/courses`, {
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
    console.log('🔑 [getStudentRegistrations] Token:', token ? 'Available' : 'Missing');
    const response = await fetch(`${API_BASE_URL}/student-registrations`, {
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
    const response = await fetch(`${API_BASE_URL}/student-registrations`, {
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
      `${API_BASE_URL}/classes?student=${studentId}`,
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
      `${API_BASE_URL}/classes`,
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
    try {
      const token = getToken();
      console.log('🔑 [callSessionAPI] Token:', token ? 'Available' : 'Missing');

      if (!token) {
        throw new Error('No access token available');
      }

      const url = `${API_BASE_URL}/auth/session`;
      console.log('🔑 [callSessionAPI] URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Session API error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Session API failed:', error.message);
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
    const response = await fetch(`${API_BASE_URL}/student-registrations`, {
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
    let url = `${API_BASE_URL}/course-modules`;
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
    let url = `${API_BASE_URL}/lessons`;
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
    let url = `${API_BASE_URL}/lesson-galleries`;
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
    const response = await fetch(`${API_BASE_URL}/lessons?id=${id}`, {
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
    let url = `${API_BASE_URL}/lesson-evaluations`;
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
    const response = await fetch(`${API_BASE_URL}/attendances`, {
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
    let url = `${API_BASE_URL}/time-tables`;
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
    const response = await fetch(`${API_BASE_URL}/facilities`, {
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
    const response = await fetch(`${API_BASE_URL}/news`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },
};
