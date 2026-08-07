# Banana Vue 项目指令

本文件适用于仓库根目录及全部子目录。

## 项目与工具

- 本项目使用 Vue 3、TypeScript、Vite、Vue Router、Pinia 和 Element Plus；对应后端为 `../../java/banana`。
- 使用 `pnpm` 和现有 `pnpm-lock.yaml`，Node.js 版本以 `package.json#engines` 为准。
- 修改前查看 `git status --short`，并阅读 `package.json`、相关配置和相邻实现。
- 任务确实涉及后端改动时，再读取对应后端的 `AGENTS.md`。

## 代码约定

- 使用 Composition API 和 `<script setup lang="ts">`，为接口数据定义明确类型，避免 `any`。
- 沿用 `@/` 别名、Element Plus 和现有样式，不无故引入替代框架。
- 当前项目是轻量骨架；没有明确需求时，不提前移植 Watermelon 的登录、权限或管理后台逻辑。
- 接入业务时按需建立 `src/api`、`src/types`、`src/composables`、`src/services` 和领域化 store，保持请求、业务编排与页面展示分离。
- 文件相关界面应处理加载、空数据、错误、上传进度和失败状态；前端校验不能替代后端安全校验。

## 配置与验证

- 环境地址集中从配置层或 `import.meta.env` 读取；`VITE_*` 只能保存公开配置。
- 不提交密码、密钥、令牌、Cookie、对象存储凭证、真实服务地址或个人信息；本地配置使用被忽略的 `.env.local`。
- 本地启动和浏览器联调必须使用 `http://banana.fblue.top:5173`，API 通过 `http://banana.fblue.top:8081`；Watermelon 登录入口使用 `http://watermelon.fblue.top:3000`。测试前确认两个域名均在 hosts 中解析到 `127.0.0.1`，不得用 `localhost` 替代。
- 修改后至少运行：

```bash
pnpm type-check
pnpm build
```

`pnpm lint` 会自动修复文件，运行后检查额外差异。涉及交互、路由或上传下载流程时，再使用 `pnpm dev` 做对应场景验证。

## Git 提交

- 生成 Git commit message 时必须使用中文说明，不得使用纯英文；如采用 Conventional Commits，可保留 `feat:`、`fix:` 等类型前缀，但正文必须为中文。
