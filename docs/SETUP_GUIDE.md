# 🚀 Cribble Gen AI Setup Guide

## Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- ✅ **MongoDB** (Community Edition) - [Download](https://www.mongodb.com/try/download/community)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **Gemini API Key** - [Get Free Key](https://makersuite.google.com/app/apikey)

## Quick Start (Windows)

### 1. Install MongoDB

Download and install MongoDB Community Edition. After installation:

```bash
# Start MongoDB service
mongod
```

Or install as Windows Service (recommended):
- During installation, check "Install MongoDB as a Service"
- MongoDB will start automatically

### 2. Setup Backend & AI Service

Run the setup script:

```bash
setup-backend.bat
```

This will:
- Install Node.js dependencies for Express backend
- Install Python dependencies for FastAPI AI service
- Create `.env` files from examples

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
# Edit .env file (already created by setup script)
```

Default values:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/cribble
AI_SERVICE_URL=http://localhost:8000
```

#### AI Service (.env)
```bash
cd ai-service
# Edit .env file and add your Gemini API key
```

Required:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=8000
```

**Get Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste into `ai-service/.env`

### 4. Start All Services

Use the convenient startup script:

```bash
START_SERVERS.bat
```

This will open 4 terminal windows:
- **MongoDB** (Database)
- **Express Backend** (Port 4000)
- **FastAPI AI Service** (Port 8000)
- **React Frontend** (Port 3000)

Or start manually:

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: AI Service
cd ai-service
uvicorn main:app --reload --port 8000

# Terminal 4: Frontend
npm run dev
```

### 5. Verify Everything Works

Open your browser and check:

- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:4000/api/health
- ✅ AI Service: http://localhost:8000/api/health
- ✅ MongoDB: Should show "connected" in backend health check

## Quick Start (Mac/Linux)

### 1. Install MongoDB

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Setup Backend & AI Service

```bash
chmod +x setup-backend.sh
./setup-backend.sh
```

### 3. Configure Environment Variables

Same as Windows (see above)

### 4. Start All Services

```bash
# Terminal 1: MongoDB (if not running as service)
mongod

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: AI Service
cd ai-service
uvicorn main:app --reload --port 8000

# Terminal 4: Frontend
npm run dev
```

## Testing the AI Features

### 1. Test AI Service Directly

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "gemini_configured": true
}
```

### 2. Generate a Design via API

```bash
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "modern tech startup design", "style": "minimal", "colorScheme": "vibrant"}'
```

### 3. Test Backend API

```bash
# Health check
curl http://localhost:4000/api/health

# Get all designs
curl http://localhost:4000/api/designs

# Generate design (with save)
curl -X POST http://localhost:4000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "creative portfolio", "saveDesign": true, "userId": "test-user"}'
```

## Using the Frontend

### 1. Open Cribble Studio

Navigate to http://localhost:3000 and click **Studio**

### 2. Use AI Chat Assistant

In the Studio page, look for the **Chat** panel on the right side.

Try these commands:
- `"add a blue circle"`
- `"create a red square at 100, 100"`
- `"delete selected"`
- `"zoom in"`
- `"generate colors for tech startup"`

### 3. Generate Full Designs

Type in the chat:
```
"generate a design for luxury fashion brand"
```

The AI will create a complete design with:
- Layout elements (shapes, text)
- Color palette
- Positioning and sizing

### 4. Save Your Design

Click the **Save** button or press `Ctrl+S` to save to MongoDB.

## Project Structure

```
Cribble/
├── src/                    # React frontend
│   ├── services/
│   │   ├── apiService.ts   # Backend API calls
│   │   ├── geminiService.ts # Mock AI (legacy)
│   │   └── colorThemeService.ts
│   └── App.tsx
├── backend/                # Express + MongoDB
│   ├── server.js          # Main server
│   ├── package.json
│   └── .env
├── ai-service/            # FastAPI + Gemini
│   ├── main.py           # AI endpoints
│   ├── requirements.txt
│   └── .env
└── ARCHITECTURE.md        # System design
```

## API Endpoints Reference

### Backend (Express - Port 4000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/designs` | Get all designs |
| GET | `/api/designs/:id` | Get design by ID |
| POST | `/api/designs` | Create design |
| PUT | `/api/designs/:id` | Update design |
| DELETE | `/api/designs/:id` | Delete design |
| POST | `/api/ai/generate` | Generate design with AI |
| POST | `/api/ai/enhance/:id` | Enhance design |
| POST | `/api/ai/colors` | Get color suggestions |

### AI Service (FastAPI - Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/ai/generate` | Generate design from prompt |
| POST | `/api/ai/enhance` | Enhance existing design |
| POST | `/api/ai/suggest-colors` | Color palette suggestions |
| POST | `/api/ai/suggest-layout` | Layout suggestions |

## Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Or check if service is running
# Windows: services.msc → MongoDB Server
# Mac: brew services list
# Linux: sudo systemctl status mongodb
```

### Gemini API Error

**Error:** `Gemini API key not configured`

**Solution:**
1. Get API key from https://makersuite.google.com/app/apikey
2. Add to `ai-service/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Restart AI service

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Python Dependencies Failed

**Error:** `pip install failed`

**Solution:**
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

## Next Steps

1. ✅ **Customize AI Prompts** - Edit `ai-service/main.py` to change AI behavior
2. ✅ **Add User Authentication** - Implement JWT auth in backend
3. ✅ **Deploy to Cloud** - Use MongoDB Atlas, Heroku, or AWS
4. ✅ **Add More AI Features** - Image generation, style transfer, etc.
5. ✅ **Build Mobile App** - React Native version

## Support

- 📖 [Architecture Documentation](./ARCHITECTURE.md)
- 🐛 [Report Issues](https://github.com/Manaswin05/Cribble/issues)
- 💬 [Discussions](https://github.com/Manaswin05/Cribble/discussions)

---

**Happy Creating! 🎨✨**
