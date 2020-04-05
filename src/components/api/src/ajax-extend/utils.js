export const STORE_KEY = 'apiTarget'

// 固定过期时间1天
export const EXPIRE_TIME = 24 * 60 * 60 * 1000
export const setStorageItem = (key, value, expireTime) => {
  const jsonValue = JSON.stringify({
    value,
    expireTime: (expireTime || EXPIRE_TIME) + Date.now()
  })
  localStorage.setItem(key, jsonValue)
}

// TODO: 内存缓存
export const getStorageItem = (key) => {
  const jsonValue = localStorage.getItem(key)
  if (!jsonValue) {
    return null
  }

  try {
    const { value, expireTime } = JSON.parse(jsonValue)
    if (+expireTime > Date.now()) {
      return value
    }

    localStorage.removeItem(key)
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
