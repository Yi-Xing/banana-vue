<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { createOss, deleteOss, listOss, testOss, testSavedOss, updateOss } from '@/api/oss'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import type { OssConfig, OssPayload } from '@/types/file'
import {
  BUSINESS_CODE_MAX_LENGTH,
  BUSINESS_CODE_MESSAGE,
  BUSINESS_CODE_PATTERN,
} from '@/utils/businessCode'
import { confirmAction } from '@/utils/confirm'

const OSS_TYPE = {
  LOCAL: 1,
  ALIYUN: 2,
  QINIU: 3,
  S3: 4,
} as const
const rows = ref<OssConfig[]>([]),
  loading = ref(false),
  visible = ref(false),
  submitting = ref(false),
  testing = ref(false),
  editingId = ref<number | null>(null)
const emptyForm = (): OssPayload => ({
  name: '',
  code: '',
  type: OSS_TYPE.LOCAL,
  endpoint: '',
  region: '',
  bucket: '',
  accessKey: '',
  secretKey: '',
  pathPrefix: '',
  publicDomain: '',
  accessMode: 1,
  state: 1,
  remark: '',
})
const form = reactive<OssPayload>(emptyForm())
const formRef = ref<FormInstance>()
const isLocalStorage = computed(() => form.type === OSS_TYPE.LOCAL)
const formRules: FormRules = {
  code: [{ pattern: BUSINESS_CODE_PATTERN, message: BUSINESS_CODE_MESSAGE, trigger: 'blur' }],
}

watch(
  () => form.type,
  (type) => {
    if (type !== OSS_TYPE.LOCAL) return
    form.endpoint = ''
    form.region = ''
    form.accessMode = 1
    form.accessKey = ''
    form.secretKey = ''
  },
)

async function load(): Promise<void> {
  loading.value = true
  try {
    rows.value = await listOss()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  } finally {
    loading.value = false
  }
}
function openCreate(): void {
  editingId.value = null
  Object.assign(form, emptyForm())
  visible.value = true
}
function openEdit(row: OssConfig): void {
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    code: row.code ?? '',
    type: row.type,
    endpoint: row.endpoint || '',
    region: row.region || '',
    bucket: row.bucket,
    accessKey: '',
    secretKey: '',
    pathPrefix: row.pathPrefix || '',
    publicDomain: row.publicDomain || '',
    accessMode: row.accessMode,
    state: row.state,
    remark: row.remark,
  })
  visible.value = true
}
async function submit(): Promise<void> {
  if (!formRef.value || !(await formRef.value.validate().catch(() => false))) return
  submitting.value = true
  try {
    if (editingId.value) await updateOss(editingId.value, form)
    else await createOss(form)
    ElMessage.success('保存成功')
    visible.value = false
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    submitting.value = false
  }
}
async function testCurrent(): Promise<void> {
  testing.value = true
  try {
    if (editingId.value && !form.accessKey && !form.secretKey) await testSavedOss(editingId.value)
    else await testOss(form)
    ElMessage.success('连接测试成功')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '测试失败')
  } finally {
    testing.value = false
  }
}
async function testRow(row: OssConfig): Promise<void> {
  try {
    await testSavedOss(row.id)
    ElMessage.success(`${row.name} 连接正常`)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '测试失败')
  }
}
async function remove(row: OssConfig): Promise<void> {
  if (!(await confirmAction(`确定删除 OSS“${row.name}”吗？`, '删除 OSS', { type: 'warning' })))
    return
  try {
    await deleteOss(row.id)
    ElMessage.success('删除成功')
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}
onMounted(load)
</script>

<template>
  <section class="management-page">
    <header class="page-heading">
      <div>
        <h1>OSS 管理</h1>
      </div>
      <el-button
        v-permission="BUTTON_PERMISSIONS.OSS_ADD"
        type="primary"
        :icon="Plus"
        @click="openCreate"
        >新增 OSS</el-button
      >
    </header>
    <el-card class="content-card"
      ><el-table v-loading="loading" :data="rows" stripe
        ><el-table-column label="名称 / Code" width="170"
          ><template #default="{ row }"
            ><b>{{ row.name }}</b
            ><el-tag v-if="row.code === 'default'" class="default-tag" size="small">默认</el-tag>
            <div class="muted">{{ row.code || '—' }}</div></template
          ></el-table-column
        ><el-table-column prop="typeLabel" label="类型" width="120" /><el-table-column
          label="Bucket / 目录"
          min-width="170"
          ><template #default="{ row }"
            >{{ row.bucket }}
            <div class="muted">{{ row.region || '未指定地域' }}</div></template
          ></el-table-column
        ><el-table-column label="访问" width="105"
          ><template #default="{ row }"
            ><el-tag :type="row.accessMode === 1 ? 'success' : 'warning'">{{
              row.accessModeLabel
            }}</el-tag></template
          ></el-table-column
        ><el-table-column label="状态" width="90"
          ><template #default="{ row }"
            ><el-tag :type="row.state === 1 ? 'success' : 'info'">{{
              row.stateLabel
            }}</el-tag></template
          ></el-table-column
        ><el-table-column label="凭据" width="130"
          ><template #default="{ row }">{{
            row.type === OSS_TYPE.LOCAL ? '无需配置' : row.accessKeyMasked || '未配置'
          }}</template></el-table-column
        ><el-table-column label="操作" width="230" fixed="right"
          ><template #default="{ row }"
            ><div class="table-actions">
              <el-button
                v-permission="BUTTON_PERMISSIONS.OSS_TEST"
                size="small"
                @click="testRow(row)"
                >测试</el-button
              ><el-button
                v-permission="BUTTON_PERMISSIONS.OSS_UPDATE"
                type="primary"
                size="small"
                @click="openEdit(row)"
                >编辑</el-button
              ><el-button
                v-if="row.code !== 'default'"
                v-permission="BUTTON_PERMISSIONS.OSS_DELETE"
                type="danger"
                size="small"
                @click="remove(row)"
                >删除</el-button
              >
            </div></template
          ></el-table-column
        ></el-table
      ></el-card
    >
    <el-dialog
      v-model="visible"
      :title="editingId ? '编辑 OSS' : '新增 OSS'"
      width="min(760px,94vw)"
      align-center
      ><el-form ref="formRef" :model="form" :rules="formRules" label-position="top"
        ><div class="form-grid">
          <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item
          ><el-form-item label="Code" prop="code"
            ><el-input
              v-model="form.code"
              :maxlength="BUSINESS_CODE_MAX_LENGTH"
              show-word-limit
              placeholder="选填；小写字母、数字、_、-"
            />
            <div class="hint">值为 default 时作为默认 OSS</div></el-form-item
          ><el-form-item label="类型"
            ><el-select v-model="form.type"
              ><el-option label="本地存储" :value="OSS_TYPE.LOCAL" /><el-option
                label="阿里云"
                :value="OSS_TYPE.ALIYUN" /><el-option
                label="七牛云"
                :value="OSS_TYPE.QINIU" /><el-option
                label="S3 兼容"
                :value="OSS_TYPE.S3" /></el-select></el-form-item
          ><el-form-item label="访问模式"
            ><el-select v-model="form.accessMode" :disabled="isLocalStorage"
              ><el-option label="公开" :value="1" /><el-option
                label="私有"
                :value="2" /></el-select></el-form-item
          ><el-form-item v-if="!isLocalStorage" label="Endpoint"
            ><el-input v-model="form.endpoint" placeholder="服务访问端点" /></el-form-item
          ><el-form-item v-if="!isLocalStorage" label="Region"
            ><el-input v-model="form.region" placeholder="存储地域" /></el-form-item
          ><el-form-item :label="isLocalStorage ? '本地目录名' : 'Bucket'"
            ><el-input
              v-model="form.bucket"
              :placeholder="
                isLocalStorage ? '例如 files，仅作为本地根目录下的子目录' : '存储空间名称'
              "
            />
            <div v-if="isLocalStorage" class="hint">
              仅支持字母、数字、点、下划线和中划线，不可填写服务器绝对路径
            </div></el-form-item
          ><el-form-item label="Path Prefix"
            ><el-input v-model="form.pathPrefix" placeholder="可选，对象键统一前缀" /></el-form-item
          ><el-form-item label="Public Domain"
            ><el-input
              v-model="form.publicDomain"
              :placeholder="
                isLocalStorage ? '可选，留空使用 Banana 本地文件访问路径' : '公开域名或七牛下载域名'
              " /></el-form-item
          ><el-form-item label="状态"
            ><el-select v-model="form.state"
              ><el-option label="启用" :value="1" /><el-option
                label="禁用"
                :value="2" /></el-select></el-form-item
          ><el-form-item v-if="!isLocalStorage" label="AccessKey"
            ><el-input
              v-model="form.accessKey"
              :placeholder="editingId ? '留空保持不变' : ''"
              autocomplete="off" /></el-form-item
          ><el-form-item v-if="!isLocalStorage" label="SecretKey"
            ><el-input
              v-model="form.secretKey"
              type="password"
              show-password
              :placeholder="editingId ? '留空保持不变' : ''"
              autocomplete="new-password"
          /></el-form-item>
        </div>
        <el-form-item label="备注"
          ><el-input
            v-model="form.remark"
            type="textarea"
            maxlength="500" /></el-form-item></el-form
      ><template #footer
        ><el-button :loading="testing" @click="testCurrent">测试连接</el-button
        ><el-button @click="visible = false">取消</el-button
        ><el-button type="primary" :loading="submitting" @click="submit">保存</el-button></template
      ></el-dialog
    >
  </section>
</template>

<style scoped>
.default-tag {
  --el-tag-bg-color: #f5f2e8;
  --el-tag-border-color: #ddd5bc;
  --el-tag-text-color: #625b43;
  margin-left: 8px;
}
.muted,
.hint {
  margin-top: 4px;
  color: var(--ink-subtle);
  font-size: 12px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 18px;
}
.form-grid :deep(.el-select) {
  width: 100%;
}
@media (max-width: 620px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
