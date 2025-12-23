/**
 * Application Constants
 * Centralized configuration values from environment variables
 */

// API Configuration - Auto-detects for laptop, mobile, or ngrok
const hostname = window.location.hostname
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
const isNgrok = hostname.includes('ngrok')

// When using ngrok (free plan allows only 1 tunnel), use laptop IP for backend
const apiHost = isLocalhost ? 'localhost' : '10.201.67.128'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${apiHost}:8000/api`

// Debug: Log the API URL being used
console.log('🔍 API Configuration:', {
    hostname,
    isLocalhost,
    isNgrok,
    apiHost,
    API_BASE_URL
})

// MediaPipe Configuration
export const MEDIAPIPE_WASM_URL = import.meta.env.VITE_MEDIAPIPE_WASM_URL ||
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'

export const MEDIAPIPE_MODEL_URL = import.meta.env.VITE_MEDIAPIPE_MODEL_URL ||
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        TOKEN: '/auth/token/',
        REFRESH: '/auth/token/refresh/',
    },
    EXERCISES: '/exercises/',
    SESSIONS: '/sessions/',
    ACTIVITY_UPLOADS: '/activity-uploads/',
    ACTIVITY_DATA: '/activity-data/',
    PREGNANCY_PROFILE: '/pregnancy-profile/',
    PREGNANCY_CONTENT: '/pregnancy-content/',
} as const

// App Configuration
export const APP_CONFIG = {
    VIDEO_WIDTH: 640,
    VIDEO_HEIGHT: 480,
    TARGET_FPS: 60,
    TOKEN_STORAGE_KEY: 'token',
    MAX_CSV_SIZE: 5 * 1024 * 1024, // 5MB
} as const

// Alert Thresholds
export const HEALTH_THRESHOLDS = {
    WEEKLY_STEPS_MIN: 50000,
    HEART_RATE_MAX: 85,
    ACTIVITY_DAYS_DISPLAY: 14,
} as const
