import axios from 'axios';

// Axios instance oluştur
const api = axios.create({
  baseURL: 'https://api.saglikhep.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Bearer token ekle
api.interceptors.request.use(
  (config) => {
    // Client-side'da token'ı localStorage'dan al
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Token yenileme ve hata yönetimi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 hatası ve token yenileme denemesi yapılmamışsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token ile yeni token al
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('https://api.saglikhep.com/api/auth/refresh', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Yeni token'ları kaydet
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Orijinal isteği yeni token ile tekrar dene
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token da geçersizse kullanıcıyı logout yap
        localStorage.clear();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
