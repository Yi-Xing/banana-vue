# Banana Vue 项目指令

本文件适用于仓库根目录及其全部子目录。用户当前请求和更高优先级指令始终优先；如有冲突，应明确说明并按优先级更高的要求执行。

## 开始工作

- 开始修改前运行 `git status --short`，保留用户已有改动，不清理、不覆盖无关文件。当前仓库可能仍处于初始化阶段，不得假定未跟踪文件可以删除或重建。
- 先阅读 `package.json`、`vite.config.ts`、受影响目录的相邻实现和已有类型；配置、脚本或目录与本文不一致时，以当前代码为准。
- 使用 `pnpm` 和已提交的 `pnpm-lock.yaml`。不要改用 npm、Yarn，也不要无故重建或大范围刷新锁文件。
- 当前 Node.js 版本要求以 `package.json#engines` 为准；目前为 `^20.19.0 || >=22.12.0`。

## 项目定位与仓库关系

本项目是 Banana 文件管理系统的 Vue 前端。当前是轻量项目骨架，技术栈为 Vue 3、TypeScript、Vite、Vue Router、Pinia 和 Element Plus；尚未默认包含登录、权限、接口或后台管理业务。

相关仓库均按当前仓库根目录计算：

- `../../java/java/banana`：对应后端，文件、目录、对象存储和 SSO 接口以该仓库为准。
- `../../java/java/watermelon`：统一用户与权限服务。
- `../../java/java/water`：后端共享基础组件。
- `../watermelon-vue`：Watermelon 前端，可参考通用技术模式，但不能直接复制其 RBAC 业务逻辑。

任务涉及后端代码、接口契约或跨仓库验证时，先完整阅读 `../../java/java/banana/AGENTS.md` 及其中指定的 `$water-java-projects` 工作流，再按后端依赖顺序处理。

## 目录职责

- `src/views/`：路由级页面。
- `src/components/`：可复用、职责单一的展示或交互组件。
- `src/router/`：路由定义、懒加载以及后续需要的访问守卫。
- `src/stores/`：Pinia 状态；当前无业务状态，新增时按领域拆分。
- `src/styles/`：全局样式、设计变量和基础响应式规则。
- `src/assets/`：由构建工具处理的静态资源。

需要接入后端时，按实际复杂度新增清晰的 `src/api/`、`src/types/`、`src/composables/` 或 `src/services/` 边界，保持请求、业务编排和页面展示分离，不把所有逻辑堆进 Vue 页面。

## 实现约定

- 使用 TypeScript、Composition API 和 `<script setup lang="ts">`；新增接口数据时给出明确类型，避免使用 `any`。
- 沿用 `@/` 指向 `src/` 的别名和现有命名风格。优先复用相邻组件、composable、store 和类型，不复制同类逻辑。
- 保持当前项目轻量。未经明确需求，不提前移植 Watermelon 的登录、权限、管理后台或完整请求层，也不引入新的 UI 框架或状态管理方案。
- 引入文件管理能力时，应覆盖加载、空数据、错误、上传进度、失败重试和无权限状态；不要只实现理想路径。
- 客户端文件名、扩展名、MIME 类型和预览结果均不可信。前端可做体验性校验，但后端必须继续执行权限、大小、类型和路径安全校验。
- 使用 Element Plus 和现有样式体系，保持组件可访问性及宽屏、窄屏布局可用。
- 仅修改任务涉及的文件；格式化或 lint 自动修复后的额外差异必须逐项检查。

## 接口、认证与配置安全

- 接入 Banana API 前先核对 `../../java/java/banana` 的 Controller、DTO/VO 和统一响应结构；不要凭 Watermelon 的接口形状推断 Banana。
- SSO、用户身份和令牌流程应与 Banana 后端及 Watermelon 的公开认证契约对齐；不得在前端另造不兼容的认证协议，也不得仅依赖前端判断保护敏感操作。
- 环境地址统一从配置层或 `import.meta.env` 读取，不在页面和 API 模块中散落硬编码地址。若增加 Vite 代理，使用相对 API 前缀并保持配置集中。
- `VITE_*` 变量会打包到浏览器端，只能保存公开配置，不能用于保存密码、密钥、对象存储凭证、JWT secret 或访问令牌。
- 本地环境值使用被忽略的 `.env.local` 等文件；只提交无敏感信息的示例文件，并使用明显占位符。
- 不在源码、测试、截图、日志或文档中写入真实令牌、Cookie、认证头、账号、真实连接串、私有服务地址或个人信息。

## 验证与交付

安装依赖：

```bash
pnpm install --frozen-lockfile
```

修改后至少运行：

```bash
pnpm type-check
pnpm build
```

需要检查代码风格时运行 `pnpm lint`；该脚本带 `--fix`，运行后必须检查自动修改。仅格式化 `src/` 时可运行 `pnpm format`。涉及交互、路由、上传下载或认证流程时，还应通过 `pnpm dev` 做对应场景的手工验证。

完成后运行 `git diff --check` 和 `git status --short`。交付时说明改动范围、已运行命令、结果，以及因缺少后端、对象存储或浏览器环境而未完成的验证。
