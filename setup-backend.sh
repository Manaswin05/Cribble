#!/bin/bash

echo "========================================"
echo "Cribble Backend Setup (Unix/Mac)"
echo "========================================"
echo ""

echo "[1/4] Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
echo ""

echo "[2/4] Setting up Backend Environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file - Please add your configuration"
else
    echo ".env file already exists"
fi
echo ""

echo "[3/4] Installing AI Service Dependencies..."
cd ../ai-service
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install AI service dependencies"
    echo "Make sure Python and pip are installed"
    exit 1
fi
echo ""

echo "[4/4] Setting up AI Service Environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file - Please add your Gemini API key"
else
    echo ".env file already exists"
fi
echo ""

cd ..
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running (mongod)"
echo "2. Add your Gemini API key to ai-service/.env"
echo "3. Run: npm run dev:all"
echo ""
