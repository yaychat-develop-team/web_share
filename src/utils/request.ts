import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { apiBaseUrl } from '@/utils/env'
import { toast } from '@/utils/toast'

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

const REQUEST_TIMEOUT_MS = 10000

const service = axios.create({
  baseURL: apiBaseUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8;'
    config.headers.token = localStorage.getItem('user_token') || 'no-token'
    config.headers.df_platform = 'web'
    return config
  },
  (error: unknown) => Promise.reject(error),
)

service.interceptors.response.use(
  ((response: AxiosResponse<ApiResponse>) => {
    const data = response.data
    if (data.success) {
      return data.data
    }

    toast.info(data.message || '请求失败')
    return false
  }) as unknown as (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
  (error: unknown) => {
    const axiosError = error as {
      code?: string
      response?: { status?: number }
      message?: string
    }

    if (axiosError.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请稍后重试'))
    }

    const status = axiosError.response?.status
    const messages: Record<number, string> = {
      401: '登录已过期，请重新登录',
      403: '没有权限访问',
      404: '请求的资源不存在',
      500: '服务器内部错误',
    }
    const message = (status && messages[status]) || axiosError.message || '网络异常'
    console.error(`[Request Error] ${message}`)
    return Promise.reject(new Error(message))
  },
)

export default service
