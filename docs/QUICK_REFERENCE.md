# Cribble Quick Reference

## 🚀 Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # TypeScript type checking
npm run clean        # Remove dist folder

# Windows specific
Remove-Item -Recurse -Force dist  # Clean build (PowerShell)
```

## 📁 Project Structure

```
cribble/
├── src/
│   ├── App.tsx                 # Main app (all components)
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   └── services/
│       └── geminiService.ts    # AI integration
├── .env                        # Your API keys (create this!)
├── .env.example                # Template for .env
├── package.json                # Dependencies
├── vite.config.ts              # Vite config
└── tsconfig.json               # TypeScript config
```

## 🔑 Environment Variables

```bash
# .env file (create from .env.example)
VITE_GEMINI_API_KEY=your_key_here
```

Get your key: https://aistudio.google.com/app/apikey

## 🎨 Main Components

| Component | Description |
|-----------|-------------|
| `Sidebar` | Left navigation menu |
| `TopBar` | Header with search and actions |
| `HomePage` | Featured works and hero section |
| `ExplorePage` | Masonry gallery layout |
| `SavedPage` | User's saved collections |
| `StudioPage` | Design canvas with AI tools |
| `MessagesPage` | Chat with AI assistant |

## 🤖 AI Functions

```typescript
// Generate art concept
const concept = await generateArtConcept("your prompt");

// Get AI assistant response
const response = await getAIAssistantResponse("your question");
```

## 🎯 Key Features

- **Tab Navigation**: Home, Explore, Saved, Studio, Messages
- **AI Generation**: Click "Generate Concept" in Studio
- **AI Chat**: Type `/ai your question` in Messages
- **Responsive**: Works on mobile, tablet, desktop
- **Animations**: Smooth transitions with Motion

## 🎨 Color Palette

```css
Primary Purple: #6a37d4
Light Purple: #ae8dff
Cyan Accent: #65e1ff
Dark Text: #2f2e2e
Gray Text: #5c5b5b
Background: #f9f6f5
Light Gray: #f3f0ef
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices (sidebar shows) */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

## 🔧 Common Tasks

### Add a new page
1. Create component in `App.tsx`
2. Add to `Tab` type
3. Add nav item to `Sidebar`
4. Add route in main `App` component

### Modify AI behavior
Edit prompts in `src/services/geminiService.ts`

### Change colors
Update Tailwind classes in components or `index.css`

### Add new icons
Import from `lucide-react`:
```typescript
import { IconName } from 'lucide-react';
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API key error | Check `.env` file exists and has `VITE_` prefix |
| Port in use | Change port in `package.json` dev script |
| Module errors | Delete `node_modules` and run `npm install` |
| Build fails | Run `npm run lint` to check for errors |
| Styles not working | Check Tailwind CSS is imported in `index.css` |

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini API](https://ai.google.dev/docs)
- [Lucide Icons](https://lucide.dev)
- [Motion Docs](https://motion.dev)
