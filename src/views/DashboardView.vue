<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Files, Picture, Delete, Coin } from '@element-plus/icons-vue'
import { getDashboardSummary } from '@/api/dashboard'
import type { DashboardSummary } from '@/types/file'
import { formatFileSize } from '@/utils/file'

const loading = ref(false)
const summary = ref<DashboardSummary | null>(null)

async function load(): Promise<void> {
  loading.value = true
  try {
    summary.value = await getDashboardSummary()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载工作台失败')
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>

<template>
  <section class="management-page" v-loading="loading">
    <header class="page-heading">
      <div>
        <p>Overview</p>
        <h1>文件工作台</h1>
        <span>集中查看文件规模、存储用量和最近上传。</span>
      </div>
    </header>
    <div v-if="summary" class="stat-grid">
      <el-card
        ><el-icon><Files /></el-icon><strong>{{ summary.availableFiles }}</strong
        ><span>可用文件</span></el-card
      >
      <el-card
        ><el-icon><Picture /></el-icon><strong>{{ summary.imageFiles }}</strong
        ><span>图片</span></el-card
      >
      <el-card
        ><el-icon><Delete /></el-icon><strong>{{ summary.recycledFiles }}</strong
        ><span>回收站</span></el-card
      >
      <el-card
        ><el-icon><Coin /></el-icon><strong>{{ formatFileSize(summary.storageBytes) }}</strong
        ><span>占用空间</span></el-card
      >
    </div>
    <div v-if="summary" class="dashboard-grid">
      <el-card
        ><template #header><b>文件类型分布</b></template>
        <div class="type-list">
          <div v-for="item in summary.typeDistribution" :key="item.type">
            <span>{{ item.label }}</span
            ><b>{{ item.count }}</b>
          </div>
        </div></el-card
      >
      <el-card
        ><template #header><b>最近上传</b></template
        ><el-empty v-if="!summary.recentFiles.length" description="暂无文件" />
        <div v-else class="recent-list">
          <div v-for="file in summary.recentFiles" :key="file.id">
            <span
              ><b>{{ file.displayName }}</b
              ><small>{{ file.fileTypeLabel }} · {{ formatFileSize(file.sizeBytes) }}</small></span
            ><time>{{ file.createdTime }}</time>
          </div>
        </div></el-card
      >
    </div>
  </section>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.stat-grid :deep(.el-card__body) {
  display: grid;
  grid-template-columns: 46px 1fr;
  align-items: center;
  gap: 2px 14px;
}
.stat-grid .el-icon {
  grid-row: 1/3;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #edf4e7;
  color: #3e6a26;
  font-size: 22px;
}
.stat-grid strong {
  font-size: 25px;
}
.stat-grid span {
  color: #8a9185;
  font-size: 13px;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.7fr) minmax(420px, 1.3fr);
  gap: 16px;
}
.type-list {
  display: grid;
  gap: 15px;
}
.type-list div,
.recent-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.type-list span {
  color: #6e756a;
}
.recent-list {
  display: grid;
  gap: 16px;
}
.recent-list span {
  display: grid;
  gap: 4px;
}
.recent-list small,
time {
  color: #959b91;
  font-size: 12px;
}
@media (max-width: 960px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
