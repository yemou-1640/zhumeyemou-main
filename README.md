# 浙江旅游景点应用 (Zhejiang Tourist Attractions App)

![浙江旅游景点应用]

## 项目概述

浙江旅游景点应用是一个现代化的 Web 应用，专注于展示浙江省的著名旅游景点。该应用提供了丰富的功能，包括景点浏览、详情查看、用户认证、收藏管理以及个人资料设置等。应用采用响应式设计，确保在各种设备上都能提供良好的用户体验。

## 主要功能

- **主页展示**：轮播展示热门景点，分类浏览，精选景点推荐和游客评价
- **景点浏览**：按类别浏览所有景点，支持网格视图
- **景点详情**：查看景点的详细信息，包括描述、位置、门票价格、开放时间等
- **用户认证**：注册、登录和个人资料管理
- **收藏功能**：用户可以收藏喜欢的景点并在收藏页面管理
- **个人中心**：用户可以查看和编辑个人资料，管理账户安全设置
- **主题切换**：支持浅色/深色模式切换

## 技术栈

### 前端框架

- **Vue 3**：使用 Composition API 构建用户界面
- **TypeScript**：提供类型安全和更好的开发体验
- **Vite**：快速的前端构建工具

### 状态管理

- **Pinia**：Vue 的官方状态管理库，用于管理用户数据和景点数据
- **VueUse**：Vue Composition API 实用工具集合，特别是 `useStorage` 用于本地数据持久化

### 路由

- **Vue Router**：官方路由管理器，处理页面导航和路由守卫

### UI 组件

- **Element Plus**：基于 Vue 3 的组件库，提供丰富的 UI 组件
- **自定义 CSS**：使用 CSS 变量实现主题切换和响应式设计

### 数据持久化

- **Local Storage**：通过 VueUse 的 `useStorage` 实现数据持久化

### 构建工具

- **Bun**：JavaScript 运行时和包管理器，替代 npm/yarn

### 开发工具

- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Vue DevTools**：Vue 应用调试工具

## 项目结构

```
/src
  /assets        # 静态资源（CSS、图片等）
  /components    # 可复用组件
  /router        # 路由配置
  /stores        # Pinia 状态管理
  /views         # 页面组件
    /attractions # 景点相关页面
    /auth        # 认证相关页面
    /home        # 主页相关页面
  App.vue        # 根组件
  main.ts        # 应用入口
```

## 开发环境设置

### 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用 Vetur)。

### 项目设置

```sh
# 安装依赖
bun install

# 开发环境运行（热重载）
bun dev

# 类型检查、编译并最小化生产构建
bun run build
```

## 未来计划

- 添加景点搜索功能
- 集成地图显示景点位置
- 添加用户评论功能
- 开发移动应用版本

## 许可证

本项目仅用于学习和演示目的。
