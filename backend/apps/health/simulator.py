"""
Health Data Simulator for Pregnancy Exercise Monitoring
Generates realistic, pregnancy-safe health vitals for demonstration purposes
"""

import random
from datetime import datetime, timedelta
from typing import Dict, Optional


class HealthDataSimulator:
    """Generate realistic pregnancy-safe health vitals"""
    
    # Pregnancy-adjusted vital ranges
    HEART_RATE_RANGES = {
        'first_trimester': (70, 90),
        'second_trimester': (75, 95),
        'third_trimester': (80, 100),
        'during_exercise': (90, 120),
    }
    
    SPO2_RANGE = (96, 100)
    FATIGUE_RANGES = {
        'first_trimester': (40, 70),
        'second_trimester': (30, 60),
        'third_trimester': (50, 80),
    }
    
    @staticmethod
    def get_trimester(pregnancy_week: int) -> str:
        """Determine trimester from pregnancy week"""
        if pregnancy_week <= 13:
            return 'first_trimester'
        elif pregnancy_week <= 27:
            return 'second_trimester'
        else:
            return 'third_trimester'
    
    @classmethod
    def generate_vitals(
        cls,
        pregnancy_week: int = 20,
        is_exercising: bool = False,
        time_of_day: Optional[str] = None
    ) -> Dict:
        """
        Generate realistic vitals based on pregnancy stage and activity
        
        Args:
            pregnancy_week: Current week of pregnancy (1-40)
            is_exercising: Whether user is currently exercising
            time_of_day: 'morning', 'afternoon', 'evening' (optional)
        
        Returns:
            Dictionary with health vitals
        """
        trimester = cls.get_trimester(pregnancy_week)
        
        # Heart Rate (higher during pregnancy and exercise)
        if is_exercising:
            hr_min, hr_max = cls.HEART_RATE_RANGES['during_exercise']
        else:
            hr_min, hr_max = cls.HEART_RATE_RANGES[trimester]
        
        # Add time-of-day variation
        if time_of_day == 'morning':
            hr_min -= 5
            hr_max -= 5
        elif time_of_day == 'evening':
            hr_min += 5
            hr_max += 5
        
        heart_rate = random.randint(hr_min, hr_max)
        
        # SpO2 (typically normal in healthy pregnancy)
        spo2 = random.randint(*cls.SPO2_RANGE)
        
        # Stress Level (weighted random)
        stress_weights = [0.6, 0.3, 0.1]  # Low, Medium, High
        stress_level = random.choices(
            ['low', 'medium', 'high'],
            weights=stress_weights
        )[0]
        
        # Fatigue Level (varies by trimester)
        fatigue_min, fatigue_max = cls.FATIGUE_RANGES[trimester]
        
        # Higher fatigue in evening
        if time_of_day == 'evening':
            fatigue_min += 10
            fatigue_max += 10
        
        fatigue_level = random.randint(fatigue_min, min(fatigue_max, 100))
        
        # Daily Active Minutes (realistic range)
        if is_exercising:
            daily_active_minutes = random.randint(20, 60)
        else:
            daily_active_minutes = random.randint(10, 45)
        
        return {
            'heart_rate': heart_rate,
            'spo2': spo2,
            'stress_level': stress_level,
            'fatigue_level': fatigue_level,
            'daily_active_minutes': daily_active_minutes,
            'is_simulated': True,
            'pregnancy_week': pregnancy_week,
            'trimester': trimester.replace('_', ' ').title()
        }
    
    @classmethod
    def generate_exercise_vitals(cls, pregnancy_week: int, exercise_intensity: str = 'moderate') -> Dict:
        """
        Generate vitals during exercise with intensity adjustment
        
        Args:
            pregnancy_week: Current week of pregnancy
            exercise_intensity: 'low', 'moderate', 'high'
        
        Returns:
            Dictionary with exercise-adjusted vitals
        """
        vitals = cls.generate_vitals(pregnancy_week, is_exercising=True)
        
        # Adjust based on intensity
        if exercise_intensity == 'low':
            vitals['heart_rate'] = min(vitals['heart_rate'], 100)
        elif exercise_intensity == 'high':
            vitals['heart_rate'] = min(vitals['heart_rate'] + 10, 130)
        
        return vitals
    
    @classmethod
    def generate_historical_data(cls, pregnancy_week: int, days: int = 7) -> list:
        """
        Generate historical health data for charts
        
        Args:
            pregnancy_week: Current week of pregnancy
            days: Number of days of historical data
        
        Returns:
            List of vitals dictionaries with timestamps
        """
        historical_data = []
        now = datetime.now()
        
        for day in range(days):
            # Generate 3 data points per day (morning, afternoon, evening)
            for time_of_day in ['morning', 'afternoon', 'evening']:
                timestamp = now - timedelta(days=day, hours=random.randint(0, 23))
                vitals = cls.generate_vitals(pregnancy_week, time_of_day=time_of_day)
                vitals['timestamp'] = timestamp.isoformat()
                historical_data.append(vitals)
        
        return sorted(historical_data, key=lambda x: x['timestamp'])
    
    @staticmethod
    def get_current_time_of_day() -> str:
        """Get current time of day for context-aware generation"""
        hour = datetime.now().hour
        if 5 <= hour < 12:
            return 'morning'
        elif 12 <= hour < 18:
            return 'afternoon'
        else:
            return 'evening'
