import { apiClient } from './api';
import { Follow, User, ApiResponse, Pagination } from '../types';

export const followService = {
  // 关注用户
  follow: async (userId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/follows', { userId });
    return response.data;
  },

  // 取消关注
  unfollow: async (userId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/follows/${userId}`);
    return response.data;
  },

  // 检查是否已关注
  check: async (userId: number): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ isFollowing: boolean }>>(`/follows/check/${userId}`);
    return response.data;
  },

  // 获取用户关注列表
  getFollowing: async (userId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Follow>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Follow>>>(`/follows/following/${userId}?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取用户粉丝列表
  getFollowers: async (userId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Follow>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Follow>>>(`/follows/followers/${userId}?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取我的关注列表
  getMyFollowing: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Follow>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Follow>>>(`/follows/my-following?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取我的粉丝列表
  getMyFollowers: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Follow>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Follow>>>(`/follows/my-followers?page=${page}&size=${size}`);
    return response.data;
  },

  // 批量关注
  batchFollow: async (userIds: number[]): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/follows/batch', { userIds });
    return response.data;
  },

  // 批量取消关注
  batchUnfollow: async (userIds: number[]): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>('/follows/batch', { data: { userIds } });
    return response.data;
  },

  // 获取关注统计
  getStats: async (userId: number): Promise<ApiResponse<{ followingCount: number; followersCount: number }>> => {
    const response = await apiClient.get<ApiResponse<{ followingCount: number; followersCount: number }>>(`/follows/stats/${userId}`);
    return response.data;
  },
};