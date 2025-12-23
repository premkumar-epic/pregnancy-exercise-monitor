"""
Safety Fusion Engine
Combines exercise posture analysis with health vitals for intelligent safety alerts
"""

from typing import Dict, List, Optional


class SafetyFusionEngine:
    """
    Analyzes combined safety metrics from exercise posture and health vitals
    Provides intelligent alerts and recommendations for pregnant users
    """
    
    # Safety thresholds
    POSTURE_THRESHOLD_POOR = 70
    POSTURE_THRESHOLD_GOOD = 85
    HEART_RATE_THRESHOLD_HIGH = 100
    HEART_RATE_THRESHOLD_VERY_HIGH = 120
    FATIGUE_THRESHOLD_HIGH = 70
    FATIGUE_THRESHOLD_VERY_HIGH = 85
    
    @classmethod
    def analyze_safety(
        cls,
        posture_score: float,
        vitals: Dict,
        current_reps: int = 0
    ) -> Dict:
        """
        Analyze combined safety metrics and generate alerts
        
        Args:
            posture_score: Current exercise posture score (0-100)
            vitals: Dictionary of health vitals
            current_reps: Current rep count
        
        Returns:
            Dictionary with safety status, alerts, and recommendations
        """
        alerts = []
        recommendations = []
        safety_level = 'safe'  # safe, caution, warning, danger
        
        # Extract vitals
        heart_rate = vitals.get('heart_rate', 80)
        stress_level = vitals.get('stress_level', 'low')
        fatigue_level = vitals.get('fatigue_level', 30)
        spo2 = vitals.get('spo2', 98)
        
        # Rule 1: Poor posture + High heart rate (CRITICAL)
        if posture_score < cls.POSTURE_THRESHOLD_POOR and heart_rate > cls.HEART_RATE_THRESHOLD_HIGH:
            alerts.append({
                'level': 'warning',
                'priority': 'high',
                'message': 'Poor posture detected with elevated heart rate',
                'action': 'Please slow down and focus on proper form',
                'should_pause': True
            })
            safety_level = 'warning'
        
        # Rule 2: Very high heart rate (CRITICAL)
        if heart_rate > cls.HEART_RATE_THRESHOLD_VERY_HIGH:
            alerts.append({
                'level': 'danger',
                'priority': 'critical',
                'message': 'Heart rate is very high',
                'action': 'Stop exercise immediately and rest',
                'should_pause': True
            })
            safety_level = 'danger'
        
        # Rule 3: High fatigue during exercise
        if fatigue_level > cls.FATIGUE_THRESHOLD_HIGH:
            if fatigue_level > cls.FATIGUE_THRESHOLD_VERY_HIGH:
                alerts.append({
                    'level': 'warning',
                    'priority': 'high',
                    'message': 'Very high fatigue level detected',
                    'action': 'Stop and rest. Do not push through fatigue',
                    'should_pause': True
                })
                safety_level = 'warning' if safety_level == 'safe' else safety_level
            else:
                recommendations.append({
                    'level': 'caution',
                    'message': 'Elevated fatigue detected',
                    'action': 'Consider taking a break after this set'
                })
                if safety_level == 'safe':
                    safety_level = 'caution'
        
        # Rule 4: High stress + Exercise
        if stress_level == 'high':
            recommendations.append({
                'level': 'info',
                'message': 'Elevated stress detected',
                'action': 'Try gentle exercises or breathing techniques instead'
            })
        
        # Rule 5: Poor posture alone
        if posture_score < cls.POSTURE_THRESHOLD_POOR and heart_rate <= cls.HEART_RATE_THRESHOLD_HIGH:
            recommendations.append({
                'level': 'caution',
                'message': 'Posture needs improvement',
                'action': 'Focus on form. Slow down if needed'
            })
            if safety_level == 'safe':
                safety_level = 'caution'
        
        # Rule 6: Low SpO2 (rare but important)
        if spo2 < 95:
            alerts.append({
                'level': 'warning',
                'priority': 'high',
                'message': 'Blood oxygen level is low',
                'action': 'Stop exercise and take deep breaths',
                'should_pause': True
            })
            safety_level = 'warning' if safety_level in ['safe', 'caution'] else safety_level
        
        # Rule 7: Excellent conditions (POSITIVE FEEDBACK)
        if (posture_score > cls.POSTURE_THRESHOLD_GOOD and 
            heart_rate < 95 and 
            stress_level == 'low' and
            fatigue_level < 50):
            recommendations.append({
                'level': 'positive',
                'message': 'Excellent! All vitals are optimal',
                'action': 'You\'re doing great - continue at this pace'
            })
        
        # Rule 8: Good posture but moderate exertion
        if (posture_score > cls.POSTURE_THRESHOLD_GOOD and 
            95 <= heart_rate <= cls.HEART_RATE_THRESHOLD_HIGH):
            recommendations.append({
                'level': 'info',
                'message': 'Good form with moderate intensity',
                'action': 'Maintain this pace for optimal benefits'
            })
        
        # Determine if safe to continue
        safe_to_continue = safety_level not in ['warning', 'danger']
        should_pause = any(alert.get('should_pause', False) for alert in alerts)
        
        return {
            'safe_to_continue': safe_to_continue,
            'should_pause': should_pause,
            'safety_level': safety_level,
            'alerts': alerts,
            'recommendations': recommendations,
            'metrics': {
                'posture_score': posture_score,
                'heart_rate': heart_rate,
                'stress_level': stress_level,
                'fatigue_level': fatigue_level,
                'spo2': spo2,
                'current_reps': current_reps
            }
        }
    
    @classmethod
    def get_safety_color(cls, safety_level: str) -> str:
        """Get color code for safety level"""
        colors = {
            'safe': '#10B981',      # Green
            'caution': '#F59E0B',   # Yellow
            'warning': '#EF4444',   # Red
            'danger': '#DC2626'     # Dark Red
        }
        return colors.get(safety_level, '#6B7280')  # Gray default
    
    @classmethod
    def get_safety_message(cls, safety_level: str) -> str:
        """Get user-friendly message for safety level"""
        messages = {
            'safe': 'All systems go! You\'re exercising safely.',
            'caution': 'Be mindful of your form and intensity.',
            'warning': 'Please slow down or take a break.',
            'danger': 'Stop immediately and rest.'
        }
        return messages.get(safety_level, 'Monitoring your safety...')
