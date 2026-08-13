<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  ElMessage,
  genFileId,
  type UploadFile,
  type UploadInstance,
  type UploadProps,
  type UploadRawFile,
} from 'element-plus'
import { Upload, Search } from '@element-plus/icons-vue'
import { listCategories } from '@/api/category'
import {
  deleteFailedRecord,
  downloadFileBlob,
  listFiles,
  recycleFile,
  recycleFiles,
  retryDeleteFile,
  updateFile,
  uploadFile,
} from '@/api/file'
import { listOss } from '@/api/oss'
import FilePreviewDialog from '@/components/file/FilePreviewDialog.vue'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import type { Category, FileInfo, FileQuery, OssConfig } from '@/types/file'
import { confirmAction } from '@/utils/confirm'
import { formatFileSize, triggerBlobDownload } from '@/utils/file'

const loading = ref(false),
  rows = ref<FileInfo[]>([]),
  total = ref(0),
  categories = ref<Category[]>([]),
  ossList = ref<OssConfig[]>([]),
  selected = ref<FileInfo[]>([]),
  recyclingSelected = ref(false)
const query = reactive<FileQuery>({
  keyword: '',
  categoryIds: [],
  fileTypes: [],
  ossId: undefined,
  pageNum: 1,
  pageSize: 20,
})
const uploadVisible = ref(false),
  uploading = ref(false),
  uploadProgress = ref(0),
  uploadRef = ref<UploadInstance>(),
  selectedFile = ref<File | null>(null)
const uploadForm = reactive({
  displayName: '',
  categoryIds: [] as number[],
  ossId: undefined as number | undefined,
  remark: '',
})
const editVisible = ref(false),
  editing = ref<FileInfo | null>(null),
  editForm = reactive({ displayName: '', categoryIds: [] as number[], remark: '' })
const previewVisible = ref(false),
  previewFile = ref<FileInfo | null>(null)
let debounceTimer: number | undefined

async function load(): Promise<void> {
  loading.value = true
  try {
    const page = await listFiles(query)
    rows.value = page.dataList
    total.value = page.total
    selected.value = []
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  } finally {
    loading.value = false
  }
}
async function init(): Promise<void> {
  try {
    ;[categories.value, ossList.value] = await Promise.all([listCategories(1), listOss(1)])
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '初始化失败')
  }
}
function reset(): void {
  Object.assign(query, {
    keyword: '',
    categoryIds: [],
    fileTypes: [],
    ossId: undefined,
    pageNum: 1,
    pageSize: 20,
  })
  void load()
}
function applyFilters(): void {
  query.pageNum = 1
  void load()
}
function handlePageSizeChange(): void {
  query.pageNum = 1
  void load()
}
function handleCurrentPageChange(): void {
  void load()
}
function fileChanged(file: UploadFile): void {
  selectedFile.value = file.raw || null
  if (file.raw) uploadForm.displayName = file.name
}
const replaceFile: UploadProps['onExceed'] = (files) => {
  const file = files[0] as UploadRawFile | undefined
  if (!file) return
  uploadRef.value?.clearFiles()
  file.uid = genFileId()
  uploadRef.value?.handleStart(file)
}
function openUpload(): void {
  uploadRef.value?.clearFiles()
  selectedFile.value = null
  uploadProgress.value = 0
  Object.assign(uploadForm, { displayName: '', categoryIds: [], ossId: undefined, remark: '' })
  uploadVisible.value = true
}
async function submitUpload(): Promise<void> {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }
  uploading.value = true
  uploadProgress.value = 0
  try {
    await uploadFile(
      {
        file: selectedFile.value,
        displayName: uploadForm.displayName,
        categoryIds: uploadForm.categoryIds,
        ossId: uploadForm.ossId,
        remark: uploadForm.remark,
      },
      (value) => (uploadProgress.value = value),
    )
    ElMessage.success('上传成功')
    uploadVisible.value = false
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '上传失败')
  } finally {
    uploading.value = false
  }
}
function openEdit(row: FileInfo): void {
  editing.value = row
  Object.assign(editForm, {
    displayName: row.displayName,
    categoryIds: row.categories.map((c) => c.id),
    remark: row.remark,
  })
  editVisible.value = true
}
async function submitEdit(): Promise<void> {
  if (!editing.value) return
  try {
    await updateFile(editing.value.id, editForm.displayName, editForm.categoryIds, editForm.remark)
    ElMessage.success('更新成功')
    editVisible.value = false
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '更新失败')
  }
}
async function recycle(row: FileInfo): Promise<void> {
  if (
    !(await confirmAction(`将“${row.displayName}”移入回收站？`, '移入回收站', {
      type: 'warning',
    }))
  )
    return
  try {
    await recycleFile(row.id)
    ElMessage.success('已移入回收站')
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}
function canSelect(row: FileInfo): boolean {
  return row.status === 2
}
async function recycleSelected(): Promise<void> {
  if (!selected.value.length) return
  const selectedCount = selected.value.length
  if (
    !(await confirmAction(`将选中的 ${selectedCount} 个文件移入回收站？`, '批量删除', {
      type: 'warning',
    }))
  )
    return
  recyclingSelected.value = true
  try {
    await recycleFiles(selected.value.map((item) => item.id))
    ElMessage.success(`已将 ${selectedCount} 个文件移入回收站`)
    const remainingTotal = total.value - selectedCount
    if (query.pageNum > 1 && remainingTotal <= (query.pageNum - 1) * query.pageSize)
      query.pageNum -= 1
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '批量删除失败')
  } finally {
    recyclingSelected.value = false
  }
}
async function removeFailed(row: FileInfo): Promise<void> {
  try {
    await deleteFailedRecord(row.id)
    ElMessage.success('失败记录已删除')
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}
async function retry(row: FileInfo): Promise<void> {
  try {
    await retryDeleteFile(row.id)
    ElMessage.success('删除重试成功')
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '重试失败')
  }
}
async function download(row: FileInfo): Promise<void> {
  try {
    triggerBlobDownload(await downloadFileBlob(row.id), row.displayName)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '下载失败')
  }
}
function canPreview(row: FileInfo): boolean {
  return row.status === 2 && (row.fileType === 1 || row.mimeType === 'application/pdf')
}
function preview(row: FileInfo): void {
  if (!canPreview(row)) return
  previewFile.value = row
  previewVisible.value = true
}
watch(
  () => query.keyword,
  () => {
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => {
      query.pageNum = 1
      void load()
    }, 350)
  },
)
onBeforeUnmount(() => window.clearTimeout(debounceTimer))
onMounted(init)
</script>

<template>
  <section class="management-page">
    <header class="page-heading">
      <div>
        <h1>文件管理</h1>
        <span class="heading-meta-text">单文件上限 100MB</span>
      </div>
      <div>
        <el-button
          v-permission="BUTTON_PERMISSIONS.FILE_DELETE"
          type="danger"
          plain
          :disabled="!selected.length"
          :loading="recyclingSelected"
          @click="recycleSelected"
          >删除选中</el-button
        ><el-button
          v-permission="BUTTON_PERMISSIONS.FILE_UPLOAD"
          type="primary"
          :icon="Upload"
          @click="openUpload"
          >上传文件</el-button
        >
      </div>
    </header>
    <div class="toolbar">
      <el-input v-model="query.keyword" class="grow" clearable placeholder="搜索文件名称"
        ><template #prefix
          ><el-icon><Search /></el-icon></template></el-input
      ><el-select v-model="query.categoryIds" multiple collapse-tags clearable placeholder="分类"
        ><el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.name"
          :value="item.id" /></el-select
      ><el-select v-model="query.fileTypes" multiple collapse-tags clearable placeholder="文件类型"
        ><el-option
          v-for="item in [
            { v: 1, l: '图片' },
            { v: 2, l: '文档' },
            { v: 3, l: '压缩包' },
            { v: 4, l: '程序' },
            { v: 5, l: '视频' },
            { v: 6, l: '音频' },
            { v: 7, l: '其它' },
          ]"
          :key="item.v"
          :label="item.l"
          :value="item.v" /></el-select
      ><el-select v-model="query.ossId" clearable placeholder="OSS"
        ><el-option
          v-for="item in ossList"
          :key="item.id"
          :label="item.name"
          :value="item.id" /></el-select
      ><el-button type="primary" :icon="Search" @click="applyFilters">筛选</el-button
      ><el-button @click="reset">重置</el-button>
    </div>
    <el-card class="content-card"
      ><el-table v-loading="loading" :data="rows" stripe @selection-change="selected = $event"
        ><el-table-column type="selection" width="46" :selectable="canSelect" /><el-table-column
          label="文件名"
          min-width="230"
          ><template #default="{ row }"
            ><div class="file-name">
              <el-button
                v-if="canPreview(row)"
                class="file-name-button"
                type="primary"
                link
                title="点击预览"
                @click="preview(row)"
                >{{ row.displayName }}</el-button
              ><b v-else>{{ row.displayName }}</b>
            </div></template
          ></el-table-column
        ><el-table-column label="类型 / 大小" width="135"
          ><template #default="{ row }"
            >{{ row.fileTypeLabel }}
            <div class="muted">{{ formatFileSize(row.sizeBytes) }}</div></template
          ></el-table-column
        ><el-table-column label="分类" min-width="160"
          ><template #default="{ row }"
            ><el-tag
              v-for="item in row.categories"
              :key="item.id"
              class="category-tag"
              size="small"
              >{{ item.name }}</el-tag
            ></template
          ></el-table-column
        ><el-table-column label="OSS" width="125"
          ><template #default="{ row }">{{ row.oss.name }}</template></el-table-column
        ><el-table-column label="状态" width="105"
          ><template #default="{ row }"
            ><el-tag
              :type="
                row.status === 2
                  ? 'success'
                  : row.status === 3 || row.status === 6
                    ? 'danger'
                    : 'warning'
              "
              >{{ row.statusLabel }}</el-tag
            ></template
          ></el-table-column
        ><el-table-column prop="updatedTime" label="更新时间" width="170" /><el-table-column
          label="操作"
          width="230"
          fixed="right"
          ><template #default="{ row }"
            ><div class="table-actions">
              <el-button v-if="row.status === 2" type="success" size="small" @click="download(row)"
                >下载</el-button
              ><el-button
                v-if="row.status === 2"
                v-permission="BUTTON_PERMISSIONS.FILE_UPDATE"
                type="primary"
                size="small"
                @click="openEdit(row)"
                >编辑</el-button
              ><el-button
                v-if="row.status === 2"
                v-permission="BUTTON_PERMISSIONS.FILE_DELETE"
                type="danger"
                size="small"
                @click="recycle(row)"
                >删除</el-button
              ><el-button
                v-if="row.status === 3"
                type="danger"
                size="small"
                @click="removeFailed(row)"
                >删记录</el-button
              ><el-button v-if="row.status === 6" type="warning" size="small" @click="retry(row)"
                >重试删除</el-button
              >
            </div></template
          ></el-table-column
        ></el-table
      >
      <div class="pagination">
        <el-pagination
          v-model:current-page="query.pageNum"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :pager-count="7"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        /></div
    ></el-card>
    <el-dialog v-model="uploadVisible" title="上传文件" width="560px" align-center
      ><el-form label-position="top"
        ><el-form-item label="选择文件"
          ><el-upload
            ref="uploadRef"
            drag
            :auto-upload="false"
            :limit="1"
            :on-change="fileChanged"
            :on-exceed="replaceFile"
            ><el-icon class="upload-icon"><Upload /></el-icon>
            <div>拖拽文件到这里，或点击选择</div>
            <template #tip
              ><span
                >单文件不超过 100MB；上传失败后会保留记录，可在列表中定位和清理。</span
              ></template
            ></el-upload
          ></el-form-item
        ><el-form-item label="展示名称"
          ><el-input v-model="uploadForm.displayName" maxlength="100" /></el-form-item
        ><el-form-item label="分类"
          ><el-select v-model="uploadForm.categoryIds" multiple placeholder="未选择时使用默认分类"
            ><el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id" /></el-select></el-form-item
        ><el-form-item label="OSS"
          ><el-select v-model="uploadForm.ossId" clearable placeholder="未选择时使用默认 OSS"
            ><el-option
              v-for="item in ossList"
              :key="item.id"
              :label="item.name"
              :value="item.id" /></el-select></el-form-item
        ><el-form-item label="备注"
          ><el-input v-model="uploadForm.remark" type="textarea" maxlength="500" /></el-form-item
        ><el-progress v-if="uploading" :percentage="uploadProgress" /></el-form
      ><template #footer
        ><el-button @click="uploadVisible = false">取消</el-button
        ><el-button type="primary" :loading="uploading" @click="submitUpload"
          >上传</el-button
        ></template
      ></el-dialog
    >
    <el-dialog v-model="editVisible" title="编辑文件" width="520px" align-center
      ><el-form label-position="top"
        ><el-form-item label="展示名称"><el-input v-model="editForm.displayName" /></el-form-item
        ><el-form-item label="分类"
          ><el-select v-model="editForm.categoryIds" multiple
            ><el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id" /></el-select></el-form-item
        ><el-form-item label="备注"
          ><el-input v-model="editForm.remark" type="textarea" /></el-form-item></el-form
      ><template #footer
        ><el-button @click="editVisible = false">取消</el-button
        ><el-button type="primary" @click="submitEdit">保存</el-button></template
      ></el-dialog
    >
    <FilePreviewDialog v-model="previewVisible" :file="previewFile" />
  </section>
</template>

<style scoped>
.toolbar :deep(.el-select) {
  width: 175px;
}
.file-name {
  min-width: 0;
}
.file-name b {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-name-button {
  display: flex;
  max-width: 100%;
  height: auto;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
}
.file-name-button :deep(span) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.muted {
  color: var(--ink-subtle);
  font-size: 12px;
}
.category-tag {
  --el-tag-bg-color: #f3f4f2;
  --el-tag-border-color: #d8dcd7;
  --el-tag-text-color: var(--ink-muted);
  margin: 2px 4px 2px 0;
}
.el-form :deep(.el-select),
.el-form :deep(.el-upload),
.el-form :deep(.el-upload-dragger) {
  width: 100%;
}
.upload-icon {
  margin-bottom: 8px;
  font-size: 34px;
  color: var(--brand);
}
</style>
