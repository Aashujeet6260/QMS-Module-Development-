import apiClient from './apiClient'; // Import our new central client

export const signUp = (userData) => {
  return apiClient.post('/users/register', userData);
};

export const login = (credentials) => {
  // FastAPI's OAuth2 expects form data for the token endpoint
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  
  // For this specific request, we override the content type
  return apiClient.post('/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

// The interceptor in apiClient.js now handles adding the token automatically
export const fetchCurrentUser = () => {
  return apiClient.get('/users/me');
};