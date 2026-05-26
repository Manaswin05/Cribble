#!/bin/bash

echo "🎨 Setting up AI Color Theme Recommender API..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Navigate to api directory
cd api

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the API server:"
echo "  1. cd api"
echo "  2. source venv/bin/activate  (or venv\\Scripts\\activate on Windows)"
echo "  3. python app.py"
echo ""
echo "The API will be available at: http://localhost:5000"
