<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { listCategories } from '@/api/category'
import { listImages } from '@/api/image'
import { getFileAccessUrl } from '@/api/file'
import FilePreviewDialog from '@/components/file/FilePreviewDialog.vue'
import type { Category, FileInfo, FileQuery } from '@/types/file'
import { formatFileSize } from '@/utils/file'

const rows = ref<FileInfo[]>([]),
  categories = ref<Category[]>([]),
  total = ref(0),
  loading = ref(false),
  previewVisible = ref(false),
  previewFile = ref<FileInfo | null>(null),
  accessUrls = ref<Record<number, string>>({})
const query = reactive<FileQuery>({
  keyword: '',
  categoryIds: [],
  minImageWidth: undefined,
  maxImageWidth: undefined,
  minImageHeight: undefined,
  maxImageHeight: undefined,
  colorSpaces: [],
  pageNum: 1,
  pageSize: 24,
})
async function load(): Promise<void> {
  loading.value = true
  try {
    const page = await listImages(query)
    rows.value = page.dataList
    total.value = page.total
    const pairs = await Promise.all(
      page.dataList.map(async (file) => {
        try {
          return [file.id, (await getFileAccessUrl(file.id)).url] as const
        } catch {
          return [file.id, ''] as const
        }
      }),
    )
    accessUrls.value = Object.fromEntries(pairs)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  } finally {
    loading.value = false
  }
}
function preview(file: FileInfo): void {
  previewFile.value = file
  previewVisible.value = true
}
function applyFilters(): void {
  query.pageNum = 1
  void load()
}
function reset(): void {
  Object.assign(query, {
    keyword: '',
    categoryIds: [],
    minImageWidth: undefined,
    maxImageWidth: undefined,
    minImageHeight: undefined,
    maxImageHeight: undefined,
    colorSpaces: [],
    pageNum: 1,
    pageSize: 24,
  })
  void load()
}
onMounted(async () => {
  try {
    categories.value = await listCategories(1)
  } catch {}
  await load()
})
</script>

<template>
  <section class="management-page">
    <header class="page-heading">
      <div>
        <p>Images</p>
        <h1>图片视图</h1>
        <span>按分类、尺寸和色彩空间筛选已上传图片。</span>
      </div>
    </header>
    <div class="toolbar">
      <el-input v-model="query.keyword" class="grow" clearable placeholder="搜索图片" /><el-select
        v-model="query.categoryIds"
        multiple
        collapse-tags
        clearable
        placeholder="分类"
        ><el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.name"
          :value="item.id" /></el-select
      ><el-input-number
        v-model="query.minImageWidth"
        :min="1"
        placeholder="最小宽"
        controls-position="right"
      /><span>×</span
      ><el-input-number
        v-model="query.minImageHeight"
        :min="1"
        placeholder="最小高"
        controls-position="right"
      /><el-select
        v-model="query.colorSpaces"
        multiple
        collapse-tags
        clearable
        placeholder="色彩空间"
        ><el-option label="RGB" value="RGB" /><el-option label="GRAY" value="GRAY" /><el-option
          label="CMYK"
          value="CMYK" /></el-select
      ><el-button type="primary" @click="applyFilters">筛选</el-button
      ><el-button link @click="reset">重置</el-button>
    </div>
    <div v-loading="loading" class="image-grid">
      <button
        v-for="file in rows"
        :key="file.id"
        class="image-card"
        type="button"
        @click="preview(file)"
      >
        <el-image :src="accessUrls[file.id]" fit="cover"
          ><template #error><div class="image-fallback">IMAGE</div></template></el-image
        >
        <div class="image-info">
          <b>{{ file.displayName }}</b
          ><span
            >{{ file.imageMetadata?.width || '—' }} × {{ file.imageMetadata?.height || '—' }} ·
            {{ formatFileSize(file.sizeBytes) }}</span
          >
        </div></button
      ><el-empty v-if="!loading && !rows.length" description="暂无符合条件的图片" />
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="query.pageNum"
        :page-size="query.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @change="load"
      />
    </div>
    <FilePreviewDialog v-model="previewVisible" :file="previewFile" />
  </section>
</template>

<style scoped>
.toolbar :deep(.el-select) {
  width: 160px;
}
.image-grid {
  display: grid;
  min-height: 240px;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
}
.image-card {
  overflow: hidden;
  padding: 0;
  border: 1px solid #e4e8df;
  border-radius: 13px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: 0.18s ease;
}
.image-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(35, 52, 27, 0.1);
}
.image-card :deep(.el-image) {
  width: 100%;
  height: 170px;
}
.image-fallback {
  display: grid;
  height: 100%;
  place-items: center;
  background: #edf1e9;
  color: #8f9789;
}
.image-info {
  display: grid;
  gap: 6px;
  padding: 13px;
}
.image-info b {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.image-info span {
  color: #92998e;
  font-size: 12px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
