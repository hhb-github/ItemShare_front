import { apiClient } from './api';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  // 获取所有分类
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  // 根据ID获取分类
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  // 创建分类
  create: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  // 更新分类
  update: async (id: number, data: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  // 删除分类
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
    return response.data;
  },

  // 获取顶级分类
  getTopLevel: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories/top-level');
    return response.data;
  },

  // 获取子分类
  getChildren: async (parentId: number): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(`/categories/children/${parentId}`);
    return response.data;
  },

  // 获取分类树
  getTree: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories/tree');
    return response.data;
  },

  // 搜索分类
  search: async (keyword: string): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(`/categories/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // 获取热门分类
  getPopular: async (size: number = 10): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(`/categories/popular?size=${size}`);
    return response.data;
  },
};