# 🎨 AI Color Theme Recommender API

## Overview

A Flask-based REST API that uses **TF-IDF (Term Frequency-Inverse Document Frequency)** and **Cosine Similarity** to intelligently recommend color palettes based on natural language prompts.

## Features

- 🤖 **AI-Powered Matching**: Uses machine learning to understand user intent
- 🎯 **Smart Recommendations**: TF-IDF vectorization with cosine similarity
- 🎨 **10 Curated Palettes**: Professional color schemes for various industries
- 🔄 **Custom Generation**: Create palettes from any base color
- 🌓 **Light/Dark Variants**: Every palette includes theme variations
- 📊 **Confidence Scores**: Know how well the match fits your prompt

## Installation

### 1. Install Python Dependencies

```bash
cd api
pip install -r requirements.txt
```

Or using a virtual environment (recommended):

```bash
cd api
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Start the API Server

```bash
python app.py
```

The API will start at `http://localhost:5000`

## API Endpoints

### 1. Health Check

**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Color Theme Recommender API is running",
  "version": "1.0.0"
}
```

### 2. Recommend Palette

**POST** `/api/recommend`

Get AI-recommended palette based on a text prompt.

**Request:**
```json
{
  "prompt": "luxury skincare brand"
}
```

**Response:**
```json
{
  "success": true,
  "palette": {
    "id": "luxury-skincare",
    "name": "Luxury Skincare",
    "colors": ["#D4AF37", "#E8D5B7", "#F5E6D3", "#8B7355", "#4A4A4A"],
    "description": "Warm, earthy tones for premium beauty brands",
    "mood": "Elegant, Sophisticated, Natural",
    "useCases": ["Beauty", "Skincare", "Spa", "Luxury Retail"],
    "lightTheme": ["#FAF7F2", "#F5E6D3", "#E8D5B7", "#D4AF37", "#8B7355"],
    "darkTheme": ["#2C2416", "#4A4A4A", "#8B7355", "#D4AF37", "#E8D5B7"],
    "confidence": 0.85,
    "match_score": 85.0
  },
  "prompt": "luxury skincare brand"
}
```

### 3. Get All Palettes

**GET** `/api/palettes`

Retrieve all available palettes.

**Response:**
```json
{
  "success": true,
  "palettes": [...],
  "count": 10
}
```

### 4. Get Palette by ID

**GET** `/api/palette/<palette_id>`

Get a specific palette by its ID.

**Example:** `/api/palette/calm-ocean`

### 5. Generate Custom Palette

**POST** `/api/generate-custom`

Generate a custom palette from a base color using color theory.

**Request:**
```json
{
  "baseColor": "#FF5733",
  "name": "My Custom Palette",
  "count": 5
}
```

**Response:**
```json
{
  "success": true,
  "palette": {
    "id": "custom-1234",
    "name": "My Custom Palette",
    "colors": ["#FF5733", "#FF8A33", "#FFBD33", ...],
    "description": "Custom palette generated from #FF5733",
    "mood": "Custom, Unique, Personalized",
    "useCases": ["Custom Design", "Personal Project"],
    "lightTheme": [...],
    "darkTheme": [...]
  }
}
```

## How It Works

### AI Recommendation Algorithm

1. **TF-IDF Vectorization**
   - Each palette has rich keyword descriptions
   - TF-IDF converts text into numerical vectors
   - Captures importance of words across all palettes

2. **Cosine Similarity**
   - User prompt is vectorized using the same TF-IDF model
   - Cosine similarity measures angle between vectors
   - Higher similarity = better match

3. **Confidence Scoring**
   - Returns match confidence (0-1)
   - Low confidence triggers random selection
   - Ensures users always get a result

### Color Theory Generation

For custom palettes:
- Converts hex to HSV color space
- Generates harmonious colors by rotating hue
- Adjusts saturation and value for variety
- Creates balanced, professional palettes

## Example Prompts

### Industry-Specific
- `"tech startup with modern vibe"`
- `"healthcare app for seniors"`
- `"luxury fashion brand"`
- `"eco-friendly food company"`

### Mood-Based
- `"calm and trustworthy"`
- `"bold and energetic"`
- `"elegant and sophisticated"`
- `"playful and fun"`

### Style-Based
- `"minimalist design"`
- `"cyberpunk aesthetic"`
- `"natural and organic"`
- `"corporate professional"`

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Recommend palette
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "tech startup"}'

# Get all palettes
curl http://localhost:5000/api/palettes

# Generate custom palette
curl -X POST http://localhost:5000/api/generate-custom \
  -H "Content-Type: application/json" \
  -d '{"baseColor": "#6A37D4", "name": "Purple Dream", "count": 5}'
```

### Using Python

```python
import requests

# Recommend palette
response = requests.post('http://localhost:5000/api/recommend', 
    json={'prompt': 'luxury skincare brand'})
print(response.json())
```

## Dependencies

- **Flask**: Web framework
- **flask-cors**: Enable CORS for React frontend
- **numpy**: Numerical operations
- **scikit-learn**: TF-IDF and cosine similarity

## CORS Configuration

The API has CORS enabled for all origins, allowing your React frontend to make requests from any domain. In production, you should restrict this:

```python
CORS(app, origins=['http://localhost:3000'])
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `404`: Resource not found
- `500`: Internal server error

## Performance

- **Fast**: TF-IDF matrix pre-computed on startup
- **Efficient**: Cosine similarity is O(n) where n = number of palettes
- **Scalable**: Can handle hundreds of requests per second

## Future Enhancements

- [ ] Add more palettes to the database
- [ ] Implement palette caching
- [ ] Add user feedback to improve recommendations
- [ ] Support for gradient generation
- [ ] Color accessibility scoring
- [ ] Integration with color APIs (Colormind, Coolors)

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:

```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### CORS Issues

Make sure flask-cors is installed:

```bash
pip install flask-cors
```

### Import Errors

Ensure all dependencies are installed:

```bash
pip install -r requirements.txt
```

## License

Apache-2.0

---

**Ready to power your color recommendations with AI!** 🚀
