import { apiRequest, buildQuery } from '@/api/request'
import type { FileInfo, FileQuery, PageData } from '@/types/file'

export const listImages = (query: FileQuery) =>
  apiRequest<PageData<FileInfo>>(`/api/admin/images${buildQuery(query)}`, {}, '获取图片列表失败')
