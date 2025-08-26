import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  rank: number;
  monthlyGoal: number;
  monthlyProgress: number;
  avatar?: string; // Optional avatar URL
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const mockResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          points: 1250,
          rank: 15,
          monthlyGoal: 500,
          monthlyProgress: 320,
        },
        token: 'mock-jwt-token-' + Date.now(),
      };

      // Store token securely
      await SecureStore.setItemAsync('auth_token', mockResponse.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(mockResponse.user));

      return mockResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const mockResponse = {
        user: {
          id: '2',
          email: userData.email,
          name: userData.name,
          points: 0,
          rank: 0,
          monthlyGoal: 500,
          monthlyProgress: 0,
        },
        token: 'mock-jwt-token-' + Date.now(),
      };

      // Store token securely
      await SecureStore.setItemAsync('auth_token', mockResponse.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(mockResponse.user));

      return mockResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loadStoredAuth = createAsyncThunk(
  'auth/loadStoredAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userDataString = await AsyncStorage.getItem('user_data');
      
      if (token && userDataString) {
        const user = JSON.parse(userDataString);
        return { user, token };
      }
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load stored authentication');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await AsyncStorage.removeItem('user_data');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.points += action.payload;
        state.user.monthlyProgress += action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Load stored auth
      .addCase(loadStoredAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadStoredAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, updateUserPoints } = authSlice.actions;
export default authSlice.reducer;
