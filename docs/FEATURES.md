# Cribble Interactive Features

## 🎨 Studio Page - Fully Interactive with Shortcuts!

### Canvas Interactions
- **Editable Headline**: Click on "THE NEW MINIMAL" text to edit it in real-time
- **Hover Effects**: Hover over the image to see color transition and "Change Image" button
- **Interactive Color Palette**: Click the colored dots at the bottom
- **Editable Date**: Click "Volume 04 / 2024" to interact
- **Right-Click Menu**: Right-click anywhere for context menu

### ⌨️ Keyboard Shortcuts

#### Editing
- **Ctrl+Z** / **Cmd+Z** - Undo last action
- **Ctrl+Shift+Z** / **Cmd+Shift+Z** - Redo
- **Ctrl+Y** / **Cmd+Y** - Redo (alternative)
- **Ctrl+C** / **Cmd+C** - Copy selected element
- **Ctrl+V** / **Cmd+V** - Paste copied element
- **Ctrl+D** / **Cmd+D** - Duplicate selected element
- **Delete** or **Backspace** - Delete selected element
- **Escape** - Deselect / Close menus

#### View
- **Ctrl++** / **Cmd++** - Zoom in
- **Ctrl+-** / **Cmd+-** - Zoom out
- **Ctrl+0** / **Cmd+0** - Reset zoom to 100%
- **?** - Show keyboard shortcuts panel

#### File
- **Ctrl+S** / **Cmd+S** - Save design as JSON file

### 🖱️ Context Menu (Right-Click)

#### On Elements
- **Copy** - Copy the element (Ctrl+C)
- **Duplicate** - Create a copy with offset (Ctrl+D)
- **Delete** - Remove the element (Del)

#### On Canvas Background
- **Paste** - Paste copied element (Ctrl+V)
- **Add Square** - Insert new square
- **Add Circle** - Insert new circle
- **Add Text** - Insert new text element

### Toolbar (Left Side)
- **Select Tool** (Pointer): Default selection mode
- **Square Tool**: Click to add draggable squares to canvas
- **Circle Tool**: Click to add draggable circles to canvas
- **Text Tool**: Click to add editable text elements
- **Pencil Tool**: Drawing mode (coming soon)
- **Image Tool**: Add images (coming soon)

Active tool is highlighted in purple!

### Canvas Elements
- **Drag & Drop**: All added elements can be dragged around
- **Selection**: Click any element to select it (shows purple ring)
- **Layer Management**: See all elements in the Layers panel
- **Undo/Redo**: Full history support for all actions

### Quick Actions Bar (Top)
- **Undo Button**: Click or use Ctrl+Z
- **Redo Button**: Click or use Ctrl+Shift+Z
- **Save Button**: Export design as JSON
- **Shortcuts Button**: View all keyboard shortcuts

### Zoom Controls (Bottom)
- **Zoom Out** (-): Decrease canvas size
- **Zoom In** (+): Increase canvas size
- **Current Zoom**: Shows percentage (25% - 200%)
- **Fit to Screen**: Click maximize icon to reset to 100%

### Properties Panel (Right Side)
- **Layer List**: Shows all canvas elements
- **Click to Select**: Click any layer to select it on canvas
- **Add Layer**: Click + button to add new square
- **Active Layer**: Highlighted with purple border

### History System
- **Unlimited Undo/Redo**: Every action is tracked
- **State Management**: Navigate through your design history
- **Keyboard Support**: Fast undo/redo with shortcuts

### AI Assistant
- **Generate Concept**: Click to create mock AI art concepts
- **Realistic Delays**: Simulates API call timing
- **Detailed Output**: Includes style, colors, mood, and creative direction
- **Regenerate**: Create new concepts with different combinations
- **Apply to Canvas**: (Coming soon) Apply concept to design

### Monetization
- **Premium Toggle**: Click to enable/disable premium asset
- **Price Input**: Edit the price when premium is enabled
- **Smooth Animation**: Toggle animates smoothly
- **Conditional Display**: Price field only shows when premium is on

### Save & Export
- **JSON Export**: Saves complete design state
- **Includes**: All elements, headline, zoom level, premium settings
- **File Name**: Auto-generated with timestamp
- **Keyboard Shortcut**: Ctrl+S for quick save

## 💬 Messages Page

### Chat Features
- **Send Messages**: Type and press Enter or click send button
- **AI Commands**: Type `/ai your question` to get design advice
- **Context-Aware**: AI responds based on keywords (color, composition, style, etc.)
- **Typing Indicator**: Shows animated dots when AI is "thinking"
- **Message History**: Scrollable conversation view

### AI Response Types
- **Color Advice**: Ask about colors or palettes
- **Composition Tips**: Ask about layout or composition
- **Style Guidance**: Ask about aesthetics or styles
- **Inspiration**: Ask for ideas or inspiration
- **General Tips**: Default helpful design advice

## 🏠 Home Page
- **Animated Hero**: Smooth fade-in animation on load
- **Hover Effects**: Featured works lift up on hover
- **Interactive Cards**: Click to view artwork details
- **Smooth Transitions**: All interactions are animated

## 🔍 Explore Page
- **Masonry Layout**: Pinterest-style responsive grid
- **Hover Overlays**: Show artwork details on hover
- **Like & Share**: Interactive buttons appear on hover
- **Follow Artists**: Quick follow button in overlay

## 💾 Saved Page
- **Collection Grid**: Organized saved items
- **Hover Effects**: Cards scale up slightly
- **Add Collection**: Click + card to create new collection

## 🎯 Navigation
- **Smooth Page Transitions**: Fade and slide animations between pages
- **Active State**: Current page highlighted in sidebar
- **Mobile Bottom Nav**: Responsive navigation for small screens
- **Floating Studio Button**: Elevated center button on mobile

## 🤖 Mock AI System

### How It Works
- **No API Required**: Everything runs locally
- **Pattern Matching**: Recognizes keywords in your questions
- **Randomization**: Generates varied responses each time
- **Realistic Timing**: Adds delays to simulate real API calls

### AI Capabilities
1. **Art Concept Generation**
   - Random style selection (8 styles)
   - Color palette generation (5 palettes)
   - Mood and atmosphere descriptions
   - Key visual elements
   - Creative direction guidance

2. **Design Assistant**
   - Color theory advice
   - Composition principles
   - Style recommendations
   - Creative inspiration
   - General design tips

### Response Quality
- Professional and helpful tone
- Contextually relevant advice
- Varied responses (not repetitive)
- Practical and actionable tips

## 🎨 Visual Feedback

### Hover States
- Buttons change color/background
- Cards lift or scale
- Opacity transitions
- Cursor changes to pointer

### Active States
- Selected tools highlighted
- Active layers bordered
- Current page in sidebar
- Toggle switches animate

### Loading States
- Spinning loader for AI generation
- Animated typing dots in chat
- Smooth transitions everywhere

## 🚀 Performance

- **Fast Load**: Vite's instant HMR
- **Smooth Animations**: 60fps with Motion
- **No Network Calls**: Everything is local
- **Instant Responses**: No API latency
- **Efficient History**: Optimized state management

## 💡 Tips for Best Experience

1. **Try Keyboard Shortcuts**: Press ? to see all shortcuts
2. **Right-Click Everything**: Context menus everywhere
3. **Use Undo/Redo**: Experiment freely, you can always go back
4. **Save Often**: Ctrl+S to export your work
5. **Drag Elements**: All shapes and text are draggable
6. **Edit Text**: Click the headline to change it
7. **Use Zoom**: Try different zoom levels for precision
8. **Chat with AI**: Type `/ai` in messages for design tips
9. **Explore Layers**: Click layers to select elements
10. **Copy & Paste**: Duplicate elements quickly with Ctrl+C/V

## 🎯 Pro Tips

- **Quick Duplicate**: Select an element and press Ctrl+D
- **Delete Fast**: Select and press Delete or Backspace
- **Zoom to Fit**: Press Ctrl+0 to reset zoom
- **Deselect All**: Press Escape to clear selection
- **Context Menu**: Right-click for quick actions
- **Save Regularly**: Use Ctrl+S to save your progress
- **Undo Mistakes**: Ctrl+Z is your friend!

## 🔜 Coming Soon

- More drawing tools (pencil, pen, brush)
- Image upload functionality
- Custom color picker
- Text formatting options
- More shape tools
- Grid and guides
- Alignment tools
- Group/ungroup elements
- Layer ordering (bring to front/back)
- Export as PNG/SVG
- Templates library
- Collaboration features

