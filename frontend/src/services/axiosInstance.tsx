import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import store from '@/store/store'
import { authLoginActions } from '@/store/authSlice'

export const queryClient = new QueryClient()

const API_URL = 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_URL
})

apiClient.interceptors.request.use(config => {
  const state = store.getState()
  const token = state.authLogin.accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  console.log('Request made with config:', config);
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    console.log('Interceptor caught an error:', error)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const state = store.getState()
      const refreshTokenValue = state.authLogin.refreshToken

      if (!refreshTokenValue) {
        // no refresh token — force logout
        store.dispatch(authLoginActions.logout())
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshTokenValue
        })

        store.dispatch(authLoginActions.setAccessToken(data.accessToken))

        processQueue(null, data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        store.dispatch(authLoginActions.logout())
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ---- API functions ----

// export const loginHandler = async ({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) => {
//   const response = await apiClient.post("/login", { email, password });
//   return response.data;
// };

// export const signupHandler = async ({
//   name,
//   email,
//   password,
// }: {
//   name: string;
//   email: string;
//   password: string;
// }) => {
//   const response = await apiClient.post("/signup", { name, email, password });
//   return response.data;
// };

// export const verifyOTPHandler = async ({
//   email,
//   otp,
// }: {
//   email: string;
//   otp: string;
// }) => {
//   const response = await apiClient.post("/auth/verify-otp", { email, otp });
//   return response.data;
// };

// export const resendOTPHandler = async ({ email }: { email: string }) => {
//   const response = await apiClient.post("/auth/send-otp", { email });
//   return response.data;
// };

// export const logoutHandler = async (refreshToken: string) => {
//   const response = await apiClient.post("/auth/logout", { refreshToken });
//   return response.data;
// };
