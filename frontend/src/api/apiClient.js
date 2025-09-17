import axios from 'axios';

// This will use the Vercel environment variable in production, 
// but fall back to your local port 8001 during development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This is the interceptor. It runs before every request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // THE FIX: Read the token directly from localStorage instead of the Redux store.
    // This breaks the circular dependency loop.
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;