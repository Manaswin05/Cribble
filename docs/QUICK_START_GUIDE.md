# 🚀 Quick Start Guide - AI Color Recommender

## 5-Minute Setup

### Step 1: Install Python Dependencies (2 min)

**Windows:**
```bash
setup-api.bat
```

**macOS/Linux:**
```bash
chmod +x setup-api.sh
./setup-api.sh
```

### Step 2: Start Flask API (1 min)

```bash
cd api
python app.py
```

✅ You should see: `🎨 Color Theme Recommender API Starting...`

### Step 3: Start React App (1 min)

**New terminal:**
```bash
npm run dev
```

✅ App opens at: `http://localhost:3000`

### Step 4: Test It! (1 min)

1. Go to **Studio** tab
2. Type in chat: `"suggest color theme for tech startup"`
3. Watch the magic! 🎨

---

## Example Commands

Try these in the chat:

```
"color theme for luxury brand"
"suggest palette for healthcare app"
"generate colors for food blog"
"recommend theme for gaming website"
"palette for minimalist design"
```

---

## What You Get

✅ AI-powered recommendations (TF-IDF + ML)
✅ 10 professional palettes
✅ Light & Dark mode variants
✅ Copy hex codes with one click
✅ Export as CSS, Tailwind, or JSON
✅ Confidence scores for each match

---

## Troubleshooting

### API not working?
```bash
# Check if running
curl http://localhost:5000/api/health

# Should return: {"status": "healthy"}
```

### Still not working?
Check the console (F12) for error messages.

---

## Next Steps

📖 Read `FLASK_API_INTEGRATION.md` for detailed docs
🧪 Run tests from `TEST_COLOR_API.md`
🎨 Customize palettes in `api/app.py`

---

**That's it! You're ready to go!** 🎉
