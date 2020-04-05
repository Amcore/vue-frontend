function mergeApiProxyOptions (options = {}, params = {}) {
  const { targetMap = {}, https = false } = params;
  const defaultApiTarget = options.target;
  function reTarget (req) {
    const target = (req.headers['x-api-target'] || '').trim();
    const protocol = https ? 'https' : 'http';

    if (targetMap[target]) {
      return `${protocol}://${targetMap[target]}`;
    }

    if (target) {
      return `${protocol}://${target}`;
    }

    return defaultApiTarget;
  }

  options.router = reTarget;
  return options;
}

export default mergeApiProxyOptions;
