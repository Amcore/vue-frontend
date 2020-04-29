import axios from 'axios'
import createAxiosInterceptor from '@/components/api/src'

const api = axios.create({
  baseURL: ''
})

const ajaxMiddleware = createAxiosInterceptor({
  matchMap: ['/api', '/normal'],
  enable: ['test', 'development'].includes('development'),
  useCompleteApi: true,
  targetMap: {
    qa1: 'www.baidu.com:8080'
  },
  expands: [
    {
      label: 'normal',
      key: 'normal',
      targetMap: {
        stable: 'normal.com'
      }
    }
  ]
})

api.interceptors.request.use(ajaxMiddleware)

export default api
