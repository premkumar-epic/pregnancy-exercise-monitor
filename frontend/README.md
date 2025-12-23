# 🤰 Pregnancy Exercise Monitor - Frontend

A modern React + TypeScript application for monitoring pregnancy exercises with AI-powered pose detection, activity tracking, and trimester-specific guidance.

## ✨ Features

- **AI Pose Detection**: Real-time exercise tracking using Google MediaPipe
- **Pregnancy Calculator**: Calculate current week, trimester, and due date from LMP
- **Activity Tracking**: Upload and visualize fitness tracker data (CSV)
- **Trimester-Safe Exercises**: Automatic filtering based on pregnancy stage
- **Health Alerts**: Automated warnings for low activity or high heart rate
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://127.0.0.1:8000` (or configure in `.env`)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ErrorBoundary.tsx
│   │   ├── ExerciseStats.tsx
│   │   └── Toast.tsx
│   ├── utils/              # Utility functions
│   │   ├── api.ts          # Centralized API client
│   │   └── constants.ts    # App configuration
│   ├── App.tsx             # Main app + auth
│   ├── PoseDemo.tsx        # AI pose tracking
│   ├── ActivityUpload.tsx  # CSV upload & charts
│   ├── PregnancyDashboard.tsx  # Calculator & guidance
│   ├── ExerciseCard.tsx    # Exercise selector
│   ├── types.ts            # TypeScript definitions
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── .env.example            # Example environment file
├── tailwind.config.js      # Tailwind CSS config
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# MediaPipe Configuration
VITE_MEDIAPIPE_WASM_URL=https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm
VITE_MEDIAPIPE_MODEL_URL=https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task
```

### Changing the Backend URL

If your backend is running on a different URL, update `VITE_API_BASE_URL` in `.env`:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🏃‍♀️ Supported Exercises

1. **🦵 Bodyweight Squat** (Safe: All trimesters)
   - Feet shoulder-width apart
   - Knees track over toes
   - Chest up

2. **✋ Arm Circles** (Safe: All trimesters)
   - Arms straight
   - Slow controlled circles
   - Shoulders relaxed

3. **🎯 Pelvic Tilt** (Safe: Trimester 1-2 only)
   - Lie on back
   - Tilt pelvis toward ceiling
   - Hold 5 seconds

## 📊 Activity Data Format

Upload CSV files with the following format:

```csv
date,steps,heart_rate,calories,sleep_minutes
2025-12-15,8500,72,450,420
2025-12-16,9200,68,480,390
```

**Required columns:**
- `date`: YYYY-MM-DD format
- `steps`: Number of steps
- `calories`: Calories burned

**Optional columns:**
- `heart_rate`: Average heart rate (bpm)
- `sleep_minutes`: Sleep duration in minutes

## 🔐 Authentication

The app uses JWT (JSON Web Token) authentication:

1. Login with username and password
2. Token is stored in localStorage
3. Token is automatically included in all API requests
4. Token expires after 60 minutes

**Default credentials** (if using Django backend):
- Username: `admin`
- Password: `admin123`

## 🎨 Styling

The app uses **Tailwind CSS** for styling with a custom pregnancy theme:

- Primary colors: Teal and Pink gradients
- Custom animations: fade-in, slide-up, pulse
- Responsive breakpoints: sm, md, lg, xl
- Dark mode: Not currently implemented

## 🧪 Browser Compatibility

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** MediaPipe requires WebAssembly support and camera access.

## 📱 Camera Permissions

The app requires camera access for pose detection:

1. Browser will prompt for camera permission
2. Allow camera access when prompted
3. If denied, you can re-enable in browser settings

**Troubleshooting:**
- Chrome: Settings → Privacy and security → Site Settings → Camera
- Firefox: Settings → Privacy & Security → Permissions → Camera

## 🐛 Common Issues

### "Cannot find module 'react-hot-toast'"

Run `npm install` to install all dependencies.

### "Unknown at rule @tailwind"

This is a CSS linter warning and can be ignored. Tailwind directives are processed correctly.

### Camera not working

1. Check browser permissions
2. Ensure HTTPS (required for camera access in production)
3. Try a different browser
4. Check if another app is using the camera

### API connection errors

1. Verify backend is running
2. Check `VITE_API_BASE_URL` in `.env`
3. Check browser console for CORS errors
4. Ensure backend CORS settings allow frontend origin

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables in Production

Make sure to set environment variables in your hosting platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & deploy → Environment

## 🔧 Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR. Changes to React components will update without full page reload.

### TypeScript Strict Mode

The project uses TypeScript strict mode. All type errors must be resolved before building.

### Code Splitting

The build automatically splits code into chunks:
- `mediapipe`: MediaPipe library (~2.5MB)
- `charts`: Chart.js and Recharts
- `vendor`: React, ReactDOM, Axios

### Performance Optimization

- MediaPipe model is loaded on-demand
- Video processing runs at 60 FPS
- Charts are only rendered when data is available
- Images are lazy-loaded

## 📚 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **AI/ML**: MediaPipe Pose Landmarker
- **Charts**: Chart.js, Recharts
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [MediaPipe](https://developers.google.com/mediapipe) for pose detection
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Chart.js](https://www.chartjs.org/) for data visualization
- [React](https://react.dev/) for the UI framework

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Built with ❤️ for expecting mothers**
