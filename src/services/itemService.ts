import { apiClient } from './api';
import { Item, ItemSearchParams, ItemCreateRequest, ItemUpdateRequest, ApiResponse, Pagination } from '../types';

export const itemService = {
  // 创建物品
  create: async (data: ItemCreateRequest): Promise<ApiResponse<Item>> => {
    const response = await apiClient.post<ApiResponse<Item>>('/items', data);
    return response.data;
  },

  // 获取物品详情
  getById: async (id: number): Promise<ApiResponse<Item>> => {
    const response = await apiClient.get<ApiResponse<Item>>(`/items/${id}`);
    return response.data;
  },

  // 搜索物品
  search: async (params: ItemSearchParams): Promise<ApiResponse<Pagination<Item>>> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get<ApiResponse<Pagination<Item>>>(`/items/search?${searchParams.toString()}`);
    return response.data;
  },

  // 获取物品列表
  getItems: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Item>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Item>>>(`/items?page=${page}&size=${size}`);
    return response.data;
  },

  // 根据分类获取物品
  getByCategory: async (categoryId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Item>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Item>>>(`/items/category/${categoryId}?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取用户发布的物品
  getUserItems: async (userId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Item>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Item>>>(`/items/user/${userId}?page=${page}&size=${size}`);
    return response.data;
  },

  // 更新物品
  update: async (id: number, data: Partial<ItemUpdateRequest>): Promise<ApiResponse<Item>> => {
    const response = await apiClient.put<ApiResponse<Item>>(`/items/${id}`, data);
    return response.data;
  },

  // 删除物品
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/items/${id}`);
    return response.data;
  },

  // 获取热门物品
  getPopular: async (size: number = 10): Promise<ApiResponse<Item[]>> => {
    const response = await apiClient.get<ApiResponse<Item[]>>(`/items/popular?size=${size}`);
    return response.data;
  },

  // 获取最新物品
  getLatest: async (size: number = 10): Promise<ApiResponse<Item[]>> => {
    const response = await apiClient.get<ApiResponse<Item[]>>(`/items/latest?size=${size}`);
    return response.data;
  },

  // 获取附近物品
  getNearby: async (latitude: number, longitude: number, distance: number = 10): Promise<ApiResponse<Item[]>> => {
    const response = await apiClient.get<ApiResponse<Item[]>>(`/items/nearby?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    return response.data;
  },

  // 收藏物品
  favorite: async (itemId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(`/items/${itemId}/favorite`);
    return response.data;
  },

  // 取消收藏
  unfavorite: async (itemId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/items/${itemId}/favorite`);
    return response.data;
  },

  // 检查是否已收藏
  checkFavorite: async (itemId: number): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ isFavorite: boolean }>>(`/items/${itemId}/favorite-status`);
    return response.data;
  },

  // 获取用户收藏的物品
  getUserFavorites: async (userId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Item>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Item>>>(`/items/favorites/${userId}?page=${page}&size=${size}`);
    return response.data;
  },
};