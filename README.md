# Banana Vue

一个参考 `watermelon-vue` 技术栈创建的轻量 Vue 项目骨架。项目只包含一个响应式首页，不包含登录、权限、接口或后台管理等业务逻辑。

## 技术栈

- Vue 3 + TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus（依赖已安装，业务组件按需引入）
- ESLint + Prettier

## 开始使用

```bash
pnpm install
pnpm dev
```

开发服务默认运行在 `http://localhost:3000`。

## 常用命令

```bash
pnpm type-check
pnpm lint
pnpm build
```

## 目录结构

```text
src/
├── assets/       # 静态资源
├── components/   # 通用组件
├── router/       # 路由配置
├── stores/       # 状态管理（按需扩展）
├── styles/       # 全局样式
├── views/        # 页面视图
├── App.vue       # 根组件
└── main.ts       # 应用入口
```
