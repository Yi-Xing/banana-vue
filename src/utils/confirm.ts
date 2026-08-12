import { ElMessageBox, type ElMessageBoxOptions } from 'element-plus'

/**
 * 展示二次确认框。用户主动取消时返回 false，其它异常继续向上抛出。
 */
export async function confirmAction(
  message: string,
  title: string,
  options?: ElMessageBoxOptions,
): Promise<boolean> {
  try {
    await ElMessageBox.confirm(message, title, options)
    return true
  } catch (error) {
    if (error === 'cancel' || error === 'close') return false
    throw error
  }
}
