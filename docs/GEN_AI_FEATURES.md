# 🤖 Cribble Gen AI Features

## Overview

Cribble now includes powerful Gen AI capabilities that allow users to:
- **Generate complete designs from text prompts**
- **Store and manage designs in MongoDB**
- **Edit and update designs with AI assistance**
- **Get AI-powered color and layout suggestions**

## Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────────┐
│ Express Backend │ ←──→ │  FastAPI AI      │
│   (Port 4000)   │      │  (Port 8000)     │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         ↓                        ↓
┌─────────────────┐      ┌──────────────────┐
│    MongoDB      │      │  Gemini API      │
│  (Port 27017)   │      │  (Google AI)     │
└─────────────────┘      └──────────────────┘
```

## Key Features

### 1. AI Design Generation

**Prompt:** `"Create a modern tech startup landing page"`

**AI Generates:**
```json
{
  "headline": "TECH\nINNOVATION",
  "elements": [
    {
      "id": 1,
      "type": "square",
      "x": 50,
      "y": 50,
      "width": 200,
      "height": 200,
      "color": "#6a37d4"
    },
    {
      "id": 2,
      "type": "circle",
      "x": 300,
      "y": 100,
      "width": 150,
      "height": 150,
      "color": "#ae8dff"
    },
    {
      "id": 3,
      "type": "text",
      "x": 100,
      "y": 300,
      "width": 300,
      "height": 80,
      "color": "#2f2e2e",
      "text": "TECH\nINNOVATION"
    }
  ],
  "colorPalette": ["#6a37d4", "#ae8dff", "#65e1ff"],
  "zoom": 100,
  "canvasWidth": 720,
  "canvasHeight": 480
}
```

### 2. MongoDB Storage

All designs are stored in MongoDB with:
- **User ID** - Track who created it
- **Title & Prompt** - Original request
- **Design Data** - Complete JSON structure
- **Timestamps** - Created/Updated dates
- **Tags** - For categorization

### 3. CRUD Operations

#### Create
```typescript
const design = await createDesign({
  userId: 'user123',
  title: 'My Awesome Design',
  prompt: 'modern tech startup',
  designData: { /* ... */ }
});
```

#### Read
```typescript
// Get all designs
const designs = await getAllDesigns();

// Get by ID
const design = await getDesignById('design_id');

// Get by user
const userDesigns = await getDesignsByUser('user123');
```

#### Update
```typescript
const updated = await updateDesign('design_id', {
  title: 'Updated Title',
  designData: { /* new data */ }
});
```

#### Delete
```typescript
await deleteDesign('design_id');
```

### 4. AI Chat Assistant

The Studio includes an AI chat assistant that understands commands:

**Natural Language Commands:**
- `"add a blue circle"` → Creates blue circle
- `"delete selected"` → Removes selected element
- `"zoom in"` → Increases zoom
- `"generate colors for luxury brand"` → AI color palette
- `"create a design for tech startup"` → Full AI generation

**Structured Commands:**
```typescript
// Add element
"add [type] [color] at [x], [y] size [width]x[height]"

// Modify
"change color to [color]"
"resize to [width]x[height]"
"move to [x], [y]"

// Actions
"undo" | "redo" | "save" | "duplicate"
```

### 5. AI Color Suggestions

```typescript
const colors = await getColorSuggestions('luxury fashion brand', 5);
// Returns: ["#D4AF37", "#E8D5B7", "#F5E6D3", "#8B7355", "#4A4A4A"]
```

### 6. Design Enhancement

```typescript
const suggestions = await enhanceDesign(
  'design_id',
  'make it more modern and minimal'
);
```

## API Reference

### Express Backend (http://localhost:4000)

#### Designs

**GET /api/designs**
```bash
curl http://localhost:4000/api/designs
```

**GET /api/designs/:id**
```bash
curl http://localhost:4000/api/designs/6789abc123def456
```

**POST /api/designs**
```bash
curl -X POST http://localhost:4000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "My Design",
    "prompt": "modern tech",
    "designData": { ... }
  }'
```

**PUT /api/designs/:id**
```bash
curl -X PUT http://localhost:4000/api/designs/6789abc123def456 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

**DELETE /api/designs/:id**
```bash
curl -X DELETE http://localhost:4000/api/designs/6789abc123def456
```

#### AI Integration

**POST /api/ai/generate**
```bash
curl -X POST http://localhost:4000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "luxury fashion brand",
    "style": "elegant",
    "colorScheme": "warm",
    "saveDesign": true,
    "userId": "user123"
  }'
```

**POST /api/ai/enhance/:id**
```bash
curl -X POST http://localhost:4000/api/ai/enhance/6789abc123def456 \
  -H "Content-Type: application/json" \
  -d '{"enhancementPrompt": "make it more minimal"}'
```

**POST /api/ai/colors**
```bash
curl -X POST http://localhost:4000/api/ai/colors \
  -H "Content-Type: application/json" \
  -d '{"prompt": "ocean sunset", "count": 5}'
```

### FastAPI AI Service (http://localhost:8000)

#### AI Generation

**POST /api/ai/generate**
```bash
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "modern tech startup",
    "style": "minimal",
    "colorScheme": "vibrant"
  }'
```

**POST /api/ai/suggest-colors**
```bash
curl -X POST http://localhost:8000/api/ai/suggest-colors \
  -H "Content-Type: application/json" \
  -d '{"prompt": "luxury brand", "count": 5}'
```

**POST /api/ai/suggest-layout**
```bash
curl -X POST http://localhost:8000/api/ai/suggest-layout \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "portfolio website",
    "canvasWidth": 720,
    "canvasHeight": 480
  }'
```

## Frontend Integration

### Using the API Service

```typescript
import {
  generateDesignWithAI,
  saveCanvasAsDesign,
  getAllDesigns,
  updateDesign
} from './services/apiService';

// Generate design
const result = await generateDesignWithAI({
  prompt: 'modern tech startup',
  style: 'minimal',
  colorScheme: 'vibrant',
  saveDesign: true,
  userId: 'user123'
});

// Apply to canvas
setCanvasElements(result.design.elements);
setHeadlineText(result.design.headline);
setCurrentColorPalette(result.design.colorPalette);

// Save current canvas
const saved = await saveCanvasAsDesign(
  'My Design',
  {
    headline: headlineText,
    elements: canvasElements,
    zoom,
    canvasWidth,
    canvasHeight,
    colorPalette: currentColors,
    premium: isPremium,
    price
  },
  'user123',
  'original prompt',
  ['tag1', 'tag2']
);

// Load designs
const designs = await getAllDesigns('user123');
```

## Database Schema

### Design Collection

```javascript
{
  _id: ObjectId("6789abc123def456"),
  userId: "user123",
  title: "Modern Tech Startup",
  prompt: "create a modern tech startup design",
  designData: {
    headline: "TECH\nINNOVATION",
    elements: [
      {
        id: 1,
        type: "square",
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        color: "#6a37d4"
      }
    ],
    zoom: 100,
    canvasWidth: 720,
    canvasHeight: 480,
    colorPalette: ["#6a37d4", "#ae8dff", "#65e1ff"],
    premium: false,
    price: null
  },
  thumbnail: "data:image/png;base64,...",
  tags: ["tech", "modern", "startup"],
  createdAt: ISODate("2026-05-24T09:54:00.000Z"),
  updatedAt: ISODate("2026-05-24T09:54:00.000Z")
}
```

## Environment Setup

### Backend (.env)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/cribble
AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
MONGODB_URI=mongodb://localhost:27017/cribble
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
```

## Example Workflows

### Workflow 1: Generate and Save

```typescript
// 1. User enters prompt
const prompt = "luxury fashion brand";

// 2. Generate with AI
const result = await generateDesignWithAI({
  prompt,
  style: 'elegant',
  colorScheme: 'warm',
  saveDesign: true,
  userId: currentUser.id
});

// 3. Design is automatically saved to MongoDB
console.log('Saved design ID:', result.designId);

// 4. Apply to canvas
applyDesignToCanvas(result.design);
```

### Workflow 2: Load and Edit

```typescript
// 1. Load user's designs
const designs = await getAllDesigns(currentUser.id);

// 2. User selects a design
const selected = designs[0];

// 3. Load to canvas
applyDesignToCanvas(selected.designData);

// 4. User makes edits
// ... user edits canvas ...

// 5. Save changes
await updateDesign(selected._id, {
  designData: getCurrentCanvasState()
});
```

### Workflow 3: AI Enhancement

```typescript
// 1. User has a design loaded
const currentDesignId = '6789abc123def456';

// 2. User requests enhancement
const suggestions = await enhanceDesign(
  currentDesignId,
  'make it more modern and add more contrast'
);

// 3. Show suggestions to user
displaySuggestions(suggestions);

// 4. User applies suggestions
// ... apply changes ...

// 5. Save updated design
await updateDesign(currentDesignId, {
  designData: getCurrentCanvasState()
});
```

## Testing

### Test AI Generation

```bash
# Test FastAPI directly
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test design", "style": "modern", "colorScheme": "vibrant"}'

# Test through Express backend
curl -X POST http://localhost:4000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test design", "saveDesign": false}'
```

### Test MongoDB Operations

```bash
# Create design
curl -X POST http://localhost:4000/api/designs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "title": "Test Design",
    "prompt": "test",
    "designData": {
      "headline": "TEST",
      "elements": [],
      "zoom": 100,
      "canvasWidth": 720,
      "canvasHeight": 480,
      "colorPalette": ["#6a37d4"],
      "premium": false
    }
  }'

# Get all designs
curl http://localhost:4000/api/designs

# Get by user
curl http://localhost:4000/api/designs/user/test-user
```

## Performance Considerations

- **AI Generation**: 2-5 seconds (depends on Gemini API)
- **MongoDB Queries**: <100ms for most operations
- **Design Storage**: ~5-10KB per design (JSON)
- **Concurrent Users**: Express can handle 100+ concurrent requests

## Security Best Practices

1. **API Keys**: Never commit `.env` files
2. **CORS**: Restrict origins in production
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Add rate limits to AI endpoints
5. **Authentication**: Implement JWT for user auth

## Future Enhancements

- [ ] Image generation with DALL-E or Stable Diffusion
- [ ] Real-time collaboration with WebSockets
- [ ] Design templates library
- [ ] Export to PNG/SVG/PDF
- [ ] Version history and branching
- [ ] AI-powered design critique
- [ ] Style transfer between designs
- [ ] Automatic responsive layouts

---

**Built with ❤️ using MERN + FastAPI + Gemini AI**
