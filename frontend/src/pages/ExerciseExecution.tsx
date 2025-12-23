import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '../App'
import apiClient, { getErrorMessage } from '../utils/api'
import { toast } from '../components/Toast'
import { MEDIAPIPE_WASM_URL, MEDIAPIPE_MODEL_URL } from '../utils/constants'
import { FilesetResolver, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision'
import { EXERCISES, type ExerciseType } from '../types'
import ExerciseStats from '../components/ExerciseStats'
import SafetyAlertOverlay from '../components/SafetyAlertOverlay'
import { Loader, AlertCircle, Play, Square, Save, Heart } from 'lucide-react'
import {
    calculateAngle,
    AngleSmoothing,
    RepCounter,
    VelocityTracker,
    analyzePosture,
    areLandmarksVisible
} from '../utils/poseAnalysis'

export default function ExerciseExecution() {
    const { id } = useParams<{ id: ExerciseType }>()
    const navigate = useNavigate()
    const { token } = useAuth()

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const poseRef = useRef<PoseLandmarker | null>(null)
    const phaseRef = useRef<'up' | 'down' | 'idle'>('idle')
    const animationRef = useRef<number>(0) as React.MutableRefObject<number>

    // State
    const [reps, setReps] = useState(0)
    const [currentAngle, setCurrentAngle] = useState(0)
    const [phase, setPhase] = useState<'up' | 'down' | 'idle'>('idle')
    const [postureScore, setPostureScore] = useState(0)
    const [postureFeedback, setPostureFeedback] = useState('Click Start to begin')
    const [sessionActive, setSessionActive] = useState(false)
    const [avgPostureScore, setAvgPostureScore] = useState(0)
    const [status, setStatus] = useState('Initializing AI...')
    const [saving, setSaving] = useState(false)
    const [postureIssues, setPostureIssues] = useState<string[]>([])
    const [landmarksVisible, setLandmarksVisible] = useState(true)

    // Safety monitoring state
    const [showSafetyAlert, setShowSafetyAlert] = useState(false)
    const [safetyLevel, setSafetyLevel] = useState<'safe' | 'caution' | 'warning' | 'danger'>('safe')
    const [safetyAlerts, setSafetyAlerts] = useState<any[]>([])
    const [safetyRecommendations, setSafetyRecommendations] = useState<any[]>([])
    const [lastSafetyCheck, setLastSafetyCheck] = useState(0)

    // Advanced tracking utilities
    const angleSmootherRef = useRef<AngleSmoothing>(new AngleSmoothing())
    const repCounterRef = useRef<RepCounter>(new RepCounter())
    const velocityTrackerRef = useRef<VelocityTracker>(new VelocityTracker())
    const previousLandmarksRef = useRef<any[] | null>(null)

    const exercise = id ? EXERCISES[id as ExerciseType] : null

    if (!exercise) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Exercise Not Found</h2>
                    <button
                        onClick={() => navigate('/exercises')}
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
                    >
                        ← Back to Library
                    </button>
                </div>
            </div>
        )
    }

    const processExercise = useCallback((landmarks: any[]) => {
        if (!landmarks?.length) return

        const lm = landmarks[0]
        const [joint1Idx, joint2Idx, joint3Idx] = exercise.joints

        // Check landmark visibility
        const visible = areLandmarksVisible(lm, exercise.joints)
        setLandmarksVisible(visible)

        if (!visible) {
            setPostureFeedback('Position yourself fully in frame')
            return
        }

        // Calculate angle with 3D support
        const rawAngle = calculateAngle(lm[joint1Idx], lm[joint2Idx], lm[joint3Idx])

        // Smooth the angle
        const smoothedAngle = angleSmootherRef.current.smooth(rawAngle)
        setCurrentAngle(Math.round(smoothedAngle))

        // Track velocity
        const currentVelocity = velocityTrackerRef.current.getVelocity(smoothedAngle)
        if (currentVelocity !== null && currentVelocity > 150) {
            setPostureFeedback('Slow down! Move at a controlled pace')
        }

        // Advanced rep counting
        const repResult = repCounterRef.current.count(
            smoothedAngle,
            exercise.thresholds.down,
            exercise.thresholds.up
        )

        if (repResult.counted) {
            setReps(r => r + 1)
        }

        setPhase(repResult.phase === 'transition' ? phaseRef.current : repResult.phase)
        phaseRef.current = repResult.phase === 'transition' ? phaseRef.current : repResult.phase

        // Advanced posture analysis
        const targetAngle = (exercise.thresholds.down + exercise.thresholds.up) / 2
        const postureAnalysis = analyzePosture(smoothedAngle, targetAngle, exercise.id, lm)

        setPostureFeedback(postureAnalysis.feedback)
        setPostureScore(postureAnalysis.score)
        setPostureIssues(postureAnalysis.issues)
        setAvgPostureScore(prev => (prev * 0.9 + postureAnalysis.score * 0.1))

        previousLandmarksRef.current = lm
    }, [exercise])

    // Safety monitoring function
    const checkExerciseSafety = useCallback(async () => {
        // Check safety every 10 seconds during active session
        const now = Date.now()
        if (now - lastSafetyCheck < 10000) return

        try {
            const response = await apiClient.post('/check-exercise-safety/', {
                posture_score: avgPostureScore,
                current_reps: reps
            })

            const { safe_to_continue, safety_level, alerts, recommendations, should_pause } = response.data

            setSafetyLevel(safety_level)
            setSafetyAlerts(alerts || [])
            setSafetyRecommendations(recommendations || [])
            setLastSafetyCheck(now)

            // Show alert if there are warnings or if not safe to continue
            if (!safe_to_continue || alerts.length > 0 || safety_level === 'warning' || safety_level === 'danger') {
                setShowSafetyAlert(true)

                // Auto-pause if critical
                if (should_pause && sessionActive) {
                    setSessionActive(false)
                    setPhase('idle')
                }
            }
        } catch (error) {
            console.error('Safety check failed:', error)
        }
    }, [avgPostureScore, reps, lastSafetyCheck, sessionActive])

    const saveSession = async () => {
        if (reps === 0) return

        setSaving(true)
        try {
            const res = await apiClient.get('/exercises/')
            const targetEx = res.data.find((ex: any) =>
                ex.name.toLowerCase().includes(exercise.id)
            ) || res.data[0]

            await apiClient.post('/sessions/', {
                exercise_id: targetEx.id,
                rep_count: reps,
                avg_posture_score: Number(avgPostureScore.toFixed(1)),
                posture_warnings: postureIssues.join(', ')
            })

            toast.success(`🎉 Saved ${reps} ${exercise.name} @ ${avgPostureScore.toFixed(0)}% posture!`)
            setReps(0)
            setAvgPostureScore(0)
        } catch (error) {
            console.error('Save failed:', error)
            toast.error('Failed to save session. Please try again.')
        }
        setSaving(false)
    }

    useEffect(() => {
        const initPose = async () => {
            try {
                setStatus('Loading MediaPipe AI...')
                const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL)

                poseRef.current = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: MEDIAPIPE_MODEL_URL,
                        delegate: 'CPU'  // CPU is faster to initialize than GPU
                    },
                    runningMode: 'VIDEO',
                    numPoses: 1,
                    minPoseDetectionConfidence: 0.3,  // Lower for faster detection
                    minPosePresenceConfidence: 0.3,   // Lower for faster detection
                    minTrackingConfidence: 0.3        // Lower for faster tracking
                })

                setStatus('Camera ready - Click Start!')

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 640,   // Lower resolution for faster processing
                        height: 480,
                        frameRate: 30  // Standard frame rate
                    }
                })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    videoRef.current.addEventListener('loadeddata', () => {
                        setStatus('AI Ready! Click Start Exercise')
                        // Set canvas size to match video
                        if (canvasRef.current && videoRef.current) {
                            canvasRef.current.width = videoRef.current.videoWidth
                            canvasRef.current.height = videoRef.current.videoHeight
                        }
                    })
                }
            } catch (error: any) {
                const errorMsg = error.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow camera permissions.'
                    : error.name === 'NotFoundError'
                        ? 'No camera found. Please connect a camera.'
                        : `Error: ${error.message}`
                setStatus(`❌ ${errorMsg}`)
                toast.error(errorMsg)
            }
        }

        initPose()

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    useEffect(() => {
        if (!sessionActive || !poseRef.current || !videoRef.current || !canvasRef.current) return

        const detectPose = async () => {
            if (!videoRef.current || !canvasRef.current || !poseRef.current) return

            const results = await poseRef.current.detectForVideo(videoRef.current, performance.now())

            const ctx = canvasRef.current.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

                if (results.landmarks && results.landmarks.length > 0) {
                    const drawingUtils = new DrawingUtils(ctx)

                    for (const landmark of results.landmarks) {
                        // Draw connections (skeleton) - bright cyan
                        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
                            color: '#00FFFF',
                            lineWidth: 5
                        })

                        // Draw landmarks (joints) - bright yellow
                        drawingUtils.drawLandmarks(landmark, {
                            radius: 8,
                            color: '#FFFF00',
                            fillColor: '#FF0000'
                        })
                    }

                    processExercise(results.landmarks)
                }
            }

            animationRef.current = requestAnimationFrame(detectPose)
        }

        detectPose()

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [sessionActive, processExercise])

    // Safety check interval
    useEffect(() => {
        if (!sessionActive) return

        const safetyInterval = setInterval(() => {
            checkExerciseSafety()
        }, 10000) // Check every 10 seconds

        return () => clearInterval(safetyInterval)
    }, [sessionActive, checkExerciseSafety])

    const toggleSession = () => {
        if (sessionActive) {
            setSessionActive(false)
            setPhase('idle')
            saveSession()

            // Reset trackers
            angleSmootherRef.current.reset()
            repCounterRef.current.reset()
            velocityTrackerRef.current.reset()
            previousLandmarksRef.current = null
        } else {
            phaseRef.current = 'up'
            setSessionActive(true)
            setPhase('up')
            setReps(0)
            setAvgPostureScore(0)
            setPostureIssues([])

            // Reset trackers
            angleSmootherRef.current.reset()
            repCounterRef.current.reset()
            velocityTrackerRef.current.reset()
            previousLandmarksRef.current = null

            toast.success(`Started tracking ${exercise.name}`)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Header */}
            <div className="bg-black/30 backdrop-blur p-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(`/exercises/${exercise.id}`)}
                    className="text-white hover:text-blue-300 font-medium flex items-center gap-2"
                >
                    ← Back to Details
                </button>
                <h1 className="text-2xl font-bold">{exercise.name}</h1>
                <div className="w-32"></div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Live Camera Feed */}
                        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-auto"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                style={{ transform: 'scaleX(-1)' }}
                            />

                            {/* Status Overlay */}
                            {!sessionActive && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader className="w-16 h-16 text-blue-400 mb-4 mx-auto animate-spin" />
                                        <p className="text-2xl font-bold mb-2 text-white">{status}</p>
                                        <p className="text-gray-300">Click "Start Exercise" to begin</p>
                                    </div>
                                </div>
                            )}

                            {/* Real-time Feedback Overlay */}
                            {sessionActive && (
                                <div className="absolute top-4 left-4 right-4 pointer-events-none">
                                    {/* Posture Feedback Banner */}
                                    <div className={`p-4 rounded-xl backdrop-blur-lg border-2 shadow-2xl ${postureScore > 85 ? 'bg-green-500/90 border-green-300' :
                                        postureScore > 70 ? 'bg-yellow-500/90 border-yellow-300' :
                                            'bg-red-500/90 border-red-300'
                                        }`}>
                                        <p className="text-white text-2xl font-bold text-center drop-shadow-lg">
                                            {postureFeedback}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reference Video Demo */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                Proper Form Reference
                            </h3>
                            <div className="relative bg-black rounded-xl overflow-hidden">
                                {exercise.imageUrl ? (
                                    <img
                                        src={exercise.imageUrl}
                                        alt={`${exercise.name} demonstration`}
                                        className="w-full h-48 object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                                        <p className="text-gray-400">Demo video coming soon</p>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                                    Reference
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Panel */}
                    <div className="space-y-4">
                        <ExerciseStats
                            reps={reps}
                            currentAngle={currentAngle}
                            phase={phase}
                            postureScore={postureScore}
                            postureFeedback={postureFeedback}
                        />

                        {/* Controls */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                            <button
                                onClick={toggleSession}
                                disabled={saving}
                                className={`w-full py-4 font-bold text-lg rounded-xl transition-all ${sessionActive
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                    } disabled:opacity-50`}
                            >
                                {saving ? (
                                    <>
                                        <Save className="w-5 h-5 animate-pulse" />
                                        Saving...
                                    </>
                                ) : sessionActive ? (
                                    <>
                                        <Square className="w-5 h-5" />
                                        Stop Exercise
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Start Exercise
                                    </>
                                )}
                            </button>

                            {reps > 0 && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-300">Average Posture</p>
                                    <p className="text-3xl font-bold">{avgPostureScore.toFixed(0)}%</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Safety Alert Overlay */}
            <SafetyAlertOverlay
                isVisible={showSafetyAlert}
                safetyLevel={safetyLevel}
                alerts={safetyAlerts}
                recommendations={safetyRecommendations}
                onContinue={() => setShowSafetyAlert(false)}
                onPause={() => {
                    setShowSafetyAlert(false)
                    setSessionActive(false)
                    setPhase('idle')
                }}
            />
        </div >
    )
}
