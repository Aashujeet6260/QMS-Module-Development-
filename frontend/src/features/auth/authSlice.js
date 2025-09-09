import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.signUp(userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    await dispatch(loadUserFromToken());
    return access_token;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const loadUserFromToken = createAsyncThunk('auth/loadUserFromToken', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (token) {
        try {
            const response = await authApi.fetchCurrentUser(token);
            return response.data;
        } catch (err) {
            localStorage.removeItem('token');
            return rejectWithValue(err.response.data);
        }
    }
    return rejectWithValue('No token found');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => { state.status = 'loading'; })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.detail || 'Sign up failed';
      })
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        state.error = action.payload.detail || 'Login failed';
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;