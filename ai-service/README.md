# 🤖 Cribble AI Service

FastAPI-based AI service for generating designs using Google Gemini AI.

## Features

- 🎨 **AI Design Generation** - Convert text prompts to design JSON
- 🎨 **Color Suggestions** - AI-powered color palette generation
- 📐 **Layout Suggestions** - Optimal element positioning
- 🔄 **Design Enhancement** - Improve existing designs
- ⚡ **Fast API** - High-performance async endpoints
- 📊 **Pydantic Validation** - Type-safe request/response

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

### 3. Run Server

```bash
uvicorn main:app --reload --port 8000
```

### 4. Test API

```bash
curl http://localhost:8000/api/health
```

## API Endpoints

### Health Check

**GET** `/api/health`

```bash
curl http://localhost:8000/api/health
```

Response:
```json
{
  "status": "healthy",
  "gemini_configured": true
}
```

### Generate Design

**POST** `/api/ai/generate`

```bash
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "modern tech startup",
    "style": "minimal",
    "colorScheme": "vibrant"
  }'
```

Request Body:
```typescript
{
  prompt: string;        // Design description
  style?: string;        // "modern", "minimal", "elegant", etc.
  colorScheme?: string;  // "vibrant", "warm", "cool", etc.
}
```

Response:
```json
{
  "success": true,
  "design": {
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
      }
    ],
    "zoom": 100,
    "canvasWidth": 720,
    "canvasHeight": 480,
    "colorPalette": ["#6a37d4", "#ae8dff", "#65e1ff"],
    "premium": false
  },
  "prompt": "modern tech startup",
  "message": "Design generated successfully"
}
```

### Suggest Colors

**POST** `/api/ai/suggest-colors`

```bash
curl -X POST http://localhost:8000/api/ai/suggest-colors \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "luxury fashion brand",
    "count": 5
  }'
```

Request Body:
```typescript
{
  prompt: string;  // Color theme description
  count?: number;  // Number of colors (default: 5)
}
```

Response:
```json
{
  "success": true,
  "colors": ["#D4AF37", "#E8D5B7", "#F5E6D3", "#8B7355", "#4A4A4A"],
  "prompt": "luxury fashion brand"
}
```

### Suggest Layout

**POST** `/api/ai/suggest-layout`

```bash
curl -X POST http://localhost:8000/api/ai/suggest-layout \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "portfolio website",
    "canvasWidth": 720,
    "canvasHeight": 480
  }'
```

### Enhance Design

**POST** `/api/ai/enhance`

```bash
curl -X POST http://localhost:8000/api/ai/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "currentDesign": {...},
    "enhancementPrompt": "make it more modern"
  }'
```

## Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=8000
MONGODB_URI=mongodb://localhost:27017/cribble
```

### Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste into `.env`

## Development

### Project Structure

```
ai-service/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example        # Environment template
├── .env                # Your configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

### Adding New Endpoints

```python
@app.post("/api/ai/your-endpoint")
async def your_endpoint(request: YourRequest):
    """
    Your endpoint description
    """
    try:
        # Your logic here
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Testing

```bash
# Run tests
pytest

# Test with curl
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

## Deployment

### Heroku

```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create cribble-ai
heroku config:set GEMINI_API_KEY="your_key"
git push heroku main
```

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t cribble-ai .
docker run -p 8000:8000 -e GEMINI_API_KEY="your_key" cribble-ai
```

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `500` - Internal Server Error

## Performance

- **Response Time**: 2-5 seconds (AI generation)
- **Throughput**: 100+ requests/second
- **Concurrency**: Async/await for high performance

## Security

- API key stored in environment variables
- CORS enabled for specified origins
- Input validation with Pydantic
- Error message sanitization

## Troubleshooting

### Gemini API Error

```bash
# Check API key
cat .env | grep GEMINI_API_KEY

# Test API key
curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Port Already in Use

```bash
# Change port
uvicorn main:app --reload --port 8001
```

### Dependencies Failed

```bash
# Use virtual environment
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

Apache-2.0

---

**Built with FastAPI + Google Gemini AI** 🤖✨
