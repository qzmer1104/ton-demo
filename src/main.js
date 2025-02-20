import { createApp } from 'vue'
import App from './App.vue'
import 'babel-polyfill';
import 'amfe-flexible'
import router from './router'
import { isProd, isLocal } from '@/utils/index';

import { TonConnectUIPlugin } from '@townsquarelabs/ui-vue';
const app = createApp(App);
// const prod = isProd();
const prod = true;
const config = {
  manifestUrl:  location.origin + (prod ? "/tonconnect-manifest.json" : "/tonconnect-manifest_test_2.json"),
  name: 'To',
  iconUrl: location.origin+'/logo.png',
  termsOfUseUrl: location.origin+"/terms-of-use.txt",
  privacyPolicyUrl: location.origin+"/privace.txt"
};
console.log('config', config);
app.use(TonConnectUIPlugin, config);

app.use(router)

const eruda = require('eruda'); // 动态引入
eruda.init();

async function start() {
  app.mount('#app');
}

start();

function __report(param){
  console.log('report', param);
}

window.onerror = async function (msg, url, lineNo, columnNo, error) {
  console.log('js error', arguments)
  __report({
    type: 'js',
    url,
    msg,
    lineNo,
    fileName: columnNo,
    detail: error?.stack,
  })
};

// 全局异常处理-promise异常
window.addEventListener('unhandledrejection', event => {
  console.warn('Unhandled Promise rejection:', event);
  // 这种是接口返回异常
  if(event.reason?.msg){
    // 这里axios里已经showToast里，所以不再提示
  }else if(event.reason){
    if(event.reason?.message && event.reason?.message.indexOf('Operation aborted') == 0){
      return;
    }
    // 否则为代码错误
      __report({
        type: 'promise',
        msg: event.reason?.message || event.reason?.name,
        detail: event.reason?.stack,
      });
  }
});
// 设置全局错误处理
app.config.errorHandler = async (err, instance, info) => {
  console.warn('vue error', err);
  if(err?.msg){
    // 这种错误是axios抛出来的后端异常，意义明确的异常，故不上报
    return;
  }
  // 提取错误堆栈（stack trace）
  const errorData = {
    message: err?.message,  // 错误消息
    name: err?.name,        // 错误名称 (例如：Error, TypeError 等)
    stack: err?.stack,      // 错误堆栈信息
    info,                  // 错误发生的生命周期钩子或渲染函数信息
  };

  // 获取堆栈的相关信息：msg, url, lineNo, columnNo
  if (err?.stack) {
    const stackLines = err.stack.split('\n'); // 按行拆分堆栈信息

    // 正则表达式提取错误发生的 URL、行号和列号
    const regex = /at\s+(.*)\s+\((.*):(\d+):(\d+)\)/;
    const match = stackLines[1]?.match(regex);  // 第二行通常包含错误发生的堆栈信息

    if (match) {
      const [, msg, url, lineNo, columnNo] = match;

      // 把堆栈信息解析出来并添加到 errorData 对象中
      errorData.errorMsg = msg;        // 错误信息
      errorData.url = url;             // 错误发生的 URL
      errorData.lineNo = lineNo;       // 错误行号
      errorData.columnNo = columnNo;   // 错误列号
    }
  }
  console.log('触发异常')

  __report({
    type: 'vue',
    url: errorData.url,
    msg: errorData.errorMsg || errorData.message || errorData.name,
    fileName:  errorData.columnNo,
    lineNo: errorData.lineNo,
    detail: [errorData.info, errorData.stack].join('\n'),
  });
  // 返回 true 阻止 Vue 默认的错误处理
  return true;
};
