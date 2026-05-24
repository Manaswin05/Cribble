# 🧪 Testing the AI Color Recommender API

## Pre-Test Checklist

- [ ] Python 3.8+ installed
- [ ] Flask API dependencies installed (`pip install -r api/requirements.txt`)
- [ ] Flask API running on port 5000
- [ ] React app running on port 3000

## Test Suite

### Test 1: API Health Check ✅

**Purpose:** Verify the API is running

**Steps:**
1. Open terminal
2. Run:
   ```bash
   curl http://localhost:5000/api/health
   ```

**Expected Result:**
```json
{
  "status": "healthy",
  "message": "Color Theme Recommender API is running",
  "version": "1.0.0"
}
```

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 2: AI Recommendation - Tech Startup 🚀

**Purpose:** Test AI matching for tech industry

**Steps:**
1. Open browser to `http://localhost:3000`
2. Navigate to **Studio** tab
3. In chat, type: `"suggest color theme for tech startup"`
4. Press Enter

**Expected Result:**
- Modal opens with **"Bold Startup Energy"** palette
- Colors: Orange, Yellow, Blue tones
- Console shows: `✅ AI Match: Bold Startup Energy (XX% confidence)`

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 3: AI Recommendation - Healthcare 🏥

**Purpose:** Test AI matching for healthcare industry

**Steps:**
1. In chat, type: `"color theme for healthcare app"`
2. Press Enter

**Expected Result:**
- Modal opens with **"Calm Ocean Morning"** palette
- Colors: Blue tones
- High confidence score (>80%)

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 4: AI Recommendation - Luxury Brand 💎

**Purpose:** Test AI matching for luxury industry

**Steps:**
1. In chat, type: `"palette for luxury skincare brand"`
2. Press Enter

**Expected Result:**
- Modal opens with **"Luxury Skincare"** palette
- Colors: Gold, Beige, Brown tones
- High confidence score

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 5: Copy Color Functionality 📋

**Purpose:** Test color copying feature

**Steps:**
1. Generate any palette
2. Click on a color swatch
3. Check clipboard

**Expected Result:**
- Hex code copied to clipboard
- Check icon appears briefly
- Can paste the hex code (e.g., `#6A37D4`)

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 6: Light/Dark Mode Toggle 🌓

**Purpose:** Test theme switching

**Steps:**
1. Generate any palette
2. Click **"Dark"** button
3. Observe color changes
4. Click **"Light"** button

**Expected Result:**
- Colors change between light and dark variants
- Smooth transition
- Preview updates accordingly

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 7: Export as CSS 📄

**Purpose:** Test CSS export functionality

**Steps:**
1. Generate any palette
2. Select **"CSS"** format
3. Click **"Download as CSS"**
4. Open downloaded file

**Expected Result:**
- File downloads: `palette-name-light.css`
- Contains CSS variables:
  ```css
  :root {
    --color-1: #...;
    --color-primary: #...;
  }
  ```

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 8: Export as Tailwind ⚡

**Purpose:** Test Tailwind export functionality

**Steps:**
1. Generate any palette
2. Select **"TAILWIND"** format
3. Click **"Download as TAILWIND"**
4. Open downloaded file

**Expected Result:**
- File downloads: `tailwind.config.js`
- Contains valid Tailwind config
- Has color definitions

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 9: Export as JSON 📊

**Purpose:** Test JSON export functionality

**Steps:**
1. Generate any palette
2. Select **"JSON"** format
3. Click **"Download as JSON"**
4. Open downloaded file

**Expected Result:**
- File downloads: `palette-name-palette.json`
- Valid JSON format
- Contains all palette data

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 10: Fallback Mechanism 🔄

**Purpose:** Test local fallback when API is down

**Steps:**
1. Stop the Flask API (Ctrl+C)
2. In chat, type: `"suggest color theme for gaming"`
3. Check browser console

**Expected Result:**
- Console shows: `⚠️ API unavailable, using local matching`
- Palette still generates (using local keywords)
- No errors or crashes

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 11: Multiple Requests 🔁

**Purpose:** Test API can handle multiple requests

**Steps:**
1. Ensure API is running
2. Quickly type these commands:
   - `"tech startup"`
   - `"healthcare"`
   - `"luxury brand"`
   - `"gaming"`
3. Observe responses

**Expected Result:**
- All requests complete successfully
- No errors or timeouts
- Each returns appropriate palette

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 12: Edge Cases 🎯

**Purpose:** Test unusual inputs

**Test Cases:**

#### 12a: Empty Prompt
- Input: `"color theme"`
- Expected: Returns a random palette

#### 12b: Very Long Prompt
- Input: `"suggest a color theme for a luxury high-end premium sophisticated elegant modern minimalist tech startup in the healthcare industry"`
- Expected: Returns best match based on keywords

#### 12c: Nonsense Prompt
- Input: `"asdfghjkl"`
- Expected: Returns a random palette

#### 12d: Special Characters
- Input: `"color theme for @#$%"`
- Expected: Handles gracefully, returns palette

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 13: API Direct Testing 🔧

**Purpose:** Test API endpoints directly

**Test 13a: Recommend Endpoint**
```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "tech startup"}'
```

**Expected:** JSON response with palette

**Test 13b: Get All Palettes**
```bash
curl http://localhost:5000/api/palettes
```

**Expected:** JSON array with 10 palettes

**Test 13c: Get Specific Palette**
```bash
curl http://localhost:5000/api/palette/calm-ocean
```

**Expected:** JSON with Calm Ocean palette

**Test 13d: Generate Custom**
```bash
curl -X POST http://localhost:5000/api/generate-custom \
  -H "Content-Type: application/json" \
  -d '{"baseColor": "#FF5733", "name": "Test", "count": 5}'
```

**Expected:** JSON with custom generated palette

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 14: Performance Test ⚡

**Purpose:** Measure response times

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Generate a palette
4. Check request timing

**Expected Result:**
- API response time: < 200ms
- Total time (including render): < 500ms
- No memory leaks

**Status:** ⬜ Pass / ⬜ Fail

---

### Test 15: Mobile Responsiveness 📱

**Purpose:** Test on mobile viewport

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or Android device
4. Generate a palette

**Expected Result:**
- Modal fits screen
- All buttons accessible
- Colors display properly
- Can scroll if needed

**Status:** ⬜ Pass / ⬜ Fail

---

## Automated Testing Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

echo "🧪 Running API Tests..."
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
curl -s http://localhost:5000/api/health | grep -q "healthy" && echo "✅ PASS" || echo "❌ FAIL"

# Test 2: Recommend
echo "Test 2: Recommend Palette"
curl -s -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"prompt": "tech startup"}' | grep -q "success" && echo "✅ PASS" || echo "❌ FAIL"

# Test 3: Get All Palettes
echo "Test 3: Get All Palettes"
curl -s http://localhost:5000/api/palettes | grep -q "palettes" && echo "✅ PASS" || echo "❌ FAIL"

# Test 4: Get Specific Palette
echo "Test 4: Get Specific Palette"
curl -s http://localhost:5000/api/palette/calm-ocean | grep -q "Calm Ocean" && echo "✅ PASS" || echo "❌ FAIL"

# Test 5: Generate Custom
echo "Test 5: Generate Custom Palette"
curl -s -X POST http://localhost:5000/api/generate-custom \
  -H "Content-Type: application/json" \
  -d '{"baseColor": "#FF5733"}' | grep -q "custom" && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "🎉 Tests Complete!"
```

Run with: `chmod +x test-api.sh && ./test-api.sh`

---

## Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Health Check | ⬜ | |
| 2. Tech Startup | ⬜ | |
| 3. Healthcare | ⬜ | |
| 4. Luxury Brand | ⬜ | |
| 5. Copy Color | ⬜ | |
| 6. Light/Dark Toggle | ⬜ | |
| 7. Export CSS | ⬜ | |
| 8. Export Tailwind | ⬜ | |
| 9. Export JSON | ⬜ | |
| 10. Fallback | ⬜ | |
| 11. Multiple Requests | ⬜ | |
| 12. Edge Cases | ⬜ | |
| 13. API Direct | ⬜ | |
| 14. Performance | ⬜ | |
| 15. Mobile | ⬜ | |

---

## Common Issues & Solutions

### Issue: API not responding
**Solution:** Check if Flask is running on port 5000

### Issue: CORS errors
**Solution:** Verify flask-cors is installed

### Issue: Wrong palette returned
**Solution:** Check console for confidence score, may need to improve prompt

### Issue: Modal not opening
**Solution:** Check browser console for errors

---

**Happy Testing!** 🎉

Report any issues or unexpected behavior.
