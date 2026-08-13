export interface PageData<T> {
  dataList: T[]
  total: number
  current: number
  size: number
  pages: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface Category {
  id: number
  name: string
  code: string | null
  orderNum: number
  state: number
  stateLabel: string
  remark: string
  defaultCategory: boolean
  fileCount: number
  createdTime: string
  updatedTime: string
}

export interface CategoryPayload {
  name: string
  code: string
  orderNum: number
  state: number
  remark: string
}

export interface CategoryQuery {
  keyword: string
  pageNum: number
  pageSize: number
}

export interface OssConfig {
  id: number
  name: string
  code: string | null
  type: number
  typeLabel: string
  endpoint: string | null
  region: string | null
  bucket: string
  pathPrefix: string | null
  publicDomain: string | null
  accessMode: number
  accessModeLabel: string
  state: number
  stateLabel: string
  remark: string
  credentialConfigured: boolean
  accessKeyMasked: string
  createdTime: string
  updatedTime: string
}

export interface OssPayload {
  name: string
  code: string
  type: number
  endpoint: string
  region: string
  bucket: string
  accessKey: string
  secretKey: string
  pathPrefix: string
  publicDomain: string
  accessMode: number
  state: number
  remark: string
}

export interface FileCategorySummary {
  id: number
  name: string
  code: string | null
}

export interface FileOssSummary {
  id: number
  name: string
  code: string | null
  type: number
}

export interface ImageMetadata {
  width: number
  height: number
  frameCount: number | null
  colorSpace: string | null
}

export interface FileInfo {
  id: number
  originalName: string
  displayName: string
  extension: string
  mimeType: string
  fileType: number
  fileTypeLabel: string
  sizeBytes: number
  oss: FileOssSummary
  categories: FileCategorySummary[]
  status: number
  statusLabel: string
  imageMetadata: ImageMetadata | null
  remark: string
  deletedTime: string | null
  createdTime: string
  updatedTime: string
}

export interface FileQuery {
  keyword?: string
  categoryIds?: number[]
  fileTypes?: number[]
  mimeTypes?: string[]
  extensions?: string[]
  ossId?: number
  statuses?: number[]
  minSize?: number
  maxSize?: number
  minImageWidth?: number
  maxImageWidth?: number
  minImageHeight?: number
  maxImageHeight?: number
  frameCount?: number
  colorSpaces?: string[]
  pageNum: number
  pageSize: number
}

export interface BatchPurgeResult {
  successIds: number[]
  failures: Array<{ id: number; message: string }>
}

export interface DashboardSummary {
  availableFiles: number
  imageFiles: number
  recycledFiles: number
  storageBytes: number
  typeDistribution: Array<{ type: number; label: string; count: number }>
  recentFiles: FileInfo[]
}
