import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || '请求失败';
    return Promise.reject({ message, detail: err.response?.data?.detail });
  }
);

export default api;
