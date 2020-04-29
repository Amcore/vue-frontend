'use strict'

Object.defineProperty(exports, "__esModule", {
  value: true
})
function mergeApiProxyOptions() {
  var matchUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
  var _params$targetMap = params.targetMap,
      targetMap = _params$targetMap === undefined ? {} : _params$targetMap,
      _params$https = params.https,
      https = _params$https === undefined ? false : _params$https;

  var defaultApiTarget = options.target
  function reTarget(req) {
    var headers = matchUrl + '-api-target'
    var target = (req.headers[headers] || '').trim()
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
  return {
    [matchUrl]: options
  }
}

exports.default = mergeApiProxyOptions
