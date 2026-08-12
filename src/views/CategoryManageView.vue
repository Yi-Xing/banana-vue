<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { createCategory, deleteCategory, listCategories, updateCategory } from '@/api/category'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import type { Category, CategoryPayload } from '@/types/file'
import {
  BUSINESS_CODE_MAX_LENGTH,
  BUSINESS_CODE_MESSAGE,
  BUSINESS_CODE_PATTERN,
} from '@/utils/businessCode'
import { confirmAction } from '@/utils/confirm'

const loading = ref(false),
  submitting = ref(false),
  visible = ref(false)
const rows = ref<Category[]>([]),
  editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const form = reactive<CategoryPayload>({ name: '', code: '', orderNum: 0, state: 1, remark: '' })
const formRules: FormRules = {
  code: [
    { required: true, message: '请输入分类 Code', trigger: 'blur' },
    { pattern: BUSINESS_CODE_PATTERN, message: BUSINESS_CODE_MESSAGE, trigger: 'blur' },
  ],
}

async function load(): Promise<void> {
  loading.value = true
  try {
    rows.value = await listCategories()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  } finally {
    loading.value = false
  }
}
function openCreate(): void {
  editingId.value = null
  Object.assign(form, { name: '', code: '', orderNum: 0, state: 1, remark: '' })
  visible.value = true
}
function openEdit(row: Category): void {
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    code: row.code,
    orderNum: row.orderNum,
    state: row.state,
    remark: row.remark,
  })
  visible.value = true
}
async function submit(): Promise<void> {
  if (!formRef.value || !(await formRef.value.validate().catch(() => false))) return
  submitting.value = true
  try {
    if (editingId.value) await updateCategory(editingId.value, form)
    else await createCategory(form)
    ElMessage.success('保存成功')
    visible.value = false
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    submitting.value = false
  }
}
async function remove(row: Category): Promise<void> {
  if (!(await confirmAction(`确定删除分类“${row.name}”吗？`, '删除分类', { type: 'warning' })))
    return
  try {
    await deleteCategory(row.id)
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
        <p>Category</p>
        <h1>分类管理</h1>
        <span>分类 code 可修改；系统默认分类固定为 default。</span>
      </div>
      <el-button
        v-permission="BUTTON_PERMISSIONS.CATEGORY_ADD"
        type="primary"
        :icon="Plus"
        @click="openCreate"
        >新增分类</el-button
      >
    </header>
    <el-card class="content-card"
      ><el-table v-loading="loading" :data="rows" stripe
        ><el-table-column prop="name" label="名称" min-width="150"
          ><template #default="{ row }"
            ><b>{{ row.name }}</b
            ><el-tag v-if="row.defaultCategory" class="default-tag" size="small"
              >默认</el-tag
            ></template
          ></el-table-column
        ><el-table-column prop="code" label="Code" min-width="170" /><el-table-column
          prop="fileCount"
          label="文件数"
          width="90"
        /><el-table-column prop="orderNum" label="排序" width="80" /><el-table-column
          label="状态"
          width="90"
          ><template #default="{ row }"
            ><el-tag :type="row.state === 1 ? 'success' : 'info'">{{
              row.stateLabel
            }}</el-tag></template
          ></el-table-column
        ><el-table-column
          prop="remark"
          label="备注"
          min-width="180"
          show-overflow-tooltip
        /><el-table-column label="操作" width="150" fixed="right"
          ><template #default="{ row }"
            ><div class="table-actions">
              <el-button
                v-permission="BUTTON_PERMISSIONS.CATEGORY_UPDATE"
                type="primary"
                size="small"
                @click="openEdit(row)"
                >编辑</el-button
              ><el-button
                v-if="!row.defaultCategory"
                v-permission="BUTTON_PERMISSIONS.CATEGORY_DELETE"
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
      :title="editingId ? '编辑分类' : '新增分类'"
      width="520px"
      align-center
      ><el-form ref="formRef" :model="form" :rules="formRules" label-position="top"
        ><el-form-item label="名称"><el-input v-model="form.name" maxlength="10" /></el-form-item
        ><el-form-item label="Code" prop="code"
          ><el-input
            v-model="form.code"
            :disabled="editingId !== null && form.code === 'default'"
            :maxlength="BUSINESS_CODE_MAX_LENGTH"
            show-word-limit
            placeholder="小写字母、数字、_、-，最长254个字符"
        /></el-form-item>
        <div class="form-grid">
          <el-form-item label="排序"
            ><el-input-number v-model="form.orderNum" :min="0" /></el-form-item
          ><el-form-item label="状态"
            ><el-select v-model="form.state" :disabled="form.code === 'default'"
              ><el-option label="启用" :value="1" /><el-option label="禁用" :value="2" /></el-select
          ></el-form-item>
        </div>
        <el-form-item label="备注"
          ><el-input
            v-model="form.remark"
            type="textarea"
            maxlength="500"
            show-word-limit /></el-form-item></el-form
      ><template #footer
        ><el-button @click="visible = false">取消</el-button
        ><el-button type="primary" :loading="submitting" @click="submit">保存</el-button></template
      ></el-dialog
    >
  </section>
</template>

<style scoped>
.default-tag {
  margin-left: 8px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-grid :deep(.el-select),
.form-grid :deep(.el-input-number) {
  width: 100%;
}
</style>
