### 接口转发

#### 使用

```js
import axios from 'axios'
import createAxiosInterceptor from '@/components/api/src'

const api = axios.create({
  baseURL: ''
})

const ajaxMiddleware = createAxiosInterceptor({
  enable: ['test', 'dev'].includes('dev'),
  useCompleteApi: true,
  targetMap: {
    // 代理接口地址
    // api target list
  }
})

api.interceptors.request.use(ajaxMiddleware)

```
