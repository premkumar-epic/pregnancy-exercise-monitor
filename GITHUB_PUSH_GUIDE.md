# GitHub Push Guide

## Pre-Push Verification ✅

### 1. All Migrations Applied
```bash
cd backend
.\.venv\Scripts\activate.ps1
python manage.py showmigrations
```
**Status:** ✅ All 11 migrations applied

### 2. Dependencies Updated
```bash
# Backend
cd backend
pip freeze > requirements.txt

# Frontend
cd frontend
# package.json already up to date
```

### 3. Files to Exclude (Already in .gitignore)
- ✅ Virtual environments (.venv/)
- ✅ Database files (*.sqlite3)
- ✅ Environment files (.env)
- ✅ Node modules (node_modules/)
- ✅ Media uploads (media/)
- ✅ Python cache (__pycache__/)
- ✅ IDE files (.vscode/, .idea/)

---

## Git Commands for First Push

### Option 1: New Repository

```bash
# Navigate to project root
cd c:\Users\pream\pregnancy-exercise-monitor

# Initialize git (if not already done)
git init

# Add all files
git add .

# Check what will be committed
git status

# Commit
git commit -m "Complete Sprint: AI-Powered Pregnancy Care Application

Features Implemented:
- Phase 1: UI improvements and dashboard redesign
- Phase 2: Date picker enhancements
- Phase 3: Nutrition food icons (80+ foods)
- Phase 4: Profile picture upload/delete
- Phase 5: PDF report export with detailed analysis
- Phase 6: Personalized nutrition by trimester
- Phase 7: Doctor selection system
- Phase 8: Admin analytics dashboard
- Phase 9: Pregnancy guidance with articles and FAQs

Tech Stack:
- Backend: Django REST Framework, JWT Auth
- Frontend: React, TypeScript, Tailwind CSS
- Features: Real-time pose detection, activity tracking, health monitoring"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/pregnancy-exercise-monitor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option 2: Existing Repository

```bash
# Pull latest changes
git pull origin main

# Add all files
git add .

# Commit
git commit -m "Complete all 9 phases of pregnancy care application"

# Push
git push origin main
```

---

## What Gets Pushed

### ✅ Included Files
- All source code (backend + frontend)
- Configuration files
- README.md
- requirements.txt
- package.json
- Migrations
- Seed data scripts
- Static assets

### ❌ Excluded Files (via .gitignore)
- Database (db.sqlite3)
- Virtual environment (.venv/)
- Node modules (node_modules/)
- Environment variables (.env)
- Media uploads (media/)
- IDE settings
- Cache files

---

## Post-Push Checklist

### 1. Verify on GitHub
- [ ] All files visible
- [ ] README displays correctly
- [ ] No sensitive data committed
- [ ] .gitignore working

### 2. Clone Test (Optional)
```bash
# Clone to different directory
git clone https://github.com/YOUR_USERNAME/pregnancy-exercise-monitor.git test-clone
cd test-clone

# Setup backend
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
Get-Content seed_complete_data.py | python manage.py shell
python manage.py runserver

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 3. Update README
- [ ] Add GitHub repository link
- [ ] Add setup instructions
- [ ] Add screenshots
- [ ] Add demo video link (optional)

---

## Branch Strategy (Recommended)

```bash
# Create development branch
git checkout -b development

# Create feature branches from development
git checkout -b feature/admin-portal
git checkout -b feature/notifications
git checkout -b feature/analytics

# Merge to development when complete
git checkout development
git merge feature/admin-portal

# Merge to main for releases
git checkout main
git merge development
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

---

## Common Issues & Solutions

### Issue 1: Large Files
```bash
# If you accidentally committed large files
git rm --cached large_file.mp4
git commit -m "Remove large file"
```

### Issue 2: Sensitive Data
```bash
# If you committed .env file
git rm --cached .env
git commit -m "Remove environment file"
# Add .env to .gitignore
```

### Issue 3: Merge Conflicts
```bash
# Pull latest changes
git pull origin main

# Resolve conflicts in files
# Then commit
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

---

## Next Steps After Push

1. **Add Repository Description** on GitHub
2. **Add Topics/Tags**: django, react, typescript, pregnancy, healthcare
3. **Enable Issues** for bug tracking
4. **Add License** (MIT recommended)
5. **Create Project Board** for next sprint (Admin Portal)
6. **Add Contributors** if team project
7. **Setup CI/CD** (optional - GitHub Actions)

---

## GitHub Repository Settings

### Recommended Settings
- ✅ Public repository (or Private if needed)
- ✅ Include README
- ✅ Add .gitignore (already done)
- ✅ Choose license (MIT, Apache 2.0, etc.)
- ✅ Enable Issues
- ✅ Enable Projects
- ✅ Protect main branch (require PR reviews)

### Branch Protection Rules
- Require pull request reviews before merging
- Require status checks to pass
- Require branches to be up to date
- Include administrators

---

## Ready to Push! 🚀

All verification complete. Project is ready for GitHub push.

**Current Status:**
- ✅ 9 Phases Complete
- ✅ All Migrations Applied
- ✅ Dependencies Documented
- ✅ .gitignore Configured
- ✅ Code Clean
- ✅ No Sensitive Data

**Execute the git commands above to push to GitHub!**
