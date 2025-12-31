import { apiClient } from './api';
import { Message, ApiResponse, Pagination } from '../types';

export const messageService = {
  // 发送消息
  send: async (data: {
    receiverId: number;
    content: string;
    itemId?: number;
    type?: number;
    title?: string;
  }): Promise<ApiResponse<Message>> => {
    const response = await apiClient.post<ApiResponse<Message>>('/messages', data);
    return response.data;
  },

  // 获取消息列表
  getMessages: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Message>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Message>>>(`/messages?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取收到的消息
  getReceived: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Message>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Message>>>(`/messages/received?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取发送的消息
  getSent: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Message>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Message>>>(`/messages/sent?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取与某个用户的对话
  getConversation: async (userId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Message>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Message>>>(`/messages/conversation/${userId}?page=${page}&size=${size}`);
    return response.data;
  },

  // 标记消息为已读
  markAsRead: async (messageId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/messages/${messageId}/read`);
    return response.data;
  },

  // 批量标记消息为已读
  markMultipleAsRead: async (messageIds: number[]): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/messages/read-multiple', { messageIds });
    return response.data;
  },

  // 删除消息
  delete: async (messageId: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/messages/${messageId}`);
    return response.data;
  },

  // 获取未读消息数量
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/messages/unread-count');
    return response.data;
  },

  // 获取系统通知
  getSystemNotifications: async (page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Message>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Message>>>(`/messages/system?page=${page}&size=${size}`);
    return response.data;
  },

  // 获取物品相关消息
  getItemMessages: async (itemId: number, page: number = 0, size: number = 20): Promise<ApiResponse<Pagination<Message>>> => {
    const response = await apiClient.get<ApiResponse<Pagination<Message>>>(`/messages/item/${itemId}?page=${page}&size=${size}`);
    return response.data;
  },
};