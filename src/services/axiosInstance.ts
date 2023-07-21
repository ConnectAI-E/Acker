import axios from 'axios';
import throttle from 'lodash/throttle';
import { Toast } from '@douyinfe/semi-ui';

const axiosInstance = axios.create({
  baseURL: 'https://server.aios.chat/api/',

  // headers: { 'Content-Type': 'application/json' },

  // withCredentials: true,
  
  timeout: 300000,

  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`or `undefined`)
  // the promise will be resolved; otherwise, the promise will be rejected.
  validateStatus: (status) => status >= 200 && status < 300,
});

// Add a request interceptor
// Do something before request is sent
axiosInstance.interceptors.request.use(
  (config) => config,  
  async (error) => Promise.reject(error)
);

// Add a response interceptor
// Do something with response data
axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.status !== 200) {
      throttle(() => Toast.info({
        // todo1: 和服务端确认报错文案的字端
        // todo2: 兜底文案国际化
        content: response?.statusText || response?.data?.message || 'Network busy',
        duration: 10,
      }), 10000, { trailing: false })();
    }
    return response.data;
  },
  async (error) => Promise.reject(error)
);

export default axiosInstance;
