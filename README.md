# 个人物品分享系统前端

## 项目概述

基于 React + TypeScript + Ant Design 开发的个人物品分享系统前端，提供用户管理、物品分享、社交互动等功能。

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **UI组件库**: Ant Design 5.x
- **状态管理**: Redux Toolkit + Redux Persist
- **数据请求**: Axios + React Query
- **路由**: React Router DOM
- **构建工具**: Create React App

## 项目架构

### 目录结构

```
src/
├── assets/          # 静态资源
├── components/      # 组件
│   ├── common/      # 通用组件
│   ├── forms/       # 表单组件
│   ├── items/       # 物品相关组件
│   ├── layout/      # 布局组件
│   ├── social/      # 社交功能组件
│   └── user/        # 用户相关组件
├── hooks/           # 自定义Hooks
├── pages/           # 页面组件
├── services/        # API服务
├── store/           # 状态管理
│   └── slices/      # Redux slices
├── styles/          # 样式文件
├── types/           # TypeScript类型定义
└── utils/           # 工具函数
```

### 核心功能模块

#### 1. 用户管理
- 用户注册/登录
- 个人资料管理
- 用户认证与授权
- 密码管理

#### 2. 物品管理
- 物品发布/编辑
- 物品搜索/筛选
- 物品详情展示
- 图片上传管理

#### 3. 分类系统
- 物品分类浏览
- 分类筛选功能
- 分类管理

#### 4. 社交功能
- 用户关注/粉丝
- 消息系统
- 收藏功能
- 浏览历史

#### 5. 地图功能
- 地理位置定位
- 物品位置展示
- 附近物品搜索

## 开发规范

### 组件开发
- 使用函数式组件 + Hooks
- 组件名称使用PascalCase
- 文件名与组件名保持一致
- 优先使用Ant Design组件

### 状态管理
- 全局状态使用Redux Toolkit
- 组件内部状态使用useState
- 服务器状态使用React Query

### 代码规范
- 使用TypeScript严格模式
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件必须定义PropTypes或TypeScript类型

## 开发环境

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

## API集成

前端通过Axios与后端RESTful API进行通信，支持以下主要功能：

- 用户认证与授权
- 物品CRUD操作
- 文件上传
- 实时消息
- 地理位置服务

## 响应式设计

项目采用响应式设计，支持以下设备：
- 桌面端 (≥1200px)
- 平板端 (768px-1199px)
- 移动端 (≤767px)

使用Ant Design的Grid系统实现布局适配。