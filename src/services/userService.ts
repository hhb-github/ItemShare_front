import { apiClient } from './api';
import { User, LoginRequest, RegisterRequest, ApiResponse, LoginResponse } from '../types';

export const userService = {
  // 用户注册
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/users/register', data);
    return response.data;
  },

  // 用户登录
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/users/login', data);
    return response.data;
  },

  // 获取用户信息
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },

  // 更新用户信息
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);
    return response.data;
  },

  // 获取用户列表
  getUsers: async (page: number = 0, size: number = 20): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  // 根据ID获取用户
  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // 根据用户名获取用户
  getUserByUsername: async (username: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/username/${username}`);
    return response.data;
  },

  // 根据邮箱获取用户
  getUserByEmail: async (email: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/email/${email}`);
    return response.data;
  },

  // 修改密码
  changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/users/change-password', data);
    return response.data;
  },

  // 上传头像
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ApiResponse<{ avatarUrl: string }>>('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};