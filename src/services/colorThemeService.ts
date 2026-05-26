// Color Theme Recommender Service
// Inspired by HueNova's intelligent palette generation
// Connected to Flask AI API for intelligent recommendations

const API_BASE_URL = 'http://localhost:5000/api';

export interface ColorPalette {
  id?: string;
  name: string;
  colors: string[];
  description: string;
  mood: string;
  useCases: string[];
  lightTheme?: string[];
  darkTheme?: string[];
  confidence?: number;
  match_score?: number;
}

const themeDatabase: Record<string, ColorPalette> = {
  'calm-ocean': {
    name: 'Calm Ocean Morning',
    colors: ['#0077BE', '#4A90A4', '#87CEEB', '#B0E0E6', '#E0F6FF'],
    description: 'Serene blues inspired by peaceful ocean waters',
    mood: 'Calm, Professional, Trustworthy',
    useCases: ['Healthcare', 'Finance', 'Corporate', 'Wellness'],
    lightTheme: ['#E0F6FF', '#B0E0E6', '#87CEEB', '#4A90A4', '#0077BE'],
    darkTheme: ['#001F3F', '#003D5C', '#0077BE', '#4A90A4', '#87CEEB']
  },
  'bold-startup': {
    name: 'Bold Startup Energy',
    colors: ['#FF6B35', '#F7931E', '#FDC830', '#37B7C3', '#088395'],
    description: 'Vibrant and energetic palette for modern brands',
    mood: 'Bold, Energetic, Innovative',
    useCases: ['Startups', 'Tech', 'Marketing', 'Creative Agencies'],
    lightTheme: ['#FFF8E7', '#FDC830', '#F7931E', '#FF6B35', '#088395'],
    darkTheme: ['#1A1A2E', '#16213E', '#FF6B35', '#F7931E', '#37B7C3']
  },
  'luxury-skincare': {
    name: 'Luxury Skincare',
    colors: ['#D4AF37', '#E8D5B7', '#F5E6D3', '#8B7355', '#4A4A4A'],
    description: 'Warm, earthy tones for premium beauty brands',
    mood: 'Elegant, Sophisticated, Natural',
    useCases: ['Beauty', 'Skincare', 'Spa', 'Luxury Retail'],
    lightTheme: ['#FAF7F2', '#F5E6D3', '#E8D5B7', '#D4AF37', '#8B7355'],
    darkTheme: ['#2C2416', '#4A4A4A', '#8B7355', '#D4AF37', '#E8D5B7']
  },
  'minimalist-modern': {
    name: 'Minimalist Modern',
    colors: ['#2F2E2E', '#6A37D4', '#AE8DFF', '#E5E5E5', '#FFFFFF'],
    description: 'Clean and contemporary with purple accents',
    mood: 'Modern, Clean, Professional',
    useCases: ['SaaS', 'Portfolio', 'Design Studios', 'Tech'],
    lightTheme: ['#FFFFFF', '#F9F6F5', '#E5E5E5', '#6A37D4', '#2F2E2E'],
    darkTheme: ['#1A1A1A', '#2F2E2E', '#6A37D4', '#AE8DFF', '#E5E5E5']
  },
  'nature-green': {
    name: 'Natural Growth',
    colors: ['#2D5016', '#4A7C2C', '#6B9F3E', '#A8D08D', '#E8F5E9'],
    description: 'Fresh greens inspired by nature and growth',
    mood: 'Fresh, Organic, Sustainable',
    useCases: ['Eco-friendly', 'Food', 'Agriculture', 'Sustainability'],
    lightTheme: ['#F1F8E9', '#E8F5E9', '#A8D08D', '#6B9F3E', '#4A7C2C'],
    darkTheme: ['#1B2A0F', '#2D5016', '#4A7C2C', '#6B9F3E', '#A8D08D']
  },
  'sunset-warm': {
    name: 'Sunset Warmth',
    colors: ['#FF6B6B', '#FF8E53', '#FFA07A', '#FFD93D', '#FFF4E6'],
    description: 'Warm sunset colors that evoke comfort',
    mood: 'Warm, Inviting, Friendly',
    useCases: ['Food & Beverage', 'Hospitality', 'Events', 'Social'],
    lightTheme: ['#FFF4E6', '#FFD93D', '#FFA07A', '#FF8E53', '#FF6B6B'],
    darkTheme: ['#2C1810', '#4A2C1A', '#FF6B6B', '#FF8E53', '#FFA07A']
  },
  'cyberpunk-neon': {
    name: 'Cyberpunk Neon',
    colors: ['#0A0E27', '#6C63FF', '#FF006E', '#00F5FF', '#FFBE0B'],
    description: 'Futuristic neon colors for tech-forward brands',
    mood: 'Futuristic, Bold, Tech-savvy',
    useCases: ['Gaming', 'Tech', 'Entertainment', 'NFT'],
    lightTheme: ['#F0F0FF', '#FFBE0B', '#00F5FF', '#6C63FF', '#FF006E'],
    darkTheme: ['#0A0E27', '#1A1F3A', '#6C63FF', '#FF006E', '#00F5FF']
  },
  'pastel-soft': {
    name: 'Soft Pastels',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    description: 'Gentle pastel colors for a soft aesthetic',
    mood: 'Gentle, Playful, Approachable',
    useCases: ['Children', 'Education', 'Lifestyle', 'Fashion'],
    lightTheme: ['#FFFEF9', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#FFB3BA'],
    darkTheme: ['#2A2A2A', '#3A3A3A', '#FFB3BA', '#BAFFC9', '#BAE1FF']
  },
  'corporate-blue': {
    name: 'Corporate Professional',
    colors: ['#003366', '#0066CC', '#3399FF', '#66B2FF', '#E6F2FF'],
    description: 'Traditional corporate blues for business',
    mood: 'Professional, Trustworthy, Stable',
    useCases: ['Corporate', 'Finance', 'Legal', 'Consulting'],
    lightTheme: ['#F5F9FF', '#E6F2FF', '#66B2FF', '#0066CC', '#003366'],
    darkTheme: ['#001A33', '#003366', '#0066CC', '#3399FF', '#66B2FF']
  },
  'monochrome-elegant': {
    name: 'Monochrome Elegance',
    colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'],
    description: 'Timeless black and white with grays',
    mood: 'Elegant, Timeless, Sophisticated',
    useCases: ['Fashion', 'Photography', 'Architecture', 'Luxury'],
    lightTheme: ['#FFFFFF', '#F5F5F5', '#CCCCCC', '#666666', '#000000'],
    darkTheme: ['#000000', '#1A1A1A', '#333333', '#666666', '#999999']
  }
};

const moodKeywords: Record<string, string[]> = {
  'calm-ocean': ['calm', 'peaceful', 'serene', 'ocean', 'water', 'blue', 'trust', 'professional', 'healthcare', 'medical'],
  'bold-startup': ['bold', 'energetic', 'vibrant', 'startup', 'tech', 'modern', 'innovative', 'creative', 'dynamic'],
  'luxury-skincare': ['luxury', 'elegant', 'premium', 'skincare', 'beauty', 'spa', 'warm', 'earthy', 'natural', 'gold'],
  'minimalist-modern': ['minimalist', 'modern', 'clean', 'simple', 'purple', 'contemporary', 'design', 'portfolio'],
  'nature-green': ['nature', 'green', 'eco', 'organic', 'sustainable', 'fresh', 'growth', 'environment', 'plant'],
  'sunset-warm': ['warm', 'sunset', 'orange', 'red', 'friendly', 'inviting', 'food', 'hospitality', 'cozy'],
  'cyberpunk-neon': ['cyberpunk', 'neon', 'futuristic', 'tech', 'gaming', 'digital', 'electric', 'vibrant', 'dark'],
  'pastel-soft': ['pastel', 'soft', 'gentle', 'cute', 'playful', 'children', 'education', 'light', 'sweet'],
  'corporate-blue': ['corporate', 'business', 'professional', 'finance', 'legal', 'formal', 'traditional', 'blue'],
  'monochrome-elegant': ['monochrome', 'black', 'white', 'gray', 'elegant', 'timeless', 'fashion', 'minimal', 'classic']
};

// API Functions

/**
 * Generate color theme using AI API
 * Falls back to local matching if API is unavailable
 */
export async function generateColorTheme(prompt: string): Promise<ColorPalette> {
  try {
    // Try to use the AI API first
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.palette) {
        console.log(`✅ AI Match: ${data.palette.name} (${Math.round(data.palette.match_score || 0)}% confidence)`);
        return data.palette;
      }
    }
    
    // Fallback to local matching if API fails
    console.warn('⚠️ API unavailable, using local matching');
    return generateColorThemeLocal(prompt);
  } catch (error) {
    console.warn('⚠️ API error, using local matching:', error);
    return generateColorThemeLocal(prompt);
  }
}

/**
 * Local fallback function (original keyword-based implementation)
 */
function generateColorThemeLocal(prompt: string): ColorPalette {
  const lowerPrompt = prompt.toLowerCase();
  
  // Score each theme based on keyword matches
  const scores: Record<string, number> = {};
  
  for (const [themeKey, keywords] of Object.entries(moodKeywords)) {
    scores[themeKey] = 0;
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        scores[themeKey] += 1;
      }
    }
  }
  
  // Find the theme with the highest score
  let bestTheme = 'minimalist-modern'; // default
  let highestScore = 0;
  
  for (const [themeKey, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestTheme = themeKey;
    }
  }
  
  // If no matches, use random theme
  if (highestScore === 0) {
    const themeKeys = Object.keys(themeDatabase);
    bestTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
  }
  
  return themeDatabase[bestTheme];
}

export function getAllThemes(): ColorPalette[] {
  return Object.values(themeDatabase);
}

export function getThemeByName(name: string): ColorPalette | undefined {
  return themeDatabase[name];
}

export function exportPaletteAsCSS(palette: ColorPalette, mode: 'light' | 'dark' = 'light'): string {
  const colors = mode === 'light' ? (palette.lightTheme || palette.colors) : (palette.darkTheme || palette.colors);
  
  let css = `:root {\n`;
  colors.forEach((color, index) => {
    css += `  --color-${index + 1}: ${color};\n`;
  });
  css += `  --color-primary: ${colors[0]};\n`;
  css += `  --color-secondary: ${colors[1]};\n`;
  css += `  --color-accent: ${colors[2]};\n`;
  css += `}\n`;
  
  return css;
}

export function exportPaletteAsTailwind(palette: ColorPalette): string {
  const colors = palette.colors;
  
  let config = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
  config += `        'primary': '${colors[0]}',\n`;
  config += `        'secondary': '${colors[1]}',\n`;
  config += `        'accent': '${colors[2]}',\n`;
  colors.forEach((color, index) => {
    config += `        'custom-${index + 1}': '${color}',\n`;
  });
  config += `      }\n    }\n  }\n}\n`;
  
  return config;
}

export function exportPaletteAsJSON(palette: ColorPalette): string {
  return JSON.stringify(palette, null, 2);
}
