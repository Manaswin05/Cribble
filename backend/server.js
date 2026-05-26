/**
 * Cribble Backend Server - Express + MongoDB
 */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cribble';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Mongoose Schema ---

const designElementSchema = new mongoose.Schema({
  id: Number,
  type: { type: String, enum: ['square', 'circle', 'text'] },
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  color: String,
  text: String
}, { _id: false });

const designSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default-user'
  },
  title: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    default: ''
  },
  designData: {
    headline: String,
    elements: [designElementSchema],
    zoom: { type: Number, default: 100 },
    canvasWidth: { type: Number, default: 720 },
    canvasHeight: { type: Number, default: 480 },
    colorPalette: [String],
    premium: { type: Boolean, default: false },
    price: String
  },
  thumbnail: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
designSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Design = mongoose.model('Design', designSchema);

// --- API Routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Cribble Backend',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Get all designs
app.get('/api/designs', async (req, res) => {
  try {
    const { userId, limit = 50, skip = 0 } = req.query;
    const query = userId ? { userId } : {};
    
    const designs = await Design.find(query)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json({
      success: true,
      count: designs.length,
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get design by ID
app.get('/api/designs/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    res.json({
      success: true,
      design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new design
app.post('/api/designs', async (req, res) => {
  try {
    const design = new Design(req.body);
    await design.save();
    
    res.status(201).json({
      success: true,
      message: 'Design created successfully',
      design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update design
app.put('/api/designs/:id', async (req, res) => {
  try {
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Design updated successfully',
      design
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete design
app.delete('/api/designs/:id', async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get designs by user
app.get('/api/designs/user/:userId', async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.params.userId })
      .sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      count: designs.length,
      designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// --- AI Integration Routes ---

// Generate design using AI
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, style, colorScheme, userId, saveDesign } = req.body;
    
    // Call FastAPI AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/ai/generate`, {
      prompt,
      style: style || 'modern',
      colorScheme: colorScheme || 'vibrant'
    });
    
    const designData = aiResponse.data;
    
    // Optionally save to database
    if (saveDesign) {
      const design = new Design({
        userId: userId || 'default-user',
        title: prompt.substring(0, 50),
        prompt,
        designData: designData.design,
        tags: [style, colorScheme].filter(Boolean)
      });
      
      await design.save();
      
      return res.json({
        success: true,
        design: designData.design,
        saved: true,
        designId: design._id
      });
    }
    
    res.json({
      success: true,
      design: designData.design,
      saved: false
    });
  } catch (error) {
    console.error('AI generation error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Enhance existing design
app.post('/api/ai/enhance/:id', async (req, res) => {
  try {
    const { enhancementPrompt } = req.body;
    const design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    // Call AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/ai/enhance`, {
      currentDesign: design.designData,
      enhancementPrompt
    });
    
    res.json({
      success: true,
      suggestions: aiResponse.data.suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get color suggestions
app.post('/api/ai/colors', async (req, res) => {
  try {
    const { prompt, count } = req.body;
    
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/ai/suggest-colors`, {
      prompt,
      count: count || 5
    });
    
    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// --- Error Handling ---

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cribble Backend running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
  console.log(`🤖 AI Service: ${AI_SERVICE_URL}`);
});
