import axios from "axios";
import useUserStore from '../store/userModule'
import { showToast } from 'vant';
import router from "@/router";
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers['Content-Type'] = 'application/json';
const userStore = useUserStore();
const config = {
  baseURL: process.env.baseURL || process.env.apiUrl || "",
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const request = axios.create(config);

request.interceptors.request.use(
  function(config) {
    const userStore = useUserStore();
    const token = userStore.$state.authorization;
    const lang = localStorage.getItem('defaultLang') || 'en-US';
    token && (config.headers.Authorization = token);
    // console.log(config.headers.Authorization)
    // showToast(config.headers.Authorization)
    lang && (config.headers['Accept-language'] = lang);
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
request.interceptors.response.use(
  function (response) {
    if (response.status==200) {
      return response.data;
    }
    // Do something with response data
    return response.data;
  },
  function (error) {
    console.log('error', error);
    let {config, response: {status, data: { msg } }} = error;
    // 特定场景下需要忽略异常toast
    if(!config.ignoreError){
      showToast(msg);
    }
    switch (status){
      case 401:
        userStore.clearUser();
        router.replace({ path:'/' })
        break;
      default:
        break;
    }
    return Promise.reject(error.response.data);
  }
);
// options

export function $get(url,params={}, config = {}){
  return request({
    url,
    method:"get",
    params:params,
      ...config
  })
}
export function $post(url,data, config={}){
  return request({
    url,
    method:"post",
    data:data,
    ...config
  })
}
export default request;
