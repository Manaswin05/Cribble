"""
Cribble AI Service - FastAPI backend for AI-powered design generation
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Cribble AI Service", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class DesignElement(BaseModel):
    id: int
    type: str  # 'square', 'circle', 'text'
    x: float
    y: float
    width: float
    height: float
    color: str
    text: Optional[str] = None

class GenerateDesignRequest(BaseModel):
    prompt: str
    style: Optional[str] = "modern"
    colorScheme: Optional[str] = "vibrant"

class GenerateDesignResponse(BaseModel):
    success: bool
    design: Dict[str, Any]
    prompt: str
    message: str

class EnhanceDesignRequest(BaseModel):
    currentDesign: Dict[str, Any]
    enhancementPrompt: str

class ColorSuggestionRequest(BaseModel):
    prompt: str
    count: int = 5

class LayoutSuggestionRequest(BaseModel):
    prompt: str
    canvasWidth: int = 720
    canvasHeight: int = 480

# --- Helper Functions ---

def parse_ai_design_response(ai_text: str, prompt: str) -> Dict[str, Any]:
    """
    Parse AI response and convert to Cribble design JSON format
    """
    # Try to extract JSON if present
    try:
        # Look for JSON in the response
        start_idx = ai_text.find('{')
        end_idx = ai_text.rfind('}') + 1
        if start_idx != -1 and end_idx > start_idx:
            json_str = ai_text[start_idx:end_idx]
            design_data = json.loads(json_str)
            return design_data
    except:
        pass
    
    # Fallback: Create a simple design based on keywords
    elements = []
    colors = ['#6a37d4', '#ae8dff', '#65e1ff', '#ff6b9d', '#ffd93d']
    
    # Analyze prompt for design elements
    prompt_lower = prompt.lower()
    
    # Add background elements
    if 'minimal' in prompt_lower or 'clean' in prompt_lower:
        elements.append({
            "id": 1,
            "type": "square",
            "x": 50,
            "y": 50,
            "width": 200,
            "height": 200,
            "color": colors[0]
        })
    
    if 'circle' in prompt_lower or 'round' in prompt_lower:
        elements.append({
            "id": 2,
            "type": "circle",
            "x": 300,
            "y": 100,
            "width": 150,
            "height": 150,
            "color": colors[1]
        })
    
    # Add text element
    headline = "CREATIVE\nDESIGN"
    if 'tech' in prompt_lower:
        headline = "TECH\nINNOVATION"
    elif 'art' in prompt_lower:
        headline = "ARTISTIC\nVISION"
    elif 'minimal' in prompt_lower:
        headline = "MINIMAL\nELEGANCE"
    
    elements.append({
        "id": 3,
        "type": "text",
        "x": 100,
        "y": 300,
        "width": 300,
        "height": 80,
        "color": "#2f2e2e",
        "text": headline
    })
    
    return {
        "headline": headline,
        "elements": elements,
        "zoom": 100,
        "canvasWidth": 720,
        "canvasHeight": 480,
        "colorPalette": colors[:3],
        "premium": False
    }

async def generate_with_gemini(prompt: str, system_instruction: str) -> str:
    """
    Generate content using Gemini API
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    
    try:
        model = genai.GenerativeModel(
            model_name='gemini-2.0-flash-exp',
            system_instruction=system_instruction
        )
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")

# --- API Endpoints ---

@app.get("/")
async def root():
    return {
        "service": "Cribble AI Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "generate": "/api/ai/generate",
            "enhance": "/api/ai/enhance",
            "colors": "/api/ai/suggest-colors",
            "layout": "/api/ai/suggest-layout"
        }
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY)
    }

@app.post("/api/ai/generate", response_model=GenerateDesignResponse)
async def generate_design(request: GenerateDesignRequest):
    """
    Generate a complete design from a text prompt using AI
    """
    try:
        system_instruction = """You are a professional design AI that creates JSON design specifications for a canvas-based design tool called Cribble.

Given a user prompt, generate a design with:
- A headline (2-3 words, uppercase, can use \\n for line breaks)
- Canvas elements (squares, circles, text)
- Color palette (hex colors)
- Layout that matches the prompt's style and mood

Return ONLY valid JSON in this exact format:
{
  "headline": "DESIGN\\nTITLE",
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
  "colorPalette": ["#6a37d4", "#ae8dff", "#65e1ff"],
  "premium": false
}

Element types: "square", "circle", "text" (text elements need a "text" field)
Coordinates: x, y are positions, width and height are sizes
Colors: Use hex format (#RRGGBB)
"""
        
        full_prompt = f"""Create a design for: "{request.prompt}"
Style: {request.style}
Color scheme: {request.colorScheme}

Generate a creative, visually appealing design with 3-5 elements."""
        
        ai_response = await generate_with_gemini(full_prompt, system_instruction)
        design_data = parse_ai_design_response(ai_response, request.prompt)
        
        return GenerateDesignResponse(
            success=True,
            design=design_data,
            prompt=request.prompt,
            message="Design generated successfully"
        )
    
    except Exception as e:
        # Fallback to rule-based generation
        design_data = parse_ai_design_response("", request.prompt)
        return GenerateDesignResponse(
            success=True,
            design=design_data,
            prompt=request.prompt,
            message=f"Design generated with fallback (AI unavailable: {str(e)})"
        )

@app.post("/api/ai/enhance")
async def enhance_design(request: EnhanceDesignRequest):
    """
    Enhance an existing design based on user feedback
    """
    try:
        system_instruction = """You are a design enhancement AI. Given a current design and enhancement request, suggest modifications.
Return JSON with suggested changes to elements, colors, or layout."""
        
        prompt = f"""Current design: {json.dumps(request.currentDesign)}
Enhancement request: {request.enhancementPrompt}

Suggest specific improvements."""
        
        ai_response = await generate_with_gemini(prompt, system_instruction)
        
        return {
            "success": True,
            "suggestions": ai_response,
            "message": "Enhancement suggestions generated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/suggest-colors")
async def suggest_colors(request: ColorSuggestionRequest):
    """
    Generate AI-powered color palette suggestions
    """
    try:
        system_instruction = """You are a color theory expert. Generate harmonious color palettes in hex format.
Return ONLY a JSON array of hex colors, nothing else.
Example: ["#6a37d4", "#ae8dff", "#65e1ff", "#ff6b9d", "#ffd93d"]"""
        
        prompt = f"""Generate a {request.count}-color palette for: "{request.prompt}"
Consider color theory, harmony, and the mood of the prompt."""
        
        ai_response = await generate_with_gemini(prompt, system_instruction)
        
        # Parse colors from response
        try:
            colors = json.loads(ai_response)
        except:
            # Fallback colors
            colors = ['#6a37d4', '#ae8dff', '#65e1ff', '#ff6b9d', '#ffd93d'][:request.count]
        
        return {
            "success": True,
            "colors": colors,
            "prompt": request.prompt
        }
    except Exception as e:
        # Fallback color palette
        fallback_colors = ['#6a37d4', '#ae8dff', '#65e1ff', '#ff6b9d', '#ffd93d']
        return {
            "success": True,
            "colors": fallback_colors[:request.count],
            "prompt": request.prompt,
            "message": f"Fallback colors (AI unavailable: {str(e)})"
        }

@app.post("/api/ai/suggest-layout")
async def suggest_layout(request: LayoutSuggestionRequest):
    """
    Generate layout suggestions based on design principles
    """
    try:
        system_instruction = """You are a layout design expert. Suggest element positions and sizes for a canvas.
Return JSON with layout suggestions following design principles (rule of thirds, balance, hierarchy)."""
        
        prompt = f"""Canvas: {request.canvasWidth}x{request.canvasHeight}
Design prompt: "{request.prompt}"

Suggest optimal layout with element positions."""
        
        ai_response = await generate_with_gemini(prompt, system_instruction)
        
        return {
            "success": True,
            "layout": ai_response,
            "prompt": request.prompt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
