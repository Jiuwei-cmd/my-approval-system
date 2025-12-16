import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code } = response.data;
    if (code === 200) {
      return response.data;
    }
    return Promise.reject(new Error(response.data.msg || '请求失败'));
  },
  (error) => {
    // 错误处理
    console.error('响应错误:', error);

    return Promise.reject(error);
  }
);

export default service;
