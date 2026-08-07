<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/option/style/css'
import 'element-plus/es/components/select/style/css'

import { addOss, type OssAddRequest } from '@/api/oss'
import { ApiError } from '@/api/http'
import AppHeader from '@/components/AppHeader.vue'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const dialogVisible = ref(false)
const submitting = ref(false)

const form = reactive<OssAddRequest>({
  name: '',
  type: null,
  code: '',
  state: 1,
  domainName: '',
  accessKey: '',
  secretKey: '',
  remark: '',
})

async function submit(): Promise<void> {
  const accessToken = authStore.getValidAccessToken()
  if (!accessToken || submitting.value) return

  submitting.value = true
  try {
    const created = await addOss(accessToken, form)
    ElMessage.success(`OSS「${created.name}」创建成功`)
    dialogVisible.value = false
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      ElMessage.error('当前用户没有新增 OSS 接口权限')
      return
    }
    ElMessage.error(error instanceof Error ? error.message : '新增 OSS 失败')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="oss-page">
    <AppHeader />
    <main class="page-container oss-main">
      <div class="heading-row">
        <div>
          <p class="eyebrow">Protected workspace</p>
          <h1>OSS 管理</h1>
          <p class="description">页面、按钮和新增接口分别由用户中心的资源权限控制。</p>
        </div>
        <el-button
          v-permission="BUTTON_PERMISSIONS.ADMIN_OSS_ADD"
          type="primary"
          size="large"
          @click="dialogVisible = true"
        >
          新增 OSS
        </el-button>
      </div>

      <section class="empty-state" aria-label="OSS 管理说明">
        <span>OSS / ADMIN</span>
        <h2>权限验证页面</h2>
        <p>拥有页面权限时可进入这里；拥有按钮权限时才会显示“新增 OSS”。提交操作仍由后端接口权限独立校验。</p>
      </section>
    </main>

    <el-dialog v-model="dialogVisible" title="新增 OSS" width="min(560px, calc(100% - 32px))">
      <el-form :model="form" label-width="84px">
        <el-form-item label="名称"><el-input v-model="form.name" placeholder="2～10 个字符" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择 OSS 类型" style="width: 100%">
            <el-option label="阿里云" :value="1" />
            <el-option label="七牛云" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="唯一标识"><el-input v-model="form.code" placeholder="例如 aliyun-main" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.state" style="width: 100%"><el-option label="启用" :value="1" /><el-option label="禁用" :value="0" /></el-select>
        </el-form-item>
        <el-form-item label="域名"><el-input v-model="form.domainName" placeholder="https://example.com" /></el-form-item>
        <el-form-item label="AccessKey"><el-input v-model="form.accessKey" /></el-form-item>
        <el-form-item label="SecretKey"><el-input v-model="form.secretKey" type="password" show-password /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.oss-page {
  min-height: 100vh;
}

.oss-main {
  padding-top: 80px;
  padding-bottom: 96px;
}

.heading-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.eyebrow,
.empty-state span {
  color: var(--leaf);
  font-family: var(--font-functional);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1 {
  margin-top: 12px;
  font-family: var(--font-display);
  font-size: clamp(42px, 6vw, 72px);
  letter-spacing: -0.055em;
}

.description {
  margin-top: 16px;
  color: var(--ink-muted);
  font-size: 17px;
}

.empty-state {
  display: grid;
  min-height: 360px;
  margin-top: 56px;
  place-content: center;
  padding: 48px;
  border: 1px dashed rgba(36, 46, 28, 0.26);
  border-radius: 28px 8px 28px 8px;
  background: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.empty-state h2 {
  margin-top: 18px;
  font-family: var(--font-display);
  font-size: 30px;
}

.empty-state p {
  max-width: 620px;
  margin-top: 14px;
  color: var(--ink-muted);
  line-height: 1.8;
}

:deep(.el-button--primary) {
  --el-button-bg-color: var(--ink-strong);
  --el-button-border-color: var(--ink-strong);
  --el-button-hover-bg-color: var(--leaf);
  --el-button-hover-border-color: var(--leaf);
}

@media (max-width: 640px) {
  .heading-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .empty-state {
    min-height: 320px;
    padding: 32px 22px;
  }
}
</style>
