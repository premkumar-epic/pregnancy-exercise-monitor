/**
 * Advanced Pose Analysis Utilities
 * Improved accuracy algorithms for exercise tracking
 */

import type { ExerciseType } from '../types'

/**
 * Landmark visibility threshold
 * Landmarks below this confidence are considered unreliable
 */
const VISIBILITY_THRESHOLD = 0.5

/**
 * Smoothing factor for angle calculations (0-1)
 * Higher values = more smoothing, less jitter
 */
const SMOOTHING_FACTOR = 0.3

/**
 * Calculate 3D angle between three points with improved accuracy
 */
export const calculateAngle = (
    a: { x: number; y: number; z?: number },
    b: { x: number; y: number; z?: number },
    c: { x: number; y: number; z?: number }
): number => {
    // Use 3D coordinates if available for better accuracy
    const useZ = a.z !== undefined && b.z !== undefined && c.z !== undefined

    if (useZ) {
        // 3D angle calculation
        const ba = {
            x: a.x - b.x,
            y: a.y - b.y,
            z: (a.z || 0) - (b.z || 0)
        }
        const bc = {
            x: c.x - b.x,
            y: c.y - b.y,
            z: (c.z || 0) - (b.z || 0)
        }

        // Dot product
        const dot = ba.x * bc.x + ba.y * bc.y + ba.z * bc.z

        // Magnitudes
        const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2 + ba.z ** 2)
        const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2 + bc.z ** 2)

        // Angle in radians
        const angleRad = Math.acos(dot / (magBA * magBC))
        return (angleRad * 180) / Math.PI
    } else {
        // 2D angle calculation (fallback)
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
        let angle = Math.abs((radians * 180) / Math.PI)
        if (angle > 180) angle = 360 - angle
        return angle
    }
}

/**
 * Smooth angle values to reduce jitter
 */
export class AngleSmoothing {
    private history: number[] = []
    private maxHistory = 5

    smooth(newAngle: number): number {
        this.history.push(newAngle)
        if (this.history.length > this.maxHistory) {
            this.history.shift()
        }

        // Weighted moving average (recent values have more weight)
        let sum = 0
        let weightSum = 0
        for (let i = 0; i < this.history.length; i++) {
            const weight = i + 1 // Linear weighting
            sum += this.history[i] * weight
            weightSum += weight
        }

        return sum / weightSum
    }

    reset() {
        this.history = []
    }
}

/**
 * Check if landmarks are visible and reliable
 */
export const areLandmarksVisible = (
    landmarks: any[],
    indices: number[]
): boolean => {
    return indices.every(idx => {
        const landmark = landmarks[idx]
        return landmark && landmark.visibility > VISIBILITY_THRESHOLD
    })
}

/**
 * Calculate distance between two points (for stability check)
 */
export const calculateDistance = (
    a: { x: number; y: number; z?: number },
    b: { x: number; y: number; z?: number }
): number => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const dz = (a.z || 0) - (b.z || 0)
    return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)
}

/**
 * Detect if user is in stable position (not moving too much)
 */
export const isStablePosition = (
    currentLandmarks: any[],
    previousLandmarks: any[] | null,
    keyPoints: number[]
): boolean => {
    if (!previousLandmarks) return true

    const threshold = 0.05 // 5% movement threshold

    for (const idx of keyPoints) {
        const current = currentLandmarks[idx]
        const previous = previousLandmarks[idx]

        if (!current || !previous) return false

        const distance = calculateDistance(current, previous)
        if (distance > threshold) return false
    }

    return true
}

/**
 * Advanced posture scoring with multiple factors
 */
export interface PostureAnalysis {
    score: number
    feedback: string
    issues: string[]
    isGoodForm: boolean
}

export const analyzePosture = (
    angle: number,
    targetAngle: number,
    exerciseType: ExerciseType,
    landmarks: any[]
): PostureAnalysis => {
    const issues: string[] = []
    let score = 100
    let feedback = '✅ Perfect form!'

    // Angle deviation analysis
    const deviation = Math.abs(angle - targetAngle)

    if (deviation > 30) {
        score -= 30
        issues.push('Large angle deviation')
        feedback = '⚠️ Check your form'
    } else if (deviation > 20) {
        score -= 20
        issues.push('Moderate angle deviation')
        feedback = '📏 Adjust position slightly'
    } else if (deviation > 10) {
        score -= 10
        issues.push('Minor angle deviation')
        feedback = '➕ Good, refine form'
    }

    // Exercise-specific checks
    if (exerciseType === 'squat') {
        // Check knee alignment (knees shouldn't go too far forward)
        const leftKnee = landmarks[25]
        const leftAnkle = landmarks[27]
        const leftHip = landmarks[23]

        if (leftKnee && leftAnkle && leftHip) {
            // Knee should not extend too far past ankle
            if (leftKnee.x > leftAnkle.x + 0.1) {
                score -= 15
                issues.push('Knees too far forward')
                feedback = '⚠️ Keep knees behind toes'
            }

            // Check back angle (should stay relatively upright)
            const backAngle = calculateAngle(
                { x: leftHip.x, y: leftHip.y },
                { x: landmarks[11].x, y: landmarks[11].y }, // shoulder
                { x: landmarks[11].x, y: 0 } // vertical reference
            )

            if (backAngle > 45) {
                score -= 10
                issues.push('Leaning too far forward')
            }
        }
    } else if (exerciseType === 'arm_raise') {
        // Check if arms are symmetrical
        const leftShoulder = landmarks[11]
        const rightShoulder = landmarks[12]
        const leftElbow = landmarks[13]
        const rightElbow = landmarks[14]

        if (leftShoulder && rightShoulder && leftElbow && rightElbow) {
            const leftAngle = calculateAngle(leftShoulder, leftElbow, landmarks[15])
            const rightAngle = calculateAngle(rightShoulder, rightElbow, landmarks[16])
            const asymmetry = Math.abs(leftAngle - rightAngle)

            if (asymmetry > 20) {
                score -= 15
                issues.push('Arms not symmetrical')
                feedback = '⚖️ Keep arms even'
            }
        }
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score)

    return {
        score,
        feedback,
        issues,
        isGoodForm: score >= 80
    }
}

/**
 * Rep counting with hysteresis to prevent false counts
 */
export class RepCounter {
    private phase: 'up' | 'down' | 'transition' = 'up'
    private transitionFrames = 0
    private readonly minTransitionFrames = 1 // Reduced from 3 for faster response

    count(
        angle: number,
        downThreshold: number,
        upThreshold: number
    ): { counted: boolean; phase: 'up' | 'down' | 'transition' } {
        let counted = false

        // Add hysteresis zone to prevent bouncing
        const hysteresis = 5 // degrees
        const downThresholdWithHysteresis = downThreshold + hysteresis
        const upThresholdWithHysteresis = upThreshold - hysteresis

        if (this.phase === 'up' && angle < downThresholdWithHysteresis) {
            this.phase = 'transition'
            this.transitionFrames = 1
        } else if (this.phase === 'transition' && angle < downThresholdWithHysteresis) {
            this.transitionFrames++
            if (this.transitionFrames >= this.minTransitionFrames) {
                this.phase = 'down'
                this.transitionFrames = 0
            }
        } else if (this.phase === 'down' && angle > upThresholdWithHysteresis) {
            this.phase = 'transition'
            this.transitionFrames = 1
        } else if (this.phase === 'transition' && angle > upThresholdWithHysteresis) {
            this.transitionFrames++
            if (this.transitionFrames >= this.minTransitionFrames) {
                this.phase = 'up'
                this.transitionFrames = 0
                counted = true
            }
        } else if (
            (this.phase === 'transition' && angle >= downThresholdWithHysteresis && angle <= upThresholdWithHysteresis)
        ) {
            // Reset transition if we're in the middle zone
            this.transitionFrames = 0
        }

        return { counted, phase: this.phase }
    }

    reset() {
        this.phase = 'up'
        this.transitionFrames = 0
    }
}

/**
 * Calculate velocity of movement (for detecting too-fast reps)
 */
export class VelocityTracker {
    private previousAngle: number | null = null
    private previousTime: number | null = null

    getVelocity(angle: number): number | null {
        const now = performance.now()

        if (this.previousAngle === null || this.previousTime === null) {
            this.previousAngle = angle
            this.previousTime = now
            return null
        }

        const deltaAngle = angle - this.previousAngle
        const deltaTime = (now - this.previousTime) / 1000 // Convert to seconds

        this.previousAngle = angle
        this.previousTime = now

        return Math.abs(deltaAngle / deltaTime) // degrees per second
    }

    reset() {
        this.previousAngle = null
        this.previousTime = null
    }
}
