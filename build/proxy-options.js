'use strict'

Object.defineProperty(exports, "__esModule", {
  value: true
})
function mergeApiProxyOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  var _params$targetMap = params.targetMap,
      targetMap = _params$targetMap === undefined ? {} : _params$targetMap,
      _params$https = params.https,
      https = _params$https === undefined ? false : _params$https;

  var defaultApiTarget = options.target
  function reTarget(req) {
    var target = (req.headers['x-api-target'] || '').trim()
    var protocol = https ? 'https' : 'http'

    if (targetMap[target]) {
      return protocol + '://' + targetMap[target]
    }

    if (target) {
      return protocol + '://' + target
    }

    return defaultApiTarget
  }

  options.router = reTarget
  return options
}

exports.default = mergeApiProxyOptions
