const mergeApiProxyOptions = require('./proxy-options').default

const targetMap = {
  qa1: 'baidu.com'
}

const defaultTarget = `http://${targetMap.qa1}`

function onProxyReq (proxyReq) {
  const sockets = proxyReq.agent.sockets
  const keys = Object.keys(sockets)

  console.log(`当前请求代理到：${keys[0]}, ${sockets[keys[0]][0]._httpMessage.path}`)
}

const devServe = {
  port: 8080,
  host: '0.0.0.0',
  hot: true,
  hotOnly: true,

  disableHostCheck: true,

  proxy: {
    '/api': mergeApiProxyOptions({
      target: defaultTarget,
      pathRewrite: {
        '/api': ''
      },
      ws: true,
      onProxyReq
    }, { targetMap })
  }
}

module.exports = devServe
