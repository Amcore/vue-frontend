# little

​	一个接口转发工具，动态设置后端服务地址


## 安装

`npm i -S @weiyi/little`

#### 

## 使用

本地的开发项目里需要在两个地方配置。一个在`webpack-dev-server`的`proxy`增加一些选项。另一个是在`axios`中增加一个`request`的拦截器。

在测试环境的网关`nginx`上也需要加一些配置

1. webpak的配置

   ```js
   const mergeApiProxyOptions = require('@weiyi/little/lib/proxy-options').default;
   
   // 定义开发环境的服务地址字典
   const targetMap = {
     qa1: 'his-web-service-qa1.dubbo.guahao-test.com:8080',
     qa2: 'his-web-service-qa2.dubbo.guahao-test.com:8080',
     qa3: 'his-web-service-qa3.dubbo.guahao-test.com:8080',
     qa4: 'his-web-service-qa4.dubbo.guahao-test.com:8080',
     qa5: 'his-web-service-qa5.dubbo.guahao-test.com:8080',
     qa6: 'his-web-service-qa6.dubbo.guahao-test.com:8080',
     qa7: 'his-web-service-qa7.dubbo.guahao-test.com:8080',
     qa8: 'his-web-service-qa8.dubbo.guahao-test.com:8080',
     qa9: 'his-web-service-qa9.dubbo.guahao-test.com:8080',
     test1: '192.168.99.120:3010',
     test2: '192.168.99.157:8071',
     test4: '192.168.99.216:8081'
   };
   
   const defaultTarget = `http://${targetMap.qa1}`;
   
   
   const devServe = {
     proxy: {
    		// 在api  proxy 的选项中调用方法  
       '/api': mergeApiProxyOptions({
         target: defaultTarget,
         pathRewrite: { '/api': '' },
       }, { targetMap })
     }
   };
   ```

   

2. axios的配置

   ```js
   // 定义测试环境的服务地址字典
   const TARGET_MAP = {
     qa1: 'his-web-service-qa1.guahao-test.com',
     qa2: 'his-web-service-qa2.guahao-test.com',
     qa3: 'his-web-service-qa3.guahao-test.com',
     qa4: 'his-web-service-qa4.guahao-test.com',
     qa5: 'his-web-service-qa5.guahao-test.com',
     qa6: 'his-web-service-qa6.guahao-test.com',
     qa7: 'his-web-service-qa7.guahao-test.com',
     qa8: 'his-web-service-qa8.guahao-test.com',
     qa9: 'his-web-service-qa9.guahao-test.com',
     test1: '192.168.99.120:3010',
     test2: '192.168.99.157:8071',
     test4: '192.168.99.216:8081'
   };
   
   // 传入配置生成中间件
   // enable 是否启用：一般在测试环境和开发环境
   // useCompleteApi：
   //			是否使用完整接口地址  即是否使用上面定义的TARGET_MAP中的value
   //			如果是，则使用value，如果否，则使用key
   //			通常情况是在测试环境置为true
   const ajaxMiddleware = createAxiosInterceptor({
     enable: ['test', 'development'].includes(process.env.VUE_APP_CURRENTMODE),
     useCompleteApi: process.env.VUE_APP_CURRENTMODE === 'test',
     targetMap: TARGET_MAP
   });
   
   api.interceptors.request.use(ajaxMiddleware);
   ```

3. 测试环境的`nginx`配置

   ```ng
    location /api/ {
      set $x_proxy_flag 0;
      set $x_proxy_uri '';
      if ($http_x_api_target) {
      	set $x_proxy_flag '${x_proxy_flag}1';
      }
      if ($request_uri ~ ^/api/(.*)) {
        set $x_proxy_flag '${x_proxy_flag}2';
        set $x_proxy_uri $1;
      }
      if ($x_proxy_flag = '012') {
        proxy_pass      http://$http_x_api_target/$x_proxy_uri;
        break;
      }
     
      proxy_pass              http://172.28.72.170:8081/; // 这里是原始的服务地址
    }
   ```

4. 扩展自定义环境

  > 应用场景：可以应用在通过`iframe`方式嵌入其他应用页面的情况，需要通过配置进行动态切换的场景，或者需要额外环境配置进行动态控制的逻辑

  **axios的配置**

  ```javascript
  const ajaxMiddleware = createAxiosInterceptor({
     ...
     // 拓展属性，数组类型
     expands: [
       {
         label: '会员环境', // 展示文案
         key: 'hmo',  // 唯一的环境KEY
         targetMap: { // 映射环境MAP
           qa1: 'qa1.hmo.guahao-test.com',
           qa2: 'qa2.hmo.guahao-test.com'
         }
       },
       {
         ....
       }
     ]
  });
  ```

  **使用环境**

  ```javascript
  import { getExpandValue } from '@weiyi/little';

  // 获取扩展环境的具体值
  const hmoTarget = getExpandValue('hmo');

  // 判断当前环境是在本地或者测试环境中
  if(['test', 'development'].includes(process.env.VUE_APP_CURRENTMODE) && hmoTarget) {
    // TODO: 这里可以编写自己业务的逻辑
  }
  ```

## RoadMap

- [ ] 调研不侵入网关配置的方式
- [ ] 支持多接口环境转发
- [ ] 支持自定义缓存时间


