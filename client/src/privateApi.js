import axios from 'axios';
import Cookies from 'js-cookie';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('csrftoken');
  const accessToken = localStorage.getItem('access_token');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
