import axios from 'axios'
import createAxiosInterceptor from '@/components/api/src'

const api = axios.create({
  baseURL: ''
})

const ajaxMiddleware = createAxiosInterceptor({
  enable: ['test', 'development'].includes('development'),
  useCompleteApi: true,
  targetMap: {
    qa1: 'www.baidu.com:8080'
  },
  expands: [
    {
      label: 'test1',
      key: 'test1',
      targetMap: {
        stable: 'test1.com',
        stable1: 'test11.com'
      }
    },
    {
      label: 'test2',
      key: 'test2',
      targetMap: {
        stable: 'test2.com'
      }
    },
    {
      label: 'test4',
      key: 'test4',
      targetMap: {
        stable: 'test4.com'
      }
    }
  ]
})

api.interceptors.request.use(ajaxMiddleware)

export default api
