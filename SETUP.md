# 🚀 Quick Setup Guide

## One-Click Setup (Windows)

### Method 1: Automated Setup (Recommended)

1. **Download** `setup.bat` from the repository
2. **Double-click** `setup.bat`
3. **Wait** for automatic setup to complete
4. **Done!** Application opens in browser

### What the Script Does

✅ Checks prerequisites (Git, Python, Node.js)  
✅ Clones repository from GitHub  
✅ Creates Python virtual environment  
✅ Installs all backend dependencies  
✅ Runs database migrations  
✅ Creates admin user (admin/admin123)  
✅ Installs all frontend dependencies  
✅ Launches backend server (port 8000)  
✅ Launches frontend server (port 5173)  
✅ Opens application in browser  

### Prerequisites

Before running `setup.bat`, ensure you have:

- **Git**: https://git-scm.com/download/win
- **Python 3.10+**: https://www.python.org/downloads/
- **Node.js 18+**: https://nodejs.org/

---

## Method 2: Manual Setup

### Backend Setup

```bash
# Clone repository
git clone https://github.com/premkumar-epic/pregnancy-exercise-monitor.git
cd pregnancy-exercise-monitor/backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

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

---

## Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change password in production!**

---

## Troubleshooting

### Port Already in Use

**Backend (8000)**:
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Frontend (5173)**:
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Dependencies Failed

**Backend**:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Frontend**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. ✅ Login with admin credentials
2. ✅ Explore admin dashboard
3. ✅ Create patient account
4. ✅ Try AI exercise tracking
5. ✅ Upload activity data
6. ✅ View weekly reports

---

## Support

📧 Issues: https://github.com/premkumar-epic/pregnancy-exercise-monitor/issues

🎉 **Happy exercising!** 🤰💪
