# 📋 Commands Cheatsheet - AI Color Recommender

## 🚀 Setup Commands

### Install Python Dependencies

**Windows:**
```bash
setup-api.bat
```

**macOS/Linux:**
```bash
chmod +x setup-api.sh
./setup-api.sh
```

**Manual Setup:**
```bash
cd api
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install
pip install -r requirements.txt
```

---

## 🏃 Run Commands

### Start Flask API
```bash
cd api
python app.py
```

### Start React App
```bash
npm run dev
```

### Start Both (Two Terminals)
```bash
# Terminal 1
cd api && python app.py

# Terminal 2
npm run dev
```

---

## 🧪 Test Commands

### Quick API Test
```bash
curl http://localhost:5000/api/health
```

### Test Recommend Endpoint
```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "tech startup"}'
```

### Test Get All Palettes
```bash
curl http://localhost:5000/api/palettes
```

### Test Specific Palette
```bash
curl http://localhost:5000/api/palette/calm-ocean
```

### Test Custom Generation
```bash
curl -X POST http://localhost:5000/api/generate-custom \
  -H "Content-Type: application/json" \
  -d '{"baseColor": "#6A37D4", "name": "Purple Dream", "count": 5}'
```

### Run Automated Tests
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 💬 Chat Commands

Type these in the Studio chat:

### Basic Commands
```
"suggest color theme for luxury brand"
"generate palette for tech startup"
"color theme for healthcare app"
"recommend colors for food blog"
"palette for minimalist design"
```

### Industry-Specific
```
"colors for a restaurant website"
"palette for a law firm"
"theme for an e-commerce store"
"colors for a gaming app"
"palette for a spa"
```

### Mood-Based
```
"calm and professional colors"
"bold and energetic palette"
"elegant and sophisticated theme"
"playful and friendly colors"
```

### Style-Based
```
"minimalist color scheme"
"cyberpunk neon palette"
"natural and organic colors"
"corporate blue theme"
```

---

## 🔧 Troubleshooting Commands

### Check API Status
```bash
curl http://localhost:5000/api/health
```

### Check Python Version
```bash
python --version
```

### Check Installed Packages
```bash
pip list
```

### Reinstall Dependencies
```bash
cd api
pip install -r requirements.txt --force-reinstall
```

### Check Port Usage (Windows)
```bash
netstat -ano | findstr :5000
```

### Check Port Usage (macOS/Linux)
```bash
lsof -i :5000
```

### Kill Process on Port (Windows)
```bash
# Find PID first
netstat -ano | findstr :5000
# Then kill
taskkill /PID <PID> /F
```

### Kill Process on Port (macOS/Linux)
```bash
kill -9 $(lsof -t -i:5000)
```

---

## 📦 Package Management

### Update Python Packages
```bash
cd api
pip install --upgrade -r requirements.txt
```

### Update Node Packages
```bash
npm update
```

### Check for Outdated Packages
```bash
pip list --outdated
npm outdated
```

---

## 🐛 Debug Commands

### View Flask Logs
```bash
# Flask runs in terminal, logs appear there
cd api
python app.py
```

### View React Logs
```bash
# React runs in terminal, logs appear there
npm run dev
```

### Check Browser Console
```
Press F12 in browser
Go to Console tab
```

### Check Network Requests
```
Press F12 in browser
Go to Network tab
Filter by "recommend"
```

---

## 📊 Performance Testing

### Test API Response Time
```bash
time curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "tech startup"}'
```

### Load Test (100 requests)
```bash
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/recommend \
    -H "Content-Type: application/json" \
    -d '{"prompt": "test"}' &
done
wait
```

---

## 🔄 Git Commands

### Commit Changes
```bash
git add .
git commit -m "Add AI color recommender system"
git push
```

### Create Branch
```bash
git checkout -b feature/color-recommender
```

### View Changes
```bash
git status
git diff
```

---

## 🚀 Deployment Commands

### Build React App
```bash
npm run build
```

### Run Production Flask
```bash
cd api
export FLASK_ENV=production
python app.py
```

### Docker Build (if using Docker)
```bash
docker build -t color-api ./api
docker run -p 5000:5000 color-api
```

---

## 📝 File Operations

### View API Code
```bash
cat api/app.py
```

### Edit API Code
```bash
# Use your preferred editor
code api/app.py
nano api/app.py
vim api/app.py
```

### View Logs
```bash
# Flask logs are in terminal
# React logs are in terminal
```

---

## 🎨 Quick Actions

### Generate Palette (One Command)
```bash
curl -s -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "luxury brand"}' | python -m json.tool
```

### Get Random Palette
```bash
curl -s http://localhost:5000/api/palettes | python -m json.tool
```

### Test All Endpoints
```bash
echo "Testing health..."
curl http://localhost:5000/api/health

echo "\nTesting recommend..."
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'

echo "\nTesting palettes..."
curl http://localhost:5000/api/palettes

echo "\nDone!"
```

---

## 🔑 Environment Variables

### Set Flask Port
```bash
# Windows
set FLASK_PORT=5001

# macOS/Linux
export FLASK_PORT=5001
```

### Set Flask Debug Mode
```bash
# Windows
set FLASK_DEBUG=1

# macOS/Linux
export FLASK_DEBUG=1
```

---

## 📚 Documentation Commands

### View Documentation
```bash
cat QUICK_START_GUIDE.md
cat FLASK_API_INTEGRATION.md
cat TEST_COLOR_API.md
```

### Open in Browser
```bash
# macOS
open README_AI_COLOR_SYSTEM.md

# Linux
xdg-open README_AI_COLOR_SYSTEM.md

# Windows
start README_AI_COLOR_SYSTEM.md
```

---

## 🎯 Most Used Commands

### Daily Workflow
```bash
# 1. Start API
cd api && python app.py

# 2. Start React (new terminal)
npm run dev

# 3. Test API
curl http://localhost:5000/api/health

# 4. Open browser
# Go to http://localhost:3000
```

### Quick Test
```bash
# One-liner to test everything
curl http://localhost:5000/api/health && \
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}' && \
echo "\n✅ All tests passed!"
```

---

## 💡 Pro Tips

### Alias for Quick Start (Add to .bashrc or .zshrc)
```bash
alias start-api="cd api && python app.py"
alias start-react="npm run dev"
alias test-api="curl http://localhost:5000/api/health"
```

### Watch Mode for Development
```bash
# Flask auto-reload is enabled by default in debug mode
# React auto-reload is enabled by default with Vite
```

---

## 🆘 Emergency Commands

### Stop All Servers
```bash
# Press Ctrl+C in each terminal
```

### Reset Everything
```bash
# Stop servers
# Delete venv
rm -rf api/venv

# Reinstall
cd api
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
```

### Clear Cache
```bash
# Python cache
find . -type d -name __pycache__ -exec rm -rf {} +

# Node cache
rm -rf node_modules
npm install
```

---

**Save this file for quick reference!** 📌

All commands in one place for easy access.
