import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  status: number;
  createdAt: string;
  lastLoginAt?: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // 清除localStorage中的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    initializeUser: (state) => {
      // 从localStorage恢复用户状态
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.currentUser = user;
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Failed to parse user data from localStorage:', error);
          // 清除无效数据
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  }
});

export const { setLoading, setCurrentUser, setError, clearError, logout, initializeUser } = userSlice.actions;

export default userSlice.reducer;