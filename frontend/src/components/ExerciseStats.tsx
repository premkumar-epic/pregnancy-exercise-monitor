interface Props {
  reps: number
  currentAngle: number
  phase: 'up' | 'down' | 'idle'
  postureScore: number
  postureFeedback: string
}

export default function ExerciseStats({
  reps, currentAngle, phase, postureScore, postureFeedback
}: Props) {
  const getPhaseColor = (phase: Props['phase']) => {
    return phase === 'up' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' :
      phase === 'down' ? 'bg-blue-100 border-blue-400 text-blue-800' :
        'bg-gray-100 border-gray-300 text-gray-700'
  }

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-4">
      {/* Reps */}
      <div className="text-center">
        <div className="text-6xl font-black text-white mb-2">
          {reps}
        </div>
        <div className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Reps
        </div>
      </div>

      {/* Angle */}
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-300 mb-2">
          {currentAngle}°
        </div>
        <div className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Angle
        </div>
      </div>

      {/* Posture Score */}
      <div className="text-center">
        <div className={`text-4xl font-black px-4 py-2 rounded-xl mb-2 ${postureScore > 85 ? 'bg-green-500 text-white' :
            postureScore > 70 ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
          }`}>
          {Math.round(postureScore)}%
        </div>
        <div className="text-sm font-bold uppercase tracking-wider text-gray-300">
          Posture
        </div>
      </div>

      {/* Phase */}
      <div className={`text-center p-4 rounded-xl ${getPhaseColor(phase)}`}>
        <div className="text-2xl font-black uppercase">
          {phase}
        </div>
        <div className="text-xs uppercase tracking-wider font-bold opacity-80">
          Phase
        </div>
      </div>

      {/* Feedback */}
      <div className="text-center p-4 bg-white/20 rounded-xl">
        <div className="text-lg font-semibold text-white">
          {postureFeedback}
        </div>
      </div>
    </div>
  )
}
