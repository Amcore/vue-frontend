import http from './index.js'

export default {
  test() {
    return http.get('/api/test')
  },

  normal() {
    return http.get('/normal')
  }
}
