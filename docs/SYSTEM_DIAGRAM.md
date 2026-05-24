# 🏗️ Cribble System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    http://localhost:3000                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   App.tsx    │  │  Components  │  │   Services   │          │
│  │              │  │              │  │              │          │
│  │  - Studio    │  │  - Sidebar   │  │  - apiService│          │
│  │  - Canvas    │  │  - TopBar    │  │  - gemini    │          │
│  │  - Chat      │  │  - ColorPanel│  │  - colorTheme│          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
└────────────────────────────────────────────────┬────────────────┘
                                                 │
                                                 │ HTTP/REST
                                                 │
                             ┌───────────────────┴───────────────────┐
                             │                                       │
                             ↓                                       ↓
┌─────────────────────────────────────┐    ┌──────────────────────────────────┐
│      EXPRESS BACKEND                │    │     FASTAPI AI SERVICE           │
│      Port 4000                      │    │     Port 8000                    │
│                                     │    │                                  │
│  ┌──────────────────────────────┐  │    │  ┌────────────────────────────┐ │
│  │   API Routes                 │  │    │  │   AI Endpoints             │ │
│  │                              │  │    │  │                            │ │
│  │  GET  /api/designs          │  │    │  │  POST /api/ai/generate     │ │
│  │  POST /api/designs          │  │    │  │  POST /api/ai/enhance      │ │
│  │  PUT  /api/designs/:id      │  │    │  │  POST /api/ai/colors       │ │
│  │  DELETE /api/designs/:id    │  │    │  │  POST /api/ai/layout       │ │
│  │  POST /api/ai/generate      │◄─┼────┼─►│                            │ │
│  │  POST /api/ai/enhance       │  │    │  └────────────┬───────────────┘ │
│  │  POST /api/ai/colors        │  │    │               │                  │
│  └──────────────┬───────────────┘  │    │               │                  │
│                 │                   │    │               ↓                  │
│                 │                   │    │  ┌────────────────────────────┐ │
│                 ↓                   │    │  │   Gemini AI Integration    │ │
│  ┌──────────────────────────────┐  │    │  │                            │ │
│  │   Mongoose ODM               │  │    │  │  - Design generation       │ │
│  │                              │  │    │  │  - Color suggestions       │ │
│  │  - Design Schema             │  │    │  │  - Layout optimization     │ │
│  │  - Validation                │  │    │  │  - Enhancement             │ │
│  │  - Middleware                │  │    │  └────────────────────────────┘ │
│  └──────────────┬───────────────┘  │    │                                  │
└─────────────────┼────────────────────┘    └──────────────────────────────────┘
                  │
                  │ MongoDB Driver
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                            │
│                   mongodb://localhost:27017                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Database: cribble                                         │ │
│  │                                                            │ │
│  │  Collection: designs                                       │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  {                                                   │ │ │
│  │  │    _id: ObjectId,                                    │ │ │
│  │  │    userId: "user123",                                │ │ │
│  │  │    title: "Modern Tech Design",                      │ │ │
│  │  │    prompt: "create modern tech startup",             │ │ │
│  │  │    designData: {                                     │ │ │
│  │  │      headline: "TECH\nINNOVATION",                   │ │ │
│  │  │      elements: [...],                                │ │ │
│  │  │      colorPalette: [...],                            │ │ │
│  │  │      zoom: 100                                       │ │ │
│  │  │    },                                                │ │ │
│  │  │    tags: ["tech", "modern"],                         │ │ │
│  │  │    createdAt: ISODate,                               │ │ │
│  │  │    updatedAt: ISODate                                │ │ │
│  │  │  }                                                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Generate Design Flow

```
┌──────────┐
│  User    │
│  Types   │
│  Prompt  │
└────┬─────┘
     │
     ↓
┌─────────────────────────────────────────────────────────┐
│  React Frontend                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  generateDesignWithAI({                            │ │
│  │    prompt: "modern tech startup",                  │ │
│  │    style: "minimal",                               │ │
│  │    colorScheme: "vibrant",                         │ │
│  │    saveDesign: true                                │ │
│  │  })                                                │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ POST /api/ai/generate
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Express Backend                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  1. Receive request                                │ │
│  │  2. Forward to AI service                          │ │
│  │  3. Receive AI response                            │ │
│  │  4. Save to MongoDB (if requested)                 │ │
│  │  5. Return design + ID                             │ │
│  └────────────────────────────────────────────────────┘ │
└────────┬────────────────────────────────┬───────────────┘
         │                                │
         │ POST /api/ai/generate          │ Save to DB
         ↓                                ↓
┌──────────────────────────┐    ┌─────────────────┐
│  FastAPI AI Service      │    │  MongoDB        │
│  ┌────────────────────┐  │    │  ┌───────────┐  │
│  │  1. Parse prompt   │  │    │  │  designs  │  │
│  │  2. Call Gemini    │  │    │  │  collection│ │
│  │  3. Parse response │  │    │  └───────────┘  │
│  │  4. Format JSON    │  │    └─────────────────┘
│  │  5. Return design  │  │
│  └────────────────────┘  │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  Google Gemini API       │
│  ┌────────────────────┐  │
│  │  Generate design   │  │
│  │  based on prompt   │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### 2. Save Design Flow

```
┌──────────┐
│  User    │
│  Clicks  │
│  Save    │
└────┬─────┘
     │
     ↓
┌─────────────────────────────────────────────────────────┐
│  React Frontend                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  saveCanvasAsDesign(                               │ │
│  │    title: "My Design",                             │ │
│  │    designData: {                                   │ │
│  │      headline: "...",                              │ │
│  │      elements: [...],                              │ │
│  │      colorPalette: [...]                           │ │
│  │    },                                              │ │
│  │    userId: "user123"                               │ │
│  │  )                                                 │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ POST /api/designs
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Express Backend                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  1. Validate request                               │ │
│  │  2. Create Design document                         │ │
│  │  3. Save to MongoDB                                │ │
│  │  4. Return design with _id                         │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│  MongoDB                                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  db.designs.insertOne({                            │ │
│  │    userId: "user123",                              │ │
│  │    title: "My Design",                             │ │
│  │    designData: {...},                              │ │
│  │    createdAt: new Date(),                          │ │
│  │    updatedAt: new Date()                           │ │
│  │  })                                                │ │
│  │                                                    │ │
│  │  Returns: { _id: "6789abc...", ... }              │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3. Load Design Flow

```
┌──────────┐
│  User    │
│  Selects │
│  Design  │
└────┬─────┘
     │
     ↓
┌─────────────────────────────────────────────────────────┐
│  React Frontend                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  getDesignById("6789abc123def456")                 │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ GET /api/designs/:id
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Express Backend                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  1. Validate ID                                    │ │
│  │  2. Query MongoDB                                  │ │
│  │  3. Return design                                  │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│  MongoDB                                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │  db.designs.findOne({                              │ │
│  │    _id: ObjectId("6789abc123def456")               │ │
│  │  })                                                │ │
│  │                                                    │ │
│  │  Returns: { _id, userId, title, designData, ... } │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│  React Frontend                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  1. Receive design data                            │ │
│  │  2. Apply to canvas:                               │ │
│  │     - setCanvasElements(design.elements)           │ │
│  │     - setHeadline(design.headline)                 │ │
│  │     - setColorPalette(design.colorPalette)         │ │
│  │  3. Render on screen                               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND COMPONENTS                         │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Studio     │    │   Sidebar    │    │   TopBar     │      │
│  │   Page       │◄───┤              │◄───┤              │      │
│  │              │    │  - Home      │    │  - Search    │      │
│  │  - Canvas    │    │  - Explore   │    │  - Profile   │      │
│  │  - Toolbar   │    │  - Saved     │    │  - Create    │      │
│  │  - Chat      │    │  - Studio    │    └──────────────┘      │
│  │  - Layers    │    │  - Messages  │                          │
│  └──────┬───────┘    └──────────────┘                          │
│         │                                                       │
│         ↓                                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              API SERVICE LAYER                       │      │
│  │                                                      │      │
│  │  - generateDesignWithAI()                           │      │
│  │  - saveCanvasAsDesign()                             │      │
│  │  - getAllDesigns()                                  │      │
│  │  - getDesignById()                                  │      │
│  │  - updateDesign()                                   │      │
│  │  - deleteDesign()                                   │      │
│  │  - getColorSuggestions()                            │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                              │
│  React 19 + TypeScript + Tailwind CSS + Motion                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│  API LAYER                                                       │
│  Express.js + FastAPI                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                                            │
│  Mongoose ODM + Pydantic Validation                              │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                      │
│  MongoDB + Google Gemini AI                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Port Allocation

```
┌──────────────────────────────────────────────────────────┐
│  Port 3000  →  React Frontend (Vite Dev Server)         │
│  Port 4000  →  Express Backend (REST API)               │
│  Port 8000  →  FastAPI AI Service (Python)              │
│  Port 27017 →  MongoDB Database                         │
└──────────────────────────────────────────────────────────┘
```

## File Structure

```
Cribble/
│
├── Frontend (React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── apiService.ts  ←─┐
│   │   └── types/                │
│   └── package.json              │
│                                 │
├── Backend (Express)             │
│   ├── server.js  ←──────────────┤
│   ├── package.json              │
│   └── .env                      │
│                                 │
├── AI Service (FastAPI)          │
│   ├── main.py  ←─────────────────┘
│   ├── requirements.txt
│   └── .env
│
└── Documentation
    ├── ARCHITECTURE.md
    ├── SETUP_GUIDE.md
    ├── GEN_AI_FEATURES.md
    └── SYSTEM_DIAGRAM.md (this file)
```

---

**This diagram shows how all components work together to create a powerful AI-powered design platform!**
