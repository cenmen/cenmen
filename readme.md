## Motto

多写多练多思考

## Step

1. element 组件 upload 源码

```
使用 input="file" 和 XMLHttpRequest 实现，触发 input 选择文件后获取节点 e.target.files 文件列表信息，利用 formData 格式 post 请求发送到服务器
```

2. 点对点实时聊天 [https://github.com/cenmen/chat](https://github.com/cenmen/chat)
3. node 文件上传 [https://github.com/cenmen/upload-server](https://github.com/cenmen/upload-server)
4. upload 组件(纯 javaScript 实现, webpack 可打包输出) [https://github.com/cenmen/uploader](https://github.com/cenmen/uploader)
5. 阅读 events 源码输出精简使用版 [https://github.com/cenmen/events](https://github.com/cenmen/events)
6. chrome 扩展程序 - 文章纯净器 [https://github.com/cenmen/cleaner-extension](https://github.com/cenmen/cleaner-extension)
7. chrome 扩展程序 - B 站斗鱼虎牙弹幕自刷器 [https://github.com/cenmen/barrage-extension](https://github.com/cenmen/barrage-extension)
8. chrome 扩展程序 - 12306 自动抢票器 [https://github.com/cenmen/12306-ticket-extension](https://github.com/cenmen/12306-ticket-extension)
9. select 组件(纯 javaScript 实现) [https://github.com/cenmen/multiple-select](https://github.com/cenmen/multiple-select)
10. modal 弹窗组件(Web Components) [https://github.com/cenmen/modal](https://github.com/cenmen/modal)
11. PC 端脚手架 [https://github.com/cenmen/react-pc](https://github.com/cenmen/react-pc)
12. h5 端单页面脚手架 [https://github.com/cenmen/react-h5](https://github.com/cenmen/react-h5)
13. h5 端多页面脚手架 [https://github.com/cenmen/react-multiple-h5](https://github.com/cenmen/react-multiple-h5)
14. B 站视频 & 音频下载工具 [https://github.com/cenmen/bilibili-media-download](https://github.com/cenmen/bilibili-media-download)
15. PC 端脚手架(Vue3.x) [https://github.com/cenmen/vue-pc](https://github.com/cenmen/vue-pc)
16. 个人歌单记录助手(小程序) [https://github.com/cenmen/musics](https://github.com/cenmen/musics)

## TodoList

1. - [x] create-react-app 脚手架源码阅读 & 优化旧版项目架构
2. - [ ] 使用 mongodb + nestjs + vue3.x 实现图书馆管理系统
3. - [ ] 使用 mongodb + nestjs + react + react-router6.x + pubsub + redux + antd 实现图书馆管理系统
4. - [ ] vite
5. - [ ] gitbook 整理个人技术

## 源码仓库阅读

- [react-router](https://github.com/remix-run/react-router)
- [history](https://github.com/remix-run/history)
- [axios](https://github.com/axios/axios)
- [element upload 组件](https://github.com/ElemeFE/element/tree/dev/packages/upload)
- [events](https://github.com/browserify/events)
- ~~[flv.js](https://github.com/bilibili/flv.js) & [flv2fmp4](https://github.com/332065255/flv2fmp4)~~

## Repository

- [awesome-javascript](https://github.com/sorrycc/awesome-javascript) 许多受欢迎的技术仓库分类
- [javascript-questions](https://github.com/lydiahallie/javascript-questions) JS 问题
- [clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript) [中文版](https://github.com/beginor/clean-code-javascript) 代码风格指南
- [javascript](https://github.com/airbnb/javascript) 代码风格指南
- [30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code) 许多有意思的函数
- [weekly](https://github.com/ascoders/weekly) 前端精读文章
- [common-regex](https://github.com/cdoco/common-regex) 常用简单正则
- [front-end-knowledges](https://github.com/dennis-jiang/Front-End-Knowledges) 优质文章

## 常用工具集录

### webpack

- loader
  - [style-loader]()
  - [css-loader]()
  - ~~[file-loader]()~~
  - [babel-loader]()
- plugins
  - [html-webpack-plugin]()
  - [mini-css-extract-plugin]()
  - [css-minimizer-webpack-plugin]()
  - [webpackbar]()
  - [webpack-bundle-analyzer]()
  - [cross-env]()

### nodejs

- ~~[colors](https://github.com/Marak/colors.js)~~
- [cli-progress](https://github.com/npkgz/cli-progress)
- [axios](https://github.com/axios/axios)
- [express](https://github.com/expressjs/express)
- [cors](https://github.com/expressjs/cors)
- [inquirer](https://github.com/SBoudrias/Inquirer.js)
- [body-parser]()

## Features
### 顺序 = 重视程度，百分比 = 掌握度（相对）
<style>
  label {
    width: 100px;
  }

  .item {
    display: flex;
    margin-top: 15px;
  }

  .progress {
    height: 20px;
    width: 300px;
    display: flex;
    border: 2px solid #409eff;
  }

  .filled {
    width: 240px;
    background-color: #409eff;
    color: white;
    text-align: right;
  }

  .percent {
    margin-right: 15px;
  }
</style>
<div>
  <div class="item">
    <label>HTML：</label>
    <div class="progress">
      <!-- 父容器 300px 根据百分比写 width -->
      <div class="filled" style="width:255px;">
        <span class="percent">85%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>CSS：</label>
    <div class="progress">
      <div class="filled" style="width:255px;">
        <span class="percent">85%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>JavaScript：</label>
    <div class="progress">
      <div class="filled" style="width:225px;">
        <span class="percent">75%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>React：</label>
    <div class="progress">
      <div class="filled" style="width:165px;">
        <span class="percent">55%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>Vue：</label>
    <div class="progress">
      <div class="filled" style="width:150px;">
        <span class="percent">50%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>微信小程序：</label>
    <div class="progress">
      <div class="filled" style="width:180px;">
        <span class="percent">60%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>Node.js：</label>
    <div class="progress">
      <div class="filled" style="width:45px;">
        <span class="percent">15%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>TypeScript：</label>
    <div class="progress">
      <div class="filled" style="width:90px;">
        <span class="percent">30%</span>
      </div>
      <div></div>
    </div>
  </div>
  <div class="item">
    <label>React Native：</label>
    <div class="progress">
      <div class="filled" style="width:0px;">
      </div>
      <div><span>&nbsp;&nbsp;0%</span></div>
    </div>
  </div>
</div>
