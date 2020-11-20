import axios from 'axios';

import { useRouter, useStore } from '@/use';

axios.defaults.baseURL = '/api';
axios.defaults.headers['Cache-Control'] = 'no-cache';
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 对请求数据做些什么
    useStore().commit('requestStart');
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    useStore().commit('requestEnd');
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    if (error.response.status === 401 && useRouter().currentRoute.name !== 'Login') {
      useRouter().push({ name: 'Login' });
    }
    useStore().commit('requestError', error);
    return Promise.reject(error);
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).axios = axios;

export * from './applicationRecordCollectionTasks';
export * from './applicationRecords';
export * from './applications';
export * from './auth';
export * from './departments';
export * from './profile';
export * from './System';
export * from './tasks';
