# Health Monitoring System Documentation

## Overview

The AI-Powered Pregnancy Care application includes a comprehensive health monitoring system that demonstrates the integration of simulated wearable device data with exercise tracking for enhanced pregnancy safety monitoring.

---

## 🎯 Purpose

This system showcases how **multimodal health monitoring** can enhance pregnancy fitness safety by combining:
- Exercise posture analysis (AI-powered)
- Simulated health vitals (wearable data)
- Intelligent safety alerts (fusion engine)
- Medical professional oversight (doctor dashboard)

---

## ⚠️ Important Disclaimer

### Academic & Research Purpose

This is a **research demonstration project** created for academic purposes. All health data is **simulated** and generated algorithmically to demonstrate the concept of integrated health monitoring.

**Key Points**:
- ✅ Demonstrates technical feasibility
- ✅ Shows system architecture
- ✅ Validates multimodal approach
- ❌ NOT for actual medical use
- ❌ NOT a replacement for real devices
- ❌ NOT providing medical advice

### For Actual Health Monitoring

Users should:
- Use certified medical wearable devices
- Consult healthcare professionals
- Follow medical advice
- Use FDA-approved equipment

---

## 🏗️ System Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                   User Interface                         │
├─────────────────────────────────────────────────────────┤
│  Health Monitoring Panel  │  Exercise Execution Page    │
│  - Real-time vitals       │  - Safety Alert Overlay     │
│  - 6 vital cards          │  - Auto-pause logic         │
│  - Info modal             │  - Recommendations          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend API                           │
├─────────────────────────────────────────────────────────┤
│  Health Simulator  │  Safety Fusion  │  Doctor Views    │
│  - Vital generation│  - 8 rules      │  - Patient list  │
│  - Pregnancy-safe  │  - Multi-level  │  - Monitoring    │
│  - Context-aware   │  - Auto-pause   │  - Read-only     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Database                             │
├─────────────────────────────────────────────────────────┤
│  HealthVitals Model  │  ExerciseSession  │  UserProfile │
│  - Heart rate        │  - Posture score  │  - Role      │
│  - SpO2              │  - Rep count      │  - Doctor    │
│  - Stress/Fatigue    │  - Warnings       │  - Patient   │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Health Vitals Monitored

### 1. Heart Rate (BPM)

**Normal Pregnancy Ranges**:
- First Trimester: 70-90 BPM
- Second Trimester: 75-95 BPM
- Third Trimester: 80-100 BPM
- During Exercise: 90-120 BPM

**Status Indicators**:
- 🟢 Good: < 70 BPM (resting)
- 🔵 Normal: 70-100 BPM
- 🟡 Caution: 100-110 BPM
- 🔴 Warning: > 110 BPM

### 2. Blood Oxygen (SpO₂)

**Normal Range**: 95-100%

**Status Indicators**:
- 🟢 Good: ≥ 98%
- 🔵 Normal: 95-97%
- 🔴 Warning: < 95%

### 3. Stress Level

**Categories**:
- 🟢 Low: Optimal for exercise
- 🟡 Medium: Monitor closely
- 🔴 High: Consider rest/relaxation

**Factors Considered**:
- Time of day
- Pregnancy week
- Recent activity

### 4. Fatigue Level (0-100)

**Ranges**:
- 0-30: Low fatigue (high energy)
- 30-50: Moderate fatigue
- 50-70: High fatigue
- 70-100: Very high fatigue

**Energy Level**: Calculated as `100 - fatigue_level`

### 5. Daily Active Minutes

**Recommendations**:
- Minimum: 15-20 minutes
- Optimal: 30-45 minutes
- Maximum: 60 minutes (pregnancy-safe)

---

## 🤖 Health Data Simulation

### Algorithm Design

The `HealthDataSimulator` class generates realistic, pregnancy-safe vitals based on:

#### Input Parameters
1. **Pregnancy Week** (1-40)
2. **Exercise State** (resting/exercising)
3. **Time of Day** (morning/afternoon/evening)
4. **Exercise Intensity** (low/moderate/high)

#### Generation Logic

```python
# Trimester-specific adjustments
if pregnancy_week <= 13:
    base_hr = 70-90 BPM
    fatigue = 40-70
elif pregnancy_week <= 27:
    base_hr = 75-95 BPM
    fatigue = 30-60
else:
    base_hr = 80-100 BPM
    fatigue = 50-80

# Exercise adjustments
if exercising:
    hr += 15-30 BPM
    
# Time-of-day adjustments
if evening:
    fatigue += 10-20
```

#### Randomization
- Weighted random for stress (60% low, 30% medium, 10% high)
- Normal distribution for heart rate
- Realistic variation within safe ranges

---

## 🛡️ Safety Fusion Engine

### Purpose

Combines **exercise posture analysis** with **health vitals** to provide intelligent safety alerts.

### 8 Safety Rules

#### Rule 1: Poor Posture + High Heart Rate
```
IF posture_score < 70 AND heart_rate > 100
THEN WARNING: "Poor posture with elevated heart rate"
ACTION: "Slow down and focus on form"
PAUSE: Yes
```

#### Rule 2: Very High Heart Rate
```
IF heart_rate > 120
THEN DANGER: "Heart rate is very high"
ACTION: "Stop exercise immediately and rest"
PAUSE: Yes
```

#### Rule 3: High Fatigue
```
IF fatigue_level > 70
THEN WARNING: "Very high fatigue detected"
ACTION: "Stop and rest. Do not push through fatigue"
PAUSE: Yes

IF fatigue_level > 85
THEN DANGER: "Extreme fatigue"
PAUSE: Yes
```

#### Rule 4: High Stress During Exercise
```
IF stress_level == 'high'
THEN INFO: "Elevated stress detected"
ACTION: "Try gentle exercises or breathing techniques"
PAUSE: No
```

#### Rule 5: Poor Posture Alone
```
IF posture_score < 70 AND heart_rate <= 100
THEN CAUTION: "Posture needs improvement"
ACTION: "Focus on form. Slow down if needed"
PAUSE: No
```

#### Rule 6: Low Blood Oxygen
```
IF spo2 < 95
THEN WARNING: "Blood oxygen level is low"
ACTION: "Stop exercise and take deep breaths"
PAUSE: Yes
```

#### Rule 7: Excellent Conditions (Positive Feedback)
```
IF posture_score > 85 AND heart_rate < 95 
   AND stress_level == 'low' AND fatigue_level < 50
THEN POSITIVE: "Excellent! All vitals are optimal"
ACTION: "You're doing great - continue at this pace"
PAUSE: No
```

#### Rule 8: Good Form with Moderate Intensity
```
IF posture_score > 85 AND 95 <= heart_rate <= 100
THEN INFO: "Good form with moderate intensity"
ACTION: "Maintain this pace for optimal benefits"
PAUSE: No
```

### Safety Levels

| Level | Color | Description | Action |
|-------|-------|-------------|--------|
| Safe | 🟢 Green | All vitals optimal | Continue |
| Caution | 🟡 Yellow | Minor concerns | Monitor |
| Warning | 🟠 Orange | Significant issues | Slow down |
| Danger | 🔴 Red | Critical condition | Stop immediately |

### Auto-Pause Logic

Exercise automatically pauses when:
- Any alert has `should_pause: true`
- Safety level is `danger` or `warning`
- Multiple caution-level alerts

---

## 👨‍⚕️ Doctor/Physiotherapist Dashboard

### Purpose

Provides medical professionals with read-only access to patient health and exercise data for monitoring and guidance.

### Features

#### 1. Patient List View
- All registered patients
- Summary statistics per patient
- Latest health vitals
- Pregnancy context (week, trimester)
- Last active date

#### 2. Patient Detail View
**Summary Statistics**:
- Total exercise sessions
- Total reps completed
- Average posture score
- Activity days tracked

**Posture Trend Chart**:
- 14-day historical data
- Daily average posture scores
- Visual trend analysis

**Recent Exercise Sessions** (10 latest):
- Exercise name
- Rep count
- Posture score
- Duration
- Date/time

**Health Vitals History** (20 latest):
- Heart rate
- SpO₂
- Stress level
- Energy level
- Timestamp

**Recent Activity Data** (7 days):
- Steps
- Average heart rate
- Calories
- Sleep minutes

### Access Control

**Permissions**:
- ✅ View patient data
- ✅ View exercise history
- ✅ View health vitals
- ✅ View trends
- ❌ Modify patient data
- ❌ Delete records
- ❌ Direct communication

**Role Verification**:
```python
# Every endpoint checks
if request.user.profile.role != 'doctor':
    return Response({'error': 'Doctor access required'}, status=403)
```

---

## 📱 User Interface

### Health Monitoring Panel

**Location**: Main Dashboard

**Components**:
1. **Heart Rate Card**
   - Current BPM
   - Color-coded status
   - Normal range indicator

2. **Blood Oxygen Card**
   - Current SpO₂ %
   - Status indicator
   - Normal threshold

3. **Stress Level Card**
   - Low/Medium/High
   - Dynamic color
   - Context-aware

4. **Energy Level Card**
   - Percentage (0-100%)
   - Calculated from fatigue
   - Visual indicator

5. **Active Minutes Card**
   - Today's activity
   - Daily goal tracking
   - Progress indicator

6. **Pregnancy Context Card**
   - Current week
   - Trimester
   - Contextual info

**Features**:
- Auto-refresh every 30 seconds
- Loading states
- Error handling
- Info modal with explanations
- "Simulated Data" badge

### Safety Alert Overlay

**Location**: Exercise Execution Page

**Trigger**: Every 10 seconds during exercise

**Display**:
- Alert level indicator
- Alert messages
- Recommended actions
- Continue/Pause buttons

**Behavior**:
- Non-intrusive (only when needed)
- Auto-pause for critical alerts
- User can override (with warning)
- Smooth animations

---

## 🔄 Data Flow

### Real-time Monitoring

```
1. User starts exercise
   ↓
2. Pose detection begins (AI)
   ↓
3. Posture score calculated
   ↓
4. Every 10 seconds:
   - Fetch current health vitals
   - Send to safety fusion engine
   - Receive safety analysis
   ↓
5. If alerts exist:
   - Show safety overlay
   - Auto-pause if critical
   - Display recommendations
   ↓
6. User continues or pauses
   ↓
7. Session saved with:
   - Posture scores
   - Rep count
   - Warnings
```

### Health Vitals Generation

```
1. API request: /api/current-health-vitals/
   ↓
2. Get user's pregnancy week
   ↓
3. Determine current context:
   - Time of day
   - Exercise state
   - Pregnancy trimester
   ↓
4. Generate vitals:
   - Heart rate (pregnancy-adjusted)
   - SpO₂ (normal range)
   - Stress (weighted random)
   - Fatigue (trimester-specific)
   - Active minutes
   ↓
5. Return JSON response
   ↓
6. Frontend displays in cards
   ↓
7. Auto-refresh in 30 seconds
```

---

## 🧪 Testing Scenarios

### Scenario 1: Normal Exercise Session
```
Vitals:
- Heart Rate: 85 BPM
- SpO₂: 98%
- Stress: Low
- Fatigue: 40%
- Posture: 90%

Expected:
✅ No alerts
✅ Positive feedback
✅ Continue exercising
```

### Scenario 2: High Heart Rate Alert
```
Vitals:
- Heart Rate: 125 BPM
- SpO₂: 97%
- Stress: Medium
- Fatigue: 60%
- Posture: 75%

Expected:
⚠️ DANGER alert
⚠️ "Heart rate very high"
⚠️ Auto-pause exercise
⚠️ Recommend rest
```

### Scenario 3: Poor Posture + Elevated HR
```
Vitals:
- Heart Rate: 105 BPM
- SpO₂: 96%
- Stress: Low
- Fatigue: 50%
- Posture: 65%

Expected:
⚠️ WARNING alert
⚠️ "Poor posture with elevated HR"
⚠️ Recommend slow down
⚠️ Focus on form
```

### Scenario 4: High Fatigue
```
Vitals:
- Heart Rate: 90 BPM
- SpO₂: 98%
- Stress: Low
- Fatigue: 85%
- Posture: 80%

Expected:
⚠️ WARNING alert
⚠️ "Very high fatigue"
⚠️ Recommend stop and rest
⚠️ Do not push through
```

---

## 📚 API Reference

### Health Monitoring Endpoints

#### GET `/api/current-health-vitals/`
**Purpose**: Get current simulated health vitals

**Query Parameters**:
- `exercising` (optional): `true`/`false`
- `save` (optional): `true`/`false` - Save to database

**Response**:
```json
{
  "heart_rate": 85,
  "spo2": 98,
  "stress_level": "low",
  "fatigue_level": 45,
  "daily_active_minutes": 30,
  "is_simulated": true,
  "pregnancy_week": 24,
  "trimester": "Second Trimester"
}
```

#### GET `/api/health-vitals-history/`
**Purpose**: Get last 24 hours of health vitals

**Response**:
```json
{
  "count": 12,
  "vitals": [
    {
      "id": 1,
      "timestamp": "2025-12-22T10:30:00Z",
      "heart_rate": 82,
      "spo2": 98,
      "stress_level": "low",
      "fatigue_level": 40,
      "daily_active_minutes": 25,
      "is_simulated": true,
      "is_heart_rate_normal": true,
      "is_spo2_normal": true,
      "energy_level": 60
    }
  ]
}
```

#### POST `/api/check-exercise-safety/`
**Purpose**: Check safety based on posture and vitals

**Request**:
```json
{
  "posture_score": 75,
  "current_reps": 10
}
```

**Response**:
```json
{
  "safe_to_continue": true,
  "should_pause": false,
  "safety_level": "caution",
  "alerts": [],
  "recommendations": [
    {
      "level": "caution",
      "message": "Posture needs improvement",
      "action": "Focus on form. Slow down if needed"
    }
  ],
  "current_vitals": {...},
  "metrics": {...}
}
```

#### GET `/api/health-dashboard-summary/`
**Purpose**: Get comprehensive health summary

**Response**:
```json
{
  "current_vitals": {...},
  "trends": {
    "avg_heart_rate_7d": 83.5,
    "avg_spo2_7d": 97.8,
    "avg_energy_7d": 62.3
  },
  "pregnancy_context": {
    "week": 24,
    "trimester": 2
  },
  "recommendations": [...]
}
```

### Doctor Endpoints

#### GET `/api/doctor/patients/`
**Purpose**: List all patients (doctor only)

**Response**: See Doctor Dashboard section

#### GET `/api/doctor/patient/<id>/`
**Purpose**: Get patient details (doctor only)

**Response**: See Doctor Dashboard section

---

## 🔐 Security & Privacy

### Data Protection
- All health data is simulated
- No real medical information stored
- JWT authentication required
- Role-based access control

### Access Levels
| Role | Health Vitals | Safety Alerts | Doctor Dashboard |
|------|---------------|---------------|------------------|
| Patient | Own data | Yes | No |
| Doctor | All patients | No | Yes |
| Admin | All users | No | Yes |

---

## 📖 User Guide

### For Patients

**Viewing Health Vitals**:
1. Login to dashboard
2. View Health Monitoring Panel
3. Check current vitals
4. Click info icon for explanations

**During Exercise**:
1. Start exercise session
2. System monitors automatically
3. Safety checks every 10 seconds
4. Follow alert recommendations

### For Doctors

**Monitoring Patients**:
1. Login with doctor credentials
2. View patient list
3. Click patient for details
4. Review trends and history

---

## 🎓 Academic Value

This system demonstrates:
- **Multimodal Integration**: Combining AI pose detection with health monitoring
- **Safety-First Design**: Intelligent alert system
- **Role-Based Architecture**: Different user types
- **Real-World Applicability**: Pregnancy-specific considerations
- **Scalable Design**: Can integrate real devices

---

## 🚀 Future Enhancements

### Real Device Integration
- Bluetooth connectivity
- Fitbit/Apple Watch integration
- Real-time data streaming
- Device synchronization

### Advanced Analytics
- Machine learning predictions
- Personalized recommendations
- Anomaly detection
- Long-term trend analysis

### Medical Features
- Doctor-patient messaging
- Appointment scheduling
- Report generation
- Emergency alerts

---

## 📞 Support & Questions

For questions about the health monitoring system:
- Review this documentation
- Check the main README.md
- Examine code comments
- Contact project maintainer

---

## ✅ Conclusion

The health monitoring system successfully demonstrates how multimodal data integration can enhance pregnancy fitness safety. While using simulated data for academic purposes, the architecture and design principles are production-ready and can be adapted for real-world deployment with certified medical devices.

**Key Takeaway**: This system proves the feasibility and value of combining AI exercise tracking with health monitoring for comprehensive pregnancy care.
