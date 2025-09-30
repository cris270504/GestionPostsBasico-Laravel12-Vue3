// src/lib/api.js
import axios from 'axios';
import router from '@/router';
import { LS_TOKEN_KEY, LS_USER_KEY } from '@/services/src/constants/auth'

const api = axios.create({
  baseURL:'https://laravel-api.test/api',
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // aquí puedes: intentar refresh token (si lo implementas)
      // o limpiar sesión y redirigir a login
      localStorage.removeItem(LS_TOKEN_KEY)
      localStorage.removeItem('LS_USER_KEY') // ajusta tu key real
      // evita bucles si ya estás en login
      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      }
    }
    return Promise.reject(error)
  }
)

export default api;
