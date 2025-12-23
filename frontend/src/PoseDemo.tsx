import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from './App'
import apiClient from './utils/api'
import { toast } from './components/Toast'
import { MEDIAPIPE_WASM_URL, MEDIAPIPE_MODEL_URL } from './utils/constants'
import { FilesetResolver, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision'
import ExerciseCard from './ExerciseCard'
import ExerciseStats from './components/ExerciseStats'
import { EXERCISES, type ExerciseType } from './types'
import {
  calculateAngle,
  AngleSmoothing,
  RepCounter,
  VelocityTracker,
  analyzePosture,
  areLandmarksVisible
} from './utils/poseAnalysis'

export default function PoseDemo() {
  const { token } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poseRef = useRef<PoseLandmarker | null>(null)
  const phaseRef = useRef<'up' | 'down' | 'idle'>('idle')
  const animationRef = useRef<number>(0) as React.MutableRefObject<number>

  // State
  const [currentExercise, setCurrentExercise] = useState<ExerciseType>('squat')
  const [reps, setReps] = useState(0)
  const [currentAngle, setCurrentAngle] = useState(0)
  const [phase, setPhase] = useState<'up' | 'down' | 'idle'>('idle')
  const [postureScore, setPostureScore] = useState(0)
  const [postureFeedback, setPostureFeedback] = useState('Select an exercise to begin')
  const [sessionActive, setSessionActive] = useState(false)
  const [avgPostureScore, setAvgPostureScore] = useState(0)
  const [status, setStatus] = useState('🔄 Initializing AI Pose Detection...')
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null) // Pregnancy profile
  const [postureIssues, setPostureIssues] = useState<string[]>([])
  const [velocity, setVelocity] = useState<number>(0)
  const [landmarksVisible, setLandmarksVisible] = useState(true)

  // Advanced tracking utilities (memoized to prevent recreation)
  const angleSmootherRef = useRef<AngleSmoothing>(new AngleSmoothing())
  const repCounterRef = useRef<RepCounter>(new RepCounter())
  const velocityTrackerRef = useRef<VelocityTracker>(new VelocityTracker())
  const previousLandmarksRef = useRef<any[] | null>(null)

  // Load pregnancy profile for trimester safety
  useEffect(() => {
    apiClient.get('/pregnancy-profile/')
      .then(res => {
        setProfile(res.data.id ? res.data : null)
      })
      .catch(() => setProfile(null))
  }, [])

  const processExercise = useCallback((landmarks: any[]) => {
    if (!landmarks?.length) return

    const lm = landmarks[0]
    const exercise = EXERCISES[currentExercise]
    const [joint1Idx, joint2Idx, joint3Idx] = exercise.joints

    // Check landmark visibility
    const visible = areLandmarksVisible(lm, exercise.joints)
    setLandmarksVisible(visible)

    if (!visible) {
      setPostureFeedback('⚠️ Position yourself fully in frame')
      return
    }

    // Calculate angle with 3D support
    const rawAngle = calculateAngle(
      lm[joint1Idx],
      lm[joint2Idx],
      lm[joint3Idx]
    )

    // Smooth the angle to reduce jitter
    const smoothedAngle = angleSmootherRef.current.smooth(rawAngle)
    setCurrentAngle(Math.round(smoothedAngle))

    // Track velocity (detect too-fast movements)
    const currentVelocity = velocityTrackerRef.current.getVelocity(smoothedAngle)
    if (currentVelocity !== null) {
      setVelocity(Math.round(currentVelocity))

      // Warn if moving too fast (pregnancy safety)
      if (currentVelocity > 150) {
        toast.error('⚠️ Slow down! Move at a controlled pace', { duration: 2000 })
      }
    }

    // Advanced rep counting with hysteresis
    const repResult = repCounterRef.current.count(
      smoothedAngle,
      exercise.thresholds.down,
      exercise.thresholds.up
    )

    if (repResult.counted) {
      setReps(r => r + 1)
      toast.success('✅ Rep counted!', { duration: 1000 })
    }

    setPhase(repResult.phase === 'transition' ? phaseRef.current : repResult.phase)
    phaseRef.current = repResult.phase === 'transition' ? phaseRef.current : repResult.phase

    // Advanced posture analysis
    const targetAngle = (exercise.thresholds.down + exercise.thresholds.up) / 2
    const postureAnalysis = analyzePosture(
      smoothedAngle,
      targetAngle,
      currentExercise,
      lm
    )

    setPostureFeedback(postureAnalysis.feedback)
    setPostureScore(postureAnalysis.score)
    setPostureIssues(postureAnalysis.issues)
    setAvgPostureScore(prev => (prev * 0.9 + postureAnalysis.score * 0.1))

    // Store current landmarks for next frame comparison
    previousLandmarksRef.current = lm
  }, [currentExercise])

  const saveSession = async () => {
    if (!token || reps === 0) return

    setSaving(true)
    try {
      const res = await apiClient.get('/exercises/')
      const targetEx = res.data.find((ex: any) =>
        ex.name.toLowerCase().includes(currentExercise)
      ) || res.data[0]

      await apiClient.post('/sessions/', {
        exercise_id: targetEx.id,
        rep_count: reps,
        avg_posture_score: Number(avgPostureScore.toFixed(1)),
        posture_warnings: postureIssues.join(', ')
      })

      toast.success(`🎉 Saved ${reps} ${EXERCISES[currentExercise].name} @ ${avgPostureScore.toFixed(0)}% posture!`)
      setReps(0)
      setAvgPostureScore(0)
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Failed to save session. Please try again.')
    }
    setSaving(false)
  }

  // Main MediaPipe loop
  useEffect(() => {
    let mounted = true

    const initPose = async () => {
      try {
        setStatus('🔄 Loading MediaPipe Pose AI...')
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL)

        poseRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_MODEL_URL,
            delegate: 'GPU' // Use GPU acceleration if available
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        setStatus('📹 Camera access granted - Choose exercise!')

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        })

        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setStatus('✅ AI Ready! Select exercise below')
          }
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
      mounted = false
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)?.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Video processing loop
  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !poseRef.current || !sessionActive) {
      animationRef.current = requestAnimationFrame(processFrame)
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || !video.videoWidth) {
      animationRef.current = requestAnimationFrame(processFrame)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const startTimeMs = performance.now()

    if (poseRef.current.detectForVideo) {
      poseRef.current.detectForVideo(video, startTimeMs, (result) => {
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Mirror effect
        ctx.scale(-1, 1)
        ctx.translate(-canvas.width, 0)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        ctx.restore()

        if (result.landmarks?.length) {
          const drawingUtils = new DrawingUtils(ctx)
          const landmarks = result.landmarks[0]

          // Draw pose landmarks and connections
          drawingUtils.drawLandmarks(landmarks, {
            color: sessionActive ? '#10B981' : '#6B7280',
            radius: sessionActive ? 6 : 3
          })
          drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
            color: sessionActive ? '#3B82F6' : '#D1D5DB',
            lineWidth: sessionActive ? 4 : 2
          })

          processExercise(result.landmarks)
        }
      })
    }

    animationRef.current = requestAnimationFrame(processFrame)
  }, [sessionActive, processExercise])

  useEffect(() => {
    if (sessionActive) {
      processFrame()
    }
  }, [processFrame, sessionActive])

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

      toast.success(`Started tracking ${EXERCISES[currentExercise].name}`)
    }
  }

  const resetSession = () => {
    setReps(0)
    setPhase('idle')
    setCurrentAngle(0)
    setAvgPostureScore(0)
    setPostureFeedback('Ready to start')
  }

  const currentEx = EXERCISES[currentExercise]
  const trimester = profile?.trimester

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
            🤰 Pregnancy Exercise Coach
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            AI-powered form tracking with trimester-safe exercises
          </p>
          <div className="mt-4 text-lg font-semibold text-emerald-600">
            {status}
          </div>
        </div>

        {/* Exercise Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.values(EXERCISES).map((exercise: any) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isActive={currentExercise === exercise.id}
              onSelect={setCurrentExercise}
              trimester={trimester}
            />
          ))}
        </div>

        {/* Live Stats (Only when session active) */}
        {sessionActive && (
          <ExerciseStats
            reps={reps}
            angle={currentAngle}
            phase={phase}
            postureScore={postureScore}
            feedback={postureFeedback}
            exerciseName={currentEx.name}
          />
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto p-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40">
          <button
            onClick={toggleSession}
            disabled={saving || !EXERCISES[currentExercise].trimesterSafe.includes(trimester || 1)}
            className={`
              flex-1 p-6 text-xl font-black rounded-3xl shadow-2xl transition-all duration-300
              ${sessionActive
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-red-500/50'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/50'
              }
              ${saving ? 'opacity-75 cursor-not-allowed' : ''}
            `}
          >
            {sessionActive
              ? saving ? '💾 Saving Session...'
                : `⏹️ End Session (${reps} reps)`
              : '▶️ Start Tracking'
            }
          </button>

          <button
            onClick={resetSession}
            disabled={sessionActive}
            className="px-8 py-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-3xl hover:from-gray-600 hover:to-gray-700 shadow-lg transition-all disabled:opacity-50"
          >
            🔄 Reset
          </button>
        </div>

        {/* Feedback */}
        <div className={`max-w-2xl mx-auto p-8 rounded-3xl shadow-xl border-4 transition-all mx-4 ${postureScore > 85 ? 'bg-emerald-50 border-emerald-300 shadow-emerald-200/50' :
          postureScore > 70 ? 'bg-amber-50 border-amber-300 shadow-amber-200/50' :
            'bg-red-50 border-red-300 shadow-red-200/50'
          }`}>
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">{postureFeedback}</div>
            <div className="text-4xl font-black">
              {avgPostureScore.toFixed(0)}% Average Form
            </div>
          </div>
        </div>

        {/* Video Feed */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-b from-white to-gray-50 p-8 rounded-4xl shadow-2xl border-8 border-white/50 backdrop-blur-xl">
            <div className="flex justify-center items-center mb-6 gap-4 text-lg font-semibold text-gray-700 uppercase tracking-wide">
              <span>{currentEx.name}</span>
              <span>• {sessionActive ? '🔴 LIVE TRACKING' : '⚫ Standby'}</span>
            </div>

            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas
              ref={canvasRef}
              className="w-full max-w-3xl mx-auto block rounded-3xl shadow-2xl border-8 border-emerald-200/30"
            />

            {!sessionActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl">
                <div className="text-center p-12">
                  <div className="text-6xl mb-4 opacity-75">{currentEx.icon}</div>
                  <div className="text-2xl font-bold text-gray-700 mb-2">
                    Ready for {currentEx.name}
                  </div>
                  <div className="text-lg text-gray-600 max-w-md mx-auto">
                    Click "Start Tracking" to begin AI pose analysis
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pregnancy Integration */}
        {profile && (
          <div className="text-center text-sm text-gray-600 py-4 bg-white/50 rounded-2xl backdrop-blur-sm">
            🤰 Week {profile.current_week} (Trimester {profile.trimester}) •
            {currentEx.trimesterSafe.includes(profile.trimester) ? '✅ Safe' : '⚠️ Consult doctor'}
          </div>
        )}
      </div>
    </div>
  )
}
