/**
 * Centralized API Client
 * Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, APP_CONFIG } from './constants'

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(APP_CONFIG.TOKEN_STORAGE_KEY)
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status
            const data = error.response.data as any

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem(APP_CONFIG.TOKEN_STORAGE_KEY)
                    window.location.reload()
                    break
                case 403:
                    console.error('Forbidden:', data)
                    break
                case 404:
                    console.error('Not found:', data)
                    break
                case 500:
                    console.error('Server error:', data)
                    break
                default:
                    console.error('API error:', data)
            }
        } else if (error.request) {
            // Request made but no response
            console.error('Network error: No response from server')
        } else {
            // Something else happened
            console.error('Error:', error.message)
        }

        return Promise.reject(error)
    }
)

export default apiClient

/**
 * Helper function to handle API errors with user-friendly messages
 */
export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as any

        // Handle validation errors
        if (data && typeof data === 'object') {
            if (data.detail) return data.detail
            if (data.message) return data.message

            // Handle field-specific errors
            const firstKey = Object.keys(data)[0]
            if (firstKey && Array.isArray(data[firstKey])) {
                return `${firstKey}: ${data[firstKey][0]}`
            }
        }

        return error.message || 'An error occurred'
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'An unknown error occurred'
}
