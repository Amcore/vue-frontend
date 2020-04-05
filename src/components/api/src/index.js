import createAxiosInterceptor from './ajax-extend'
import { getStorageItem, STORE_KEY } from './ajax-extend/utils'

/**
 * ! 内存缓存
 */
export const getExpandValue = (key) => {
  const value = getStorageItem(STORE_KEY)
  if (!value) return null
  const map = value.apiExpands || {}
  return map[key]
}

export default createAxiosInterceptor
