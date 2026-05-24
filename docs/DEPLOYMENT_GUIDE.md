# 🚀 Cribble Deployment Guide

## Deployment Options

### Option 1: All-in-One Cloud (Recommended for Beginners)

**Platform:** Railway / Render / Fly.io

**Pros:**
- Easy setup
- Automatic scaling
- Built-in MongoDB
- Free tier available

**Cons:**
- Limited customization
- May have cold starts

### Option 2: Separate Services (Recommended for Production)

**Platforms:**
- Frontend: Vercel / Netlify
- Backend: Heroku / Railway
- AI Service: Heroku / Railway
- Database: MongoDB Atlas

**Pros:**
- Better performance
- Independent scaling
- More control

**Cons:**
- More complex setup
- Higher cost

### Option 3: Self-Hosted (Advanced)

**Platforms:**
- VPS: DigitalOcean / Linode / AWS EC2
- Container: Docker + Kubernetes

**Pros:**
- Full control
- Best performance
- Cost-effective at scale

**Cons:**
- Requires DevOps knowledge
- Manual maintenance

---

## 🌐 MongoDB Atlas Setup (Cloud Database)

### 1. Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (Free M0 tier)

### 2. Configure Database

```bash
# 1. Create database user
Username: cribble-user
Password: <generate-strong-password>

# 2. Whitelist IP addresses
# For development: Add your current IP
# For production: Add 0.0.0.0/0 (allow all) or specific IPs

# 3. Get connection string
mongodb+srv://cribble-user:<password>@cluster0.xxxxx.mongodb.net/cribble?retryWrites=true&w=majority
```

### 3. Update Environment Variables

```bash
# backend/.env
MONGODB_URI=mongodb+srv://cribble-user:<password>@cluster0.xxxxx.mongodb.net/cribble?retryWrites=true&w=majority
```

---

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare for Deployment

```bash
# Update .env.production
VITE_API_URL=https://your-backend-url.herokuapp.com/api
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Using GitHub Integration

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add `VITE_API_URL`
6. Click "Deploy"

### 3. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## 🔧 Backend Deployment (Heroku)

### 1. Prepare Backend

```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Update package.json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 2. Deploy to Heroku

```bash
# Install Heroku CLI
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create cribble-backend

# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set AI_SERVICE_URL="https://cribble-ai.herokuapp.com"
heroku config:set PORT=4000

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a cribble-backend
git push heroku main

# Check logs
heroku logs --tail
```

### 3. Verify Deployment

```bash
curl https://cribble-backend.herokuapp.com/api/health
```

---

## 🤖 AI Service Deployment (Heroku)

### 1. Prepare AI Service

```bash
cd ai-service

# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# Create runtime.txt
echo "python-3.11.0" > runtime.txt
```

### 2. Deploy to Heroku

```bash
# Create app
heroku create cribble-ai

# Set environment variables
heroku config:set GEMINI_API_KEY="your_api_key"
heroku config:set MONGODB_URI="mongodb+srv://..."

# Deploy
git init
git add .
git commit -m "Deploy AI service"
heroku git:remote -a cribble-ai
git push heroku main

# Check logs
heroku logs --tail
```

### 3. Verify Deployment

```bash
curl https://cribble-ai.herokuapp.com/api/health
```

---

## 🐳 Docker Deployment

### 1. Create Dockerfiles

#### Frontend Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 4000
CMD ["node", "server.js"]
```

#### AI Service Dockerfile

```dockerfile
# ai-service/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Create Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: cribble

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/cribble
      - AI_SERVICE_URL=http://ai-service:8000
      - PORT=4000
    depends_on:
      - mongodb
      - ai-service

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - MONGODB_URI=mongodb://mongodb:27017/cribble
      - PORT=8000
    depends_on:
      - mongodb

  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:4000/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### 3. Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☁️ AWS Deployment

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  CloudFront (CDN)                                   │
│  ↓                                                  │
│  S3 (Frontend Static Files)                        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Application Load Balancer                          │
│  ↓                          ↓                       │
│  ECS (Backend)              ECS (AI Service)        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  MongoDB Atlas                                      │
└─────────────────────────────────────────────────────┘
```

### 1. Frontend (S3 + CloudFront)

```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://cribble-frontend --delete

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name cribble-frontend.s3.amazonaws.com
```

### 2. Backend (ECS)

```bash
# Build and push Docker image
docker build -t cribble-backend ./backend
docker tag cribble-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/cribble-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/cribble-backend:latest

# Create ECS task definition and service
aws ecs create-service --cluster cribble --service-name backend ...
```

---

## 🔒 Security Checklist

### Before Deployment

- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use strong API keys
- [ ] Add input validation
- [ ] Enable logging
- [ ] Set up monitoring

### Environment Variables

```bash
# Never commit these!
GEMINI_API_KEY=<secret>
MONGODB_URI=<secret>
JWT_SECRET=<secret>
```

### CORS Configuration

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://cribble.vercel.app',
    'https://www.cribble.com'
  ],
  credentials: true
}));
```

---

## 📊 Monitoring & Logging

### 1. Application Monitoring

**Tools:**
- Sentry (Error tracking)
- LogRocket (Session replay)
- New Relic (Performance)

```javascript
// backend/server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### 2. Database Monitoring

**MongoDB Atlas:**
- Enable monitoring in Atlas dashboard
- Set up alerts for:
  - High CPU usage
  - Low disk space
  - Connection spikes

### 3. Logging

```javascript
// backend/server.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Cribble

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "cribble-backend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "backend"
```

---

## 🧪 Post-Deployment Testing

```bash
# Test all endpoints
curl https://cribble-backend.herokuapp.com/api/health
curl https://cribble-ai.herokuapp.com/api/health

# Test design creation
curl -X POST https://cribble-backend.herokuapp.com/api/designs \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "title": "Test", "designData": {...}}'

# Test AI generation
curl -X POST https://cribble-backend.herokuapp.com/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test design", "saveDesign": false}'
```

---

## 💰 Cost Estimation

### Free Tier (Development)

- **Frontend**: Vercel (Free)
- **Backend**: Heroku (Free dyno)
- **AI Service**: Heroku (Free dyno)
- **Database**: MongoDB Atlas (Free M0)
- **Total**: $0/month

### Production (Small Scale)

- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Heroku Hobby ($7/month)
- **AI Service**: Heroku Hobby ($7/month)
- **Database**: MongoDB Atlas M10 ($57/month)
- **Total**: ~$91/month

### Production (Medium Scale)

- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Heroku Standard ($25/month)
- **AI Service**: Heroku Standard ($25/month)
- **Database**: MongoDB Atlas M30 ($250/month)
- **CDN**: CloudFront (~$10/month)
- **Total**: ~$330/month

---

## 🆘 Troubleshooting Deployment

### Build Failures

```bash
# Check build logs
heroku logs --tail --app cribble-backend

# Common issues:
# - Missing dependencies
# - Wrong Node/Python version
# - Environment variables not set
```

### Connection Issues

```bash
# Test MongoDB connection
mongosh "mongodb+srv://..."

# Test API endpoints
curl https://your-app.herokuapp.com/api/health
```

### Performance Issues

```bash
# Check dyno metrics
heroku ps --app cribble-backend

# Scale up if needed
heroku ps:scale web=2 --app cribble-backend
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)

---

**Ready to deploy! 🚀**
