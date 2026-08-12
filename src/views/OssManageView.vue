<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createOss, deleteOss, listOss, testOss, testSavedOss, updateOss } from '@/api/oss'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import type { OssConfig, OssPayload } from '@/types/file'
import {
  BUSINESS_CODE_MAX_LENGTH,
  BUSINESS_CODE_MESSAGE,
  BUSINESS_CODE_PATTERN,
} from '@/utils/businessCode'
import { confirmAction } from '@/utils/confirm'

const rows = ref<OssConfig[]>([]),
  loading = ref(false),
  visible = ref(false),
  submitting = ref(false),
  testing = ref(false),
  editingId = ref<number | null>(null)
const emptyForm = (): OssPayload => ({
  name: '',
  code: '',
  type: 1,
  endpoint: '',
  region: '',
  bucket: '',
  accessKey: '',
  secretKey: '',
  pathPrefix: '',
  publicDomain: '',
  accessMode: 2,
  state: 1,
  remark: '',
})
const form = reactive<OssPayload>(emptyForm())
const formRef = ref<FormInstance>()
const formRules: FormRules = {
  code: [
    { required: true, message: '请输入 OSS Code', trigger: 'blur' },
    { pattern: BUSINESS_CODE_PATTERN, message: BUSINESS_CODE_MESSAGE, trigger: 'blur' },
  ],
}

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
    code: row.code,
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
        <p>Storage</p>
        <h1>OSS 管理</h1>
        <span>统一配置阿里云、七牛云和 S3 兼容存储；code 为 default 时作为默认 OSS。</span>
      </div>
      <el-button v-permission="BUTTON_PERMISSIONS.OSS_ADD" type="primary" @click="openCreate"
        >新增 OSS</el-button
      >
    </header>
    <el-card class="content-card"
      ><el-table v-loading="loading" :data="rows"
        ><el-table-column label="名称 / Code" min-width="190"
          ><template #default="{ row }"
            ><b>{{ row.name }}</b>
            <div class="muted">{{ row.code }}</div></template
          ></el-table-column
        ><el-table-column prop="typeLabel" label="类型" width="120" /><el-table-column
          label="Bucket"
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
        ><el-table-column label="默认" width="75"
          ><template #default="{ row }"
            ><el-tag v-if="row.code === 'default'">默认</el-tag><span v-else>—</span></template
          ></el-table-column
        ><el-table-column label="凭据" width="130"
          ><template #default="{ row }">{{
            row.accessKeyMasked || '未配置'
          }}</template></el-table-column
        ><el-table-column label="操作" width="205" fixed="right"
          ><template #default="{ row }"
            ><el-button v-permission="BUTTON_PERMISSIONS.OSS_TEST" link @click="testRow(row)"
              >测试</el-button
            ><el-button
              v-permission="BUTTON_PERMISSIONS.OSS_UPDATE"
              link
              type="primary"
              @click="openEdit(row)"
              >编辑</el-button
            ><el-button
              v-if="row.code !== 'default'"
              v-permission="BUTTON_PERMISSIONS.OSS_DELETE"
              link
              type="danger"
              @click="remove(row)"
              >删除</el-button
            ></template
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
              placeholder="小写字母、数字、_、-，最长254个字符"
            />
            <div class="hint">RPC 外部系统通过 code 定位；值为 default 时作为默认 OSS</div></el-form-item
          ><el-form-item label="类型"
            ><el-select v-model="form.type"
              ><el-option label="阿里云" :value="1" /><el-option
                label="七牛云"
                :value="2" /><el-option label="S3 兼容" :value="3" /></el-select></el-form-item
          ><el-form-item label="访问模式"
            ><el-select v-model="form.accessMode"
              ><el-option label="公开" :value="1" /><el-option
                label="私有"
                :value="2" /></el-select></el-form-item
          ><el-form-item label="Endpoint"
            ><el-input v-model="form.endpoint" placeholder="服务访问端点" /></el-form-item
          ><el-form-item label="Region"
            ><el-input v-model="form.region" placeholder="存储地域" /></el-form-item
          ><el-form-item label="Bucket"
            ><el-input v-model="form.bucket" placeholder="存储空间名称" /></el-form-item
          ><el-form-item label="Path Prefix"
            ><el-input v-model="form.pathPrefix" placeholder="可选，对象键统一前缀" /></el-form-item
          ><el-form-item label="Public Domain"
            ><el-input
              v-model="form.publicDomain"
              placeholder="公开域名或七牛下载域名" /></el-form-item
          ><el-form-item label="状态"
            ><el-select v-model="form.state"
              ><el-option label="启用" :value="1" /><el-option
                label="禁用"
                :value="2" /></el-select></el-form-item
          ><el-form-item label="AccessKey"
            ><el-input
              v-model="form.accessKey"
              :placeholder="editingId ? '留空保持不变' : ''"
              autocomplete="off" /></el-form-item
          ><el-form-item label="SecretKey"
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
.muted,
.hint {
  margin-top: 4px;
  color: #969c92;
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
