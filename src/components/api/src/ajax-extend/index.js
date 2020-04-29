import Vue from 'vue'
import Panel from './panel'
import { getStorageItem, STORE_KEY, EXPIRE_TIME } from './utils'

function mountPanel (matchMap, enable, expireTime, targetMap, expands) {
  if (window.__PANEL_MOUNTED__ || !enable) {
    return
  }
  const domContainer = document.createElement('div')
  domContainer.id = 'extends-panel'

  document.body.appendChild(domContainer)

  const panel = new Vue(Panel)
  panel.expireTime = expireTime || EXPIRE_TIME
  panel.targetMap = targetMap
  panel.matchMap = matchMap || []
  panel.expands = expands || []
  panel.$mount('#extends-panel')

  window.__PANEL_MOUNTED__ = true
};

function createAxiosInterceptor ({
  matchMap,
  targetMap,
  enable = true,
  useCompleteApi = true,
  expireTime,
  expands
}) {
  if (!targetMap) {
    throw Error('targetMap can not be empty')
  }

  window.addEventListener('DOMContentLoaded', () => {
    mountPanel(matchMap, enable, expireTime, targetMap, expands)
  })

  return (config) => {
    const apiTargetCache = getStorageItem(STORE_KEY)
    if (!apiTargetCache) {
      return config
    }

    const {
      targetType,
      // useApiForward,
      customTarget,
      apiTarget
      // useApiMock,
      // apiPattern
    } = apiTargetCache

    const userTarget = targetType === 'test' ? apiTarget : customTarget
    const target = targetMap[userTarget || 0]
    const xApiTarget = useCompleteApi ? `${target || userTarget}` : userTarget

    // 如果启用了接口转发 则需要校验接口
    // if (useApiForward && apiPattern) {
    //   const { url } = config
    //   if (url.includes(apiPattern)) {
    //     config.headers['X-Api-Target'] = xApiTarget
    //   }
    //   return config
    // }

    for (var i = 0; i < matchMap.length; i++) {
      var headers = matchMap[i] + '-Api-Target'
      config.headers[headers] = xApiTarget[matchMap]
    }
    return config
  }
}

export default createAxiosInterceptor
