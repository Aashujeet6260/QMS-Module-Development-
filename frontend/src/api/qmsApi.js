import apiClient from './apiClient'; // Import our new central client

// All functions now use the configured apiClient which includes the auth token
export const getEvents = () => apiClient.get('/events/');
export const getEventById = (id) => apiClient.get(`/events/${id}`);
export const createEvent = (eventData) => apiClient.post('/events/', eventData);
export const postAiPrompt = (prompt) => apiClient.post('/ai/prompt', { prompt });
export const deleteEvents = (ids) => apiClient.delete('/events/', { data: { ids } });
export const updateEvent = (id, eventData) => apiClient.put(`/events/${id}`, eventData);