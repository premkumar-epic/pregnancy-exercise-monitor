import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface SafetyAlert {
    level: 'warning' | 'danger' | 'caution' | 'info' | 'positive'
    priority?: 'high' | 'critical' | 'low'
    message: string
    action: string
    should_pause?: boolean
}

interface SafetyAlertOverlayProps {
    isVisible: boolean
    safetyLevel: 'safe' | 'caution' | 'warning' | 'danger'
    alerts: SafetyAlert[]
    recommendations: SafetyAlert[]
    onContinue: () => void
    onPause: () => void
}

export default function SafetyAlertOverlay({
    isVisible,
    safetyLevel,
    alerts,
    recommendations,
    onContinue,
    onPause
}: SafetyAlertOverlayProps) {
    if (!isVisible || (alerts.length === 0 && recommendations.length === 0)) {
        return null
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'danger':
                return 'bg-red-500'
            case 'warning':
                return 'bg-orange-500'
            case 'caution':
                return 'bg-yellow-500'
            case 'positive':
                return 'bg-green-500'
            default:
                return 'bg-blue-500'
        }
    }

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'danger':
            case 'warning':
                return AlertTriangle
            case 'positive':
                return CheckCircle
            case 'caution':
                return XCircle
            default:
                return Info
        }
    }

    const shouldPause = alerts.some(alert => alert.should_pause)

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-full ${getLevelColor(safetyLevel)}`}>
                                {safetyLevel === 'danger' || safetyLevel === 'warning' ? (
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                ) : safetyLevel === 'safe' ? (
                                    <CheckCircle className="w-6 h-6 text-white" />
                                ) : (
                                    <Info className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    {safetyLevel === 'danger' && 'Safety Alert!'}
                                    {safetyLevel === 'warning' && 'Please Be Careful'}
                                    {safetyLevel === 'caution' && 'Attention Needed'}
                                    {safetyLevel === 'safe' && 'All Good!'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {shouldPause ? 'Exercise paused for your safety' : 'Review and continue'}
                                </p>
                            </div>
                        </div>

                        {/* Alerts */}
                        {alerts.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {alerts.map((alert, index) => {
                                    const Icon = getLevelIcon(alert.level)
                                    return (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg border-2 ${alert.level === 'danger'
                                                    ? 'bg-red-50 border-red-200'
                                                    : alert.level === 'warning'
                                                        ? 'bg-orange-50 border-orange-200'
                                                        : 'bg-yellow-50 border-yellow-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Icon className={`w-5 h-5 mt-0.5 ${alert.level === 'danger'
                                                        ? 'text-red-600'
                                                        : alert.level === 'warning'
                                                            ? 'text-orange-600'
                                                            : 'text-yellow-600'
                                                    }`} />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 mb-1">
                                                        {alert.message}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        {alert.action}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Recommendations */}
                        {recommendations.length > 0 && (
                            <div className="space-y-2 mb-4">
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">Recommendations:</h4>
                                {recommendations.map((rec, index) => {
                                    const Icon = getLevelIcon(rec.level)
                                    return (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg ${rec.level === 'positive'
                                                    ? 'bg-green-50 border border-green-200'
                                                    : 'bg-blue-50 border border-blue-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <Icon className={`w-4 h-4 mt-0.5 ${rec.level === 'positive' ? 'text-green-600' : 'text-blue-600'
                                                    }`} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {rec.message}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {rec.action}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {shouldPause ? (
                                <>
                                    <button
                                        onClick={onPause}
                                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                                    >
                                        Take a Break
                                    </button>
                                    <button
                                        onClick={onContinue}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        I'll Be Careful
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onContinue}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    Continue Exercise
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
