<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileAccessUrl } from '@/api/file'
import type { FileInfo } from '@/types/file'

const props = defineProps<{ modelValue: boolean; file: FileInfo | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const loading = ref(false)
const url = ref('')
const isImage = computed(() => props.file?.fileType === 1)
const isPdf = computed(() => props.file?.mimeType === 'application/pdf')

watch(
  () => [props.modelValue, props.file?.id] as const,
  async ([visible]) => {
    url.value = ''
    if (!visible || !props.file || (!isImage.value && !isPdf.value)) return
    loading.value = true
    try {
      url.value = (await getFileAccessUrl(props.file.id)).url
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '加载预览失败')
    } finally {
      loading.value = false
    }
  },
)
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="file?.displayName || '文件预览'"
    width="min(920px, 92vw)"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-loading="loading" class="preview-body">
      <el-image v-if="isImage && url" :src="url" fit="contain" :preview-src-list="[url]" />
      <iframe v-else-if="isPdf && url" :src="url" title="PDF 预览" />
      <el-empty v-else-if="!loading" description="该文件类型不支持在线预览，请下载后查看" />
    </div>
  </el-dialog>
</template>

<style scoped>
.preview-body {
  min-height: 420px;
  display: grid;
  place-items: center;
  background: #f4f6f1;
  border-radius: 10px;
  overflow: hidden;
}
.preview-body :deep(.el-image) {
  width: 100%;
  height: min(68vh, 620px);
}
iframe {
  width: 100%;
  height: min(72vh, 680px);
  border: 0;
}
</style>
