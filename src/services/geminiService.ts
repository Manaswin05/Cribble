/**
 * Gemini AI Service
 * Uses the real Gemini API when VITE_GEMINI_API_KEY is set,
 * otherwise falls back to a built-in mock for zero-config demo.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const IS_REAL_AI = !!API_KEY && API_KEY !== 'your_gemini_api_key_here';

let genAI: GoogleGenerativeAI | null = null;
if (IS_REAL_AI) {
  genAI = new GoogleGenerativeAI(API_KEY!);
}

// ── Mock fallback data ────────────────────────────────────────────────────────

const artStyles = [
  'Minimalist', 'Surrealism', 'Cyberpunk', 'Abstract Expressionism',
  'Neo-Brutalism', 'Vaporwave', 'Art Deco', 'Bauhaus'
];
const colorPalettes = [
  ['#6a37d4', '#ae8dff', '#65e1ff', '#2f2e2e'],
  ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7fff7'],
  ['#2d3436', '#fdcb6e', '#e17055', '#74b9ff'],
  ['#a29bfe', '#fd79a8', '#fdcb6e', '#55efc4'],
  ['#1e272e', '#ff6348', '#ffa502', '#2ed573']
];
const moods = [
  'Ethereal and dreamlike', 'Bold and energetic', 'Calm and contemplative',
  'Mysterious and intriguing', 'Vibrant and playful', 'Dark and moody',
  'Light and airy', 'Intense and dramatic'
];
const elements = [
  'geometric shapes', 'organic forms', 'flowing lines', 'sharp angles',
  'gradient transitions', 'textured surfaces', 'negative space', 'layered compositions',
  'symmetrical patterns', 'asymmetric balance', 'light and shadow play', 'depth illusions'
];
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function generateMockConcept(prompt: string): string {
  const style = artStyles[Math.floor(Math.random() * artStyles.length)];
  const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  const shuffled = [...elements].sort(() => Math.random() - 0.5).slice(0, 4);

  const adjectives = ['Ethereal', 'Digital', 'Abstract', 'Modern', 'Cosmic', 'Urban', 'Fluid', 'Crystalline'];
  const nouns = ['Dreams', 'Horizons', 'Echoes', 'Visions', 'Fragments', 'Rhythms', 'Dimensions', 'Reflections'];
  const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;

  const colorNames: Record<string, string> = {
    '#6a37d4': 'Deep Purple', '#ae8dff': 'Lavender', '#65e1ff': 'Sky Blue', '#2f2e2e': 'Charcoal',
    '#ff6b6b': 'Coral Red', '#4ecdc4': 'Turquoise', '#45b7d1': 'Ocean Blue', '#f7fff7': 'Mint Cream',
    '#2d3436': 'Dark Slate', '#fdcb6e': 'Golden Yellow', '#e17055': 'Terracotta', '#74b9ff': 'Sky Blue',
    '#a29bfe': 'Periwinkle', '#fd79a8': 'Pink', '#55efc4': 'Mint Green', '#1e272e': 'Midnight',
    '#ff6348': 'Tomato Red', '#ffa502': 'Amber', '#2ed573': 'Emerald'
  };

  return `🎨 CONCEPT: ${title}

📐 VISUAL STYLE
${style} with contemporary digital aesthetics

🔑 KEY ELEMENTS
${shuffled.map((el, i) => `${i + 1}. ${el.charAt(0).toUpperCase() + el.slice(1)}`).join('\n')}

🎨 COLOR PALETTE
${palette.map((c, i) => `${i + 1}. ${c} — ${colorNames[c] || 'Custom'}`).join('\n')}

✨ MOOD & ATMOSPHERE
${mood}, creating an immersive visual experience.

💡 CREATIVE DIRECTION
This concept explores the intersection of ${style.toLowerCase()} principles with modern digital art. The composition balances ${shuffled[0]} with ${shuffled[1]}, creating dynamic tension that engages the viewer's eye.

The color palette establishes a ${mood.toLowerCase()} foundation, while the strategic use of ${shuffled[2]} adds depth and complexity.`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export const generateArtConcept = async (prompt: string): Promise<string> => {
  if (IS_REAL_AI && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const systemPrompt = `You are Cribble AI, a creative design concept generator. Given a user's design prompt, generate a detailed, inspiring design concept in the following exact format:

🎨 CONCEPT: [Creative title inspired by the prompt]

📐 VISUAL STYLE
[Art style with contemporary digital aesthetics — 1-2 sentences]

🔑 KEY ELEMENTS
1. [Element 1]
2. [Element 2]
3. [Element 3]
4. [Element 4]

🎨 COLOR PALETTE
1. #[hex] — [Color name]: [why it fits]
2. #[hex] — [Color name]: [why it fits]
3. #[hex] — [Color name]: [why it fits]
4. #[hex] — [Color name]: [why it fits]

✨ MOOD & ATMOSPHERE
[2-3 sentences describing the feeling and atmosphere]

💡 CREATIVE DIRECTION
[2-3 sentences on how to execute this design concept]

User prompt: ${prompt}`;

      const result = await model.generateContent(systemPrompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn('Gemini API error, falling back to mock:', err);
    }
  }

  // Fallback mock
  await delay(1200 + Math.random() * 800);
  return generateMockConcept(prompt);
};

export const getAIAssistantResponse = async (message: string, _context: string = ''): Promise<string> => {
  if (IS_REAL_AI && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const systemPrompt = `You are Cribble AI, a helpful creative design assistant inside a digital art studio. You give concise, expert advice on design, color, composition, and art. Keep responses under 120 words and friendly in tone.

User message: ${message}`;
      const result = await model.generateContent(systemPrompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn('Gemini API error, falling back to mock:', err);
    }
  }

  // Fallback
  await delay(700 + Math.random() * 600);
  const lower = message.toLowerCase();
  if (lower.includes('color') || lower.includes('palette')) return "For a harmonious palette, try the 60-30-10 rule: 60% dominant color, 30% secondary, and 10% accent. This creates visual balance instantly.";
  if (lower.includes('composition') || lower.includes('layout')) return "The rule of thirds is your friend! Place key elements along the intersecting lines for natural, balanced compositions.";
  if (lower.includes('inspiration') || lower.includes('idea')) return "Look beyond your screen! Nature, architecture, and everyday objects are incredible sources of inspiration.";
  if (lower.includes('style') || lower.includes('aesthetic')) return "Glassmorphism adds depth with frosted glass effects. Use subtle transparency and blur for a modern, layered look.";
  if (lower.match(/\b(hi|hello|hey)\b/)) return "Hey there! 👋 I'm Cribble AI. Ask me about design, colors, or composition!";
  return "Great design is iterative. Don't be afraid to experiment, fail, and refine — your first idea is rarely your best.";
};

// ── Studio Command Parser ─────────────────────────────────────────────────────

export type StudioCommand =
  | { type: 'add_element'; elementType: 'square' | 'circle' | 'text'; color?: string; text?: string; x?: number; y?: number; width?: number; height?: number }
  | { type: 'delete_selected' }
  | { type: 'delete_all' }
  | { type: 'change_color'; color: string }
  | { type: 'zoom_in' }
  | { type: 'zoom_out' }
  | { type: 'zoom_reset' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'save' }
  | { type: 'duplicate' }
  | { type: 'resize'; width?: number; height?: number }
  | { type: 'move'; x: number; y: number }
  | { type: 'color_theme'; prompt: string }
  | { type: 'generate_design'; prompt: string }
  | { type: 'unknown'; message: string };

const colorMap: Record<string, string> = {
  red: '#e74c3c', blue: '#3498db', green: '#27ae60', yellow: '#f1c40f',
  purple: '#6a37d4', violet: '#6a37d4', orange: '#e67e22', pink: '#fd79a8',
  cyan: '#00cec9', teal: '#00b894', white: '#ffffff', black: '#2f2e2e',
  gray: '#95a5a6', grey: '#95a5a6', gold: '#fdcb6e', navy: '#2d3436',
  coral: '#ff6b6b', indigo: '#5e26c7', lavender: '#ae8dff', turquoise: '#4ecdc4',
};

function resolveColor(text: string): string | undefined {
  for (const [name, hex] of Object.entries(colorMap)) {
    if (text.includes(name)) return hex;
  }
  const hexMatch = text.match(/#[0-9a-fA-F]{3,8}/);
  if (hexMatch) return hexMatch[0];
  return undefined;
}

export function parseStudioCommand(message: string): { command: StudioCommand; response: string } {
  const lower = message.toLowerCase().trim();

  // --- Generate design from prompt ---
  if (lower.match(/\b(generate|create|design|make)\b.*\b(design|layout|concept|art|poster|banner|logo|ui|interface)\b/) ||
      lower.match(/^generate\b/)) {
    return {
      command: { type: 'generate_design', prompt: message },
      response: IS_REAL_AI
        ? `✨ Generating design concept with Gemini AI for: "${message}"...`
        : `✨ Generating design concept for: "${message}"...`
    };
  }

  // --- Add element commands ---
  if (lower.match(/\b(add|create|draw|place|insert|make|put)\b.*\b(square|rectangle|rect|box)\b/)) {
    const color = resolveColor(lower);
    const sizeMatch = lower.match(/(\d+)\s*[x×]\s*(\d+)/);
    return {
      command: { type: 'add_element', elementType: 'square', color: color || '#6a37d4', width: sizeMatch ? parseInt(sizeMatch[1]) : undefined, height: sizeMatch ? parseInt(sizeMatch[2]) : undefined },
      response: `✅ Added a ${color ? Object.entries(colorMap).find(([, v]) => v === color)?.[0] || 'custom' : 'purple'} rectangle!`
    };
  }
  if (lower.match(/\b(add|create|draw|place|insert|make|put)\b.*\b(circle|oval|ellipse|round)\b/)) {
    const color = resolveColor(lower);
    const sizeMatch = lower.match(/(\d+)\s*[x×]\s*(\d+)/);
    return {
      command: { type: 'add_element', elementType: 'circle', color: color || '#6a37d4', width: sizeMatch ? parseInt(sizeMatch[1]) : undefined, height: sizeMatch ? parseInt(sizeMatch[2]) : undefined },
      response: `✅ Added a ${color ? Object.entries(colorMap).find(([, v]) => v === color)?.[0] || 'custom' : 'purple'} circle!`
    };
  }
  if (lower.match(/\b(add|create|draw|place|insert|make|put|write|type)\b.*\b(text|label|heading|title|word)\b/)) {
    const color = resolveColor(lower);
    let textContent = 'New Text';
    const quotedMatch = message.match(/["""'](.+?)["""']/);
    const sayingMatch = message.match(/(?:saying|with|that says|with text|labeled|reading)\s+(.+)/i);
    if (quotedMatch) textContent = quotedMatch[1];
    else if (sayingMatch) textContent = sayingMatch[1].replace(/[.!?]$/, '').trim();
    return {
      command: { type: 'add_element', elementType: 'text', color: color || '#6a37d4', text: textContent },
      response: `✅ Added text "${textContent}" to the canvas!`
    };
  }

  // Simple shapes
  if (lower.match(/^(a\s+)?(square|rectangle|rect|box)$/)) return { command: { type: 'add_element', elementType: 'square', color: '#6a37d4' }, response: '✅ Added a rectangle!' };
  if (lower.match(/^(a\s+)?(circle|oval)$/)) return { command: { type: 'add_element', elementType: 'circle', color: '#6a37d4' }, response: '✅ Added a circle!' };

  // --- Delete ---
  if (lower.match(/\b(delete|remove|clear)\b.*\b(all|everything|canvas)\b/)) return { command: { type: 'delete_all' }, response: '🗑️ Cleared canvas!' };
  if (lower.match(/\b(delete|remove|trash|erase)\b/)) return { command: { type: 'delete_selected' }, response: '🗑️ Deleted selected element!' };

  // --- Color change ---
  if (lower.match(/\b(change|set|make|update)\b.*\b(color|colour|fill)\b/)) {
    const color = resolveColor(lower);
    if (color) return { command: { type: 'change_color', color }, response: `🎨 Changed color to ${Object.entries(colorMap).find(([, v]) => v === color)?.[0] || color}!` };
    return { command: { type: 'unknown', message }, response: "🤔 Which color? Try \"change color to blue\"." };
  }
  if (lower.match(/\bmake\s+(it\s+)?(red|blue|green|yellow|purple|orange|pink|cyan|teal|white|black|gray|grey|gold|navy|coral|indigo|lavender|turquoise)\b/)) {
    const color = resolveColor(lower);
    if (color) return { command: { type: 'change_color', color }, response: `🎨 Color changed!` };
  }

  // --- Zoom ---
  if (lower.match(/\bzoom\s*(in|closer|\+)\b/) || lower.match(/\bbigger\b/)) return { command: { type: 'zoom_in' }, response: '🔍 Zoomed in!' };
  if (lower.match(/\bzoom\s*(out|further|\-)\b/) || lower.match(/\bsmaller\b/)) return { command: { type: 'zoom_out' }, response: '🔍 Zoomed out!' };
  if (lower.match(/\b(zoom\s*reset|reset\s*zoom|100%|fit)\b/)) return { command: { type: 'zoom_reset' }, response: '🔍 Zoom reset!' };

  // --- Undo / Redo ---
  if (lower.match(/\bundo\b/)) return { command: { type: 'undo' }, response: '↩️ Undone!' };
  if (lower.match(/\bredo\b/)) return { command: { type: 'redo' }, response: '↪️ Redone!' };

  // --- Save ---
  if (lower.match(/\b(save|export|download)\b/)) return { command: { type: 'save' }, response: '💾 Design saved!' };

  // --- Duplicate ---
  if (lower.match(/\b(duplicate|copy|clone)\b/)) return { command: { type: 'duplicate' }, response: '📑 Duplicated!' };

  // --- Resize ---
  const resizeMatch = lower.match(/\b(resize|set\s*size|change\s*size)\b.*?(\d+)\s*[x×]\s*(\d+)/);
  if (resizeMatch) return { command: { type: 'resize', width: parseInt(resizeMatch[2]), height: parseInt(resizeMatch[3]) }, response: `📐 Resized to ${resizeMatch[2]}×${resizeMatch[3]}!` };

  // --- Move ---
  const moveMatch = lower.match(/\b(move|position|place)\b.*?(\d+)\s*[,\s]\s*(\d+)/);
  if (moveMatch) return { command: { type: 'move', x: parseInt(moveMatch[2]), y: parseInt(moveMatch[3]) }, response: `📍 Moved!` };

  // --- Color Theme ---
  if (lower.match(/\b(color\s*(theme|palette|scheme)|theme|palette|suggest\s*colors?|recommend\s*colors?|generate\s*palette)\b/)) {
    let themePrompt = message;
    const forMatch = message.match(/(?:for|about|with|based on)\s+(.+)/i);
    if (forMatch) themePrompt = forMatch[1].replace(/[.!?]$/, '').trim();
    return { command: { type: 'color_theme', prompt: themePrompt }, response: `🎨 Generating color theme for: "${themePrompt}"...` };
  }

  // --- Help ---
  if (lower.match(/\b(help|commands|what can you do)\b/)) {
    return {
      command: { type: 'unknown', message },
      response: `🤖 Here's what I can do:\n\n🎨 **Generate design**: "generate a minimalist poster"\n📦 **Add shapes**: "add a red square", "create a blue circle"\n✏️ **Add text**: "add text saying Hello"\n🎨 **Colors**: "change color to green"\n🗑️ **Delete**: "delete selected", "clear all"\n🔍 **Zoom**: "zoom in", "zoom out"\n↩️ **History**: "undo", "redo"\n💾 **Save**: "save"\n\nType what you want to do!`
    };
  }

  if (lower.match(/\b(hi|hello|hey|sup|yo)\b/)) {
    return {
      command: { type: 'unknown', message },
      response: `👋 Hey! I'm your Studio AI${IS_REAL_AI ? ' (powered by Gemini)' : ''}. Try "generate a cyberpunk poster" or "add a blue circle"!`
    };
  }

  // Fallback: color + shape without verb
  const color = resolveColor(lower);
  if (color && lower.match(/\b(square|rectangle|rect|box)\b/)) return { command: { type: 'add_element', elementType: 'square', color }, response: `✅ Added a ${Object.entries(colorMap).find(([, v]) => v === color)?.[0]} rectangle!` };
  if (color && lower.match(/\b(circle|oval)\b/)) return { command: { type: 'add_element', elementType: 'circle', color }, response: `✅ Added a ${Object.entries(colorMap).find(([, v]) => v === color)?.[0]} circle!` };

  return {
    command: { type: 'unknown', message },
    response: '🤔 Not sure what you mean. Try "generate a sunset landscape" or type "help"!'
  };
}

export { IS_REAL_AI };
