## 拦截器
在请求或响应被 then 或 catch 处理前拦截它们。[示例](https://www.axios-http.cn/docs/interceptors)

原理代码摘录：
```javascript
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

function InterceptorManager() {
  this.handlers = [];
}

InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/* 请求拦截器 */
var requestInterceptorChain = [];
var synchronousRequestInterceptors = true;
this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
  if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
    return;
  }

  synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

  requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
});

/* 响应拦截器 */
var responseInterceptorChain = [];
this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
  responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
});

var promise;

/* 默认同步情况下 */
if (!synchronousRequestInterceptors) {
  /* dispatchRequest 为实际的 xhr 请求 */
  var chain = [dispatchRequest, undefined];

  Array.prototype.unshift.apply(chain, requestInterceptorChain);
  chain = chain.concat(responseInterceptorChain);

  promise = Promise.resolve(config);
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
}

/* 异步情况... */
```