// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  status: number;
  emailVerified: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// 分类相关类型
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  parentId: number;
  sortOrder: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// 物品相关类型
export interface Item {
  id: number;
  title: string;
  description?: string;
  categoryId: number;
  userId: number;
  conditionType: number;
  price: number;
  originalPrice: number;
  isFree: number;
  status: number;
  viewCount: number;
  favoriteCount: number;
  contactMethod?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: number;
  
  // 关联字段
  category?: Category;
  user?: User;
  images?: Image[];
}

// 图片相关类型
export interface Image {
  id: number;
  itemId: number;
  userId: number;
  originalName?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  sortOrder: number;
  createdAt: string;
}

// 收藏相关类型
export interface Favorite {
  id: number;
  userId: number;
  itemId: number;
  createdAt: string;
}

// 关注相关类型
export interface Follow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
}

// 消息相关类型
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  itemId?: number;
  type: number;
  title?: string;
  content: string;
  isRead: number;
  createdAt: string;
  readAt?: string;
}

// 浏览历史类型
export interface ViewHistory {
  id: number;
  userId?: number;
  itemId: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// 系统配置类型
export interface SystemConfig {
  id: number;
  configKey: string;
  configValue?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 操作日志类型
export interface OperationLog {
  id: number;
  userId?: number;
  operation: string;
  targetType: string;
  targetId: number;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

// 分页类型 - Spring Data JPA Page格式
export interface Pagination<T = any> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  numberOfElements: number;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

// 兼容旧格式的别名
export interface PaginationRecords<T = any> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 登录相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

// 注册相关类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
  phone?: string;
}

// 物品搜索类型
export interface ItemSearchParams {
  keyword?: string;
  categoryId?: number;
  conditionType?: number;
  isFree?: number;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  page?: number;
  size?: number;
}

// 物品发布类型
export interface ItemCreateRequest {
  title: string;
  description?: string;
  categoryId: number;
  conditionType: number;
  price?: number;
  originalPrice?: number;
  isFree: number;
  contactMethod?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  tags?: string;
  userId: number;
}

// 物品更新类型
export interface ItemUpdateRequest extends Partial<ItemCreateRequest> {
  id: number;
}

// 文件上传类型
export interface FileUploadResponse {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

// 物品状态枚举
export enum ItemStatus {
  DELETED = 0,      // 已删除
  PENDING = 1,      // 待审核
  APPROVED = 2,     // 审核通过
  REJECTED = 3,     // 审核拒绝
  OFFLINE = 4       // 已下架
}

// 物品成色枚举
export enum ItemCondition {
  NEW = 1,          // 全新
  LIKE_NEW = 2,     // 几乎全新
  LIGHT_USE = 3,    // 轻微使用痕迹
  OBVIOUS_USE = 4,  // 明显使用痕迹
  NEED_REPAIR = 5   // 需要维修
}

// 消息类型枚举
export enum MessageType {
  PRIVATE = 1,      // 私信
  SYSTEM = 2,       // 系统通知
  ITEM_RELATED = 3  // 物品相关
}

// 用户状态枚举
export enum UserStatus {
  DISABLED = 0,     // 禁用
  NORMAL = 1        // 正常
}

// 分类状态枚举
export enum CategoryStatus {
  DISABLED = 0,     // 禁用
  NORMAL = 1        // 正常
}