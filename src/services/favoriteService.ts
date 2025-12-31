import { apiClient } from './api';
import { Favorite, ApiResponse, Pagination } from '../types';

export const favoriteService = {
  // 添加收藏
  add: async (userId: number, itemId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.post<ApiResponse<null>>(`/favorites?userId=${userId}&itemId=${itemId}`);
      return response.data;
    } catch (error) {
      console.error('添加收藏失败:', error);
      throw error;
    }
  },

  // 取消收藏
  remove: async (userId: number, itemId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(`/favorites?userId=${userId}&itemId=${itemId}`);
      return response.data;
    } catch (error) {
      console.error('取消收藏失败:', error);
      throw error;
    }
  },

  // 检查是否已收藏
  check: async (userId: number, itemId: number): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    try {
      const response = await apiClient.get<ApiResponse<{ isFavorite: boolean }>>(`/favorites/check?userId=${userId}&itemId=${itemId}`);
      return response.data;
    } catch (error) {
      console.error('检查收藏状态失败:', error);
      throw error;
    }
  },

  // 获取用户收藏列表
  getUserFavorites: async (userId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Favorite>>> => {
    try {
      const response = await apiClient.get<ApiResponse<Pagination<Favorite>>>(`/favorites/user/${userId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('获取用户收藏列表失败:', error);
      throw error;
    }
  },

  // 获取我的收藏列表
  getMyFavorites: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Favorite>>> => {
    try {
      const response = await apiClient.get<ApiResponse<Pagination<Favorite>>>(`/favorites/my?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('获取我的收藏列表失败:', error);
      throw error;
    }
  },

  // 批量取消收藏
  batchRemove: async (itemIds: number[]): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete<ApiResponse<null>>('/favorites/batch', { data: { itemIds } });
      return response.data;
    } catch (error) {
      console.error('批量取消收藏失败:', error);
      throw error;
    }
  },

  // 获取收藏统计
  getStats: async (userId: number): Promise<ApiResponse<{ totalFavorites: number }>> => {
    try {
      const response = await apiClient.get<ApiResponse<{ totalFavorites: number }>>(`/favorites/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取收藏统计失败:', error);
      throw error;
    }
  },
};