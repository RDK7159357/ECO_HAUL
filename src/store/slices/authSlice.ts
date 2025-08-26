import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

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

// Helper function to store token securely
const storeTokenSecurely = async (token: string) => {
  try {
    if (Platform.OS === 'web') {
      // Fallback to AsyncStorage for web
      await AsyncStorage.setItem('auth_token', token);
    } else {
      // Check if SecureStore is available
      const isAvailable = await SecureStore.isAvailableAsync();
      if (!isAvailable) {
        console.warn('SecureStore is not available, falling back to AsyncStorage');
        await AsyncStorage.setItem('auth_token', token);
        return;
      }
      // Use SecureStore for native platforms
      await SecureStore.setItemAsync('auth_token', token);
    }
  } catch (error) {
    console.error('Error storing token securely:', error);
    // Fallback to AsyncStorage on any error
    await AsyncStorage.setItem('auth_token', token);
  }
};

// Helper function to get token securely
const getTokenSecurely = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      // Fallback to AsyncStorage for web
      return await AsyncStorage.getItem('auth_token');
    } else {
      // Check if SecureStore is available
      const isAvailable = await SecureStore.isAvailableAsync();
      if (!isAvailable) {
        console.warn('SecureStore is not available, falling back to AsyncStorage');
        return await AsyncStorage.getItem('auth_token');
      }
      // Use SecureStore for native platforms
      return await SecureStore.getItemAsync('auth_token');
    }
  } catch (error) {
    console.error('Error getting token securely:', error);
    // Fallback to AsyncStorage on any error
    return await AsyncStorage.getItem('auth_token');
  }
};

// Helper function to delete token securely
const deleteTokenSecurely = async () => {
  try {
    if (Platform.OS === 'web') {
      // Fallback to AsyncStorage for web
      await AsyncStorage.removeItem('auth_token');
    } else {
      // Check if SecureStore is available
      const isAvailable = await SecureStore.isAvailableAsync();
      if (!isAvailable) {
        console.warn('SecureStore is not available, falling back to AsyncStorage');
        await AsyncStorage.removeItem('auth_token');
        return;
      }
      // Use SecureStore for native platforms
      await SecureStore.deleteItemAsync('auth_token');
    }
  } catch (error) {
    console.error('Error deleting token securely:', error);
    // Fallback to AsyncStorage on any error
    await AsyncStorage.removeItem('auth_token');
  }
};

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
      await storeTokenSecurely(mockResponse.token);
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
      await storeTokenSecurely(mockResponse.token);
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
      const token = await getTokenSecurely();
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
      await deleteTokenSecurely();
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
