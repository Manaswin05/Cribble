# ❓ Cribble - Frequently Asked Questions

## 📋 Table of Contents

- [General Questions](#general-questions)
- [Setup & Installation](#setup--installation)
- [MongoDB Issues](#mongodb-issues)
- [Backend Issues](#backend-issues)
- [AI Service Issues](#ai-service-issues)
- [Frontend Issues](#frontend-issues)
- [API & Integration](#api--integration)
- [Deployment](#deployment)
- [Performance](#performance)
- [Security](#security)

---

## General Questions

### What is Cribble?

Cribble is an AI-powered design platform that allows users to:
- Generate designs from text prompts using Google Gemini AI
- Create and edit designs with a drag-and-drop canvas
- Store designs in MongoDB
- Use natural language commands to manipulate designs
- Get AI-powered color and layout suggestions

### What technologies does Cribble use?

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Motion (Framer Motion)

**Backend:**
- Express.js + Node.js
- MongoDB + Mongoose
- FastAPI + Python
- Google Gemini AI

### Is Cribble free to use?

Yes! Cribble is open-source (Apache-2.0 license). However, you'll need:
- A free Gemini API key (free tier available)
- MongoDB (free local or MongoDB Atlas free tier)

### Do I need coding experience?

**To use:** No, just follow the setup guide.
**To customize:** Basic JavaScript/Python knowledge helps.
**To contribute:** Yes, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Setup & Installation

### Q: What are the system requirements?

**Minimum:**
- OS: Windows 10, macOS 10.15, or Linux
- RAM: 4GB
- Storage: 2GB free space
- Node.js: v18+
- Python: v3.9+
- MongoDB: Latest version

**Recommended:**
- RAM: 8GB+
- Storage: 5GB+ free space
- SSD for better performance

### Q: How do I get a Gemini API key?

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `ai-service/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

### Q: Can I use a different AI model?

Yes! You can modify `ai-service/main.py` to use:
- OpenAI GPT-4
- Anthropic Claude
- Local models (Ollama, LM Studio)

Example for OpenAI:
```python
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
)
```

### Q: Setup script fails on Windows

**Issue:** PowerShell execution policy

**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run setup
.\setup-backend.bat
```

### Q: Setup script fails on Mac/Linux

**Issue:** Permission denied

**Solution:**
```bash
chmod +x setup-backend.sh
./setup-backend.sh
```

---

## MongoDB Issues

### Q: MongoDB won't start

**Issue 1: Port already in use**
```bash
# Check what's using port 27017
# Windows
netstat -ano | findstr :27017

# Mac/Linux
lsof -i :27017

# Kill the process or use different port
mongod --port 27018
```

**Issue 2: Data directory not found**
```bash
# Create data directory
# Windows
mkdir C:\data\db

# Mac/Linux
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

**Issue 3: MongoDB not installed**
```bash
# Windows: Download from mongodb.com
# Mac
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu)
sudo apt-get install mongodb
```

### Q: Can't connect to MongoDB

**Check connection string:**
```bash
# Local MongoDB
mongodb://localhost:27017/cribble

# MongoDB Atlas
mongodb+srv://username:password@cluster.mongodb.net/cribble
```

**Test connection:**
```bash
mongosh "mongodb://localhost:27017"
```

### Q: MongoDB Atlas connection fails

**Common issues:**
1. **IP not whitelisted**
   - Go to Atlas → Network Access
   - Add your IP or 0.0.0.0/0 (allow all)

2. **Wrong credentials**
   - Check username and password
   - Ensure password is URL-encoded

3. **Wrong connection string**
   - Use the connection string from Atlas dashboard
   - Replace `<password>` with actual password

---

## Backend Issues

### Q: Backend won't start

**Issue 1: Port 4000 already in use**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9

# Or change port in backend/.env
PORT=4001
```

**Issue 2: Dependencies not installed**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Issue 3: Environment variables missing**
```bash
# Check backend/.env exists
cat backend/.env

# Should have:
PORT=4000
MONGODB_URI=mongodb://localhost:27017/cribble
AI_SERVICE_URL=http://localhost:8000
```

### Q: Backend crashes on startup

**Check logs:**
```bash
cd backend
npm run dev
# Look for error messages
```

**Common errors:**

1. **MongoDB connection failed**
   - Ensure MongoDB is running: `mongod`
   - Check connection string in `.env`

2. **Module not found**
   - Reinstall dependencies: `npm install`

3. **Syntax error**
   - Check Node.js version: `node --version` (need v18+)

### Q: API endpoints return 404

**Check:**
1. Backend is running on correct port
2. URL is correct: `http://localhost:4000/api/designs`
3. CORS is configured properly

**Test:**
```bash
curl http://localhost:4000/api/health
```

---

## AI Service Issues

### Q: AI service won't start

**Issue 1: Port 8000 already in use**
```bash
# Use different port
uvicorn main:app --reload --port 8001

# Update backend/.env
AI_SERVICE_URL=http://localhost:8001
```

**Issue 2: Python dependencies missing**
```bash
cd ai-service
pip install -r requirements.txt

# If fails, use virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Issue 3: Python version too old**
```bash
python --version  # Need 3.9+

# Install newer Python from python.org
```

### Q: Gemini API errors

**Error: API key not configured**
```bash
# Check ai-service/.env
cat ai-service/.env | grep GEMINI_API_KEY

# Should have:
GEMINI_API_KEY=your_actual_key_here
```

**Error: Invalid API key**
- Get new key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Ensure no spaces or quotes around key

**Error: Rate limit exceeded**
- Free tier has limits
- Wait a few minutes
- Consider upgrading to paid tier

**Error: Model not found**
- Check model name in `main.py`
- Use: `gemini-2.0-flash-exp` or `gemini-pro`

### Q: AI generates poor designs

**Improve prompts:**
```python
# Bad
"design"

# Good
"modern tech startup landing page with minimal design and vibrant colors"
```

**Adjust system instructions:**
Edit `ai-service/main.py` → `system_instruction` variable

**Use better models:**
- Try `gemini-pro` instead of `gemini-2.0-flash-exp`
- Adjust temperature and parameters

---

## Frontend Issues

### Q: Frontend won't start

**Issue 1: Port 3000 already in use**
```bash
# Change port in package.json
"dev": "vite --port 3001"
```

**Issue 2: Dependencies not installed**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue 3: Build errors**
```bash
# Clear cache
npm run clean
npm run build
```

### Q: API calls fail from frontend

**Check:**
1. Backend is running: `curl http://localhost:4000/api/health`
2. CORS is enabled in backend
3. API URL is correct in `.env`:
   ```
   VITE_API_URL=http://localhost:4000/api
   ```

**Test in browser console:**
```javascript
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Q: Chat assistant not working

**Check:**
1. Backend is running
2. AI service is running
3. Gemini API key is configured
4. Check browser console for errors (F12)

**Test AI service directly:**
```bash
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

---

## API & Integration

### Q: How do I test API endpoints?

**Using curl:**
```bash
# Health check
curl http://localhost:4000/api/health

# Get designs
curl http://localhost:4000/api/designs

# Create design
curl -X POST http://localhost:4000/api/designs \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "title": "Test", "designData": {...}}'
```

**Using Postman:**
1. Download [Postman](https://www.postman.com/)
2. Import collection from `docs/postman-collection.json` (if available)
3. Test endpoints

**Using FastAPI docs:**
- Open http://localhost:8000/docs
- Interactive API documentation

### Q: CORS errors in browser

**Error:** `Access-Control-Allow-Origin`

**Solution:** Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    // Add your frontend URLs
  ],
  credentials: true
}));
```

### Q: Request timeout

**Increase timeout:**

**Backend:**
```javascript
// backend/server.js
axios.defaults.timeout = 30000; // 30 seconds
```

**Frontend:**
```typescript
// src/services/apiService.ts
const response = await fetch(url, {
  signal: AbortSignal.timeout(30000) // 30 seconds
});
```

---

## Deployment

### Q: How do I deploy to production?

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick options:**
1. **Vercel** (Frontend) + **Heroku** (Backend/AI) + **MongoDB Atlas** (Database)
2. **Railway** (All-in-one)
3. **AWS** (Full control)
4. **Docker** (Self-hosted)

### Q: Environment variables for production

**Frontend (.env.production):**
```
VITE_API_URL=https://your-backend.herokuapp.com/api
```

**Backend (.env):**
```
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cribble
AI_SERVICE_URL=https://your-ai-service.herokuapp.com
NODE_ENV=production
```

**AI Service (.env):**
```
GEMINI_API_KEY=your_key
PORT=8000
```

### Q: Deployment fails

**Common issues:**

1. **Build fails**
   - Check Node.js/Python version
   - Install dependencies locally first
   - Check build logs

2. **Environment variables not set**
   - Set in platform dashboard (Heroku, Vercel, etc.)
   - Don't commit `.env` files

3. **Database connection fails**
   - Use MongoDB Atlas for production
   - Whitelist deployment platform IPs

---

## Performance

### Q: AI generation is slow

**Normal:** 2-5 seconds for Gemini API

**If slower:**
1. Check internet connection
2. Try different Gemini model
3. Reduce prompt complexity
4. Check API rate limits

### Q: Database queries are slow

**Solutions:**
1. Add indexes:
   ```javascript
   designSchema.index({ userId: 1, createdAt: -1 });
   ```

2. Limit results:
   ```javascript
   const designs = await Design.find().limit(50);
   ```

3. Use pagination:
   ```javascript
   const designs = await Design.find()
     .skip(page * limit)
     .limit(limit);
   ```

### Q: Frontend is slow

**Optimize:**
1. Use React.memo for components
2. Implement virtual scrolling for large lists
3. Lazy load images
4. Code splitting with React.lazy

---

## Security

### Q: Is my API key safe?

**Best practices:**
1. Never commit `.env` files
2. Use environment variables
3. Rotate keys regularly
4. Use different keys for dev/prod

### Q: How do I add authentication?

**JWT Authentication:**

1. Install dependencies:
   ```bash
   npm install jsonwebtoken bcrypt
   ```

2. Add auth middleware:
   ```javascript
   // backend/middleware/auth.js
   const jwt = require('jsonwebtoken');
   
   module.exports = (req, res, next) => {
     const token = req.header('Authorization')?.replace('Bearer ', '');
     if (!token) return res.status(401).send('Access denied');
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (err) {
       res.status(400).send('Invalid token');
     }
   };
   ```

3. Protect routes:
   ```javascript
   const auth = require('./middleware/auth');
   app.get('/api/designs', auth, async (req, res) => {
     // Only authenticated users can access
   });
   ```

### Q: How do I secure MongoDB?

1. **Enable authentication:**
   ```bash
   mongod --auth
   ```

2. **Create admin user:**
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "strong_password",
     roles: ["root"]
   })
   ```

3. **Use connection string with auth:**
   ```
   mongodb://admin:password@localhost:27017/cribble?authSource=admin
   ```

---

## Still Need Help?

### Documentation
- [Setup Guide](./SETUP_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [All Documentation](./DOCUMENTATION_INDEX.md)

### Community
- [GitHub Issues](https://github.com/Manaswin05/Cribble/issues)
- [GitHub Discussions](https://github.com/Manaswin05/Cribble/discussions)

### Resources
- [Gemini AI Docs](https://ai.google.dev/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)

---

**Can't find your answer? [Open an issue](https://github.com/Manaswin05/Cribble/issues/new)!**
