# ⚡ Quick Start - AI Features

## 🚀 5-Minute Setup

### 1. Install Prerequisites (5 min)

```bash
# Check if you have everything
node --version    # Need v18+
python --version  # Need v3.9+
mongod --version  # Need MongoDB
```

**Don't have them?**
- Node.js: https://nodejs.org/
- Python: https://www.python.org/
- MongoDB: https://www.mongodb.com/try/download/community

### 2. Get Gemini API Key (2 min)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### 3. Setup (3 min)

```bash
# Windows
setup-backend.bat

# Mac/Linux
chmod +x setup-backend.sh
./setup-backend.sh
```

### 4. Add API Key (1 min)

Edit `ai-service/.env`:
```
GEMINI_API_KEY=paste_your_key_here
```

### 5. Start Everything (1 min)

```bash
# Windows
START_SERVERS.bat

# Mac/Linux - Open 4 terminals:
# Terminal 1
mongod

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd ai-service && uvicorn main:app --reload --port 8000

# Terminal 4
npm run dev
```

### 6. Test It! (1 min)

Open http://localhost:3000

Go to **Studio** → Open **Chat** panel → Type:

```
"create a design for modern tech startup"
```

🎉 **Done!** Your AI-powered design tool is ready!

---

## 🎯 Common Commands

### In Studio Chat

```bash
# Generate full design
"create a design for [your idea]"
"generate a [style] design for [purpose]"

# Add elements
"add a blue circle"
"add a red square at 100, 100"
"add text saying 'Hello World'"

# Modify
"change color to #ff6b9d"
"resize to 200x200"
"move to 150, 150"

# Colors
"generate colors for luxury brand"
"suggest colors for tech startup"

# Actions
"delete selected"
"duplicate"
"undo"
"save"
"zoom in"
```

### API Testing

```bash
# Test health
curl http://localhost:4000/api/health
curl http://localhost:8000/api/health

# Generate design
curl -X POST http://localhost:4000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "modern portfolio", "saveDesign": true}'

# Get all designs
curl http://localhost:4000/api/designs

# Get colors
curl -X POST http://localhost:4000/api/ai/colors \
  -H "Content-Type: application/json" \
  -d '{"prompt": "ocean sunset", "count": 5}'
```

---

## 🔧 Troubleshooting

### MongoDB not starting?

```bash
# Windows - Check if service is running
services.msc
# Look for "MongoDB Server"

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Port already in use?

```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Gemini API not working?

1. Check your API key in `ai-service/.env`
2. Make sure there are no spaces or quotes
3. Restart AI service: `uvicorn main:app --reload --port 8000`

### Python packages failing?

```bash
# Use virtual environment
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

---

## 📖 Next Steps

- **Full Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **AI Features**: [GEN_AI_FEATURES.md](./GEN_AI_FEATURES.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 💡 Pro Tips

1. **Save Often**: Press `Ctrl+S` or click Save button
2. **Use Chat**: The AI chat understands natural language
3. **Experiment**: Try different prompts to see what AI creates
4. **Check MongoDB**: Use MongoDB Compass to view saved designs
5. **API Docs**: Visit http://localhost:8000/docs for FastAPI docs

---

**Need Help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions!
