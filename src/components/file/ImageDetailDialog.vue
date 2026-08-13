<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { downloadFileBlob, getFileAccessUrl, recycleFile, updateFile } from '@/api/file'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import { usePermissionStore } from '@/stores/permission'
import type { Category, FileInfo } from '@/types/file'
import { confirmAction } from '@/utils/confirm'
import { formatFileSize, triggerBlobDownload } from '@/utils/file'

const props = defineProps<{
  modelValue: boolean
  file: FileInfo | null
  categories: Category[]
}>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  updated: [file: FileInfo]
  deleted: [id: number]
}>()

const permissionStore = usePermissionStore()
const loading = ref(false)
const downloading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const url = ref('')
const form = reactive({
  displayName: '',
  categoryIds: [] as number[],
  remark: '',
})
let previewRequestId = 0

const canEdit = computed(
  () =>
    props.file?.status === 2 &&
    permissionStore.hasButtonPermission(BUTTON_PERMISSIONS.FILE_UPDATE),
)
const canDelete = computed(
  () =>
    props.file?.status === 2 &&
    permissionStore.hasButtonPermission(BUTTON_PERMISSIONS.FILE_DELETE),
)
const pixelSize = computed(() => {
  const metadata = props.file?.imageMetadata
  return metadata ? `${metadata.width} × ${metadata.height} px` : '—'
})
const fileFormat = computed(() => {
  if (!props.file) return '—'
  const extension = props.file.extension ? props.file.extension.toUpperCase() : '未知格式'
  return `${extension} · ${props.file.mimeType}`
})
const ossLabel = computed(() => {
  const oss = props.file?.oss
  if (!oss) return '—'
  return oss.code ? `${oss.name}（${oss.code}）` : oss.name
})

watch(
  () => [props.modelValue, props.file?.id] as const,
  async ([visible]) => {
    const requestId = ++previewRequestId
    const file = props.file
    url.value = ''
    if (!visible || !file) return

    Object.assign(form, {
      displayName: file.displayName,
      categoryIds: file.categories.map((category) => category.id),
      remark: file.remark,
    })
    loading.value = true
    try {
      const result = await getFileAccessUrl(file.id)
      if (requestId === previewRequestId) url.value = result.url
    } catch (error) {
      if (requestId === previewRequestId)
        ElMessage.error(error instanceof Error ? error.message : '加载图片失败')
    } finally {
      if (requestId === previewRequestId) loading.value = false
    }
  },
)

function close(): void {
  emit('update:modelValue', false)
}

async function download(): Promise<void> {
  const file = props.file
  if (!file) return

  downloading.value = true
  try {
    triggerBlobDownload(await downloadFileBlob(file.id), file.displayName)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '下载失败')
  } finally {
    downloading.value = false
  }
}

async function save(): Promise<void> {
  if (!props.file || !canEdit.value) return
  const displayName = form.displayName.trim()
  if (!displayName) {
    ElMessage.warning('请输入展示名称')
    return
  }

  saving.value = true
  try {
    const updatedFile = await updateFile(
      props.file.id,
      displayName,
      form.categoryIds,
      form.remark.trim(),
    )
    ElMessage.success('图片信息已更新')
    emit('updated', updatedFile)
    close()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '更新失败')
  } finally {
    saving.value = false
  }
}

async function remove(): Promise<void> {
  const file = props.file
  if (!file || !canDelete.value) return
  if (
    !(await confirmAction(`将“${file.displayName}”移入回收站？`, '删除图片', {
      type: 'warning',
    }))
  )
    return

  deleting.value = true
  try {
    await recycleFile(file.id)
    ElMessage.success('图片已移入回收站')
    emit('deleted', file.id)
    close()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '删除失败')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    class="image-detail-dialog"
    width="min(1120px, 94vw)"
    align-center
    destroy-on-close
    :close-on-click-modal="!saving && !deleting"
    :close-on-press-escape="!saving && !deleting"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="dialog-heading">
        <strong>图片详情</strong>
        <span>{{ file?.originalName }}</span>
      </div>
    </template>

    <div v-if="file" class="detail-layout">
      <section v-loading="loading" class="preview-panel">
        <el-image v-if="url" :src="url" fit="contain" :preview-src-list="[url]" />
        <el-empty v-else-if="!loading" description="图片加载失败" />
      </section>

      <aside class="info-panel">
        <el-form label-position="top">
          <el-form-item label="展示名称">
            <el-input
              v-model="form.displayName"
              :disabled="!canEdit"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="分类">
            <el-select
              v-model="form.categoryIds"
              :disabled="!canEdit"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="未选择时使用默认分类"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              :disabled="!canEdit"
              type="textarea"
              :rows="2"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>

        <div class="metadata-list">
          <div><span>像素尺寸</span><strong>{{ pixelSize }}</strong></div>
          <div><span>文件大小</span><strong>{{ formatFileSize(file.sizeBytes) }}</strong></div>
          <div><span>文件格式</span><strong :title="fileFormat">{{ fileFormat }}</strong></div>
          <div><span>OSS</span><strong :title="ossLabel">{{ ossLabel }}</strong></div>
          <div><span>色彩空间</span><strong>{{ file.imageMetadata?.colorSpace || '—' }}</strong></div>
          <div><span>帧数</span><strong>{{ file.imageMetadata?.frameCount || '—' }}</strong></div>
          <div><span>状态</span><strong>{{ file.statusLabel }}</strong></div>
          <div><span>上传时间</span><strong>{{ file.createdTime }}</strong></div>
          <div><span>更新时间</span><strong>{{ file.updatedTime }}</strong></div>
        </div>
      </aside>
    </div>

    <template #footer>
      <div class="dialog-actions">
        <div>
          <el-button
            type="success"
            plain
            :loading="downloading"
            :disabled="saving || deleting"
            @click="download"
            >下载图片</el-button
          >
          <el-button
            v-if="canDelete"
            type="danger"
            plain
            :loading="deleting"
            :disabled="saving || downloading"
            @click="remove"
            >删除图片</el-button
          >
        </div>
        <div>
          <el-button :disabled="saving || deleting || downloading" @click="close">关闭</el-button>
          <el-button
            v-if="canEdit"
            type="primary"
            :loading="saving"
            :disabled="deleting || downloading"
            @click="save"
            >保存</el-button
          >
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-heading {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 12px;
}
.dialog-heading strong {
  flex: none;
  color: var(--ink-strong);
  font-size: 18px;
}
.dialog-heading span {
  overflow: hidden;
  color: var(--ink-subtle);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
}
.preview-panel {
  display: grid;
  min-height: 520px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background: #f6f7f4;
  place-items: center;
}
.preview-panel :deep(.el-image) {
  width: 100%;
  height: min(68vh, 620px);
}
.info-panel {
  min-width: 0;
  padding: 16px 12px 16px 0;
}
.info-panel :deep(.el-select) {
  width: 100%;
}
.metadata-list {
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}
.metadata-list > div {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: 12px;
  min-height: 39px;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.metadata-list > div:last-child {
  border-bottom: 0;
}
.metadata-list span {
  color: var(--ink-subtle);
  font-size: 13px;
}
.metadata-list strong {
  overflow: hidden;
  color: var(--ink-muted);
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.dialog-actions > div {
  display: flex;
  gap: 12px;
}
.dialog-actions .el-button + .el-button {
  margin-left: 0;
}
@media (max-width: 820px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
  .info-panel {
    padding: 16px 0;
  }
  .preview-panel {
    min-height: 300px;
  }
  .preview-panel :deep(.el-image) {
    height: 42vh;
  }
}
</style>
