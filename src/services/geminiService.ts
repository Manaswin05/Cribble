// Mock AI Service - No external APIs required
// This simulates AI responses with pre-defined templates and randomization

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

// Simulate async delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateArtConcept = async (prompt: string): Promise<string> => {
  // Simulate API call delay
  await delay(1500 + Math.random() * 1000);

  const style = artStyles[Math.floor(Math.random() * artStyles.length)];
  const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  
  // Pick 3-4 random elements
  const shuffledElements = [...elements].sort(() => Math.random() - 0.5);
  const selectedElements = shuffledElements.slice(0, 3 + Math.floor(Math.random() * 2));

  const title = generateTitle(prompt, style);

  return `
🎨 CONCEPT: ${title}

📐 VISUAL STYLE
${style} with contemporary digital aesthetics

🔑 KEY ELEMENTS
${selectedElements.map((el, i) => `${i + 1}. ${el.charAt(0).toUpperCase() + el.slice(1)}`).join('\n')}

🎨 COLOR PALETTE
${palette.map((color, i) => `${i + 1}. ${color} - ${getColorName(color)}`).join('\n')}

✨ MOOD & ATMOSPHERE
${mood}, creating an immersive visual experience that draws the viewer into a carefully crafted world of form and color.

💡 CREATIVE DIRECTION
This concept explores the intersection of ${style.toLowerCase()} principles with modern digital art techniques. The composition balances ${selectedElements[0]} with ${selectedElements[1]}, creating a dynamic tension that engages the viewer's eye.

The color palette establishes a ${mood.toLowerCase()} foundation, while the strategic use of ${selectedElements[2] || 'visual elements'} adds depth and complexity to the overall composition.
  `.trim();
};

export const getAIAssistantResponse = async (message: string, context: string = ""): Promise<string> => {
  // Simulate API call delay
  await delay(800 + Math.random() * 700);

  const lowerMessage = message.toLowerCase();

  // Pattern matching for common queries
  if (lowerMessage.includes('color') || lowerMessage.includes('palette')) {
    return generateColorAdvice();
  } else if (lowerMessage.includes('composition') || lowerMessage.includes('layout')) {
    return generateCompositionAdvice();
  } else if (lowerMessage.includes('inspiration') || lowerMessage.includes('idea')) {
    return generateInspirationAdvice();
  } else if (lowerMessage.includes('style') || lowerMessage.includes('aesthetic')) {
    return generateStyleAdvice();
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hey there! 👋 I'm Cribble AI, your creative companion. I can help you with design concepts, color palettes, composition tips, and creative inspiration. What would you like to explore today?";
  } else {
    return generateGeneralAdvice();
  }
};

// Helper functions for generating responses

function generateTitle(prompt: string, style: string): string {
  const adjectives = ['Ethereal', 'Digital', 'Abstract', 'Modern', 'Cosmic', 'Urban', 'Fluid', 'Crystalline'];
  const nouns = ['Dreams', 'Horizons', 'Echoes', 'Visions', 'Fragments', 'Rhythms', 'Dimensions', 'Reflections'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj} ${noun}`;
}

function getColorName(hex: string): string {
  const colorNames: { [key: string]: string } = {
    '#6a37d4': 'Deep Purple',
    '#ae8dff': 'Lavender',
    '#65e1ff': 'Sky Blue',
    '#2f2e2e': 'Charcoal',
    '#ff6b6b': 'Coral Red',
    '#4ecdc4': 'Turquoise',
    '#45b7d1': 'Ocean Blue',
    '#f7fff7': 'Mint Cream',
    '#2d3436': 'Dark Slate',
    '#fdcb6e': 'Golden Yellow',
    '#e17055': 'Terracotta',
    '#74b9ff': 'Sky Blue',
    '#a29bfe': 'Periwinkle',
    '#fd79a8': 'Pink',
    '#55efc4': 'Mint Green',
    '#1e272e': 'Midnight',
    '#ff6348': 'Tomato Red',
    '#ffa502': 'Amber',
    '#2ed573': 'Emerald'
  };
  return colorNames[hex] || 'Custom';
}

function generateColorAdvice(): string {
  const tips = [
    "For a harmonious palette, try using colors that are adjacent on the color wheel. This creates a cohesive, flowing aesthetic that's easy on the eyes.",
    "Consider the 60-30-10 rule: 60% dominant color, 30% secondary color, and 10% accent color. This creates visual balance and hierarchy.",
    "Don't be afraid of contrast! Pairing complementary colors (opposite on the color wheel) can create striking, memorable designs.",
    "Monochromatic schemes using different shades of one color can be incredibly sophisticated and modern.",
    "Remember that colors evoke emotions: blues for calm, reds for energy, greens for growth, purples for creativity."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function generateCompositionAdvice(): string {
  const tips = [
    "The rule of thirds is your friend! Place key elements along the intersecting lines for natural, balanced compositions.",
    "Use negative space intentionally. Sometimes what you don't include is just as important as what you do.",
    "Create visual hierarchy through size, color, and placement. Guide the viewer's eye through your design.",
    "Asymmetrical balance can be more dynamic than symmetry. Try offsetting elements while maintaining visual weight.",
    "Leading lines draw the viewer's attention. Use them to create movement and direct focus to your focal point."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function generateInspirationAdvice(): string {
  const tips = [
    "Look beyond your screen! Nature, architecture, and everyday objects are incredible sources of inspiration.",
    "Create a mood board before starting. Collect colors, textures, and compositions that resonate with your vision.",
    "Try the 'opposite approach': if you usually work with soft colors, try bold ones. Breaking patterns sparks creativity.",
    "Set constraints to boost creativity. Limit yourself to 3 colors or 2 shapes and see what emerges.",
    "Study the masters, both classic and contemporary. Understanding what works helps you develop your unique style."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function generateStyleAdvice(): string {
  const tips = [
    "Minimalism isn't about removing everything—it's about keeping only what matters. Every element should serve a purpose.",
    "Brutalism is making a comeback! Bold typography, raw layouts, and unconventional grids create striking designs.",
    "Glassmorphism adds depth with frosted glass effects. Use subtle transparency and blur for a modern, layered look.",
    "Retro styles are cyclical. 80s neon, 90s grunge, and Y2K aesthetics are all being reimagined for today.",
    "Mix styles intentionally. Combining minimalist layouts with maximalist details can create unique, memorable work."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function generateGeneralAdvice(): string {
  const tips = [
    "Great design is iterative. Don't be afraid to experiment, fail, and refine. Your first idea rarely your best.",
    "Take breaks! Stepping away from your work gives you fresh perspective and often leads to breakthroughs.",
    "Seek feedback from other creatives. Different perspectives can reveal blind spots and new possibilities.",
    "Build a personal design system. Consistent spacing, typography, and color choices make your work cohesive.",
    "Stay curious and keep learning. Design trends evolve, but fundamental principles remain timeless."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

// --- Studio Command Parser ---
// Parses natural language into structured canvas actions

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
  | { type: 'unknown'; message: string };

const colorMap: Record<string, string> = {
  red: '#e74c3c',
  blue: '#3498db',
  green: '#27ae60',
  yellow: '#f1c40f',
  purple: '#6a37d4',
  violet: '#6a37d4',
  orange: '#e67e22',
  pink: '#fd79a8',
  cyan: '#00cec9',
  teal: '#00b894',
  white: '#ffffff',
  black: '#2f2e2e',
  gray: '#95a5a6',
  grey: '#95a5a6',
  gold: '#fdcb6e',
  navy: '#2d3436',
  coral: '#ff6b6b',
  indigo: '#5e26c7',
  lavender: '#ae8dff',
  turquoise: '#4ecdc4',
};

function resolveColor(text: string): string | undefined {
  // Check named colors
  for (const [name, hex] of Object.entries(colorMap)) {
    if (text.includes(name)) return hex;
  }
  // Check hex codes
  const hexMatch = text.match(/#[0-9a-fA-F]{3,8}/);
  if (hexMatch) return hexMatch[0];
  return undefined;
}

export function parseStudioCommand(message: string): { command: StudioCommand; response: string } {
  const lower = message.toLowerCase().trim();

  // --- Add element commands ---
  if (lower.match(/\b(add|create|draw|place|insert|make|put)\b.*\b(square|rectangle|rect|box)\b/)) {
    const color = resolveColor(lower);
    const sizeMatch = lower.match(/(\d+)\s*[x×]\s*(\d+)/);
    return {
      command: {
        type: 'add_element',
        elementType: 'square',
        color: color || '#6a37d4',
        width: sizeMatch ? parseInt(sizeMatch[1]) : undefined,
        height: sizeMatch ? parseInt(sizeMatch[2]) : undefined,
      },
      response: `✅ Added a ${color ? Object.entries(colorMap).find(([,v]) => v === color)?.[0] || 'custom colored' : 'purple'} rectangle to the canvas!`
    };
  }

  if (lower.match(/\b(add|create|draw|place|insert|make|put)\b.*\b(circle|oval|ellipse|round)\b/)) {
    const color = resolveColor(lower);
    const sizeMatch = lower.match(/(\d+)\s*[x×]\s*(\d+)/);
    return {
      command: {
        type: 'add_element',
        elementType: 'circle',
        color: color || '#6a37d4',
        width: sizeMatch ? parseInt(sizeMatch[1]) : undefined,
        height: sizeMatch ? parseInt(sizeMatch[2]) : undefined,
      },
      response: `✅ Added a ${color ? Object.entries(colorMap).find(([,v]) => v === color)?.[0] || 'custom colored' : 'purple'} circle to the canvas!`
    };
  }

  if (lower.match(/\b(add|create|draw|place|insert|make|put|write|type)\b.*\b(text|label|heading|title|word)\b/)) {
    const color = resolveColor(lower);
    // Extract the text content – look for quoted text or text after "saying/with/that says"
    let textContent = 'New Text';
    const quotedMatch = message.match(/["'""](.+?)["'""]/);
    const sayingMatch = message.match(/(?:saying|with|that says|with text|labeled|reading)\s+(.+)/i);
    if (quotedMatch) {
      textContent = quotedMatch[1];
    } else if (sayingMatch) {
      textContent = sayingMatch[1].replace(/[.!?]$/, '').trim();
    }
    return {
      command: {
        type: 'add_element',
        elementType: 'text',
        color: color || '#6a37d4',
        text: textContent,
      },
      response: `✅ Added text "${textContent}" to the canvas!`
    };
  }

  // Simple "add square/circle/text" without preceding verb
  if (lower.match(/^(a\s+)?(square|rectangle|rect|box)$/)) {
    return { command: { type: 'add_element', elementType: 'square', color: '#6a37d4' }, response: '✅ Added a purple rectangle!' };
  }
  if (lower.match(/^(a\s+)?(circle|oval)$/)) {
    return { command: { type: 'add_element', elementType: 'circle', color: '#6a37d4' }, response: '✅ Added a purple circle!' };
  }

  // --- Delete commands ---
  if (lower.match(/\b(delete|remove|clear)\b.*\b(all|everything|canvas)\b/)) {
    return { command: { type: 'delete_all' }, response: '🗑️ Cleared all elements from the canvas!' };
  }
  if (lower.match(/\b(delete|remove|trash|erase)\b/)) {
    return { command: { type: 'delete_selected' }, response: '🗑️ Deleted the selected element!' };
  }

  // --- Color change ---
  if (lower.match(/\b(change|set|make|update)\b.*\b(color|colour|fill)\b/)) {
    const color = resolveColor(lower);
    if (color) {
      return { command: { type: 'change_color', color }, response: `🎨 Changed the selected element's color to ${Object.entries(colorMap).find(([,v]) => v === color)?.[0] || color}!` };
    }
    return { command: { type: 'unknown', message }, response: '🤔 I didn\'t catch which color you want. Try something like "change color to blue" or "make it red".' };
  }
  if (lower.match(/\bmake\s+(it\s+)?(red|blue|green|yellow|purple|orange|pink|cyan|teal|white|black|gray|grey|gold|navy|coral|indigo|lavender|turquoise)\b/)) {
    const color = resolveColor(lower);
    if (color) {
      return { command: { type: 'change_color', color }, response: `🎨 Changed the color to ${Object.entries(colorMap).find(([,v]) => v === color)?.[0]}!` };
    }
  }

  // --- Zoom ---
  if (lower.match(/\bzoom\s*(in|closer|\+)\b/) || lower.match(/\bbigger\b/)) {
    return { command: { type: 'zoom_in' }, response: '🔍 Zoomed in!' };
  }
  if (lower.match(/\bzoom\s*(out|further|\-)\b/) || lower.match(/\bsmaller\b/)) {
    return { command: { type: 'zoom_out' }, response: '🔍 Zoomed out!' };
  }
  if (lower.match(/\b(zoom\s*reset|reset\s*zoom|100%|fit|actual\s*size)\b/)) {
    return { command: { type: 'zoom_reset' }, response: '🔍 Zoom reset to 100%!' };
  }

  // --- Undo / Redo ---
  if (lower.match(/\bundo\b/)) {
    return { command: { type: 'undo' }, response: '↩️ Undone!' };
  }
  if (lower.match(/\bredo\b/)) {
    return { command: { type: 'redo' }, response: '↪️ Redone!' };
  }

  // --- Save ---
  if (lower.match(/\b(save|export|download)\b/)) {
    return { command: { type: 'save' }, response: '💾 Design saved!' };
  }

  // --- Duplicate ---
  if (lower.match(/\b(duplicate|copy|clone)\b/)) {
    return { command: { type: 'duplicate' }, response: '📑 Duplicated the selected element!' };
  }

  // --- Resize ---
  const resizeMatch = lower.match(/\b(resize|set\s*size|change\s*size)\b.*?(\d+)\s*[x×]\s*(\d+)/);
  if (resizeMatch) {
    return { command: { type: 'resize', width: parseInt(resizeMatch[2]), height: parseInt(resizeMatch[3]) }, response: `📐 Resized to ${resizeMatch[2]}×${resizeMatch[3]}!` };
  }

  // --- Move ---
  const moveMatch = lower.match(/\b(move|position|place)\b.*?(\d+)\s*[,\s]\s*(\d+)/);
  if (moveMatch) {
    return { command: { type: 'move', x: parseInt(moveMatch[2]), y: parseInt(moveMatch[3]) }, response: `📍 Moved to (${moveMatch[2]}, ${moveMatch[3]})!` };
  }

  // --- Color Theme / Palette ---
  if (lower.match(/\b(color\s*(theme|palette|scheme)|theme|palette|suggest\s*colors?|recommend\s*colors?|generate\s*palette)\b/)) {
    // Extract the theme description
    let themePrompt = message;
    const forMatch = message.match(/(?:for|about|with|based on)\s+(.+)/i);
    if (forMatch) {
      themePrompt = forMatch[1].replace(/[.!?]$/, '').trim();
    }
    return { 
      command: { type: 'color_theme', prompt: themePrompt }, 
      response: `🎨 Generating color theme for: "${themePrompt}"...` 
    };
  }

  // --- Help / greeting ---
  if (lower.match(/\b(help|commands|what can you do)\b/)) {
    return {
      command: { type: 'unknown', message },
      response: `🤖 Here's what I can do:\n\n📦 **Add elements**: "add a red square", "create a blue circle", "add text saying Hello"\n🎨 **Change colors**: "change color to green", "make it pink"\n🎨 **Color themes**: "suggest color theme for luxury brand", "generate palette for tech startup"\n🗑️ **Delete**: "delete selected", "clear all"\n🔍 **Zoom**: "zoom in", "zoom out", "reset zoom"\n↩️ **History**: "undo", "redo"\n📑 **Duplicate**: "duplicate", "copy"\n📐 **Resize**: "resize to 200x150"\n📍 **Move**: "move to 100, 200"\n💾 **Save**: "save", "export"\n\nJust type what you want to do!`
    };
  }

  if (lower.match(/\b(hi|hello|hey|sup|yo)\b/)) {
    return {
      command: { type: 'unknown', message },
      response: '👋 Hey! I\'m your Studio AI assistant. Tell me what to create — like "add a blue circle" or "make a red square". Type "help" to see all available commands!'
    };
  }

  // --- Fallback: try to be smart about it ---
  // Check if they mention a color + shape without a verb
  const color = resolveColor(lower);
  if (color && lower.match(/\b(square|rectangle|rect|box)\b/)) {
    return { command: { type: 'add_element', elementType: 'square', color }, response: `✅ Added a ${Object.entries(colorMap).find(([,v]) => v === color)?.[0]} rectangle!` };
  }
  if (color && lower.match(/\b(circle|oval)\b/)) {
    return { command: { type: 'add_element', elementType: 'circle', color }, response: `✅ Added a ${Object.entries(colorMap).find(([,v]) => v === color)?.[0]} circle!` };
  }

  return {
    command: { type: 'unknown', message },
    response: '🤔 I\'m not sure what you mean. Try commands like "add a red square", "create a circle", "delete selected", or type "help" to see what I can do!'
  };
}
