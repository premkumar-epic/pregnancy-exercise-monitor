import type { ExerciseConfig, ExerciseType } from './types'

interface Props {
  exercise: ExerciseConfig
  isActive: boolean
  onSelect: (type: ExerciseType) => void
  trimester?: number
}

export default function ExerciseCard({ exercise, isActive, onSelect, trimester }: Props) {
  const isSafe = !trimester || exercise.trimesterSafe.includes(trimester)

  const handleClick = () => {
    if (isSafe) {
      onSelect(exercise.id)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isSafe && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onSelect(exercise.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={isSafe ? 0 : -1}
      aria-label={`${exercise.name} exercise${isActive ? ', currently selected' : ''}${!isSafe ? ', not safe for current trimester' : ''}`}
      aria-pressed={isActive}
      aria-disabled={!isSafe}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      className={`
        p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl group relative
        border-4 ${isActive
          ? 'border-emerald-400 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 shadow-emerald-500/25 ring-4 ring-emerald-200/50 scale-105'
          : isSafe
            ? 'border-gray-200/50 hover:border-emerald-300/50 hover:scale-[1.02] hover:shadow-xl bg-white/80 backdrop-blur-sm cursor-pointer'
            : 'border-gray-200/30 bg-gray-50/50 cursor-not-allowed opacity-60'
        }
      `}
    >
      <div className={`text-5xl mb-4 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
        {exercise.icon}
      </div>
      <h3 className="text-xl font-black mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        {exercise.name}
      </h3>
      <div className="space-y-2 mb-4">
        {exercise.instructions.slice(0, 3).map((tip, i) => (
          <div key={i} className="flex items-start text-sm">
            <div className={`w-2 h-2 mt-1.5 rounded-full mr-3 flex-shrink-0 ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
            <span className="leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>
      {!isSafe && trimester && (
        <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-300">
          T{trimester} Check w/ Doc
        </div>
      )}
    </div>
  )
}
