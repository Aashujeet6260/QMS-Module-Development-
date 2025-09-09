import { configureStore } from '@reduxjs/toolkit';
import qmsReducer from '../features/qms/qmsSlice';
import authReducer from '../features/auth/authSlice'; // Import the new auth reducer

export const store = configureStore({
  reducer: {
    qms: qmsReducer,
    auth: authReducer, // Add the auth reducer to the store
  },
});