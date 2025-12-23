# 🤰 AI-Powered Pregnancy Care

> Your comprehensive AI fitness companion for a safe and healthy pregnancy journey

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Django](https://img.shields.io/badge/Django-4.x-092E20?logo=django)](https://www.djangoproject.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Pose-00D9FF)](https://google.github.io/mediapipe/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Overview

**AI-Powered Pregnancy Care** is a comprehensive web application designed to help pregnant women maintain a safe and healthy lifestyle throughout their pregnancy journey. The application combines cutting-edge AI technology with medical expertise to provide real-time exercise tracking, nutrition guidance, health monitoring, and personalized recommendations.

### Key Highlights

- 🤖 **AI-Powered Pose Detection** using Google MediaPipe
- 🏃‍♀️ **10 Pregnancy-Safe Exercises** with real-time form tracking
- 🥗 **Nutrition Guide** with 80+ foods and unique food icons
- 📊 **Weekly Health Reports** with PDF export and detailed analysis
- 📚 **Pregnancy Guidance** with 5 comprehensive articles and 8 FAQs
- 👨‍⚕️ **Doctor Selection System** with 5 seeded healthcare providers
- 👤 **User Profile Management** with profile picture upload
- 👥 **Role-Based Access Control** (Admin, Patient & Doctor portals)
- 📈 **Real-Time Rep Counting** and posture scoring
- 🎨 **Modern, Responsive UI** with smooth animations
- ❤️ **Health Monitoring** with simulated wearable data
- 🔔 **Smart Notifications** with email integration
- 📅 **Custom Reminders** for exercise and health tracking

---

## ✨ Features

### 1. 🏋️ AI Exercise Tracking

- **Real-time pose detection** using MediaPipe
- **Automatic rep counting** with configurable thresholds
- **Posture score calculation** (0-100%)
- **Visual feedback** with skeleton overlay
- **Safety warnings** for incorrect form
- **10 pregnancy-safe exercises** across all trimesters

**Exercise Library:**
- Shoulder Rolls (Low) - All trimesters
- Standing Calf Raises (Low) - All trimesters
- Cat-Cow Stretch (Low) - All trimesters
- Seated Marches (Low) - All trimesters
- Bodyweight Squats (High) - Trimesters 2-3
- Standing Leg Lifts (High) - Trimesters 2-3
- Wall Push-Ups (Medium) - All trimesters
- Side Leg Raises (Medium) - All trimesters
- Arm Circles (Medium) - All trimesters
- Pelvic Tilts (Medium) - All trimesters

### 2. 🥗 Nutrition Guide

- **6 Food Categories**: Fruits, Vegetables, Proteins, Dairy, Grains, Nuts & Seeds
- **80+ Foods** with unique emoji icons for each food
- **Complete nutritional information** for each food
- **Trimester-specific recommendations**
- **Foods to avoid** warnings
- **Daily nutrition tips**
- **Search and filter** functionality
- **Detailed food information**: calories, protein, fiber, iron, calcium
- **Benefits for pregnancy** highlighted for each food
- **Smart icon fallback system** for unmapped foods

### 3. 📚 Pregnancy Guidance

- **5 Comprehensive Articles**:
  - First Trimester Guide
  - Second Trimester Guide
  - Third Trimester Guide
  - Safe Exercise Guide
  - Nutrition Guide
- **8 FAQs** across categories (health, nutrition, symptoms, general)
- **Trimester-personalized content**
- **Weekly content** specific to pregnancy week
- **Expandable FAQ interface**
- **Beautiful, engaging UI**

### 4. 📄 PDF Health Reports

- **One-click PDF export** of weekly health reports
- **Executive Summary** with overall health status
- **Activity Analysis** with status indicators (✅ Excellent, ✓ Good, ⚠ Fair)
- **Exercise Performance** tracking with achievement metrics
- **Daily Activity Trends** in table format
- **Detailed Health Analysis** for each metric
- **Personalized Recommendations**
- **Professional multi-page layout** with headers and footers
- **Auto-generated filename** with date range

### 5. 👨‍⚕️ Doctor Selection System

- **5 Pre-seeded Doctors** with specializations
- **Doctor Information**: Name, specialization, hospital, contact
- **API Integration** for doctor list retrieval
- **Profile Integration** ready for doctor selection
- **Extensible System** for adding more doctors

### 6. 👤 User Profile Management

**Comprehensive Profile Sections:**
- **Personal Info**: Name, date of birth, phone, profile picture
- **Pregnancy Data**: LMP date, doctor, hospital
- **Health Metrics**: Height, weight, BMI, blood type
- **Medical History**: Conditions, allergies, medications, previous pregnancies
- **Emergency Contact**: Name, relationship, phone

**Auto-Calculated Fields:**
- Age (from date of birth)
- BMI (from height/weight)
- Due date (LMP + 280 days)
- Current pregnancy week
- Trimester
- Days until due date

### 4. 📊 Health Monitoring

- **Activity Data Upload** (CSV format)
- **Weekly Health Reports** with interactive charts
- **Pregnancy Progress Widget** showing week, trimester, and due date
- **Personalized Recommendations** based on activity levels
- **Simulated Wearable Integration** (heart rate, SpO₂, stress, fatigue)
- **Real-time Health Vitals** displayed on dashboard
- **Safety Fusion Alerts** during exercise

**Health Vitals Tracked:**
- ❤️ Heart Rate (BPM) - Pregnancy-adjusted ranges
- 🫁 Blood Oxygen (SpO₂%) - Normal: 95-100%
- 🧠 Stress Level (Low/Medium/High)
- 🔋 Energy Level (0-100%)
- ⏱️ Active Minutes - Daily activity tracking
- 🤰 Pregnancy Context - Week & trimester awareness

### 5. 🔔 Notifications & Reminders

**Notification System:**
- Welcome notifications for new users
- Exercise completion notifications
- Health alerts and warnings
- Weekly summary notifications
- Real-time notification bell with unread count
- Mark as read/unread functionality
- Delete notifications

**Custom Reminders:**
- Create custom exercise reminders
- Set time and frequency
- Toggle reminders on/off
- Manage all reminders in one place
- Notification preferences

**Email Integration:**
- Welcome emails for new users
- Exercise completion emails
- Health alert emails
- Weekly summary emails

### 6. 👨‍⚕️ Doctor Portal

**Read-only patient monitoring** for medical professionals:

**Features:**
- 📋 Patient list with summary statistics
- 📊 Detailed patient view with:
  - Exercise history (10 recent sessions)
  - Health vitals history (20 recent)
  - Posture trend chart (14 days)
  - Activity data (7 days)
  - Pregnancy context
- 📈 Analytics:
  - Total sessions & reps
  - Average posture score
  - Activity days tracked
- 🔒 Read-only access (no data modification)
- 🎨 Professional UI with charts

### 7. 👑 Admin Portal

- **System-wide Analytics** (users, sessions, posture scores)
- **User Management** with search and filters
- **Interactive Charts** (user growth, activity trends)
- **CSV Export** functionality
- **Role-based Access Control**
- **Patient count tracking** (excludes admin/doctor users)

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI Framework |
| **TypeScript** | 5.x | Type Safety |
| **Vite** | 5.x | Build Tool |
| **TailwindCSS** | 3.x | Styling |
| **Framer Motion** | 11.x | Animations |
| **Recharts** | 2.x | Data Visualization |
| **Lucide React** | Latest | Icons |
| **React Router** | 6.x | Routing |
| **Axios** | 1.x | HTTP Client |
| **MediaPipe** | Latest | Pose Detection |
| **jsPDF** | 2.x | PDF Generation |
| **jsPDF-AutoTable** | 3.x | PDF Tables |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Django** | 4.x | Web Framework |
| **Django REST Framework** | 3.x | API Development |
| **Simple JWT** | 5.x | Authentication |
| **SQLite** | 3.x | Database |
| **Python** | 3.10+ | Programming Language |

### AI/ML

| Technology | Purpose |
|------------|---------|
| **MediaPipe Pose** | Real-time pose estimation |
| **TensorFlow.js** | ML model execution |
| **Custom Algorithms** | Rep counting, posture analysis |

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

### Backend Setup

```bash
# Clone repository
git clone https://github.com/premkumar-epic/pregnancy-exercise-monitor.git
cd pregnancy-exercise-monitor

# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed nutrition data
python manage.py seed_nutrition

# Seed engagement notifications
python manage.py seed_engagement_notifications

# Seed doctors, guidance articles, and FAQs
Get-Content seed_complete_data.py | python manage.py shell

# Create admin user
python manage.py shell
>>> from django.contrib.auth.models import User
>>> from exercise.models import UserProfile
>>> admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin')
>>> UserProfile.objects.create(user=admin, role='admin')
>>> exit()

# Create doctor user
python manage.py shell
>>> from django.contrib.auth.models import User
>>> from exercise.models import UserProfile
>>> doctor = User.objects.create_user('doctor', 'doctor@example.com', 'doctor123')
>>> UserProfile.objects.create(user=doctor, role='doctor')
>>> exit()

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

**Default Credentials:**
- **Admin**: username: `admin`, password: `admin`
- **Doctor**: username: `doctor`, password: `doctor123`
- **Patient**: Register a new account

---

## 💻 Usage

### For Patients

1. **Register/Login**: Create account or sign in
2. **Complete Profile**:
   - Fill in personal information
   - Enter LMP date for pregnancy tracking
   - Add health metrics
   - Upload profile picture
3. **Browse Exercises**: View 10 pregnancy-safe exercises
4. **Start Exercise**:
   - Click on exercise
   - Allow camera access
   - Follow on-screen instructions
   - AI tracks your form and counts reps
5. **Explore Nutrition Guide**:
   - Browse food categories
   - View recommended foods for your trimester
   - Check foods to avoid
   - Read daily nutrition tips
6. **Upload Activity Data**:
   - Download CSV template
   - Fill with daily activity data
   - Upload to track progress
7. **View Reports**:
   - Check weekly health reports
   - View charts and analytics
   - Get personalized recommendations
8. **Manage Reminders**:
   - Create custom exercise reminders
   - Set notification preferences
   - View notifications

### For Doctors

1. **Login**: Use doctor credentials
2. **View Patient List**: See all patients with summary stats
3. **Monitor Patient**:
   - Click on patient to view details
   - Review exercise history
   - Check health vitals
   - View posture trends
   - Analyze activity data

### For Admins

1. **Login**: Use admin credentials
2. **View Dashboard**:
   - System-wide statistics
   - User growth charts
   - Activity trends
3. **Manage Users**:
   - Search and filter users
   - View user activity
   - Export data to CSV
4. **Monitor System**:
   - Track popular exercises
   - View engagement metrics
   - Analyze trends

---

## 📁 Project Structure

```
pregnancy-exercise-monitor/
├── frontend/
│   ├── public/
│   │   ├── exercises/          # Custom AI-generated images
│   │   └── why-choose-us.png
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ExerciseLibrary.tsx
│   │   │   ├── ExerciseDetail.tsx
│   │   │   ├── ExerciseExecution.tsx
│   │   │   ├── WeeklyReport.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── DoctorPortal.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── NutritionDashboard.tsx
│   │   │   ├── CategoryDetailView.tsx
│   │   │   ├── FoodDetailView.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── ReminderManager.tsx
│   │   ├── components/
│   │   │   ├── Toast.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   └── PregnancyProgressWidget.tsx
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   ├── constants.ts
│   │   │   └── poseDetection.ts
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── exercise/
│   │   ├── models.py              # Database models
│   │   ├── views.py               # API views
│   │   ├── serializers.py         # DRF serializers
│   │   ├── urls.py                # URL routing
│   │   ├── admin_views.py         # Admin endpoints
│   │   ├── auth_serializers.py    # Custom JWT
│   │   ├── weekly_report_view.py  # Report generation
│   │   ├── doctor_views.py        # Doctor portal endpoints
│   │   ├── notification_views.py  # Notification endpoints
│   │   ├── notification_utils.py  # Notification utilities
│   │   ├── email_utils.py         # Email utilities
│   │   ├── profile_views.py       # Profile endpoints
│   │   ├── nutrition_views.py     # Nutrition endpoints
│   │   ├── reminder_views.py      # Reminder endpoints
│   │   ├── extended_views.py      # Extended features (Doctor, Guidance, FAQ)
│   │   ├── nutrition_models.py    # Nutrition models
│   │   ├── reminder_models.py     # Reminder models
│   │   ├── extended_models.py     # Extended models (Doctor, Guidance, FAQ)
│   │   └── management/
│   │       └── commands/
│   │           ├── seed_nutrition.py
│   │           └── seed_engagement_notifications.py
│   ├── pregnancy/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── db.sqlite3
│   ├── manage.py
│   ├── seed_complete_data.py      # Seed doctors, guidance, FAQs
│   └── requirements.txt
│
└── README.md
```

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register/`
**Description**: User registration

**Request**:
```json
{
  "username": "user123",
  "password": "password123",
  "email": "user@example.com"
}
```

#### POST `/api/auth/token/`
**Description**: User login with JWT token generation

**Request**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

### Exercise Endpoints

#### GET `/api/exercises/`
**Description**: List all available exercises

#### GET `/api/exercises/{id}/`
**Description**: Get exercise details

#### POST `/api/sessions/`
**Description**: Create new exercise session

**Request**:
```json
{
  "exercise": 1,
  "rep_count": 15,
  "avg_posture_score": 85.5,
  "posture_warnings": "Keep back straight"
}
```

### Profile Endpoints

#### GET `/api/profile/`
**Description**: Get user profile

#### PUT `/api/profile/`
**Description**: Update user profile

**Request**:
```json
{
  "full_name": "Jane Doe",
  "date_of_birth": "1990-01-01",
  "phone_number": "+1234567890",
  "lmp_date": "2024-10-01",
  "height": 165,
  "weight": 65
}
```

#### POST `/api/profile/picture/`
**Description**: Upload profile picture

#### DELETE `/api/profile/picture/delete/`
**Description**: Delete profile picture

### Nutrition Endpoints

#### GET `/api/nutrition/categories/`
**Description**: List all food categories

#### GET `/api/nutrition/foods/`
**Description**: List foods with filtering

**Query Parameters**:
- `category`: Filter by category ID
- `trimester`: Filter by trimester (1, 2, or 3)
- `search`: Search by food name

#### GET `/api/nutrition/foods/{id}/`
**Description**: Get food details

#### GET `/api/nutrition/tips/`
**Description**: Get daily nutrition tips

#### GET `/api/nutrition/recommended/`
**Description**: Get recommended foods for user's trimester

#### GET `/api/nutrition/avoid/`
**Description**: Get foods to avoid

### Notification Endpoints

#### GET `/api/notifications/`
**Description**: List user notifications

#### POST `/api/notifications/{id}/mark-read/`
**Description**: Mark notification as read

#### POST `/api/notifications/mark-all-read/`
**Description**: Mark all notifications as read

#### DELETE `/api/notifications/{id}/`
**Description**: Delete notification

#### DELETE `/api/notifications/clear-all/`
**Description**: Clear all notifications

### Reminder Endpoints

#### GET `/api/reminders/`
**Description**: List custom reminders

#### POST `/api/reminders/`
**Description**: Create custom reminder

**Request**:
```json
{
  "title": "Morning Exercise",
  "message": "Time for your morning workout!",
  "reminder_time": "08:00:00",
  "frequency": "daily"
}
```

#### PATCH `/api/reminders/{id}/toggle/`
**Description**: Toggle reminder on/off

#### DELETE `/api/reminders/{id}/`
**Description**: Delete reminder

### Activity Endpoints

#### POST `/api/activity-data/`
**Description**: Upload activity data (CSV)

**CSV Format**:
```csv
date,steps,calories,heart_rate,sleep_hours,distance,active_minutes
2025-01-01,8000,350,75,7.5,5.2,45
```

#### GET `/api/weekly-report/`
**Description**: Get weekly health report

**Query Parameters**:
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD

### Doctor Endpoints

#### GET `/api/doctor/patients/`
**Description**: List all patients (Doctor only)

#### GET `/api/doctor/patients/{id}/`
**Description**: Get detailed patient information (Doctor only)

### Admin Endpoints

#### GET `/api/admin-analytics/`
**Description**: System-wide analytics (Admin only)

---

## 🎯 Key Achievements

### Sprint 1-4: Core Features ✅
- AI pose detection with MediaPipe
- Real-time rep counting and posture scoring
- 10 pregnancy-safe exercises
- Exercise library and execution
- User authentication and authorization

### Sprint 5: Notifications & Email ✅
- Notification system with bell icon
- Email integration (Gmail SMTP)
- Welcome notifications
- Exercise completion notifications
- Custom reminders
- Notification preferences

### Sprint 6: Nutrition Guide ✅
- 6 food categories with 25+ foods
- Trimester-specific recommendations
- Category detail view with search/filter
- Food detail view with complete nutrition info
- Daily nutrition tips
- Foods to avoid warnings

### Sprint 7: User Profile & UX ✅
- Extended user profile with 18 new fields
- Auto-calculated pregnancy metrics
- Profile picture upload
- Pregnancy progress widget
- Dashboard consolidation
- 5-tab profile interface

### Sprint 4: Complete Feature Set ✅
- **PDF Report Export**: Comprehensive health reports with detailed analysis
- **Food Icons**: 80+ unique emoji icons for nutrition guide
- **Doctor System**: Doctor model with 5 seeded healthcare providers
- **Pregnancy Guidance**: 5 articles and 8 FAQs with trimester personalization
- **Enhanced UI**: Improved dashboard, card reordering, welcome card
- **Media Handling**: Profile picture upload/delete with validation

### Additional Features ✅
- Weekly health reports
- Activity data upload
- Admin dashboard
- Doctor portal
- Role-based access control
- Health monitoring with simulated wearables
- Safety fusion system

---

## 🔮 Future Enhancements

### Planned Features

1. **Mobile Application**
   - React Native version
   - Offline exercise tracking
   - Push notifications

2. **Advanced Analytics**
   - Predictive health insights
   - ML-based recommendations
   - Trend analysis and forecasting

3. **Social Features**
   - Community forum
   - Exercise challenges
   - Progress sharing

4. **Integration**
   - Real wearable device sync (Fitbit, Apple Watch)
   - Calendar integration
   - Telemedicine integration

5. **Content Expansion**
   - More exercises (yoga, pilates)
   - Video tutorials
   - Meal planning
   - Pregnancy education content

---

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google MediaPipe** for pose detection technology
- **React** and **Django** communities for excellent documentation
- **Lucide React** for beautiful icons
- **Recharts** for data visualization
- All contributors and testers

---

## 📞 Contact

**Premkumar** - [@premkumar-epic](https://github.com/premkumar-epic)

**Project Link**: [https://github.com/premkumar-epic/pregnancy-exercise-monitor](https://github.com/premkumar-epic/pregnancy-exercise-monitor)

---

**Made with ❤️ for expecting mothers everywhere**
