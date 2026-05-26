# 🧪 Cribble Testing Guide

## Quick Test Checklist

### ✅ Pre-Flight Checks

```bash
# 1. Check all services are installed
node --version     # Should be v18+
python --version   # Should be v3.9+
mongod --version   # Should show MongoDB version

# 2. Check all services are running
curl http://localhost:3000        # React Frontend
curl http://localhost:4000/api/health  # Express Backend
curl http://localhost:8000/api/health  # FastAPI AI Service
```

## Backend Testing (Express)

### 1. Health Check

```bash
curl http://localhost:4000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Cribble Backend",
  "mongodb": "connected",
  "timestamp": "2026-05-24T09:54:00.000Z"
}
```

### 2. Create Design

```bash
curl -X POST http://localhost:4000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "title": "Test Design",
    "prompt": "modern tech startup",
    "designData": {
      "headline": "TEST\nDESIGN",
      "elements": [
        {
          "id": 1,
          "type": "square",
          "x": 50,
          "y": 50,
          "width": 200,
          "height": 200,
          "color": "#6a37d4"
        }
      ],
      "zoom": 100,
      "canvasWidth": 720,
      "canvasHeight": 480,
      "colorPalette": ["#6a37d4", "#ae8dff"],
      "premium": false
    },
    "tags": ["test", "demo"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Design created successfully",
  "design": {
    "_id": "6789abc123def456",
    "userId": "test-user",
    "title": "Test Design",
    ...
  }
}
```

### 3. Get All Designs

```bash
curl http://localhost:4000/api/designs
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "designs": [...]
}
```

### 4. Get Design by ID

```bash
# Replace with actual ID from create response
curl http://localhost:4000/api/designs/6789abc123def456
```

### 5. Update Design

```bash
curl -X PUT http://localhost:4000/api/designs/6789abc123def456 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Design"
  }'
```

### 6. Delete Design

```bash
curl -X DELETE http://localhost:4000/api/designs/6789abc123def456
```

### 7. Get Designs by User

```bash
curl http://localhost:4000/api/designs/user/test-user
```

## AI Service Testing (FastAPI)

### 1. Health Check

```bash
curl http://localhost:8000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "gemini_configured": true
}
```

### 2. Generate Design

```bash
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "modern tech startup landing page",
    "style": "minimal",
    "colorScheme": "vibrant"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "design": {
    "headline": "TECH\nINNOVATION",
    "elements": [...],
    "colorPalette": ["#6a37d4", "#ae8dff", "#65e1ff"],
    "zoom": 100,
    "canvasWidth": 720,
    "canvasHeight": 480
  },
  "prompt": "modern tech startup landing page",
  "message": "Design generated successfully"
}
```

### 3. Color Suggestions

```bash
curl -X POST http://localhost:8000/api/ai/suggest-colors \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "luxury fashion brand",
    "count": 5
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "colors": ["#D4AF37", "#E8D5B7", "#F5E6D3", "#8B7355", "#4A4A4A"],
  "prompt": "luxury fashion brand"
}
```

### 4. Layout Suggestions

```bash
curl -X POST http://localhost:8000/api/ai/suggest-layout \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "portfolio website",
    "canvasWidth": 720,
    "canvasHeight": 480
  }'
```

## Integrated AI Testing (Through Backend)

### 1. Generate and Save Design

```bash
curl -X POST http://localhost:4000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "creative portfolio design",
    "style": "modern",
    "colorScheme": "vibrant",
    "userId": "test-user",
    "saveDesign": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "design": {...},
  "saved": true,
  "designId": "6789abc123def456"
}
```

### 2. Enhance Existing Design

```bash
curl -X POST http://localhost:4000/api/ai/enhance/6789abc123def456 \
  -H "Content-Type: application/json" \
  -d '{
    "enhancementPrompt": "make it more minimal and modern"
  }'
```

### 3. Get Color Suggestions

```bash
curl -X POST http://localhost:4000/api/ai/colors \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "ocean sunset",
    "count": 5
  }'
```

## Frontend Testing

### 1. Manual UI Testing

Open http://localhost:3000 and test:

#### Studio Page
- [ ] Canvas loads correctly
- [ ] Toolbar buttons work
- [ ] Can add shapes (square, circle)
- [ ] Can add text elements
- [ ] Elements are draggable
- [ ] Zoom controls work
- [ ] Save button works
- [ ] Undo/Redo works

#### Chat Assistant
- [ ] Chat panel opens
- [ ] Can send messages
- [ ] AI responds to commands
- [ ] Try: `"add a blue circle"`
- [ ] Try: `"generate colors for tech startup"`
- [ ] Try: `"create a design for luxury brand"`

#### Design Management
- [ ] Can save design (Ctrl+S)
- [ ] Can load saved designs
- [ ] Can update existing designs
- [ ] Can delete designs

### 2. Browser Console Testing

Open browser console (F12) and run:

```javascript
// Test API service
import { checkHealth, getAllDesigns, generateDesignWithAI } from './services/apiService';

// Check health
await checkHealth();

// Get all designs
const designs = await getAllDesigns();
console.log('Designs:', designs);

// Generate design
const result = await generateDesignWithAI({
  prompt: 'modern tech startup',
  style: 'minimal',
  colorScheme: 'vibrant',
  saveDesign: true,
  userId: 'test-user'
});
console.log('Generated:', result);
```

## MongoDB Testing

### 1. Using MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Navigate to `cribble` database
4. Check `designs` collection
5. Verify documents are being created

### 2. Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to cribble database
use cribble

# Count designs
db.designs.countDocuments()

# Find all designs
db.designs.find().pretty()

# Find by user
db.designs.find({ userId: "test-user" }).pretty()

# Find recent designs
db.designs.find().sort({ createdAt: -1 }).limit(5).pretty()

# Delete test data
db.designs.deleteMany({ userId: "test-user" })
```

## Performance Testing

### 1. API Response Time

```bash
# Test backend response time
time curl http://localhost:4000/api/designs

# Test AI generation time
time curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "style": "modern", "colorScheme": "vibrant"}'
```

**Expected Times:**
- Backend API: <100ms
- AI Generation: 2-5 seconds
- Database Query: <50ms

### 2. Load Testing (Optional)

Using Apache Bench:

```bash
# Install Apache Bench
# Windows: Download from Apache website
# Mac: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Test backend
ab -n 100 -c 10 http://localhost:4000/api/health

# Test design retrieval
ab -n 100 -c 10 http://localhost:4000/api/designs
```

## Error Testing

### 1. Test Invalid Requests

```bash
# Missing required fields
curl -X POST http://localhost:4000/api/designs \
  -H "Content-Type: application/json" \
  -d '{}'

# Invalid ID format
curl http://localhost:4000/api/designs/invalid-id

# Non-existent design
curl http://localhost:4000/api/designs/000000000000000000000000
```

### 2. Test Service Failures

```bash
# Stop MongoDB and test
# Should return connection error

# Stop AI service and test
curl -X POST http://localhost:4000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
# Should return AI service unavailable error
```

## Integration Testing

### Complete Workflow Test

```bash
#!/bin/bash

echo "=== Cribble Integration Test ==="

# 1. Health checks
echo "1. Checking services..."
curl -s http://localhost:4000/api/health | jq .
curl -s http://localhost:8000/api/health | jq .

# 2. Generate design with AI
echo "2. Generating design..."
DESIGN_ID=$(curl -s -X POST http://localhost:4000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "modern tech startup",
    "style": "minimal",
    "colorScheme": "vibrant",
    "userId": "test-user",
    "saveDesign": true
  }' | jq -r '.designId')

echo "Design ID: $DESIGN_ID"

# 3. Retrieve design
echo "3. Retrieving design..."
curl -s http://localhost:4000/api/designs/$DESIGN_ID | jq .

# 4. Update design
echo "4. Updating design..."
curl -s -X PUT http://localhost:4000/api/designs/$DESIGN_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Design"}' | jq .

# 5. Get all designs
echo "5. Getting all designs..."
curl -s http://localhost:4000/api/designs | jq '.count'

# 6. Delete design
echo "6. Deleting design..."
curl -s -X DELETE http://localhost:4000/api/designs/$DESIGN_ID | jq .

echo "=== Test Complete ==="
```

Save as `test-integration.sh` and run:

```bash
chmod +x test-integration.sh
./test-integration.sh
```

## Troubleshooting Tests

### Backend Not Responding

```bash
# Check if backend is running
curl http://localhost:4000/api/health

# Check backend logs
cd backend
npm run dev
# Look for errors in console
```

### AI Service Not Responding

```bash
# Check if AI service is running
curl http://localhost:8000/api/health

# Check AI service logs
cd ai-service
uvicorn main:app --reload --port 8000
# Look for errors in console
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongosh

# If not running, start it
mongod

# Check connection string in backend/.env
cat backend/.env | grep MONGODB_URI
```

### Gemini API Errors

```bash
# Check API key is set
cat ai-service/.env | grep GEMINI_API_KEY

# Test API key directly
curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

## Test Data Cleanup

```bash
# Clean up test designs
curl -X DELETE http://localhost:4000/api/designs/user/test-user

# Or using MongoDB shell
mongosh
use cribble
db.designs.deleteMany({ userId: "test-user" })
```

## Automated Testing (Future)

### Backend Tests (Jest)

```javascript
// backend/tests/designs.test.js
describe('Design API', () => {
  test('GET /api/designs returns designs', async () => {
    const response = await request(app).get('/api/designs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
  
  test('POST /api/designs creates design', async () => {
    const design = { /* ... */ };
    const response = await request(app)
      .post('/api/designs')
      .send(design);
    expect(response.status).toBe(201);
    expect(response.body.design._id).toBeDefined();
  });
});
```

### Frontend Tests (Vitest)

```typescript
// src/services/apiService.test.ts
import { describe, it, expect } from 'vitest';
import { getAllDesigns, createDesign } from './apiService';

describe('API Service', () => {
  it('should fetch all designs', async () => {
    const designs = await getAllDesigns();
    expect(Array.isArray(designs)).toBe(true);
  });
  
  it('should create a design', async () => {
    const design = await createDesign({ /* ... */ });
    expect(design._id).toBeDefined();
  });
});
```

## Test Coverage Goals

- [ ] Backend API: 80%+ coverage
- [ ] AI Service: 70%+ coverage
- [ ] Frontend Services: 75%+ coverage
- [ ] Integration Tests: All critical paths
- [ ] E2E Tests: Main user workflows

---

**Happy Testing! 🧪✨**
