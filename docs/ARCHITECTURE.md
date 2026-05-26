# 🏗️ Cribble Gen AI Architecture

## Overview
Transform Cribble into a Gen AI-powered design platform where users can generate, store, and manage designs using natural language prompts.

## Tech Stack

### Frontend
- **React 19** + TypeScript
- **Vite** for bundling
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend (Node.js)
- **Express.js** - REST API server
- **MongoDB** - Design storage (localhost)
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin requests

### AI Service (Python)
- **FastAPI** - High-performance API
- **PyMongo** - MongoDB driver
- **Google Gemini API** - AI design generation
- **Pydantic** - Data validation

## System Flow

```
User Prompt → React Frontend → Express API → FastAPI AI Service
                                    ↓                ↓
                                MongoDB ← Design JSON
```

## API Endpoints

### Express Backend (Port 4000)

#### Designs
- `POST /api/designs` - Create new design
- `GET /api/designs` - Get all designs
- `GET /api/designs/:id` - Get design by ID
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design
- `GET /api/designs/user/:userId` - Get user's designs

### FastAPI AI Service (Port 8000)

#### AI Generation
- `POST /api/ai/generate` - Generate design from prompt
- `POST /api/ai/enhance` - Enhance existing design
- `POST /api/ai/suggest-colors` - AI color recommendations
- `POST /api/ai/suggest-layout` - AI layout suggestions

## Database Schema

### Design Collection
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "title": "string",
  "prompt": "string",
  "designData": {
    "headline": "string",
    "elements": [
      {
        "id": "number",
        "type": "square|circle|text",
        "x": "number",
        "y": "number",
        "width": "number",
        "height": "number",
        "color": "string",
        "text": "string?"
      }
    ],
    "zoom": "number",
    "canvasWidth": "number",
    "canvasHeight": "number",
    "colorPalette": ["string"],
    "premium": "boolean",
    "price": "string?"
  },
  "thumbnail": "string",
  "tags": ["string"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Implementation Steps

1. ✅ Setup MongoDB locally
2. ✅ Create Express backend with Mongoose
3. ✅ Create FastAPI AI service
4. ✅ Integrate Gemini API for design generation
5. ✅ Update React frontend to use APIs
6. ✅ Add save/load functionality
7. ✅ Add AI prompt interface
8. ✅ Test end-to-end flow

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/cribble
PORT=4000
AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)
```
GEMINI_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/cribble
PORT=8000
```

## Development Commands

```bash
# Start MongoDB
mongod

# Start Express Backend
cd backend
npm run dev

# Start FastAPI AI Service
cd ai-service
uvicorn main:app --reload --port 8000

# Start React Frontend
npm run dev
```
