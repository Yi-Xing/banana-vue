<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import {
  emptyRecycleBin,
  listRecycleBin,
  purgeFile,
  purgeFiles,
  restoreFile,
} from '@/api/recycleBin'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import type { BatchPurgeResult, FileInfo, FileQuery } from '@/types/file'
import { confirmAction } from '@/utils/confirm'
import { formatFileSize } from '@/utils/file'

const rows = ref<FileInfo[]>([]),
  total = ref(0),
  loading = ref(false),
  selected = ref<FileInfo[]>([])
const query = reactive<FileQuery>({ keyword: '', pageNum: 1, pageSize: 20 })
async function load(): Promise<void> {
  loading.value = true
  try {
    const page = await listRecycleBin(query)
    rows.value = page.dataList
    total.value = page.total
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  } finally {
    loading.value = false
  }
}
function applyFilters(): void {
  query.pageNum = 1
  void load()
}
function reset(): void {
  Object.assign(query, { keyword: '', pageNum: 1, pageSize: 20 })
  void load()
}
function handlePageSizeChange(): void {
  query.pageNum = 1
  void load()
}
function handleCurrentPageChange(): void {
  void load()
}
function showResult(result: BatchPurgeResult): void {
  if (result.failures.length)
    ElMessage.warning(
      `成功 ${result.successIds.length} 个，失败 ${result.failures.length} 个：${result.failures[0]?.message}`,
    )
  else ElMessage.success(`已彻底删除 ${result.successIds.length} 个文件`)
}
async function restore(row: FileInfo): Promise<void> {
  try {
    await restoreFile(row.id)
    ElMessage.success('还原成功')
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '还原失败')
  }
}
async function purgeOne(row: FileInfo): Promise<void> {
  if (!(await confirmAction('彻底删除后不可恢复，是否继续？', '彻底删除', { type: 'warning' })))
    return
  try {
    showResult(await purgeFile(row.id))
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}
async function purgeSelected(): Promise<void> {
  if (!selected.value.length) return
  if (
    !(await confirmAction(`彻底删除选中的 ${selected.value.length} 个文件？`, '批量删除', {
      type: 'warning',
    }))
  )
    return
  try {
    showResult(await purgeFiles(selected.value.map((i) => i.id)))
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}
async function clearAll(): Promise<void> {
  if (
    !(await confirmAction('确定清空回收站吗？失败项会保留为删除失败状态。', '清空回收站', {
      type: 'warning',
      confirmButtonText: '确认清空',
    }))
  )
    return
  try {
    showResult(await emptyRecycleBin())
    await load()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '清空失败')
  }
}
onMounted(load)
</script>

<template>
  <section class="management-page">
    <header class="page-heading">
      <div>
        <h1>回收站</h1>
        <span class="heading-meta-text">保留 30 天</span>
      </div>
      <div>
        <el-button
          v-permission="BUTTON_PERMISSIONS.RECYCLE_PURGE"
          :disabled="!selected.length"
          @click="purgeSelected"
          >删除选中</el-button
        ><el-button
          v-permission="BUTTON_PERMISSIONS.RECYCLE_PURGE"
          type="danger"
          plain
          @click="clearAll"
          >清空回收站</el-button
        >
      </div>
    </header>
    <div class="toolbar">
      <el-input
        v-model="query.keyword"
        class="grow"
        clearable
        placeholder="搜索回收站文件"
        @keyup.enter="applyFilters"
      /><el-button type="primary" :icon="Search" @click="applyFilters">查询</el-button
      ><el-button @click="reset">重置</el-button>
    </div>
    <el-card class="content-card"
      ><el-table v-loading="loading" :data="rows" stripe @selection-change="selected = $event"
        ><el-table-column type="selection" width="46" /><el-table-column
          label="文件"
          min-width="240"
          ><template #default="{ row }"
            ><b>{{ row.displayName }}</b>
            <div class="muted">
              {{ row.fileTypeLabel }} · {{ formatFileSize(row.sizeBytes) }}
            </div></template
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
        ><el-table-column prop="deletedTime" label="删除时间" width="175" /><el-table-column
          prop="oss.name"
          label="OSS"
          width="130"
        /><el-table-column label="操作" width="180" fixed="right"
          ><template #default="{ row }"
            ><div class="table-actions">
              <el-button
                v-permission="BUTTON_PERMISSIONS.RECYCLE_RESTORE"
                type="primary"
                size="small"
                @click="restore(row)"
                >还原</el-button
              ><el-button
                v-permission="BUTTON_PERMISSIONS.RECYCLE_PURGE"
                type="danger"
                size="small"
                @click="purgeOne(row)"
                >彻底删除</el-button
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
  </section>
</template>

<style scoped>
.muted {
  margin-top: 5px;
  color: var(--ink-subtle);
  font-size: 12px;
}
.category-tag {
  --el-tag-bg-color: #f3f4f2;
  --el-tag-border-color: #d8dcd7;
  --el-tag-text-color: var(--ink-muted);
  margin: 2px 4px 2px 0;
}
</style>
