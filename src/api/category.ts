import { apiRequest, buildQuery } from '@/api/request'
import type { Category, CategoryPayload, CategoryQuery, PageData } from '@/types/file'

export const listCategories = (state?: number) =>
  apiRequest<Category[]>(`/api/admin/categories${buildQuery({ state })}`, {}, '获取分类失败')

export const queryCategories = (query: CategoryQuery) =>
  apiRequest<PageData<Category>>(`/api/admin/categories${buildQuery(query)}`, {}, '获取分类失败')

export const createCategory = (payload: CategoryPayload) =>
  apiRequest<Category>(
    '/api/admin/categories',
    { method: 'POST', body: JSON.stringify(payload) },
    '创建分类失败',
  )

export const updateCategory = (id: number, payload: CategoryPayload) =>
  apiRequest<Category>(
    '/api/admin/categories',
    { method: 'PUT', body: JSON.stringify({ id, ...payload }) },
    '更新分类失败',
  )

export const deleteCategory = (id: number) =>
  apiRequest<void>(
    `/api/admin/categories${buildQuery({ id })}`,
    { method: 'DELETE' },
    '删除分类失败',
  )
